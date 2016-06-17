require( "class" )

-------------------------------------------------------------------------------
-- Class used to Prepare the Vis data for the back end  -----------------------
-- We substitute the mesh0 macs with eth0 among other things-------------------
-------------------------------------------------------------------------------
class "rdVis"

--Init function for object
function rdVis:rdVis()

	require('rdLogger')
	self.version    = "1.0.1"
	self.tag	    = "MESHdesk"
	self.debug	    = true
	self.json	    = require("json")
	self.logger	    = rdLogger()
	self.ethmap		= 110
	self.mac_map	= {}
end
        
function rdVis:getVersion()
	return self.version
end

function rdVis:getVis()
	self:log("==Get batadv-vis formatted to out liking ==")
	return self:__getVis()
end

function rdVis:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end

--[[--
========================================================
=== Private functions start here =======================
========================================================
--]]--


function rdVis.__getVis(self)
   
	--We have the mac lookup so now we can work on the output of
	self:__buildMacMap()

	local fb_data = {}
	fd    = io.popen("batadv-vis -f jsondoc")
	if fd then
        output = fd:read("*a")
        if output then
        	--print(output)
			local json_vis = self.json.decode(output)
			for i, row in ipairs(json_vis.vis) do
				--print(row.primary)
				local lookup= self.mac_map[row.primary]
				if(lookup)then	
					local eth0 	= lookup.eth0
					local gw	= lookup.gateway
					local fb_wip= {}
					fb_wip = {neighbors ={},gateway = gw, eth0 = eth0}
					--print("Mesh "..	row.primary .. " Eth " .. eth0 .. " Gw " .. gw)
					--Now we can loop through the neighbors
					for j, n in ipairs(row.neighbors) do
						local n_lookup= self.mac_map[n.neighbor]
						if(n_lookup)then
							local hwmode = false
							if(n_lookup.hwmode ~= nil)then
								hwmode = n_lookup.hwmode
							end
							table.insert(fb_wip.neighbors, {eth0 = n_lookup.eth0, metric = n.metric,hwmode = hwmode})
							--print(n.neighbor);
							--print(n.metric);
						end
					end
					table.insert(fb_data, fb_wip)
				end
			end
        end
        fd:close()
    end
	return self.json.encode(fb_data)
end


function rdVis.__buildMacMap(self)

	rows  		= nil                           
    local fd    = io.popen("alfred -r " .. self.ethmap)
    if fd then
        local output = fd:read("*a")
        if output then
          assert(loadstring("rows = {" .. output .. "}"))()
        end
        fd:close()
    end

    --Now we can loop through the rows to build our lookup
	local mac_lookup = {}
	if(rows)then
        for i, row in ipairs(rows) do
            local node, value 	= unpack(row)
            local j_val 		= self.json.decode(value)
			local dashes, count = string.gsub(j_val.eth0, ":", "-")
			dashes 				= string.upper(dashes)
			--Create a mini loop for mesh0 -> mesh2 (3 wifi cards) and check which are populated
			--{ "96:28:50:73:0d:06", "{\"mesh1\":false,\"gateway\":1,\"mesh2\":false,\"mesh0\":\"ac:86:74:10:03:0a\",\"eth0\":\"ac:86:74:10:03:08\"}\x0a" },

			local if_start = 0
			while if_start  <= 2 do
				local if_name = 'mesh'..if_start
				local m		  = j_val[if_name]
				if(m ~= false)then
					local hwmode  		= j_val['hwmode_'..if_name]
					mac_lookup[m]		= { eth0 = dashes, gateway = j_val.gateway, hwmode = hwmode}
				end
				if_start = if_start + 1
			end		
        end
    end
	self.mac_map = mac_lookup
end

