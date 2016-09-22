require( "class" )

-------------------------------------------------------------------------------
-- A class to ping the Openvpn Bridge's gateways and return it in JSON form ---
-------------------------------------------------------------------------------
class "rdOpenvpnstats"

--Init function for object
function rdOpenvpnstats:rdOpenvpnstats()
	require('rdLogger');	
	local uci 		= require("uci")
	self.version 	= "1.0.0"
	self.json	    = require("json")
	self.logger	    = rdLogger()
	self.debug	    = true
	self.x			= uci.cursor(nil,'/var/state')
end
        
function rdOpenvpnstats:getVersion()
	return self.version
end


function rdOpenvpnstats:getStats()
	return self:_getStats()
end


function rdOpenvpnstats:log(m,p)
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

function rdOpenvpnstats._getStats(self)
	self:log('Getting OpenVPN stats')
	local stats 	        = {}
    stats['vpn_gateways']   = {}  
    require('rdConfig');
    local c                 = rdConfig();
    
    self.x.foreach('vpn-gateways', 'gateway',
		function(s)	
		    local ipaddr;
		    local vpn_client_id;
		    local state = false;
		
            for key, value in pairs(s) do
                if(key == 'ipaddr')then
                    ipaddr = tostring(value);
                end
            
                if(key == 'vpn_client_id')then
                    vpn_client_id = tostring(value);
                end
            end
            
            if(ipaddr and vpn_client_id)then
                if(c:pingTest(ipaddr))then
                    state = true;
                end
                table.insert(stats['vpn_gateways'],{ipaddr=ipaddr,vpn_client_id=vpn_client_id,state=state,timestamp=os.time()})
            end
		end)     
    return (self.json.encode(stats)) 	
end 

