require( "class" )

-------------------------------------------------------------------------------
-- CoovaChilli
-------------------------------------------------------------------------------
class "rdCoovaChilli"

--Init function for object
function rdCoovaChilli:rdCoovaChilli()
	self.socket    	= require("socket")
	local uci 	= require("uci")
	self.version 	= "1.0.0"
	self.x		= uci.cursor(nil,'/var/state')
	self.cpCount	= 5 -- The amount of captive portals allowed / worked on
	self.specific   = "/etc/MESHdesk/captive_portals/"
	self.priv_start = "1"
	self.proxy_start= 3128
	self.tiny_conf  = "tinyproxy.conf"
end
        
function rdCoovaChilli:getVersion()
	return self.version
end


 
function rdCoovaChilli:createConfigs(cp)
	cp = cp or {}
	self:removeConfigs()	--Clean up previous ones
	self:stopPortals()
	self:__doConfigs(cp)
	
end     

function rdCoovaChilli:removeConfigs()
	self:__removeConfigs()
end


function rdCoovaChilli:startPortals()
	
	for i=1,self.cpCount do
	
	        local s_file = self.specific..i.."/specific.conf"
	        print("Testing for file " .. s_file)
	        local f=io.open(s_file,"r")
	        if f~=nil then --File do exist; try to start this captive portal
	        	io.close(f)
	        	print("Found config for "..s_file)
	        	local config_file = self.specific .. "chilli_"..i..".conf"
	        	print("Start chilli with "..config_file)
	        	local ret_val = os.execute("chilli --conf "..config_file)
	        	print("We have a return value of "..ret_val)
	        	print("Sleep first a bit...")
	        	self:__sleep(5)
	        end
	
 	end
end

function rdCoovaChilli:stopPortals()
	local ret_val = os.execute("killall chilli")
	print("We have a return value of "..ret_val)
end

--[[--
=========================================
========= Private methods =============== 
=========================================
--]]--


function rdCoovaChilli.__sleep(self,sec)                                                                     
    self.socket.select(nil, nil, sec)                              
end 

    
function rdCoovaChilli.__doConfigs(self,p)

	for k,v in ipairs(p)do 
		local s_file = self.specific..k.."/specific.conf" -- The file name to build
		print("Specific file is "..s_file)
		--The file's content--
		local r2 = v['radius_2']
		if(string.len(v['radius_2']) == 0)then
			r2 = "localhost"
		end

		--Check if we need to activate the postauth proxy
		local proxy_string = ''
		if(v['proxy_enable'] == true)then
			require("rdNetwork")
			local n = rdNetwork()
			local ip = n:getIpForInterface("br-lan")
			
			if(ip)then
				proxy_string = "postauthproxy  '"..ip.."'\n".."postauthproxyport  '"..self.proxy_start.."'\n";
				--Now we can set the config file for tinyproxy up also
				local conf_file 	= self.specific..k.."/"..self.tiny_conf
				local proxy_ip  	= v['proxy_ip'];
				local proxy_port	= v['proxy_port'];
				local username 		= v['proxy_auth_username'];
				local password		= v['proxy_auth_password'];
				if((username == '')and(password == ''))then -- Some placeholder names to ensure TinyProxy starts up
					username = 'a'
					password = 'a' 
				end		
				self:__doTinyProxy(conf_file,ip,proxy_ip,proxy_port,username,password)
			end
		end
		--Up this one regardless
		self.proxy_start = self.proxy_start+1
		
		-- Make the walled garden --
		local wg = "10."..self.priv_start..".0.1" 
		if(string.len(v['walled_garden']) ~= 0)then
			wg = "10."..self.priv_start..".0.1"..","..v['walled_garden']
		end
		self.priv_start = self.priv_start + 1
		
		-- Get the DNS --
		local dns = self:__getDns()
		local dns_string = ''
		if(dns[2] == nil)then
			dns_string = "dns1  '" ..dns[1].."'\n"
		else
			dns_string = 	"dns1  '"..dns[1].."'\n"..
					"dns2  '"..dns[2].."'\n"
		end

		-- See if there are additional Coova Settings
		local coova_optional = '';
		if(string.len(v['coova_optional']) ~= 0)then
			coova_optional = v['coova_optional'];
		end

		
		local s_content = "radiusserver1  '"..v['radius_1'].."'\n"..
			"radiusserver2  '".. r2 .."'\n"..
			"radiussecret '".. v['radius_secret'].."'\n"..
			"uamserver '"   .. v['uam_url'].."'\n"..
			"radiusnasid '" .. v['radius_nasid'].."'\n"..
			"uamsecret   '" .. v['uam_secret'].."'\n"..
			"dhcpif	'"      .. v['hslan_if'].."'\n"..
			"uamallowed '"  .. wg .."'\n"..
			"cmdsocket  '/var/run/chilli." .. v['hslan_if'] .. ".sock'\n"..
			"unixipc    'chilli." .. v['hslan_if'] .. ".ipc'\n"..
			"pidfile    '/var/run/chilli." .. v['hslan_if'] .. ".pid'\n"..
			dns_string..
			proxy_string..
			coova_optional

		if(v['mac_auth'])then
			s_content = s_content.."macauth\n"
		end

		if(v['swap_octets'])then
			s_content = s_content.."swapoctets\n"
		end

		
		--print(s_content) 
		--Write this to the config file
		local f,err = io.open(s_file,"w")
		if not f then return print(err) end
		f:write(s_content)
		f:close()
	end
end

function rdCoovaChilli.__getDns(self)
	local file = io.open("/etc/resolv.conf", "r");
	local arr = {}
	local dns_start = 1
	local dns_list  = {}
	for line in file:lines() do
		if(string.match(line,"^\s*nameserver") ~= nil)then
		
			local s = string.gsub(line, "^\s*nameserver", "")
			s = s:find'^%s*$' and '' or s:match'^%s*(.*%S)' -- Remove leading and trailing spaces
			if(s == '127.0.0.1')then -- We assume this is not normal
				local one = self.x.get('meshdesk','captive_portal','default_dns_1')
				local two = self.x.get('meshdesk','captive_portal','default_dns_1')
				dns_list[1] = one
				dns_list[2] = two
				return dns_list
			else
				dns_list[dns_start] = s
			end
			dns_start = dns_start + 1
		end
	end
	--dns_list[1]= 'o' --Dunno what this is.... probably an artefact 
	return dns_list
end

function rdCoovaChilli.__removeConfigs(self)
	print("Removing configs")
	for i=1,self.cpCount do 
	
		local s_file = self.specific..i.."/specific.conf"
		print("Removing file " .. s_file)
		os.remove(s_file)
		 
	end
end

function rdCoovaChilli.__doTinyProxy(self,conf_file,ip,proxy_ip,proxy_port,username,password)
	local fp 	= io.open( conf_file, "r" )
    	local str 	= fp:read( "*all" )
    	str 		= string.gsub( str, "Bind%s+.-\n", "Bind "..ip.."\n")
    	str 		= string.gsub( str, "upstream%s+.-\n", "upstream "..username..":"..password.."@"..proxy_ip..":"..proxy_port.."\n")
    	fp:close()
    	fp 		= io.open( conf_file, "w+" )
   	fp:write( str )
    	fp:close()
	--We got out file now we can fire up the proxy
	local ret_val = os.execute("/usr/sbin/tinyproxy -c "..conf_file)
	print("Tinyproxy return value "..ret_val)
end
