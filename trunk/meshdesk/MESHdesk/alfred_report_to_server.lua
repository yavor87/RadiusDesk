#!/usr/bin/lua


-- Include libraries
package.path = "libs/?.lua;" .. package.path

--Some variables
local network_data          = 100   --This is where we store network stats
local system_data           = 101   --This is where we store stats about the system
local feedback_timestamp    = 102   --This is where feedback timestamp

local json_file_to_send = '/tmp/to_server.json'
local result_file       = '/tmp/result.json'

function buildJsonFile()
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
    local sd        = j.encode(repacked_system)
    local curl_data = '{"network_info":'..nd..',"system_info":'..sd..'}'
    os.execute('curl -o '..result_file..' -X POST -H "Content-Type: application/json" -d \''..curl_data..'\' http://192.168.1.101/cake2/rd_cake/mesh_reports/submit_report.json')
    
    --Read the results
    local f=io.open(result_file,"r")
    if(f)then
        result_string = f:read("*all")
        r =j.decode(result_string)
        if(r.success)then
            local fb    = {}
            fb.timestamp = os.time()
            a:writeData(fb,feedback_timestamp)
        end
    end

end

buildJsonFile()

