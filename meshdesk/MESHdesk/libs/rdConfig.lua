local rdConfig = {}

--[[--
A library which are used for Config server related things


--]]-- 

function fetch_config_value(item)
	local handle = io.popen('uci get '..item)
        local result = handle:read("*a")
        handle:close()
        result = string.gsub(result, "[\r\n]+$", "")
        return result
end
                                        


local ping_counts=3
local ok_ping_count=2
local new_file=fetch_config_value('meshdesk.settings.config_file')
local old_file=fetch_config_value('meshdesk.settings.previous_config_file')

function file_exists(name)                                                 
	local f=io.open(name,"r")                                          
        if f~=nil then io.close(f) return true else return false end       
end                                                                        
                                                                                           
function file_not_exists(name)                                             
	local f=io.open(name,"r")                                          
        if f~=nil then io.close(f) return false else return true end       
end                      


function rdConfig.pingTest(server)
	local handle = io.popen('ping -q -c ' .. ping_counts .. ' ' .. server .. ' 2>&1')
	local result = handle:read("*a")                          
	handle:close()     
	result = string.gsub(result, "[\r\n]+$", "")
	if(string.find(result,"is unreachable"))then --If the network is down
		return false
	end      
	result = string.gsub(result, "^.*transmitted,", "")       
	result = string.gsub(result, "packets.*$", "")            
	result = tonumber(result)                          
	if(result >= ok_ping_count)then  
		return true
	else
		return false
	end
end

function rdConfig.fetchSettings(url,device_id,gateway)

	gateway = gateway or false
	if(gateway)then
		gw = "true"
	else
		gw = "false"
	end

	if(file_exists(new_file))then
		os.execute("mv " .. new_file .. " " .. old_file)
	end
	url = url.."?mac="..device_id.."&gateway=".. gw
	print("URL is "..url)
	os.execute("wget '" .. url  .. "' -O " .. new_file)
	if(file_exists(new_file))then
		return true
	else
		return false
	end
end


return rdConfig
