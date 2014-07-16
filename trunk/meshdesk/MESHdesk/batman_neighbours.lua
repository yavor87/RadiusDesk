#!/usr/bin/lua

-- Include libraries
package.path = "libs/?.lua;" .. package.path

--[[--
This script will typically be started during the setup of the MESHdesk device
If will then loop while checking the following:
1.) If the MESHdesk setup script is still running if will wait and loop
2.) If the MESHdesk setup script is not running; it will 
	2.1)  Run batctl o to determine the neighbour count
	2.2) Stop the morse LED
	2.3) Indicate the amount of neighbours by flashing the LED morse eq to neighbours
3.) Sleep
--]]--a

debug 	 = true
interval = 30

require "socket"                                                                                          
require("rdLogger")
l                       = rdLogger() 

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

function batman_neighbour_count()
	local handle = io.popen('batctl o ')
        local result = handle:read("*a")
        handle:close()
        local n = select(2, result:gsub('\n', '\n'))	--Get the line count of the output
        if(n ~= nil )then
        	local r = n
        	if(r < 3)then
        		--Turn off the LED
        		os.execute("/etc/MESHdesk/main_led.lua stop")
        	end
        	if(r == 3)then
        		if(string.find(result,'No batman nodes in range'))then
        			os.execute("/etc/MESHdesk/main_led.lua stop")
        		else
        			os.execute("/etc/MESHdesk/main_led.lua start one")
        		end
        	end
        	if(r == 4)then
        		os.execute("/etc/MESHdesk/main_led.lua start two")
        	end
        	if(r == 5)then
        		os.execute("/etc/MESHdesk/main_led.lua start three")
        	end
        	if(r == 6)then
        		os.execute("/etc/MESHdesk/main_led.lua start four")
        	end
        	if(r == 7)then
        		os.execute("/etc/MESHdesk/main_led.lua start five")
        	end
        	if(r == 8)then
        		os.execute("/etc/MESHdesk/main_led.lua start six")
        	end
        	if(r == 9)then
        		os.execute("/etc/MESHdesk/main_led.lua start seven")
        	end
        	if(r == 10)then
        		os.execute("/etc/MESHdesk/main_led.lua start eight")
        	end
        	if(r == 11)then
        		os.execute("/etc/MESHdesk/main_led.lua start nine")
        	end
        	if(r > 12)then
        		os.execute("/etc/MESHdesk/main_led.lua start zero")
        	end
        end
end

--=================================================

loop = true
while(loop)do
	if(not(pidof('a.lua')))then                   
		--print("Setup script not running evaluate the Batman-adv neighbours")
		--log("Setup script not running evaluate the Batman-adv neighbours")
		batman_neighbour_count()
	else
		--print("Setup script running already wait for it to finish")
		log("Setup script running already wait for it to finish")
	end
	sleep(interval)
end 

