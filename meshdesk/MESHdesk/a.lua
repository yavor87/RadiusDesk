#!/usr/bin/lua

--[[--

Startup script to get the config of the device from the config server

--]]--

-- Include libraries
package.path = "libs/?.lua;" .. package.path
require "socket"


function fetch_config_value(item)
	local handle = io.popen('uci get '..item)
	local result = handle:read("*a")
	handle:close()
	result = string.gsub(result, "[\r\n]+$", "")
	return result
end


-- Some constants -- Replace later with uci values
previous_config_file 	= fetch_config_value('meshdesk.settings.previous_config_file')
sleep_time		= 1
config_file		= fetch_config_value('meshdesk.settings.config_file')
lan_timeout		= tonumber(fetch_config_value('meshdesk.settings.lan_timeout'))
wifi_timeout		= tonumber(fetch_config_value('meshdesk.settings.wifi_timeout'))

-- Some general functions --
function sleep(sec)
    socket.select(nil, nil, sec)
end

function file_exists(name)                                                          
        local f=io.open(name,"r")                                                   
        if f~=nil then io.close(f) return true else return false end                
end                                                                                 
                                                                                                    
function file_not_exists(name)                                                      
	local f=io.open(name,"r")                                                   
        if f~=nil then io.close(f) return false else return true end                        
end

-- Read file; return contents              
function readAll(file)                     
	local f = io.open(file, "rb")      
        local content = f:read("*all")     
        f:close()                          
        return content                     
end

-- End Some general functions --

-- Start-up function --
function wait_for_lan()
	-- LAN we flash "A"
	os.execute("/etc/MESHdesk/main_led.lua start a")
	local start_time=os.time()
	local loop=true
	local lan_is_up=false
	
	local w = require("rdNetwork")                                            
	w.dhcpStart()
	
	
	while (loop) do
		sleep(sleep_time)
		-- If the lan came up we will try to get the settings
		if(did_lan_came_up())then
			loop = false
			lan_is_up = true
		end
		local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= lan_timeout)then
			print("LAN is not coming up. Try the WiFi")
			loop=false --This will break the loop
		else
			print("Waiting for LAN to come up now for " .. time_diff .. " seconds")
		end
	end
	
	--See what happended and how we should handle it
	if(lan_is_up)then
		os.execute("/etc/MESHdesk/main_led.lua start b")
		-- sleep at least 10 seconds to make sure it got a DHCP addy
		sleep(10)
		try_settings_through_lan()
	else
		wait_for_wifi()		
	end
	
end

function did_lan_came_up()
	local lan_up_file=fetch_config_value('meshdesk.settings.lan_up_file')
	if(file_exists(lan_up_file))then
		return true		
	else
		return false
	end
end

function try_settings_through_lan()
	print("LAN up; now try fetch the settings")
	
	-- See if we can ping it
	local server = fetch_config_value('meshdesk.internet1.ip')
	local c = require("rdConfig")
	local lan_config_fail=true                                          
	if(c.pingTest(server))then
		print("Ping os server was OK try to fetch the settings")
--		local id	= "A8-40-41-13-60-E3"
		local id	= getMac('eth0')
		local proto 	= fetch_config_value('meshdesk.internet1.protocol')
		local url   	= fetch_config_value('meshdesk.internet1.url')
		local query     = proto .. "://" .. server .. "/" .. url 
		print("Query url is " .. query )
		if(c.fetchSettings(query,id,true))then
			print("Cool, settings gekry")
			lan_config_fail=false
		end
	end
	if(lan_config_fail)then	
		wait_for_wifi()
	else
		--flash D--
		os.execute("/etc/MESHdesk/main_led.lua start d")
		configure_device(config_file)
	end
end

function wait_for_wifi()
	-- WiFi we flash "C"
	os.execute("/etc/MESHdesk/main_led.lua start c")
	
	-- Start the WiF interface
	local w = require("rdWireless")                                            
	w.connectClient()
	
	local start_time=os.time()
	local loop=true
	local wifi_is_up=false
	
	while (loop) do
		sleep(sleep_time)
		
		-- If the lan came up we will try to get the settings
		if(did_wifi_came_up())then
			loop = false
			wifi_is_up = true
		end
		
		local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= lan_timeout)then
			print("WiFi is not coming up. Try the previous settings")
			loop=false --This will break the loop
		else
			print("Waiting for WIFI to come up now for " .. time_diff .. " seconds")
		end
	end
	
	--See what happended and how we should handle it
	if(wifi_is_up)then
		-- sleep at least 10 seconds to make sure it got a DHCP addy
		sleep(10)
		print("Wifi is up try to get the settings through WiFi")
		try_settings_through_wifi()
	else
		print("Settings could not be fetched through WiFi see if older ones exists")
		check_for_previous_settings()
	end
end

function try_settings_through_wifi()
	print("Wifi up; now try fetch the settings")
	
	-- See if we can ping it
	local server = fetch_config_value('meshdesk.internet1.ip')
	local c = require("rdConfig")
	local wifi_config_fail=true                                          
	if(c.pingTest(server))then
		print("Ping os server was OK try to fetch the settings")
--		local id	="A8-40-41-13-60-E3"
		local id	= getMac('eth0')
		local proto 	= fetch_config_value('meshdesk.internet1.protocol')
		local url   	= fetch_config_value('meshdesk.internet1.url')
		local query     = proto .. "://" .. server .. "/" .. url 
		print("Query url is " .. query )
		if(c.fetchSettings(query,id,false))then
			print("Cool, settings gekry")
			wifi_config_fail=false
		end
	end
	if(wifi_config_fail)then	
		print("Failed to get settings through Wi-Fi see if older ones exists")
		check_for_previous_settings()
	else
		--flash D--
		os.execute("/etc/MESHdesk/main_led.lua start d")
		configure_device(config_file)
	end
end

function did_wifi_came_up()
	local wifi_up_file=fetch_config_value('meshdesk.settings.wifi_up_file')
	if(file_exists(wifi_up_file))then
		return true		
	else
		return false
	end
end

function check_for_previous_settings()
	print("Checking for previous settings")
	if(file_exists(previous_config_file))then
		print("Using previous settings")
		os.execute("/etc/MESHdesk/main_led.lua start e")
		configure_device(previous_config_file)
	else
		--Nothing we can do but flash an SOS
		os.execute("/etc/MESHdesk/main_led.lua start sos")
	end
end

function configure_device(config)

	print("Configuring device according to " .. config)
	
	local contents        = readAll(config) 
	local json            = require("json")           
	local o               = json.decode(contents)  
---[[--	
	-- Is this perhaps a gateway node? --
	if(o.config_settings.gateways ~= nil)then
		-- Set up the gateways --	
		require("rdGateway")
		local a = rdGateway()
		a:enable(o.config_settings.gateways)
		
	else
		-- Break down the gateways --
		require("rdGateway")
		local a = rdGateway()
		a:disable()
	end

	-- Do we have some wireless settings?      
	if(o.config_settings.wireless ~= nil)then  
		print("Doing wireless")            
	        local w = require("rdWireless")    
	        w.main(o.config_settings.wireless) 
	end
	
	-- Do we have some network settings?       
	if(o.config_settings.network ~= nil)then   
		print("Doing network")             
	        local n = require("rdNetwork")     
	        n.main(o.config_settings.network) 
	end 
	
	  
        os.execute("/etc/init.d/network reload")
        --os.execute("batctl if add wlan0") 	-- The batman if does not always comes up
	sleep(5)
       -- os.execute("wifi")			-- Reload the wifi also else the dhcp does not work well
        
        
        -- Check if there are perhaps some captive portals to set up once everything has been done --
        sleep(5) -- Wait a bit before doing this part else the DHCP not work correct
        if(o.config_settings.captive_portals ~= nil)then
        	print("Doing Captive Portals")
        	require("rdCoovaChilli")
        	local a = rdCoovaChilli()
        	a:createConfigs(o.config_settings.captive_portals)                  
        	a:startPortals()	
        	
        end
        
        -- Do the LED's we have configured in /etc/config/system
        os.execute("ifconfig bat0 up") 	--On the pico's it goes down
        --os.execute("/etc/init.d/led start")
        
--]]--
end

function getMac(interface)

	interface = interface or "eth0"
	io.input("/sys/class/net/" .. interface .. "/address")
	t = io.read("*line")
	dashes, count = string.gsub(t, ":", "-")
	dashes = string.upper(dashes)
	return dashes

end


-- Kick off by waiting for the LAN
wait_for_lan()
