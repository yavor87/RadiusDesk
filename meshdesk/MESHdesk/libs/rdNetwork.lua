local rdNetwork = {}

-- Hardware with two ethernet interfaces
local dhcp_file="/etc/MESHdesk/configs/dhcp_network_two_eth"

-- Hardware with one ethernet interface
--local dhcp_file="/etc/MESHdesk/configs/dhcp_network_one_eth"

-- DHCP start Network
function rdNetwork.dhcpStart()
	os.execute("cp " .. dhcp_file .. " /etc/config/network")
	os.execute("/etc/init.d/network reload")
end


-- Clean start Network                                                 
function newNetwork()
	local f="/etc/config/network"  
        os.execute("rm " .. f)
        os.execute("touch " .. f)
end    


function rdNetwork.main(table)
	-- Clean start                                                           
	newNetwork()                                                            
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
    
return rdNetwork
