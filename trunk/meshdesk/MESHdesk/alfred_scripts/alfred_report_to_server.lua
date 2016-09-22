#!/usr/bin/lua


-- Include libraries
package.path = "../libs/?.lua;./libs/?.lua;" .. package.path

--Some variables
local network_data          = 100   --This is where we store network stats
local system_data           = 101   --This is where we store stats about the system
local feedback_timestamp    = 102   --This is where feedback timestamp
local vpn_data              = 103   --This is where we store stats on all the OpenVPN Gateway pings
local actions_waiting		= 115
local result_file       	= '/tmp/result.json'

function fetch_config_value(item)
	local handle = io.popen('uci get '..item)
	local result = handle:read("*a")
	handle:close()
	result = string.gsub(result, "[\r\n]+$", "")
	return result
end

function submitReport()
    --We will only send data from Gateway nodes
    local f=io.open('/tmp/gw',"r")
    if f==nil then return end

    --File seems to be there go on
    require('rdAlfred')
    local a     = rdAlfred()
    local j     = require("json")
    local repacked_network = {}
    local nt    = a:readData(network_data)

    if(nt)then
        for i, row in ipairs(nt) do
            local node, value = unpack(row)
            local j_val = j.decode(value)
            table.insert(repacked_network, j_val)
        end
    end
    local nd    = j.encode(repacked_network)

    local repacked_system = {}
    local st    = a:readData(system_data)
    if(st)then
        for i, row in ipairs(st) do
            local node, value = unpack(row)
            local j_val = j.decode(value)
            table.insert(repacked_system, j_val)
        end
    end
    local sd    = j.encode(repacked_system)
    
    local repacked_vpn = {}
    local vpn_t    = a:readData(vpn_data)
    if(vpn_t)then
        for i, row in ipairs(vpn_t) do
            local node, value = unpack(row)
            local j_val = j.decode(value)
            table.insert(repacked_vpn, j_val)
        end
    end
    local vpn_d = j.encode(repacked_vpn)
    

	--Add the neighbor details
	require('rdVis')
	local v 			= rdVis()
	local vis_string 	= "[]"
	local vis_feedback 	= v:getVis()
	if(vis_feedback)then
		vis_string = vis_feedback
	end
	
    local curl_data = '{"network_info":'..nd..',"system_info":'..sd..',"vis":'..vis_string..',"vpn_info":'..vpn_d..'}'

    local proto 	= fetch_config_value('meshdesk.internet1.protocol')
    local mode      = fetch_config_value('meshdesk.settings.mode')
    local url       = fetch_config_value('meshdesk.internet1.status_url')
    
    if(mode == 'ap')then
        url       = fetch_config_value('meshdesk.internet1.ap_status_url')
    end
    
    local server    = fetch_config_value('meshdesk.internet1.ip')
    local query     = proto .. "://" .. server .. "/" .. url

    --Remove old results                                                                                              
    os.remove(result_file)
    os.execute('curl -k -o '..result_file..' -X POST -H "Content-Type: application/json" -d \''..curl_data..'\' '..query)
    
    --Read the results
    local f=io.open(result_file,"r")
    if(f)then
        result_string = f:read("*all")
        r =j.decode(result_string)
        if(r.success)then
			--Write the awaiting actions to actions_awaiting (no matter if you overwrite - the will remain waiting until a client fetch
			a:writeData(r.items, actions_waiting)
            local fb    = {}
            fb.timestamp = os.time()
            a:writeData(fb,feedback_timestamp)
        end
    end
end

submitReport()

