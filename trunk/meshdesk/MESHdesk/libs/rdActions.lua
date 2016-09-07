require( "class" )

-------------------------------------------------------------------------------
-- Class used to check and execute actions for this node-----------------------

-------------------------------------------------------------------------------
class "rdActions"

--Init function for object
function rdActions:rdActions()

	require('rdLogger')
	require('rdNetwork')
	require('rdAlfred')

	local uci	    = require('uci')
	self.socket    	= require("socket")
	self.version    = "1.0.1"
	self.tag	    = "MESHdesk"
	self.debug	    = true
	self.json	    = require("json")
	self.logger	    = rdLogger()
	self.network	= rdNetwork()
	self.alfred		= rdAlfred()
	self.x		    = uci.cursor(nil,'/var/state')
	self.waiting	= 115
	self.completed	= 116
	
	local id_if     = self.x.get('meshdesk','settings','id_if');
	
	self.id_if		= self.network:getMac(id_if)
	self.results	= '/tmp/actions_result.json'
end
        
function rdActions:getVersion()
	return self.version
end

function rdActions:check()
	self:log("== Do the check for any awaiting actions ==")
	self:__check()
end

function rdActions:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end

--[[--
========================================================
=== Private functions start here =======================
========================================================
--]]--


function rdActions.__check(self)
	local waiting 	= self:__getWaitingList()
	local completed	= self:__getCompletedList()

	--Is there some commands waiting?
	if(waiting)then
		--Is there some already some completed
		if(completed)then
			self:log("Found completed list - Check if there are new ones in the waiting list")
			--Is there unfinished commands (in the waiting list but not in completed list)
			if(self:__checkForNewActions(waiting,completed))then
				self:__fetchActions()
			end
		else
			self:log("No completed list - Fetch commands")
			self:__fetchActions()
		end
	end  	
end


function rdActions.__getWaitingList(self)
	local ret_val = false   
    local a_waiting = self.alfred:readData(self.waiting)
    if(a_waiting)then
        local ts = 0
        for i, row in ipairs(a_waiting) do
            local node, value = unpack(row)
            local data = self.json.decode(value)
			for k in pairs(data) do
				if(k == self.id_if)then
					self:log("Potential actions for "..self.id_if)
					ret_val = data[k]
				end
			end
        end
    end
	return ret_val
end

function rdActions.__getCompletedList(self)
	local ret_val = false
	local a_done = self.alfred:readData(self.completed)
	if(a_done)then
		for i, row in ipairs(a_done)do
			local node, value = unpack(row)
			local data = self.json.decode(value)
			for k in pairs(data) do
				if(k == self.id_if)then
					self:log("Found completed list for "..self.id_if)
					ret_val = data[k]
				end
			end
		end
	end
	return ret_val
end

function rdActions.__checkForNewActions(self,waiting,completed)

	local new_actions = false
	--If there are new actions it will be in the waiting list and NOT in the completed
	for a, k in ipairs(waiting) do
		local found = false
		for b, l in ipairs(completed) do
			if(k == l)then
				found = true
			end
		end
		if(found ~= true)then --break on the first waiting one NOT found in completed
			new_actions = true
			break
		end
	end
	return new_actions
end

function rdActions.__fetchActions(self)
	local curl_data = '{"mac":"'..self.id_if..'"}'
    local proto 	= self.x.get('meshdesk','internet1','protocol')
    local mode      = self.x.get('meshdesk','settings','mode')
    
    local url       = self.x.get('meshdesk','internet1','actions_url')
    
    if(mode == 'ap')then
        url       = self.x.get('meshdesk','internet1','ap_actions_url')
    end
    
    local server    = self.x.get('meshdesk','internet1','ip')
    local query     = proto .. "://" .. server .. "/" .. url

    --Remove old results                                                                                              
    os.remove(self.results)
    os.execute('curl -k -o '..self.results..' -X POST -H "Content-Type: application/json" -d \''..curl_data..'\' '..query)
    
    --Read the results
    local f=io.open(self.results,"r")
    if(f)then
        result_string = f:read("*all")
        r =self.json.decode(result_string)
        if(r.success)then
			if(r.items)then
				self:__executeActions(r.items)
			end
        end
    end
end

function rdActions.__executeActions(self,actions)
	--Actions is a list in the format [{'id':"98","command": "reboot"}]--
	for i, row in ipairs(actions)do
		print("Doing action NR "..row.id)
		self:__addToCompleted(row.id)
		print("Doing "..row.command)
		os.execute(row.command)
	end
end

function rdActions.__addToCompleted(self,id)
	--Get the current list of completed

	local not_found = true

	local c = self:__getCompletedList()
	if(c)then
		for a, k in ipairs(c) do
			if(k == id)then
				not_found = false
			end
		end
	end
	if(c)then 
		if(not_found)then --Did not find the item in the completed list add and write to Alfred
			table.insert(c, id)
			local t = {}
			t[self.id_if] = c
			self.alfred:writeData(t, self.completed)
		end
	else --empty list
		local e = {}
		e[self.id_if] = {id}
		self.alfred:writeData(e, self.completed)
	end
end

