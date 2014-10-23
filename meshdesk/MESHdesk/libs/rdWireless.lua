require( "class" )

-------------------------------------------------------------------------------
-- Class used to configure the Wireless based on JSON data in a file ----------
-------------------------------------------------------------------------------
class "rdWireless"

--Init function for object
function rdWireless:rdWireless()

	require('rdLogger')
	local uci	= require('uci')

	self.version 	= "1.0.1"
	self.tag	= "MESHdesk"
	self.debug	= true
	self.config	= "/etc/config/wireless"
	
	self.json	= require("json")
	self.logger	= rdLogger()
	self.x		= uci.cursor(nil,'/var/state')
	self.socket    	= require("socket")
end
        
function rdWireless:getVersion()
	return self.version
end

function rdWireless:newWireless()
	self:log("==Creating a new Wireless config file==")
	self:__newWireless()
end

function rdWireless:connectClient()
	self:log("==Connect as Client to MESHdesk mesh==")
	self:__connectClient()
end

function rdWireless:configureFromJson(file)
	self:log("==Configure Wireless from JSON file "..file.."==")
	self:__configureFromJson(file)
end

function rdWireless:configureFromTable(tbl)
	self:log("==Configure Wireless from  Lua table==")
	self:__configureFromTable(tbl)
end



function rdWireless:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end


--[[--
========================================================
=== Private functions start here =======================
========================================================
--]]--
function rdWireless.__newWireless(self)
	self:log("Removing "..self.config)
	os.execute("rm "..self.config)
	--Check if there are a basic file available for this hardware
	local hardware = self.x.get('meshdesk','settings','hardware')
	if(hardware ~= nil)then
		local name = '/etc/MESHdesk/files/'..hardware..'/wireless'
		local f=io.open(name,"r")
		if f~=nil then 
			io.close(f)
			self:log("Found a sample "..self.config.." for "..hardware)
			os.execute("cp "..name.." "..self.config)
		else
			self:log("Found  NO sample "..self.config.." for "..hardware.." create one")
			os.execute("wifi detect >> "..self.config)
		end
	else
		self:log("Generating a new "..self.config)
		os.execute("wifi detect >> "..self.config)
	end
	os.execute("wifi detect >> "..self.config)
	--This is if we have two radios!
	os.execute("uci delete wireless.@wifi-iface[1]")
	os.execute("uci commit wireless")

	os.execute("uci delete wireless.@wifi-iface[0]")
	os.execute("uci commit wireless")
end


function rdWireless.__connectClient(self)
	local client_settings = self.x.get_all('meshdesk','wifi_client')
	if(client_settings ~= nil)then
		self:log("Starting clean")
		self:__newWireless()
	
		local device 	= client_settings.device
		local name	= client_settings['.name']
		self:log("Enabling radio on "..device)
		self.x.set('wireless',device,'disabled',0)
		self:log("Add wifi-iface "..name)
		self.x.set('wireless',name,'wifi-iface')
		for k, v in pairs(client_settings)do                                  
			if(not(string.find(k,'^%.')))then -- we are not interested in the hidden values.
		        	self.x.set('wireless',name,k,v)                                                              
		      	end                                                                             
		end  
		self.x.commit('wireless')
		self:log("Reload the network and restart wifi")
		os.execute("/etc/init.d/network reload")
		os.execute("wifi")
	end
end

function rdWireless.__configureFromJson(self,json_file)
	self:log("Configuring WiFi from a JSON file")
	local contents 	= self:__readAll(json_file)
	local o		= self.json.decode(contents)
	if(o.config_settings.wireless ~= nil)then
		self:log("Found Wireless settings - completing it")
		self:__configureFromTable(o.config_settings.wireless)
	else
		self:log("No Wireless settings found, please check JSON file")
	end
end

function rdWireless.__configureFromTablezz(self,tbl)
	self:__newWireless()
end

function rdWireless.__configureFromTable(self,tbl)
	-- Clean start
	self:__newWireless()
	
	 
	for i, setting_entry in ipairs(tbl) do
		local entry_type
		local entry_name
		local options 	= {}
		local lists	= {}
		for key, val in pairs(setting_entry) do
			if((key == 'wifi-iface') or (key == 'wifi-device'))then
				entry_type = key
				entry_name = val
			else
				-- Run through all the options
				if(key == 'options')then
					options = val
				end
				-- Run through all the lists
				if(key == 'lists')then
					lists = val
				end
			end
		end
		-- Now we hava gathered the info
		self:log("Configuring "..entry_type..' '..entry_name)
		self.x.set('wireless',entry_name,entry_type)
		
		local l	= {}
		for i, list in ipairs(lists) do
			local list_item = list['name']
			local value	= list['value']
			if(l[list_item] == nil)then
				l[list_item] = {}
			end
			table.insert(l[list_item], value)			
		end
		for key, val in pairs(l) do
			self.x.set('wireless',entry_name,key, val)
            self.x.commit('wireless')
		end
		
		for key, val in pairs(options) do
			local t = type(val);
			if(t == 'boolean')then
				local bool_val = "0"
				if(val)then
					bool_val = "1"
				end
				self.x.set('wireless',entry_name,key,bool_val)
			else
				self.x.set('wireless',entry_name,key,val)
			end
            self.x.commit('wireless')
		end
	end
	self.x.commit('wireless')
end

function rdWireless.__readAll(self,file)
	local f = io.open(file,"rb")
	local content = f:read("*all")
	f:close()
	return content
end

function rdWireless.__sleep(self,sec)                                                                     
    self.socket.select(nil, nil, sec)                              
end 
