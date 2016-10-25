require( "class" )

-------------------------------------------------------------------------------
-- A class to fetch network statistics and return it in JSON form -------------
-------------------------------------------------------------------------------
class "rdNetstats"

--Init function for object
function rdNetstats:rdNetstats()

	require('rdLogger');
	require('rdExternal');
	require('rdNetwork');
	
	local uci 		= require("uci")

	self.version 	= "1.0.0"
	self.json		= require("json")
	self.logger		= rdLogger()
	self.external	= rdExternal()
	self.debug		= true
	self.x			= uci.cursor(nil,'/var/state')
	self.network    = rdNetwork
	
end
        
function rdNetstats:getVersion()
	return self.version
end


function rdNetstats:getWifi()
	return self:_getWifi()
end

function rdNetstats:getEthernet()

	local wifi = self.x.get('meshdesk', 'settings','hardware')
	self.x.foreach('meshdesk', 'hardware',
		function(a)
			if(a['.name'] == hardware)then
				self.led = a['morse_led']
				if(a['swap_on_off'] == '1')then
					--print("Swapping on and off")
					self:swapOnOff()
				end
			end	
		end)
end

function rdNetstats:mapEthWithMeshMac()
	--Prime the object with easy lookups
	self:_createWirelessLookup()
	return self:__mapEthWithMeshMac()
end

function rdNetstats:log(m,p)
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

function rdNetstats.__mapEthWithMeshMac(self)

	--This part is used for us so we can have a mapping between eth0 (the 'id' of the Node)
	--And the various mesh interfaces (mesh0... mesh5)-----
	--We have to go though each one since anit can have mesh1 running but not mesh0 , or both can be on...

	local m     = {};
	local id_if = self.x.get('meshdesk','settings','id_if');
    local id    = self.network:getMac(id_if)                                                                           
	m['eth0']   = id --FIXME The back-end still thinks its eth0 but it can be set in firmware to be another eth

	--Our loopy-de-loop
	local i 	= 0;
	while i  <= 2 do

		local mesh  = 'mesh'..i
		local file_to_check = "/sys/class/net/" .. mesh .. "/address"

		--Check if file exists
		local f=io.open(file_to_check,"r")                                                   
		if f~=nil then --This file exists
			io.close(f)

			--Read the file now we know it exists
			io.input(file_to_check)
			local mac 	= io.read("*line")
			m[mesh] 	= mac

			--Also record the hwmode of this interface (we need this to show different coulors on the spiderweb)
			local device 		= self[mesh]['device'];
			local hwmode 		= self[device]['hwmode'];
			m['hwmode_'..mesh]  = hwmode;

		else

			m[mesh] = false	--If there are no

		end

		--Increment the loop	
		i = i + 1;

	end

	--Also record if this node is a gateway or not
	m['gateway'] = 0

	local f=io.open('/tmp/gw',"r")
	if f~=nil then
  		m['gateway'] = 1
	end

	return self.json.encode(m)
end


function rdNetstats._getWifi(self)
	self:log('Getting WiFi stats')
	local w 	= {}
	w['radios']	= {}
	
	local id_if = self.x.get('meshdesk','settings','id_if');
    local id    = self.network:getMac(id_if)
    w['eth0']   = id --FIXME The back-end still thinks its eth0 but it can be set in firmware
	
	local phy 	= nil
	local i_info	= {}
	
	local dev = self.external:getOutput("iw dev")
	for line in string.gmatch(dev, ".-\n")do
		
		line = line:gsub("^%s*(.-)%s*$", "%1")
		if(line:match("^phy#"))then
			--Get the interface number 
			phy = line:gsub("^phy#", '')
			w['radios'][phy]		={}
			w['radios'][phy]['interfaces']	={}
			w['radios'][phy]['info']	={}
		end
		if(line:match("^Interface "))then
			line = line:gsub("^Interface ", '')
			i_info['name']	= line
		end
		if(line:match("^addr "))then
			line = line:gsub("^addr ", '')
			i_info['mac']	= line
		end
		if(line:match("^ssid "))then
			line = line:gsub("^ssid ", '')
			i_info['ssid']	= line
		end
		if(line:match("^type "))then
			line = line:gsub("^type ", '')
			i_info['type']	= line
			local stations 	= self._getStations(self,i_info['name'])
			--This is our last search now we can add the info
			
			--Sometimes the ssid is not listed per interface, then we have to search for it
			if(i_info['ssid'] == nil)then
				i_info['ssid'] = self._getSsidForInterface(self,i_info['name']);
				--print(i_info['ssid']);	
			end

			table.insert(w['radios'][phy]['interfaces'],{name= i_info['name'],mac = i_info['mac'], ssid = i_info['ssid'], type= i_info['type'],stations = stations})

			i_info['ssid'] = nil --zero it again for the next round
		end


	end
	return self.json.encode(w)
end 


function rdNetstats._getStations(self,interface)

	self:log('Getting Stations connected to '..interface)
	local s 	= {}
	local s_info	= {}
	local want_these= {
				'inactive time', 'rx bytes','rx packets','tx packets', 'tx bytes', 'tx packets', 'tx retries', 'tx failed',
				'signal', 'avg', 'tx bitrate', 'rx bitrate', 'authorized', 'authenticated', 'preamble',
				'WMM/WME', 'MFP', 'TDLS peer'
			}
	local last_item = "TDLS peer"
	
	local dev = self.external:getOutput("iw dev "..interface.." station dump")
	for line in string.gmatch(dev, ".-\n")do	--split it up on newlines
		
		line = line:gsub("^%s*(.-)%s*$", "%1")  --remove leading and trailing spaces
		if(line:match("^Station"))then
			line = line:gsub("^Station-%s(.-)%s.+","%1")
			s_info['mac'] = line
		end
		
		for i, v in ipairs(want_these) do 
			local l = line
			if(line:match(v..":-%s"))then
				line  		= line:gsub(v..":-%s+","")
				if(line:match("avg:") == nil)then --avoid catching 'signal avg'
					s_info[v] 	= line
				end
				if(l:match(last_item))then
					--create a new table and insert it into the s table
					local new_info = {}
					for j,k in ipairs(want_these) do
						new_info[k] = s_info[k]
					end
					new_info['mac'] = s_info['mac']
					table.insert(s,new_info)
				end
			end
		end
	end
	return s
end

function rdNetstats._getSsidForInterface(self,interface)
	local retval = nil
	self.x.foreach('wireless','wifi-iface', 
		function(a)
			--print(a['.name'].." "..interface)
			--Check the name--
			if(a['ifname'] ~= nil)then
				if(string.find(a['ifname'],interface))then
					retval = a['ssid']
				end
			end
 		end)
	return retval
end

function rdNetstats._createWirelessLookup(self)
	--This will create a lookup on the object to determine the hardware mode a wifi-device has
	--So we only call this once
 
	local default_val = 'g' --We specify a 'sane' default of g	
	self.x.foreach('wireless','wifi-device', 
	function(a)
		local dev_name 	= a['.name'];
		local hwmode 	= a['hwmode'];
		if(hwmode == nil)then
			hwmode = default_val;
		end
		self[dev_name] = {}; --empty table
		self[dev_name]['hwmode'] = hwmode;
	end)

	self.x.foreach('wireless','wifi-iface', 
		function(a)
			--print(a['.name'].." "..interface)
			--Check the name--
			local ifname = a['ifname'];
			local device = a['device'];
			if(ifname ~= nil)then
				self[ifname] = a;
				--print(self[ifname]['device']);	
			end
	end)
end
