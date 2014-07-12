#! /usr/bin/lua

local host, port = "192.168.1.107", 3000
local socket 	= require("socket")
local tcp 	= assert(socket.tcp()) --Create a tcp connection

tcp:connect(host, port) --Connect to the host
tcp:settimeout(5)

function sData(s)
	tcp:send(s)
end

function rData()
    local retval = nil
    while true do
        local s, status, partial = tcp:receive("*l")
        --If we send from the server with a "\n" we can read the whole line
        if(s)then
            retval = s
	    break
        end

        if status == 'timeout' then
            print('Connection timed out no response from server')
            break
        end
        if status == "closed" then
	    print("Server closed the connection") 
	    break 
        end
    end
    return retval
end

--Function that request the md5sum of the shared secret from the server
function md5check()
    --The letter 'a' asks the server to send us the md5sum of the secret
    sData('a')
    local md5sum = rData()
    if(md5sum)then
        print("The MD5Sum from the server is "..md5sum)
        if(string.find(md5sum, "md5sum="))then
            print("Correct data")
            local filter_md5 = string.gsub(md5sum, "md5sum=", "")
            if(filter_md5 == '3588e5b98b1051ee6dc7748f13474987')then
                print("MD5sums are matching - go on")
		send_my_info()
		get_my_settings()
	    else
                print("MD5sums not matching - notify and terminate")
	        sData('x')
	        sData("Mismatch of the shared secrets\n")
	        tcp:close()
            end
        end
    else
        print("MD5Sum not sent from server, terminating the connection")
        tcp:close()
    end
end

--Function that sends the info of the device to the server
--The server needs to respond with 'ok' each time
function send_my_info()
    --The letter 'b' will inform the server there is local info about the device on its way
    local a = { 'eth0=08-00-27-84-f9-08', 'server=192.168.1.111', 'firmware=OpenWrt|release 89898|CPU Atheros 9311' }
    for i, v in ipairs(a) do
	sData('b')
	sData(v.."\n")
	local r = rData()
	print("GOT:"..r..":END")
	if(r ~='ok')then --Stop of we don't get 'ok' back each time
		print("Did not get an ok back")
		break
	end
    end
end

function get_my_settings()
	
    sData('c') --Tell the server to send the settings along
    local next_setting = true
    while(next_setting)do
        local s = rData()
        print("==== Settings from the server ====")
	print(s)
	print('-----------------------------')
	if(s == 'last')then
		next_setting = false	
	end
	sData("ok\n")
    end

end

md5check()
tcp:close()
