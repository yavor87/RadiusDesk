require( "class" )

-------------------------------------------------------------------------------
-- A class to fetch the configuration for the mesh and return it as a file ----
-------------------------------------------------------------------------------
class "rdConfig"

--Init function for object
function rdConfig:rdConfig()
	require('rdLogger');
	require('rdExternal');
    local uci 	= require("uci")

	self.version 	= "1.0.0"
	self.json	    = require("json")
	self.logger	    = rdLogger()
	self.external	= rdExternal()
	self.debug	    = true
    self.new_file   = ''
    self.old_file   = ''
    self.x		    = uci.cursor(nil,'/var/state')

    self.ping_counts    = 3
    self.ok_ping_count  = 2
    self.retry_count    = 5
    self.current_try    = 0

    --Determine the Files to use--
	self.new_file = self.x.get('meshdesk', 'settings','config_file')
    self.old_file = self.x.get('meshdesk', 'settings','previous_config_file')
	

end
        
function rdConfig:getVersion()
	return self.version
end

function rdConfig:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end


function rdConfig:pingTest(server)
	local handle = io.popen('ping -q -c ' .. self.ping_counts .. ' ' .. server .. ' 2>&1')
	local result = handle:read("*a")                          
	handle:close()     
	result = string.gsub(result, "[\r\n]+$", "")
	if(string.find(result," unreachable"))then --If the network is down
		return false
	end
	      
	result = string.gsub(result, "^.*transmitted,", "")       
	result = string.gsub(result, "packets.*$", "")            
	result = tonumber(result)                          
	if(result >= self.ok_ping_count)then  
		return true
	else
		return false
	end
end

function rdConfig:fetchSettings(url,device_id,gateway)

	gateway = gateway or false
	if(gateway)then
		gw = "true"
	else
		gw = "false"
	end

	if(self:_file_exists(self.new_file))then
        self:log('Move '..self.new_file.." to "..self.old_file)
		os.execute("mv " .. self.new_file .. " " .. self.old_file)
	end
	url = url.."?mac="..device_id.."&gateway=".. gw
	self:log("URL is "..url)
	
      	local retval = os.execute("curl -k -o '" .. self.new_file .."' '" .. url .."'")
      	self:log("The return value of curl is "..retval)
      	if(retval ~= 0)then
      		self:log("Problem executing command to fetch config")
      		return false   
      	end
	if(self:_file_exists(self.new_file))then
        self:log("Got new config file "..self.new_file)
        if(self:_file_size(self.new_file) == 0)then
            self:log("File size of zero - not cool")
            return false
        else
            return true
        end
	else
        self:log("Failed to get latest config file")
		return false
	end
end

--[[--
========================================================
=== Private functions start here =======================
========================================================
--]]--

function rdConfig._file_exists(self,name)
    local f=io.open(name,"r")                                          
        if f~=nil then io.close(f) return true else return false end       
end

function rdConfig._file_size(self,name)
    local file = io.open(name,"r");
    local size = file:seek("end")    -- get file size
    file:close()        
    return size
end  

