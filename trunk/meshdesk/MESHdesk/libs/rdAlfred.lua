require( "class" )

-------------------------------------------------------------------------------
-- Class used read and write to Alred and to read from Alfred -----------------
-- We write JSON and read Lua tables ------------------------------------------
-------------------------------------------------------------------------------
class "rdAlfred"

--Init function for object
function rdAlfred:rdAlfred()

	require('rdLogger')
	local uci	= require('uci')

	self.version    = "1.0.1"
	self.tag	    = "MESHdesk"
	self.debug	    = true
	self.json	    = require("json")
	self.logger	    = rdLogger()
	self.x		    = uci.cursor(nil,'/var/state')
	self.socket    	= require("socket")
end
        
function rdAlfred:getVersion()
	return self.version
end

function rdAlfred:writeData(item,nr)
	self:log("==Write Alfred data to "..nr.." ==")
	self:__writeData(item,nr)
end

function rdAlfred:readData(nr)
	self:log("==Read Alfred data from "..nr.." ==")
	return self:__readData(nr)
end

function rdAlfred:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end


--[[--
========================================================
=== Private functions start here =======================
========================================================
--]]--
function rdAlfred.__writeData(self,item,nr)
    os.execute("echo '"..self.json.encode(item).."' | alfred -s "..nr)
end

function rdAlfred.__readData(self,nr)
    rows  = nil                           
    local fd    = io.popen("alfred -r " .. nr)
    --[[ this command returns something like
        { "54:e6:fc:b9:cb:37", "00:11:22:33:44:55 ham_wlan0\x0a00:22:33:22:33:22 ham_eth0\x0a" },
        { "90:f6:52:bb:ec:57", "00:22:33:22:33:23 spam\x0a" },
        We then have to add tome text to make Lua see it as a table (data structure) so we add "rows = {" and "}"
    ]]--
    if fd then
        local output = fd:read("*a")
        if output then
          assert(loadstring("rows = {" .. output .. "}"))()
        end
        fd:close()
    end
    return rows
end


function rdAlfred.__sleep(self,sec)                                                                     
    self.socket.select(nil, nil, sec)                              
end 
