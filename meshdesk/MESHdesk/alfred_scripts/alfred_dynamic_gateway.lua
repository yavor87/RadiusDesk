#!/usr/bin/lua


-- Include libraries
package.path = "../libs/?.lua;" .. package.path

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
    local current_gw = getCurrentGateway()
    if(current_gw)then
     print("current gateway is "..current_gw)
    end
    
    --Get the Alfred GW
    require('rdAlfred')
    local a         = rdAlfred()
    local gw_list   = a:readData(gateway_data)
    if(gw_list)then
        local ts = 0
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

function getCurrentGateway()
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
    return current_gw	
end

function checkForAutoReboot()
	--We don't check for reboot on the gatewat itself
    	local f=io.open('/tmp/gw',"r")
    	if f~=nil then return end

	local gw_missing_file 	= "/tmp/gw_missing_stamp";

	local uci 		= require('uci')
	local x	  		= uci.cursor(nil,'/var/state')
	local gw_auto_reboot 	= x.get('meshdesk', 'settings', 'gw_auto_reboot')
	local reboot_time	= x.get('meshdesk', 'settings', 'gw_auto_reboot_time')

	if(gw_auto_reboot == '1')then

		--Find the current gateway--
		local current_gw = getCurrentGateway()

		local complete_missing_action = true

		--=====CURRENT GW=========
		if(current_gw ~= nil)then
			require('rdConfig');
			local c = rdConfig();
			--local test_for_ip = "10.5.5.2";
			local test_for_ip = current_gw;
			if(c:pingTest(test_for_ip))then
				os.remove(gw_missing_file)
				complete_missing_action = false
			end
		end

		if(complete_missing_action)then

			--Check if it is the first time the gateway is missing
			local mf =io.open(gw_missing_file,"r")
			if mf==nil then
				print("Create new gw missing file")
				--Write the current timestamp to the file
				local ts = os.time()
				--Write this to the config file
				local f,err = io.open(gw_missing_file,"w")
				if not f then return print(err) end
				f:write(ts)
				f:close()
			else
				print("Existing missing file... check timestamp")
				local ts_last = mf:read()
				print("The last failure was at "..ts_last)
				if(ts_last+reboot_time < os.time())then
					print("We need to reboot pappie")
					os.execute("reboot")
				end
				mf:close()
			end
		end
	end

end

supplyGateway()
updateGateway()
checkForAutoReboot()
