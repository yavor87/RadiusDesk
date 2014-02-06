local rdWireless = {}


-- Clean start Wifi                                                 
function newWireless()
	local f="/etc/config/wireless"  
        os.execute("rm " .. f)
        os.execute("wifi detect >> " .. f)
        os.execute("uci delete wireless.@wifi-iface[0]")                         
        os.execute("uci commit wireless")
end    


function rdWireless.connectClient()

local uci=require("uci")
local x = uci.cursor()
local one =x.get_all("meshdesk","wifi_client")
if(one ~= nil)then
	--Enable the radio (device)
	local device = one.device
	local name   = one['.name']
	
	newWireless()
	os.execute('uci set wireless.' .. device .. '.disabled=0')
	os.execute('uci set wireless.' .. name .. '=wifi-iface')	
		
	for k, v in pairs(one)do
		if(not(string.find(k,'^%.')))then -- we are not interested in the hidden values.
			print(k,v)
			os.execute("uci set wireless." .. name .. '.' .. k ..'="'.. v .. '"')	
		end
	end
        os.execute("uci commit wireless")                                        
        os.execute("/etc/init.d/network reload")
        os.execute("wifi")
end
end


function rdWireless.main(table)
	-- Clean start                                                           
	newWireless()                                                            
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
            	os.execute("uci set wireless." .. entry_name .. "=" .. entry_type)               
            	for key, val in pairs(options) do 
            	
            		local t = type(val);
            		if(t == 'boolean')then
            			local bool_val = "0"
            			if(val)then
            				bool_val = "1"
            			end
	            		os.execute("uci set wireless." .. entry_name .. "." .. key .. '="' .. bool_val .. '"')                              
            		else
	            		os.execute("uci set wireless." .. entry_name .. "." .. key .. '="' .. val .. '"')                              
            			print("There " .. key .. ' and '.. val)
            		end 
            	end                                                                                                            
		os.execute("uci commit wireless")                                                                              
                                                                                                                                                                                        
         end            
end
    
return rdWireless
