require( "class" )

-------------------------------------------------------------------------------
-- A class to configure the ethernet interfaces -------------
-------------------------------------------------------------------------------
class "rdNetwork"

--Init function for object
function rdNetwork:rdNetwork()
	require('rdLogger');
	require('rdExternal');

    local uci 	    = require("uci")
    self.x		    = uci.cursor(nil,'/var/state')
	self.version 	= "2.0.0"
	self.logger	    = rdLogger()
	self.debug	    = true
    self.dhcp_one   = "/etc/MESHdesk/configs/dhcp_network_one_eth"
    self.dhcp_two   = "/etc/MESHdesk/configs/dhcp_network_two_eth"
    
    self.dhcp_eth_one   = "/etc/MESHdesk/configs/dhcp_network_eth_one"

    self.frmwr_one  = "/etc/MESHdesk/configs/frmwr_network_one_eth"
    self.frmwr_two  = "/etc/MESHdesk/configs/frmwr_network_two_eth"
    
    self.frmwr_eth_one  = "/etc/MESHdesk/configs/frmwr_network_eth_one"
	--Add external command object
	self.external	= rdExternal()

end
        
function rdNetwork:getVersion()
	return self.version
end

function rdNetwork:getIpForInterface(int)
	self:log("Get ip address for interface "..int)
	return self:__getIpForInterface(int) 
end


function rdNetwork:dhcpStart()
    --Determine which file to use based on whether the board has eth1 or not
    local id_if = self.x.get('meshdesk','settings','id_if');
    if(id_if == 'eth1')then --if it is eth1 we are not bridging it
        os.execute("cp " .. self.dhcp_eth_one .. " /etc/config/network")  
    else
        if(self:__getMac('eth1'))then
            os.execute("cp " .. self.dhcp_two .. " /etc/config/network")
        else
            os.execute("cp " .. self.dhcp_one .. " /etc/config/network") 
        end
    end
    
    --Are we using 3G?
    self:__includeMobileWan()
    
    --Is there any Wifi Web specified
    self:__includeWebByWifi()
	  
	os.execute("/etc/init.d/network reload")
end

function rdNetwork:frmwrStart()
    --Determine which file to use based on whether the board has eth1 or not
    local id_if = self.x.get('meshdesk','settings','id_if');
    if(id_if == 'eth1')then --if it is eth1 we are not bridging it
        os.execute("cp " .. self.frmwr_eth_one .. " /etc/config/network")  
    else
        if(self:__getMac('eth1'))then
            os.execute("cp " .. self.frmwr_two .. " /etc/config/network")
        else
            os.execute("cp " .. self.frmwr_one .. " /etc/config/network") 
        end
    end
	os.execute("/etc/init.d/network reload")
end

function rdNetwork:getMac(int)
    return self:__getMac(int) --default is eth0
end

function rdNetwork:configureFromTable(tbl)
	self:log("==Configure Network from  Lua table==")
	self:__configureFromTable(tbl)
	
	--Are we using 3G?
    self:__includeMobileWan()
    
    --Is there any Wifi Web specified (We do it in the Wireless module)
    --self:__includeWebByWifi()
    
end


function rdNetwork:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end

--[[--
========================================================
=== Private functions start here =======================
========================================================
(Note they are in the pattern function <rdName>._function_name(self, arg...) and called self:_function_name(arg...) )
--]]--

-- Add WiFi Client if enabled
function rdNetwork.__includeWebByWifi(self)

    -- We need to find out if we perhaps also have wifi-iface configured and if it is enabled add it to the settings
    local iface_name = 'web_by_wifi' 
    self.x.foreach('meshdesk','wifi-iface', 
		function(a)
		    if(a['.name'] == iface_name)then
		        if(a['disabled'] ~= nil)then
		            if(a['disabled'] == '0')then
		                --Create it
		                self.x.set('wireless', iface_name, "wifi-iface")
	                    self.x.commit('wireless')
		                for key, val in pairs(a) do
		                    if(string.find(key, '.', 1, true) == nil)then
	                            self.x.set('wireless', iface_name,key, val)
	                            if(key == 'device')then
	                                self.x.set('wireless',val,'disabled','0') --Enable the specified radio also
	                            end
	                        end
	                    end
	                    self.x.commit('wireless')
	                    
	                    --Also include the configs in the netwok config
	                    self.x.set('network', 'web_by_wifi', "interface")
	                    self.x.commit('network')
	                    self.x.set('network', 'web_by_wifi','proto', 'dhcp')
	                    self.x.commit('network')
	                    
	                    self.x.set('network', 'stabridge', "interface")
	                    self.x.commit('network')
	                    self.x.set('network', 'stabridge','proto', 'relay')
	                    self.x.set('network', 'stabridge','network', 'lan web_by_wifi')
	                    
	                    
	                    --Also set a static address on the 'lan'
	                    self.x.set('network', 'lan','proto', 'static')
	                    self.x.set('network', 'lan','ipaddr','10.50.50.50')
	                    self.x.set('network', 'lan','netmask','255.255.255.0')
	                    
	                    self.x.commit('network')
	                    
	                    os.execute("wifi") --Bring up the WiFi
		            end
		        end
		    end
	end)
end


-- Add 3G if enabled --
function rdNetwork.__includeMobileWan(self)

    -- We need to find out if we perhaps also have 3G (wwan) configured and if it is enabled add it to the settings 
    self.x.foreach('meshdesk','interface', 
		function(a)
		    if(a['.name'] == 'wwan')then
		        if(a['enabled'] ~= nil)then
		            if(a['enabled'] == '1')then
		                --Create it
		                self.x.set('network', 'wwan', "interface")
	                    self.x.commit('network')
		                for key, val in pairs(a) do
		                    if(string.find(key, '.', 1, true) == nil)then
	                            self.x.set('network', 'wwan',key, val)
	                        end
	                    end
	                    self.x.commit('network')
		            end
		        end
		    end
	end)
end

-- Clean start Network                                                 
function rdNetwork.__newNetwork(self)
	local f="/etc/config/network"  
    os.execute("rm " .. f)
    os.execute("touch " .. f)
end

function rdNetwork.__getMac(self,interface)
	interface = interface or "eth0"

	local file_to_check = "/sys/class/net/" .. interface .. "/address"

	--Check if file exists
	local f=io.open(file_to_check,"r")                                                   
    if f~=nil then 
		io.close(f)
	else
		return false
	end

	--Read the file now we know it exists
	io.input(file_to_check)
	t = io.read("*line")
    if(t)then
	    dashes, count = string.gsub(t, ":", "-")
	    dashes = string.upper(dashes)
	    return dashes
    else
        return false
    end
end    

function rdNetwork.__configureFromTable(self,table)
	-- Clean start                                                           
	self:__newNetwork()                                                            
	for i, setting_entry in ipairs(table) do                                 
		local entry_type                                                 
	    local entry_name                                                  
	    local options = {} -- New empty array for this entry
		for key, val in pairs(setting_entry) do                           
        	-- If it is not an options entry; it is a type with value                
                if(key ~= 'options')then                                                 
                	entry_type  = key                                                
                        entry_name  = val                                                
             	else                                                                                                   
                -- Run through all the options                                                                 
                	for key, val in pairs(val) do                                                                  
                        	options[key] = val                                                                     
                      	end                                                                                            
                end                                                                                                    
    	end

    	-- Now we have gathered the info                                                 
    	os.execute("uci set network." .. entry_name .. "=" .. entry_type)               
    	for key, val in pairs(options) do
            print("There " .. key .. ' and '.. val)
            os.execute("uci set network." .. entry_name .. "." .. key .. '="' .. val .. '"')
        end
        os.execute("uci commit network")
    end
end


function rdNetwork.__getIpForInterface(self,interface)
	local ip = false
	local if_out = self.external:getOutput("ifconfig "..interface)
	if(if_out:match("inet addr:"))then
		if_out = if_out:gsub(".*inet addr:","")
		if_out = if_out:gsub("%s.+","")
		ip =if_out
	end
	return ip
end
