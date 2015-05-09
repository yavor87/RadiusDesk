require( "class" )

-------------------------------------------------------------------------------
-- A class to configure the ethernet interfaces -------------
-------------------------------------------------------------------------------
class "rdNetwork"

--Init function for object
function rdNetwork:rdNetwork()
	require('rdLogger');
	require('rdExternal');

	self.version 	= "2.0.0"
	self.logger	    = rdLogger()
	self.debug	    = true
    self.dhcp_one   = "/etc/MESHdesk/configs/dhcp_network_one_eth"
    self.dhcp_two   = "/etc/MESHdesk/configs/dhcp_network_two_eth"

    self.frmwr_one  = "/etc/MESHdesk/configs/frmwr_network_one_eth"
    self.frmwr_two  = "/etc/MESHdesk/configs/frmwr_network_two_eth"
	--Add external command object
	self.external	= rdExternal()

end
        
function rdNetwork:getVersion()
	return self.version
end

function rdNetwork:getIpForInterface(int)
	self:log("Get ip address for interface "..int)
	return self:__getIpForInterface(int) 
end


function rdNetwork:dhcpStart()
    --Determine which file to use based on whether the board has eth1 or not
    if(self:__getMac('eth1'))then
        os.execute("cp " .. self.dhcp_two .. " /etc/config/network")
    else
        os.execute("cp " .. self.dhcp_one .. " /etc/config/network") 
    end
	os.execute("/etc/init.d/network reload")
end

function rdNetwork:frmwrStart()
    --Determine which file to use based on whether the board has eth1 or not
    if(self:__getMac('eth1'))then
        os.execute("cp " .. self.frmwr_two .. " /etc/config/network")
    else
        os.execute("cp " .. self.frmwr_one .. " /etc/config/network") 
    end
	os.execute("/etc/init.d/network reload")
end

function rdNetwork:getMac(int)
    return self:__getMac(int) --default is eth0
end

function rdNetwork:configureFromTable(tbl)
	self:log("==Configure Wireless from  Lua table==")
	self:__configureFromTable(tbl)
end


function rdNetwork:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end

--[[--
========================================================
=== Private functions start here =======================
========================================================
(Note they are in the pattern function <rdName>._function_name(self, arg...) and called self:_function_name(arg...) )
--]]--

-- Clean start Network                                                 
function rdNetwork.__newNetwork(self)
	local f="/etc/config/network"  
    os.execute("rm " .. f)
    os.execute("touch " .. f)
end

function rdNetwork.__getMac(self,interface)
	interface = interface or "eth0"

	local file_to_check = "/sys/class/net/" .. interface .. "/address"

	--Check if file exists
	local f=io.open(file_to_check,"r")                                                   
    if f~=nil then 
		io.close(f)
	else
		return false
	end

	--Read the file now we know it exists
	io.input(file_to_check)
	t = io.read("*line")
    if(t)then
	    dashes, count = string.gsub(t, ":", "-")
	    dashes = string.upper(dashes)
	    return dashes
    else
        return false
    end
end    

function rdNetwork.__configureFromTable(self,table)
	-- Clean start                                                           
	self:__newNetwork()                                                            
	for i, setting_entry in ipairs(table) do                                 
		local entry_type                                                 
	    local entry_name                                                  
	    local options = {} -- New empty array for this entry
		for key, val in pairs(setting_entry) do                           
        	-- If it is not an options entry; it is a type with value                
                if(key ~= 'options')then                                                 
                	entry_type  = key                                                
                        entry_name  = val                                                
             	else                                                                                                   
                -- Run through all the options                                                                 
                	for key, val in pairs(val) do                                                                  
                        	options[key] = val                                                                     
                      	end                                                                                            
                end                                                                                                    
    	end

    	-- Now we have gathered the info                                                 
    	os.execute("uci set network." .. entry_name .. "=" .. entry_type)               
    	for key, val in pairs(options) do
            print("There " .. key .. ' and '.. val)
            os.execute("uci set network." .. entry_name .. "." .. key .. '="' .. val .. '"')
        end
        os.execute("uci commit network")
    end
end


function rdNetwork.__getIpForInterface(self,interface)
	local ip = false
	local if_out = self.external:getOutput("ifconfig "..interface)
	if(if_out:match("inet addr:"))then
		if_out = if_out:gsub(".*inet addr:","")
		if_out = if_out:gsub("%s.+","")
		ip =if_out
	end
	return ip
end
