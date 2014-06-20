#!/usr/bin/lua

-- Include libraries
package.path = "../libs/?.lua;" .. package.path

--Some variables
local feedback_timestamp    = 102   --This is where feedback timestamp

function fetch_config_value(item)
	local handle = io.popen('uci get '..item)
	local result = handle:read("*a")
	handle:close()
	result = string.gsub(result, "[\r\n]+$", "")
	return result
end

function check()
    require('rdAlfred')
    local a     = rdAlfred()
    local j     = require("json")
    local ft    = a:readData(feedback_timestamp)

    local dead_after    = fetch_config_value('meshdesk.settings.internet_off_after')
    local hardware      = fetch_config_value('meshdesk.settings.hardware')
    local led           = fetch_config_value('meshdesk.'..hardware..'.internet_led')

    if(ft.timestamp == nil)then ft.timestamp = 0 end
    if(ft)then
        if(os.time() > ft.timestamp+dead_after)then
            os.execute('echo 1 > ' .. led )
        else
            os.execute('echo 0 > ' .. led )
        end
    end
end

check()

