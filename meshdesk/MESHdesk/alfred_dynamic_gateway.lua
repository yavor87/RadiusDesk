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


function updateGateway()
    --We don't update the gateway self
    local f=io.open('/tmp/gw',"r")
    if f~=nil then return end

    --Get the current GW
    local current_gw = nil
    local fd = io.popen("route -n")
    if fd then
        for line in fd:lines() do
            if(string.find(line, "^0.0.0.0.*UG.*"))then
                found_gw = true
                current_gw = string.gsub(line, "^0.0.0.0%s*", "")
                current_gw = string.gsub(current_gw,"%s+.*UG.*","")
            end  
        end
        fd:close()
    end
    if(current_gw)then
     print("current gateway is "..current_gw)
    end
    
    --Get the Alfred GW
    require('rdAlfred')
    local a = rdAlfred()
    gw_list = a:readData(gateway_data)
    if(gw_list)then
        local ts = 0;
        local gw = nil
        local j = require("json")

        for i, row in ipairs(gw_list) do
            local node, value = unpack(row)
            local data = j.decode(value)
            if(ts < data.timestamp)then -- Only get the largest one
                ts = data.timestamp
                gw = data.ip_address
            end
        end
        --There was a gw list now we need to compare
        if(gw)then
            print("Alfred GW is " ..gw)
        end

        if(current_gw ~= gw)then
            if((current_gw == nil) and (gw ~= nil))then --simply add the new gw
                print("Add new gw entry")
                os.execute("route add default gw ".. gw)
                os.execute("sed -i 's/nameserver.*/nameserver "..gw.."/' /etc/resolv.conf")
            end

            if((current_gw ~= nil)and(gw ~= nil))then -- remove the current add the new
                print("Remove old gw entry")
                os.execute("route del default gw "..current_gw)
                os.execute("route add default gw ".. gw)
                os.execute("sed -i 's/nameserver.*/nameserver "..gw.."/' /etc/resolv.conf")
            end
        end
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
updateGateway()
