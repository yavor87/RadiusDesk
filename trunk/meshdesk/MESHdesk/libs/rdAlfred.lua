require( "class" )

-------------------------------------------------------------------------------
-- Class used read and write to Alred and to read from Alfred -----------------
-- We write JSON and read Lua tables ------------------------------------------
-------------------------------------------------------------------------------
class "rdAlfred"

--Init function for object
function rdAlfred:rdAlfred()

	require('rdLogger')
    require('rdExternal');
	local uci	    = require('uci')
    self.socket    	= require("socket")
	self.version    = "1.0.1"
	self.tag	    = "MESHdesk"
	self.debug	    = true
	self.json	    = require("json")
	self.logger	    = rdLogger()
	self.x		    = uci.cursor(nil,'/var/state')
    self.external   = rdExternal()
	self.bat_hosts  = '/etc/alfred/bat-hosts.lua'
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

function rdAlfred:masterEnableAndStart()

    local interface = self.x.get('alfred','alfred','interface')
    if(interface ~= 'br-one')then
        self.x.set('alfred','alfred','interface','br-one')
    end

    local mode      = self.x.get('alfred','alfred','mode')
    if(mode ~= 'master')then
        self.x.set('alfred','alfred','mode','master')
    end

    local disabled  = self.x.get('alfred','alfred','disabled')
    if(disabled ~= '0')then
        self.x.set('alfred','alfred','disabled','0')
    end

    --local start_vis  = self.x.get('alfred','alfred','start_vis')
    --if(start_vis ~= '1')then
	--Enable this regardless
   	self.x.set('alfred','alfred','start_vis','1')
    --end

    self.x.commit('alfred')

	--Remove the /etc/alfred/bat-hosts.lua file since installer fails
	local f=io.open(self.bat_hosts,"r")                                                   
    if f~=nil then 
		io.close(f) 
 		os.remove(self.bat_hosts)
		os.execute("/etc/init.d/alfred disable")
	end
    --start the service
    self:log("**Start up alfred master**")
    os.execute("/etc/init.d/alfred start")

end

function rdAlfred:slaveEnableAndStart()

    local interface = self.x.get('alfred','alfred','interface')
    if(interface ~= 'br-one')then
        self.x.set('alfred','alfred','interface','br-one')
    end

    local mode      = self.x.get('alfred','alfred','mode')
    if(mode ~= 'slave')then
        self.x.set('alfred','alfred','mode','slave')
    end

    local disabled  = self.x.get('alfred','alfred','disabled')
    if(disabled ~= '0')then
        self.x.set('alfred','alfred','disabled','0')
    end

	--We also need to start the vis server so all can join in
    --local start_vis  = self.x.get('alfred','alfred','start_vis')
    --if(start_vis ~= '0')then
    --Enable this regardless
   	self.x.set('alfred','alfred','start_vis','1')
    --end

    self.x.commit('alfred')
	--Remove the /etc/alfred/bat-hosts.lua file since installer fails
	local f=io.open(self.bat_hosts,"r")                                                   
    if f~=nil then 
		io.close(f) 
 		os.remove(self.bat_hosts)
		os.execute("/etc/init.d/alfred disable")
	end
    --start the service
    self:log("**Start up alfred slave**")
    os.execute("/etc/init.d/alfred start")
	
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
