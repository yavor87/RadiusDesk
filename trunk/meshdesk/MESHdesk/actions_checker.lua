#!/usr/bin/lua

-- Include libraries
package.path = "libs/?.lua;" .. package.path

--[[--
This script will typically be started during the setup of the  MESHdesk device
If will then loop while checking the following:
1.) If the MESHdesk setup script is still running if will wait  and loop
2.) If the MESHdesk setup script is not running; it will 
	2.1)  run the /etc/MESHdesk/alfred_scripts/alfred_check_for_actions.lua
3.) Sleep
--]]--a

debug 	 = true
interval = 120
local uci= require('uci')

require "socket" 
require("rdLogger")
l   	= rdLogger() 

--======================================
---- Some general functions -----------
--=====================================
function log(m,p)
	if(debug)then                                                                                     
        	l:log(m,p)                                                                                
	end                               
end
                                                                                                       
function sleep(sec)
	socket.select(nil, nil, sec)                                                                          
end        

function pidof(program)
	local handle = io.popen('pidof '.. program)
        local result = handle:read("*a")
        handle:close()
        result = string.gsub(result, "[\r\n]+$", "")
        if(result ~= nil)then
        	return tonumber(result)
        else
        	return false
        end
end

function check_for_actions()
	os.execute("/etc/MESHdesk/alfred_scripts/alfred_check_for_actions.lua")      
end

--=================================================

loop = true
while(loop)do
	if(not(pidof('a.lua')))then                   
		log("Check for actions awaiting")
		check_for_actions()
	else
		--print("Setup script running already wait for it to finish")
		log("Setup script running already wait for it to finish")
	end

	--Check if there are another interval besides the default of 30 seconds
	local x = uci.cursor(nil,'/var/state')
	local time_to_sleep = x.get('meshdesk','settings','heartbeat_interval')
	if(time_to_sleep)then
		interval = time_to_sleep
	end
	sleep(interval)
end 

