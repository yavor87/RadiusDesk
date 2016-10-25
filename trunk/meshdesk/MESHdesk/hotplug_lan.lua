#!/usr/bin/lua

file_lan_up='/tmp/lan_up'
file_lan_down='/tmp/lan_down'
file_wifi_up='/tmp/wifi_up'
file_wifi_down='/tmp/wifi_down'
os.execute("env >> /tmp/dirk")

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
                                        

function lan_up_trigger()
	os.execute('rm ' .. file_lan_down)
	os.execute('touch ' .. file_lan_up)
	-- We can (if a.lau is not running call a.lua)
	if(not(pidof('a.lua')))then
		os.execute('logger -p user.info -t MESHdesk "Trigger received for Config Fetcher"')
		os.execute('/etc/init.d/md_prerun start')
	end	
end

function lan_down_trigger()
	os.execute('rm ' .. file_lan_up)
	os.execute('touch ' .. file_lan_down)
end

function wifi_up_trigger()
	os.execute('rm ' .. file_wifi_down)
	os.execute('touch ' .. file_wifi_up)
end

function wifi_down_trigger()
	os.execute('rm ' .. file_wifi_up)
	os.execute('touch ' .. file_wifi_down)
end


function interface_switch()

	local act=os.getenv("ACTION")
	local int=os.getenv("INTERFACE")
	local dev=os.getenv("DEVICE")
	
	if((act == nil)and(int ==nil))then
		print("Script not called by procd/hotplug");
		print(pidof('led.lua'))
	else
		if((act == 'ifup')and((int == 'lan')or(int == 'wwan')or(int == 'web_by_wifi')))then
			lan_up_trigger();
		end
		if((act == 'ifdown')and((int == 'lan')or(int == 'wwan')or(int == 'web_by_wifi')))then
			lan_down_trigger();
		end
		if((act == 'ifup')and(string.find(int,"client")))then
			wifi_up_trigger();
		end
		if((act == 'ifdown')and(string.find(int,"client")))then
			wifi_down_trigger();
		end
	end
end

interface_switch()
