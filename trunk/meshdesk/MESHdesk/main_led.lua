#!/usr/bin/lua

start_stop = arg[1]
what_to_flash = arg[2]

if((start_stop == nil)or(start_stop == 'start'))then
	os.execute("killall led.lua")
	os.execute("/etc/MESHdesk/led.lua " .. what_to_flash .. " &")
end

if(start_stop == 'stop')then
	os.execute("killall led.lua")
	os.execute("/etc/MESHdesk/led.lua stop &")
end

