#!/usr/bin/lua


-- Include libraries
package.path = "libs/?.lua;" .. package.path

--Some variables
local gateway_data  = 120  

function supplyGateway()
    --We will only supply a gateway if we are a gateway (file /tmp/gw exists)
    local f=io.open('/tmp/gw',"r")
    if f==nil then return end

    --File seems to be there go on
    require('rdAlfred')
    local a     = rdAlfred()
    local j     = require("json")
    local gw    = {}
    local ip    = getIPAddress('br-one')
    if(ip)then
        gw.ip_address   = ip
        gw.timestamp    = os.time() 
        a:writeData(gw,gateway_data)
    end
end


function getIPAddress(interface) 
    local ip = nil
    local fd = io.popen("ifconfig " .. interface)
    if fd then
        for line in fd:lines() do
            if(string.find(line, "inet addr:"))then
                ip = string.gsub(line, "%s*inet addr:%s*", "")
                ip = string.gsub(ip,"%s*Bcast.*","")   
            end  
        end
        fd:close()
    end
    return ip
end

supplyGateway()
