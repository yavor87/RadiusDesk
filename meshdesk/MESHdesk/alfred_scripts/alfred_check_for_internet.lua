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
    local a         = rdAlfred()
    local j         = require("json")
    local ft_list   = a:readData(feedback_timestamp)

    local dead_after    = fetch_config_value('meshdesk.settings.heartbeat_dead_after')
    local hardware      = fetch_config_value('meshdesk.settings.hardware')
    local led           = fetch_config_value('meshdesk.'..hardware..'.internet_led')

    if(ft_list)then
        local ts = 0
        local j = require("json")
        for i, row in ipairs(ft_list) do
            local node, value = unpack(row)
            local data = j.decode(value)
            if(ts < data.timestamp)then -- Only get the largest one
                ts = data.timestamp
            end
        end
 
        if(ts == 0)then
            os.execute('echo 0 > ' .. led )
        end

        if(os.time() > (ts+dead_after))then
            os.execute('echo 0 > ' .. led )
        else
            os.execute('echo 1 > ' .. led )
        end
    else
        os.execute('echo 0 > ' .. led )   
    end
end

check()

