local rdGateway = {}                                                                          
                                                                                              
                                                                                                                                                                                            
function rdGateway.enable()                                                                   
     -- Enable all the gateway related things on the node                                  
     print("Enable gateway")                                                               
     go()                                                          
end     

--[[--

Experiment with uci library

--]]--

function go()

	local uci=require("uci")
	local x = uci.cursor(nil, "/var/state")
	x.foreach('firewall','zone',
		function(a)
			if(a['name'] == 'lan')then
				print("Gooi die lan " .. a[".name"] )
				x.set("firewall",a[".name"],"masq",1)
				x.set("firewall",a[".name"],"mtu_fix",1)
			end
		end)
	
	x.commit('firewall')
	x.save('firewall')
	print("Go pappie")
end

                                                                            
return rdGateway
