#!/usr/bin/lua

--[[--

Startup script to get the config of the device from the config server

--]]--

-- Include libraries
package.path = "libs/?.lua;" .. package.path
require "socket"
require("rdLogger")
--External programs object
require("rdExternal")
--Configure object
require("rdConfig")
--Alfred object
require("rdAlfred")

--uci object
require('uci')
uci_cursor = uci.cursor(nil,'/var/state')

function fetch_config_value(item)
	local handle = io.popen('uci get '..item)
	local result = handle:read("*a")
	handle:close()
	result = string.gsub(result, "[\r\n]+$", "")
	return result
end


-- Some constants -- Replace later with uci values
previous_config_file 	= fetch_config_value('meshdesk.settings.previous_config_file')
sleep_time		        = 1
config_file		        = fetch_config_value('meshdesk.settings.config_file')
gw_dhcp_timeout		    = tonumber(fetch_config_value('meshdesk.settings.gw_dhcp_timeout'))
wifi_timeout		    = tonumber(fetch_config_value('meshdesk.settings.wifi_timeout'))
debug			        = true
l			            = rdLogger()
ext 			        = rdExternal()
alfred                  = rdAlfred()
config_server           = fetch_config_value('meshdesk.settings.config_server')

--Reboot on SOS
sos_reboot_timeout		= 30


--======================================
---- Some general functions ------------
--======================================



function log(m,p)
	if(debug)then
		l:log(m,p)
	end
end

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

function getMac(interface)
	interface = interface or "eth0"
	io.input("/sys/class/net/" .. interface .. "/address")
	t = io.read("*line")
	dashes, count = string.gsub(t, ":", "-")
	dashes = string.upper(dashes)
	return dashes
end

--==============================
-- End Some general functions --
--==============================


--======================================
---- Some test functions ---------------
--======================================
function did_lan_came_up()
	local lan_up_file=fetch_config_value('meshdesk.settings.lan_up_file')
	if(file_exists(lan_up_file))then
		return true		
	else
		return false
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

function reboot_on_sos()
    --When the device is in SOS mode we might as well just reboot it again to keep on trying
	local start_time	= os.time()
	local loop			= true

	--**********LOOP**********
	while (loop) do
		sleep(sleep_time)
		local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= sos_reboot_timeout)then
			os.execute("reboot")
			break
		end
	end
	--**********LOOP END**********
end


--==============================
-- End Some test functions -----
--==============================

--===========================
-- Firmware Configuration ---
--===========================
function do_fw_config()
    --kill potential existing batman_neighbours.lua instance
	ext:stop('batman_neighbours.lua')

	-- Break down the gateways --
	require("rdGateway")
	local a = rdGateway()
	a:disable()
	a:restartServices()

    require("rdNetwork")

	-- LAN we flash "I"
	log("Do Firmware configuration - if server running")
	os.execute("/etc/MESHdesk/main_led.lua start config")
    --Set meshdesk.settings.id_if (typically eth0) to a known IP Address
    local network = rdNetwork()
	network:frmwrStart()
    sleep(4) --just so it eases out
    
    --See if we can at least ping the machine running the utility
    local conf  = rdConfig();
    if(conf:pingTest(config_server))then
        require("rdFirmwareConfig")
        local f = rdFirmwareConfig()
        f:runConfig()
    end
end

--=====================
-- Start-up function --
--=====================
function wait_for_lan()
	                 
	--kill potential existing batman_neighbours.lua instance
	ext:stop('batman_neighbours.lua')
	ext:stop('heartbeat.lua')
	ext:stop('actions_checker')	
	os.execute("/etc/init.d/alfred stop")

	-- LAN we flash "A"
	log("Starting LAN wait")
	os.execute("/etc/MESHdesk/main_led.lua start lan")
	local start_time	= os.time()
	local loop			= true
	local lan_is_up		= false
	
	--Do a clean start with the wireless--
	require("rdWireless")
	
	local wireless = rdWireless()
	wireless:newWireless()
	--After this we can fetch a count of the radios
	radio_count = wireless:getRadioCount()
	
    require("rdNetwork")
	
	local network = rdNetwork()
	network:dhcpStart()
	
	--**********LOOP**********
	while (loop) do
		sleep(sleep_time)
		-- If the lan came up we will try to get the settings
		if(did_lan_came_up())then
			lan_is_up 	= true
			break	--no need to continiue
		end
		local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= gw_dhcp_timeout)then
			log("LAN is not coming up. Try the WiFi")
			print("LAN is not coming up. Try the WiFi")
			break
		else
			log("Waiting for LAN to come up now for " .. time_diff .. " seconds")
			print("Waiting for LAN to come up now for " .. time_diff .. " seconds")
		end
		
		--If it happens that the LAN comes up the time may be adjusted by a large amount due to NTP.
		--Then we can assume the LAN is up as set the flag
		--TODO This will be large on second runs! - fix this
		if((os.time() > 4000) and (start_time < 4000))then
			log('Detected a very large value for os time asume the LAN and NTP working')
			lan_is_up 	= true
			break	--no need to continiue
		end
	end
	--*********LOOP END*********
	
	--See what happended and how we should handle it
	if(lan_is_up)then
		--os.execute("/etc/MESHdesk/main_led.lua start b")
		log("sleep at least 10 seconds to make sure it got a DHCP addy")
		-- sleep at least 10 seconds to make sure it got a DHCP addy
		sleep(10)
		try_settings_through_lan()
	else
		try_wifi()		
	end	
end


function try_settings_through_lan() 
	log("LAN up now try fetch the settings")
	print("LAN up now try fetch the settings")
	
	-- See if we can ping it
	local server 			= fetch_config_value('meshdesk.internet1.ip')
	local c 				= rdConfig()
	local lan_config_fail	=true 
	local loop	= true
	local start_time	    = os.time()
	
	--**********LOOP**********
	while (loop) do
		sleep(sleep_time)
		
		if(c:pingTest(server))then
	        print("Ping os server was OK try to fetch the settings")
	        log("Ping os server was OK try to fetch the settings")
    		--local id	= "A8-40-41-13-60-E3"
    		local id_if     = fetch_config_value('meshdesk.settings.id_if')
	        local id		= getMac(id_if)
	        local proto 	= fetch_config_value('meshdesk.internet1.protocol')
	        local url   	= fetch_config_value('meshdesk.internet1.url')
	        local query     = proto .. "://" .. server .. "/" .. url 
	        print("Query url is " .. query )
	        if(c:fetchSettings(query,id,true))then
		        print("Funky -> got settings through LAN")
		        lan_config_fail=false
		        break --We can exit the loop
	        end
        else 
	        log("Ping os server was NOT OK! - Try again")
        end
		
		--Here we have a timer to limit the loops 
	    local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= gw_dhcp_timeout)then
		    log('No contact to Internet for '..gw_dhcp_timeout..' seconds')
			print('No contact to Internet for '..gw_dhcp_timeout..' seconds')
			break
        end
        --Here we break since NTP we assume is already up and adjusted.
        if((os.time() > 4000) and (start_time < 4000))then
			log('Detected a very large value for os time asume the LAN and NTP working')
			break	--no need to continiue
		end           
    end

	if(lan_config_fail)then	
		log("Could not fetch settings through LAN")
		try_wifi()
	else
		--flash D--
		--os.execute("/etc/MESHdesk/main_led.lua start d")
		configure_device(config_file)
	end
end

function try_wifi()
	local got_new_config = false
	--Here we will go through each of the radios
	log("Try to fetch the settings through the WiFi radios")
	log("Device has "..radio_count.." radios")
	local radio = 0 --first radio
	while(radio < radio_count) do
		log("Try to get settings using radio "..radio)
		--Bring up the Wifi
		local wifi_is_up = wait_for_wifi(radio)
		if(wifi_is_up)then
			local got_settings = try_settings_through_wifi()
			if(got_settings)then
				--flash D--
				got_new_config = true
				--os.execute("/etc/MESHdesk/main_led.lua start d")
				configure_device(config_file)
				break -- We already got the new config and can break our search of next radio
			end
		end
		--Try next radio
		radio = radio+1
	end

	if(got_new_config == false)then
		print("Settings could not be fetched through WiFi see if older ones exists")
		log("Settings could not be fetched through WiFi see if older ones exists")
		check_for_previous_settings()
	end
end


function wait_for_wifi(radio_number)

	if(radio_number == nil)then
		radio_number = 0
	end

	-- WiFi we flash "C"
	log("Try settings through WiFi network")
	if(radio_number == 0)then
	    os.execute("/etc/MESHdesk/main_led.lua start rone")
    end
	
	if(radio_number == 1)then
	    os.execute("/etc/MESHdesk/main_led.lua start rtwo")
    end
	
	-- Start the WiF interface
	require("rdWireless")
	local w = rdWireless()
                             
	w:connectClient(radio_number)
	
	local start_time	= os.time()
	local loop			= true
	local wifi_is_up	= false --default
	
	while (loop) do
		sleep(sleep_time)
		
		-- If the wifi came up we will try to get the settings
		if(did_wifi_came_up())then
			wifi_is_up = true
			break
		end
		
		local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= wifi_timeout)then
			print("Failed to get settings through Wi-Fi see if older ones exists")
			log("Failed to get settings through Wi-Fi see if older ones exists")
			break
		else
			print("Waiting for WIFI to come up now for " .. time_diff .. " seconds")
		end
		--If it happens that the WIFI comes up the time may be adjusted by a large amount due to NTP.
		--Then we can assume the WIFI is up as set the flag
		if((os.time() > 4000) and (start_time < 4000))then
			log('Detected a very lage value for os time assume the WiFi client and NTP working')
			loop = false
			wifi_is_up = true
		end
	end

	--See what happended and how we should handle it
	if(wifi_is_up)then
		-- sleep at least 10 seconds to make sure it got a DHCP addy
		sleep(10)
		print("Wifi is up try to get the settings through WiFi")
		log("Wifi is up try to get the settings through WiFi")
	end
	return wifi_is_up
end

function try_settings_through_wifi()
	print("Wifi up now try fetch the settings")
	log("Wifi up now try fetch the settings")
	
	-- See if we can ping it
	local server 		= fetch_config_value('meshdesk.internet1.ip')
	local c 			= rdConfig()
	local got_settings	=false                                          
	if(c:pingTest(server))then
		print("Ping os server was OK try to fetch the settings")
		log("Ping os server was OK try to fetch the settings")
--		local id	="A8-40-41-13-60-E3"
        local id_if     = fetch_config_value('meshdesk.settings.id_if')
		local id	    = getMac(id_if)
		local proto 	= fetch_config_value('meshdesk.internet1.protocol')
		local url   	= fetch_config_value('meshdesk.internet1.url')
		local query     = proto .. "://" .. server .. "/" .. url 
		print("Query url is " .. query )
		if(c:fetchSettings(query,id,false))then
			print("Funky -> got settings through WIFI")
			got_settings=true
		end
	end
	return got_settings
end



function check_for_previous_settings()
	print("Checking for previous settings")
	if(file_exists(previous_config_file))then
		print("Using previous settings")
		--os.execute("/etc/MESHdesk/main_led.lua start e")
		configure_device(previous_config_file)
	else
		--Nothing we can do but flash an SOS
		os.execute("/etc/MESHdesk/main_led.lua start sos")
		--This will result in a reboot to try again
		reboot_on_sos()
	end
end

function configure_device(config)

    configure_mode();
    
	print("Configuring device according to " .. config)
	
	local contents        = readAll(config) 
	local json            = require("json")           
	local o               = json.decode(contents)  

    if(o.success == false)then --If the device was not yet assigned we need to give feedback about it
	    print("The server returned an error");
	    log("The server returned an error");

        --There might be an error message
	    if(o.error ~= nil)then
	        print(o.error);
	        log(o.error);
	        reboot_on_sos();
	        return;
	    end

        --There might also be an option to point the device to another server for its settings
        if(o.new_server ~= nil)then
            log("Setting new config server to " .. o.new_server);
            uci_cursor.set('meshdesk','internet1','ip',o.new_server);
            uci_cursor.commit('meshdesk');
            reboot_on_sos();
	        return;  
        end

    end


	-- Do we have any batman_adv settings? --
	if(o.config_settings.batman_adv ~= nil)then   
		--print("Doing Batman-adv")
        require("rdBatman")
	    local batman = rdBatman()
	    batman:configureFromTable(o.config_settings.batman_adv)             
	end 


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

	-- Do we have some network settings?       
	if(o.config_settings.network ~= nil)then   
		print("Doing network")
        require("rdNetwork")
	    local network = rdNetwork()
	    network:configureFromTable(o.config_settings.network)             
	end 
	
	-- Do we have some wireless settings?      
	if(o.config_settings.wireless ~= nil)then  
		print("Doing wireless")
		require("rdWireless")           
	    local w = rdWireless()    
	    w:configureFromTable(o.config_settings.wireless) 
	end
	  
    os.execute("/etc/init.d/network reload")
    sleep(2)
    os.execute("/sbin/wifi")

	-- Do we have some system settings?
	if(o.config_settings.system ~= nil)then  
		print("Doing system")
		require("rdSystem")           
	    local s = rdSystem()    
	    s:configureFromTable(o.config_settings.system) 
	end
    
    -- Do the LED's we have configured in /etc/config/system
    os.execute("ifconfig bat0 up") 	--On the pico's it goes down
    
	if(o.config_settings.gateways ~= nil)then
		-- Set up the gateways --	
		require("rdGateway")
		local a = rdGateway()
		a:restartServices()
        --start alfred in master mode
        alfred:masterEnableAndStart()
		--Only the gateway node
		ext:startOne('/etc/MESHdesk/heartbeat.lua &','heartbeat.lua')
    else
        alfred:slaveEnableAndStart()
	end

	--Start the actions checker (on every node)
	ext:startOne('/etc/MESHdesk/actions_checker.lua &','actions_checker.lua')
	
    --os.execute("/etc/init.d/led start")
	log("Ensure mesh0 and/or mesh1 if present is added to bat0")
	os.execute("batctl if add mesh0")
    os.execute("batctl if add mesh1")

    log('Starting Batman neighbour scan')
    ext:startOne('/etc/MESHdesk/batman_neighbours.lua &','batman_neighbours.lua')
    
    --We move it to last since it gave more trouble with 802.11s based transport
    -- Check if there are perhaps some captive portals to set up once everything has been done --
    sleep(5) -- Wait a bit before doing this part else the DHCP not work correct
    if(o.config_settings.captive_portals ~= nil)then
    	print("Doing Captive Portals")
    	require("rdCoovaChilli")
    	local a = rdCoovaChilli()
    	a:createConfigs(o.config_settings.captive_portals)                  
    	a:startPortals()
    	sleep(5)
    	a:setDnsMasq(o.config_settings.captive_portals)
    	
    end
    
    if(o.config_settings.openvpn_bridges ~= nil)then
        print("Doing OpenVPN Bridges")
        require("rdOpenvpn")
	    local v = rdOpenvpn()
        v:configureFromTable(o.config_settings.openvpn_bridges)
        os.execute("/etc/init.d/openvpn start")
    end
        
--]]--
end

--=====================
--AP Specifics Here----
--=====================

--===============================
-- AP -> Start-up function for --
--===============================
function ap_wait_for_lan()

    ext:stop('heartbeat.lua')
	ext:stop('actions_checker')	
	os.execute("/etc/init.d/alfred stop")
	                 
	-- LAN we flash "1"
	log("Starting LAN wait")
	--os.execute("/etc/MESHdesk/main_led.lua start one")
	os.execute("/etc/MESHdesk/main_led.lua start lan")
	local start_time	= os.time()
	local loop			= true
	local lan_is_up		= false
	
	--Do a clean start with the wireless--
	require("rdWireless")
	
	local wireless = rdWireless()
	wireless:newWireless()
	
    require("rdNetwork")
	
	local network = rdNetwork()
	network:dhcpStart()
	
	--**********LOOP**********
	while (loop) do
		sleep(sleep_time)
		-- If the lan came up we will try to get the settings
		if(did_lan_came_up())then
			lan_is_up 	= true
			break	--no need to continiue
		end
		local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= gw_dhcp_timeout)then
			log("LAN is not coming up. Try again")
			print("LAN is not coming up. Try again")
			reboot_on_sos();
			break
		else
			log("Waiting for LAN to come up now for " .. time_diff .. " seconds")
			print("Waiting for LAN to come up now for " .. time_diff .. " seconds")
		end
		
		--If it happens that the LAN comes up the time may be adjusted by a large amount due to NTP.
		--Then we can assume the LAN is up as set the flag
		if((os.time() > 4000) and (start_time < 4000))then
			log('Detected a very lage value for os time asume the LAN and NTP working')
			lan_is_up 	= true
			break	--no need to continiue
		end
	end
	--*********LOOP END*********
	
	--See what happended and how we should handle it
	if(lan_is_up)then
		--os.execute("/etc/MESHdesk/main_led.lua start two")
		log("sleep at least 10 seconds to make sure it got a DHCP addy")
		-- sleep at least 10 seconds to make sure it got a DHCP addy
		sleep(10)
		ap_try_settings_through_lan()
	else
		print("LAN did not come up see if older config exists")
		log("LAN did not come up see if older config exists")
		ap_check_for_previous_settings()		
	end	
end


function ap_try_settings_through_lan() 
	log("LAN up now try fetch the settings")
	print("LAN up now try fetch the settings")
	
	-- See if we can ping it
	local server 			= fetch_config_value('meshdesk.internet1.ip')
	local c 				= rdConfig()
	local lan_config_fail	=true 	
	local loop      = true 
	local start_time	    = os.time()
	
	--**********LOOP**********
	while (loop) do
		
		sleep(sleep_time)
		
		if(c:pingTest(server))then
	        print("Ping os server was OK try to fetch the settings")
	        log("Ping os server was OK try to fetch the settings")
    		--local id	= "A8-40-41-13-60-E3"
    		local id_if     = fetch_config_value('meshdesk.settings.id_if')
	        local id		= getMac(id_if)
	        local proto 	= fetch_config_value('meshdesk.internet1.protocol')
	        local url   	= fetch_config_value('meshdesk.internet1.ap_url')
	        local query     = proto .. "://" .. server .. "/" .. url 
	        print("Query url is " .. query )
	        if(c:fetchSettings(query,id,true))then
		        print("Funky -> got settings through LAN")
		        lan_config_fail=false
		        break --We can exit the loop
	        end
        else 
	        log("Ping os server was NOT OK! - Try again")
        end
		
		--Here we have a timer to limit the loops 
	    local time_diff = os.difftime(os.time(), start_time)
		if(time_diff >= gw_dhcp_timeout)then
		    log('No contact to Internet for '..gw_dhcp_timeout..' seconds')
			print('No contact to Internet for '..gw_dhcp_timeout..' seconds')
			break
        end
        --Here we break since NTP we assume is already up and adjusted.
        if((os.time() > 4000) and (start_time < 4000))then
			log('Detected a very large value for os time asume the LAN and NTP working')
			break	--no need to continiue
		end           
    end

	if(lan_config_fail)then	
		print("Settings could not be fetched through LAN see if older ones exists")
		log("Settings could not be fetched through LAN see if older ones exists")
		ap_check_for_previous_settings()
	else
		--flash D--
		--os.execute("/etc/MESHdesk/main_led.lua start three")
		ap_configure_device(config_file)
	end
end

function ap_check_for_previous_settings()
	print("Checking for previous settings")
	if(file_exists(previous_config_file))then
		print("Using previous settings")
		--os.execute("/etc/MESHdesk/main_led.lua start four")
		ap_configure_device(previous_config_file)
	else
		--Nothing we can do but flash an SOS
		os.execute("/etc/MESHdesk/main_led.lua start sos")
		--This will result in a reboot to try again
		reboot_on_sos();
	end
end

function ap_configure_device(config)

	print("Configuring device according to " .. config)
	
	local contents        = readAll(config) 
	local json            = require("json")           
	local o               = json.decode(contents) 
	
	if(o.success == false)then --If the device was not yet assigned we need to give feedback about it
	    print("The server returned an error");
	    log("The server returned an error");

        --There might be an error message
	    if(o.error ~= nil)then
	        print(o.error);
	        log(o.error);
	        reboot_on_sos();
	        return;
	    end

        --There might also be an option to point the device to another server for its settings
        if(o.new_server ~= nil)then
            log("Setting new config server to " .. o.new_server);
            uci_cursor.set('meshdesk','internet1','ip',o.new_server);
            uci_cursor.commit('meshdesk');
            reboot_on_sos();
	        return;  
        end

    end


	-- Is this perhaps a gateway node? --
	if(o.config_settings.gateways ~= nil)then
		-- Set up the gateways --	
		require("rdGateway")
		local a = rdGateway()
		a:setMode('ap')
		a:enable(o.config_settings.gateways)
		
	else
		-- Break down the gateways --
		require("rdGateway")
		local a = rdGateway()
		a:setMode('ap')
		a:disable()
	end

	-- Do we have some network settings?       
	if(o.config_settings.network ~= nil)then   
		print("Doing network")
        require("rdNetwork")
	    local network = rdNetwork()
	    network:configureFromTable(o.config_settings.network)             
	end 
	
	-- Do we have some wireless settings?      
	if(o.config_settings.wireless ~= nil)then  
		print("Doing wireless")
		require("rdWireless")           
	    local w = rdWireless()    
	    w:configureFromTable(o.config_settings.wireless) 
	end
	  
    os.execute("/etc/init.d/network reload")

	-- Do we have some system settings?
	if(o.config_settings.system ~= nil)then  
		print("Doing system")
		require("rdSystem")           
	    local s = rdSystem()    
	    s:configureFromTable(o.config_settings.system) 
	end

    -- Check if there are perhaps some captive portals to set up once everything has been done --
    sleep(5) -- Wait a bit before doing this part else the DHCP not work correct

    os.execute("/etc/init.d/firewall reload") --Activate the new firewall rules especiallt NAT to LAN

    if(o.config_settings.captive_portals ~= nil)then
    	print("Doing Captive Portals")
    	require("rdCoovaChilli")
    	local a = rdCoovaChilli()
    	a:createConfigs(o.config_settings.captive_portals)                  
    	a:startPortals()
    	sleep(5)
    	a:setDnsMasq(o.config_settings.captive_portals)   		
    end
    
    if(o.config_settings.openvpn_bridges ~= nil)then
        print("Doing OpenVPN Bridges")
        require("rdOpenvpn")
	    local v = rdOpenvpn()
        v:configureFromTable(o.config_settings.openvpn_bridges)
        os.execute("/etc/init.d/openvpn start")
    end
    
    --Start Alfred for the collecting of data (No MESH)
    alfred:masterNoBatmanEnableAndStart()
    --Start the heartbeat to the server
    ext:startOne('/etc/MESHdesk/heartbeat.lua &','heartbeat.lua')
    --Start the actions checker
	ext:startOne('/etc/MESHdesk/actions_checker.lua &','actions_checker.lua')
        
	if(o.config_settings.gateways ~= nil)then
		-- Set up the gateways --	
		require("rdGateway")
		local a = rdGateway()
		a:setMode('ap')
		a:restartServices()   
    end      
--]]--
end

--=====================
--END AP Specifics ----
--=====================

function prep_leds()
    local hw        = uci_cursor.get('meshdesk','settings','hardware');
    local sled      = uci_cursor.get('meshdesk',hw,'single_led');
    local mled      = uci_cursor.get('meshdesk',hw,'meshed_led');
    local sysled    = uci_cursor.get('meshdesk',hw,'system_led');
    
    if((sled ~= nil)and(mled ~= nil)and(sysled ~= nil))then
        os.execute("echo '0' > '/sys/class/leds/"..sled.."/brightness'");   --Single off
        os.execute("echo '0' > '/sys/class/leds/"..mled.."/brightness'");   --Multiple off
        os.execute("echo '1' > '/sys/class/leds/"..sysled.."/brightness'"); --System on
        uci_cursor.set('system','wifi_led','sysfs',sled);
        uci_cursor.commit('system');
        os.execute("/etc/init.d/led stop")
        os.execute("/etc/init.d/led start")
    end
end

function configure_mode()
    local hw        = uci_cursor.get('meshdesk','settings','hardware');
    local sled      = uci_cursor.get('meshdesk',hw,'single_led');
    local sysled    = uci_cursor.get('meshdesk',hw,'system_led');
    if(sysled ~= sled)then -- Only when the single mode is not the same LED (else we switch it off)
        os.execute("echo '0' > '/sys/class/leds/"..sysled.."/brightness'"); --System on    
    end
end


--Get the mode
mode = fetch_config_value('meshdesk.settings.mode')

if(mode == 'off')then
    os.exit()
end

--=====================
--Pre-setup: ----------
--Configure Firmware is there is a server running on the correct IP and port
--=====================
do_fw_config()

--Prep the LEDs if needs to
prep_leds()



--=======================================
-- Check if we are and AP or a MESH node=
--=======================================

if(mode == 'ap')then
    print("Device in AP Mode");
    ap_wait_for_lan()
    --Make sure alfred started
    os.execute("/etc/init.d/alfred start")
elseif(mode == 'mesh')then
    print("Device in Mesh node");
    wait_for_lan()
    --Make sure alfred started
    os.execute("/etc/init.d/alfred start")
else
    print("Device in unknown mode of "..mode)    
end
