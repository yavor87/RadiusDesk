require( "class" )

-------------------------------------------------------------------------------
-- Gateway
-------------------------------------------------------------------------------
class "rdGateway"

--Init function for object
function rdGateway:rdGateway()

	require('rdLogger')
	
	local uci 		= require("uci")
	self.version 	= "1.0.0"
	self.debug	    = true
	self.x			= uci.cursor(nil,'/var/state')
	self.logger	    = rdLogger()

	self.conf_zone  = 'one' -- network interface 'one' is the admin interface
	self.conf_rule	= 'one_rule' -- The name of the firewall rule that allow traffic to conf server.
	self.ntp_rule   = 'one_ntp'
	self.mode       = 'mesh' -- Mode can be mesh or ap - With ap mode we do not need to set up the conf zone
end
        
function rdGateway:getVersion()
	return self.version
end

function rdGateway:getMode()
	return self.mode
end

function rdGateway:setMode(mode)
	self.mode = mode
end

function rdGateway:log(m,p)
	if(self.debug)then
		self.logger:log(m,p)
	end
end
 
function rdGateway:enable(exPoints)
	exPoints = exPoints or {}
	self:disable()	--Clean up any left overs
	
	self:__fwAddMobileWanZone()
	
	self:__fwAddWebByWifiZone()
	
	self:__fwMasqEnable()
	
	if(self.mode == 'mesh')then --Default is mesh mode
	    self:__fwGwEnable()
	    self:__dhcpGwEnable()
    end
    
	self:__addExPoints(exPoints)
    os.execute("touch /tmp/gw")

	--We also have to remove (and re-enable the /etc/resolv.conf)
	os.execute("rm /etc/resolv.conf")
	os.execute("ln -s /tmp/resolv.conf /etc/resolv.conf")

	--Tell batman we are a server
	if(self.mode == 'mesh')then
	    self.x.set('batman-adv','bat0','gw_mode', 'server')
	    self.x.commit('batman-adv')
    end
end     

function rdGateway:disable()

    self:__fwRemoveMobileWanZone()
    self:__fwRemoveWebByWifiZone()
    self:__fwMasqDisable()
	self:__fwGwDisable()
	self:__dhcpGwDisable()
    os.execute("rm /tmp/gw")

	--Tell batman we are a client
	if(self.mode == 'mesh')then
	    self.x.set('batman-adv','bat0','gw_mode', 'client')
	    self.x.commit('batman-adv')
    end
end

function rdGateway:addNat(network)
	self:__fwGwEnable(network,'no')
    os.execute("rm /tmp/gw")
end

function rdGateway:restartServices()

	os.execute("/etc/init.d/dnsmasq stop")
	os.execute("/etc/init.d/dnsmasq start")
--	os.execute("/etc/init.d/telnet stop")
--	os.execute("/etc/init.d/telnet start")
--	os.execute("/etc/init.d/dropbear stop")
--	os.execute("/etc/init.d/dropbear start")

end


--[[--
=========================================
========= Private methods =============== 
=========================================
--]]--

function rdGateway.__addExPoints(self,exPoints)

	for k,v in pairs(exPoints)do 
		print(v) 
		self:__dhcpGwEnable(v)
		self:__fwGwEnable(v)
	end
end

function rdGateway.__dhcpGwEnable(self,network,start,limit)

	--Some sane defaults
	network 	= network or self.conf_zone
	start 		= start or 100
	limit		= limit or 200
	
	self.x.set('dhcp','lan','ignore',1)
	self.x.set('dhcp',network,'dhcp')
	self.x.set('dhcp',network,'interface', network)
	self.x.set('dhcp',network,'start', start)
	self.x.set('dhcp',network,'limit', limit)
	self.x.set('dhcp',network,'leasetime','12h')
	self.x.commit('dhcp')
end

function rdGateway.__dhcpGwDisable(self)
	self.x.set('dhcp','lan','ignore',1)                  
    self.x.commit('dhcp') 
    if(self.mode == 'mesh')then                                       
	    self.x.delete('dhcp',self.conf_zone)
    end
	--Remove any previous NAT points (if there were any) the will start with ex_
	self.x.foreach('dhcp','dhcp', 
		function(a)
			--print(a['.name'])
			--Check the name--
			if(string.find(a['.name'],"ex_"))then
				self.x.delete('dhcp',a['.name'])
			end
 		end)
	
	self.x.commit('dhcp')
end

function rdGateway.__fwGwEnable(self,network,forward)
	print("Enable gateway on firewall")
	
	--Some sane defaults
	network 	= network or self.conf_zone
	forward		= forward or "yes" -- default is to add the forward rule
	
	local no_config_zone = true
	
	self.x.foreach('firewall', 'zone',
		function(a)	
			-- Check if 'meshdesk_config' zone is present
			if(a['name'] == network)then
				no_config_zone = false
			end
		end)
		
	--If config zone not present / add it
	if(no_config_zone)then
		local zone_name = self.x.add('firewall','zone')
		self.x.set('firewall',zone_name,'name',		network)	
        self.x.set('firewall',zone_name,'network', { network })	
		self.x.set('firewall',zone_name,'input',	'ACCEPT')	
		self.x.set('firewall',zone_name,'output',	'ACCEPT')	
		self.x.set('firewall',zone_name,'forward',	'REJECT') -- By default we are not forwarding traffic
		self.x.set('firewall',zone_name,'conntrack',	'1')	
	end
	
	-- Add the SNAT rules
	local no_redir = true
	self.x.foreach('firewall', 'redirect',
		function(a)
			if((a.src == network)and(a.dst == 'lan'))then
				no_redir = false
			end
		end)
	if(no_redir)then
		local r = self.x.add('firewall','redirect')
		self.x.set('firewall',r, 'src',network)
		self.x.set('firewall',r, 'dst','lan')
		self.x.set('firewall',r, 'target','SNAT')
        self.x.set('firewall',r, 'proto','tcpudp')
        --According the the documentation we are also suppose to add src_dip (and specify the IP of the LAN)
        --Problem is that the LAN IP can and will most probably change so it makes it impractical--
          
	end
	
	-- Add the forwarding entry
	local no_forwarding = true
	self.x.foreach('firewall','forwarding',
		function(a)
			if((a.src == network)and(a.dst=='lan'))then
				no_forwarding = false
			end
		end)

	--We are not adding a forward rule for the conf_zone for security reasons
	if(no_forwarding and (forward == 'yes')and(network ~= self.conf_zone))then -- Only if we specified to add a forward rule
		local f = self.x.add('firewall', 'forwarding')
		self.x.set('firewall',f,'src',network)
		self.x.set('firewall',f,'dst','lan')   	
	end
	
	--=====================================================
	--3G things
	--See if we need to add a rule for the 3G (wwan) connection
	
	local mobile_enabled = false;
	self.x.foreach('meshdesk','interface', 
        function(a)
            if(a['.name'] == 'wwan')then
                if(a['enabled'] ~= nil)then
                    if(a['enabled'] == '1')then
                       mobile_enabled = true
                    end
                end
            end
    end)
	
	if(mobile_enabled)then
	
	    local no_redir_mobile = true
	    self.x.foreach('firewall', 'redirect',
		    function(a)
			    if((a.src == network)and(a.dst == 'wwan'))then
				    no_redir_mobile = false
			    end
		    end)
	
	    if(no_redir_mobile)then
            --Create it
            local r_wwan = self.x.add('firewall','redirect')
           	self.x.set('firewall',r_wwan, 'src',network)
            self.x.set('firewall',r_wwan, 'dst','wwan')
            self.x.set('firewall',r_wwan, 'target','SNAT')
            self.x.set('firewall',r_wwan, 'proto','tcpudp')
        end
    
        local no_forwarding_mobile = true
	    self.x.foreach('firewall','forwarding',
		    function(a)
			    if((a.src == network)and(a.dst=='wwan'))then
				    no_forwarding_mobile = false
			    end
		    end)
	
        if(no_forwarding_mobile and (forward == 'yes')and(network ~= self.conf_zone))then -- Only if we specified to add a forward rule				
            --Create it
            local f_wwan = self.x.add('firewall','forwarding')
           	self.x.set('firewall',f_wwan,'src',network)
            self.x.set('firewall',f_wwan,'dst','wwan')    	
	    end
	    
    end 
    --=========END 3G ===============================
	
	self.x.commit('firewall')

	--only for the config zone
	--We need to add a rule to allow traffic to the config server for the config zone
	
	if(network == self.conf_zone)then 
	
	    --Web_by_wifi check
	    local wifi_enabled = false;
	    self.x.foreach('meshdesk','wifi-iface', 
            function(a)
                if(a['.name'] == 'web_by_wifi')then
                    if(a['disabled'] ~= nil)then
                        if(a['disabled'] == '0')then
                           wifi_enabled = true
                        end
                    end
                end
        end)
	

		--Avoid duplicates
		local no_conf_accept_rule = true
		self.x.foreach('firewall','rule',
			function(a)
				if(a['name'] == self.conf_rule)then
					no_conf_accetp_rule = false --We found the entry
				end
			end)

		--Get the IP of the config server
		local conf_srv = self.x.get('meshdesk','internet1','ip')

		--Add a rule for conf server 
		if(no_conf_accept_rule)then
			--For the conf server
			local r = self.x.add('firewall','rule')
			self.x.set('firewall',r,'src', network)
			self.x.set('firewall',r,'dest', 'lan')
			self.x.set('firewall',r,'dest_ip', conf_srv)
			self.x.set('firewall',r,'target', 'ACCEPT')
			self.x.set('firewall',r,'name', self.conf_rule)
			self.x.set('firewall',r,'proto', 'all') --required to include ping
			
			--For the ntp server
			local s = self.x.add('firewall','rule')
			self.x.set('firewall',s,'src', network)
			self.x.set('firewall',s,'dest', 'lan')
			self.x.set('firewall',s,'dest_port', '123')
			self.x.set('firewall',s,'proto', 'udp')
			self.x.set('firewall',s,'target', 'ACCEPT')
			self.x.set('firewall',s,'name', self.ntp_rule)
			
			if(mobile_enabled)then
			
			    local rm = self.x.add('firewall','rule')
			    self.x.set('firewall',rm,'src', network)
			    self.x.set('firewall',rm,'dest', 'wwan')
			    self.x.set('firewall',rm,'dest_ip', conf_srv)
			    self.x.set('firewall',rm,'target', 'ACCEPT')
			    self.x.set('firewall',rm,'name', self.conf_rule)
			    self.x.set('firewall',rm,'proto', 'all') --required to include ping
			
			    --For the ntp server
			    local sm = self.x.add('firewall','rule')
			    self.x.set('firewall',sm,'src', network)
			    self.x.set('firewall',sm,'dest', 'wwan')
			    self.x.set('firewall',sm,'dest_port', '123')
			    self.x.set('firewall',sm,'proto', 'udp')
			    self.x.set('firewall',sm,'target', 'ACCEPT')
			    self.x.set('firewall',sm,'name', self.ntp_rule)
					
			end
			
			if(wifi_enabled)then
			    local rw = self.x.add('firewall','rule')
			    self.x.set('firewall',rw,'src', network)
			    self.x.set('firewall',rw,'dest', 'web_by_wifi')
			    self.x.set('firewall',rw,'dest_ip', conf_srv)
			    self.x.set('firewall',rw,'target', 'ACCEPT')
			    self.x.set('firewall',rw,'name', self.conf_rule)
			    self.x.set('firewall',rw,'proto', 'all') --required to include ping
			
			    --For the ntp server
			    local sw = self.x.add('firewall','rule')
			    self.x.set('firewall',sw,'src', network)
			    self.x.set('firewall',sw,'dest', 'web_by_wifi')
			    self.x.set('firewall',sw,'dest_port', '123')
			    self.x.set('firewall',sw,'proto', 'udp')
			    self.x.set('firewall',sw,'target', 'ACCEPT')
			    self.x.set('firewall',sw,'name', self.ntp_rule)
			end		

			self.x.commit('firewall')
		end

	end

end



function rdGateway.__fwGwDisable(self)
	print("Disable gateway on firewall")
	
	-- Take care of the Zones --
	self.x.foreach('firewall', 'zone',
		function(a)
			if((a['name'] == self.conf_zone) or (string.find(a['name'],"ex_")))then
				local z_name = a['.name']
				self.x.delete('firewall',z_name)
			end
		end)
	
	-- Remove the SNAT rules --
	self.x.foreach('firewall', 'redirect',
		function(a)
			if((a.src == self.conf_zone) or (string.find(a.src, "ex_")))then
				local r_zone = a['.name']
				self.x.delete('firewall',r_zone)
			end
		end)
	
	-- Remove the forwarding entry --
	self.x.foreach('firewall', 'forwarding',
		function(a)
			if((a.src == self.conf_zone) or (string.find(a.src,"ex_")))then
				local fwd_name	  = a['.name']
				self.x.delete('firewall',fwd_name)
			end
		end)

	--Remove the rule allowing traffic to config servers well as NTP traffic
	self.x.foreach('firewall', 'rule',
		function(a)
			if(a.name == self.conf_rule)then
				local r	  = a['.name']
				self.x.delete('firewall',r)
			end

			if(a.name == self.ntp_rule)then
				local n = a['.name']
				self.x.delete('firewall',n)
			end
		end)
	
	self.x.commit('firewall')
		
end

function rdGateway.__fwMasqEnable(self,network)

    network     = network or 'lan' --default is to do it on the LAN
    self.x.foreach('firewall', 'zone',
	    function(a)
		    -- Add masq option to LAN --
		    if(a['name'] == 'lan')then
			    self.x.set('firewall',a['.name'],'masq',1)
			    self.x.set('firewall',a['.name'],'mtu_fix',1)
		    end
	end)
    self.x.commit('firewall')
    
end

function rdGateway.__fwMasqDisable(self,network)

    network     = network or 'lan' --default is to do it on the LAN
    self.x.foreach('firewall', 'zone',
	    function(a)
		    -- Add masq option to LAN --
		    if(a['name'] == 'lan')then
			    self.x.delete('firewall',a['.name'],'masq')
				self.x.delete('firewall',a['.name'],'mtu_fix')
		    end
	end)
    self.x.commit('firewall')
    
end

function rdGateway.__fwAddMobileWanZone(self)

    local mobile_enabled = false;
	self.x.foreach('meshdesk','interface', 
        function(a)
            if(a['.name'] == 'wwan')then
                if(a['enabled'] ~= nil)then
                    if(a['enabled'] == '1')then
                       mobile_enabled = true
                    end
                end
            end
    end)
 
    if(mobile_enabled)then
        --Create it
        local zone_name = self.x.add('firewall','zone')
        self.x.set('firewall',zone_name,'name',		'wwan')	
        self.x.set('firewall',zone_name,'network', { 'wwan' })	
        self.x.set('firewall',zone_name,'input',	'ACCEPT')	
        self.x.set('firewall',zone_name,'output',	'ACCEPT')	
        self.x.set('firewall',zone_name,'forward',	'ACCEPT')
        self.x.set('firewall',zone_name,'masq',	1)
        self.x.set('firewall',zone_name,'mtu_fix',	1)
        self.x.commit('firewall')
    end
end

function rdGateway.__fwRemoveMobileWanZone(self)

    self.x.foreach('firewall', 'zone',
	    function(a)
		    if(a['name'] == 'wwan')then
			    local wwan_name	  = a['.name']
				self.x.delete('firewall',wwan_name)
				self.x.commit('firewall')
		    end
	end)
end

function rdGateway.__fwAddWebByWifiZone(self)

    local wifi_enabled = false;
	self.x.foreach('meshdesk','wifi-iface', 
        function(a)
            if(a['.name'] == 'web_by_wifi')then
                if(a['disabled'] ~= nil)then
                    if(a['disabled'] == '0')then
                       wifi_enabled = true
                    end
                end
            end
    end)
 
    if(wifi_enabled)then
        --Create it
        local zone_name = self.x.add('firewall','zone')
        self.x.set('firewall',zone_name,'name',		'web_by_wifi')	
        self.x.set('firewall',zone_name,'network', { 'lan', 'web_by_wifi' })	
        self.x.set('firewall',zone_name,'input',	'ACCEPT')	
        self.x.set('firewall',zone_name,'output',	'ACCEPT')	
        self.x.set('firewall',zone_name,'forward',	'ACCEPT')
        self.x.set('firewall',zone_name,'masq',	1)
        self.x.set('firewall',zone_name,'mtu_fix',	1)
        self.x.commit('firewall')
    end
end

function rdGateway.__fwRemoveWebByWifiZone(self)

    self.x.foreach('firewall', 'zone',
	    function(a)
		    if(a['name'] == 'web_by_wifi')then
			    local relay_name	  = a['.name']
				self.x.delete('firewall',relay_name)
				self.x.commit('firewall')
		    end
	end)
end
