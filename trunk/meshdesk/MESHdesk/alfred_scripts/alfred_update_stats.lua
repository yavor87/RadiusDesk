#!/usr/bin/lua

--[[--

Script which is periodically run by crond to update the dato of the mesh which is 'kept' by Afred

--]]--

-- Include libraries
package.path = "../libs/?.lua;" .. package.path

--Some variables
local network_data  = 100   --This is where we store network stats
local system_data   = 101   --This is where we store stats about the system
local feedback_data = 102   --This is where feedback from the back-end is kept
local vpn_data      = 103   --This is where we store stats on all the OpenVPN Gateway pings
local eth_mesh_map  = 110

function main()

    --Network info to Alfred--
    require("rdNetstats")
    local n         = rdNetstats()
    local n_stats   = n:getWifi()
    os.execute("echo '"..n_stats.."' | alfred -s "..network_data)

	--Keep the mapping of eth0 to mesh0 fresh
	local mapping	= n:mapEthWithMeshMac()
	os.execute("echo '"..mapping.."' | alfred -s "..eth_mesh_map)

    --System info to Alfred--
    require("rdSystemstats")
    local s         = rdSystemstats()
    local s_stats   = s:getStats()
    os.execute("echo '"..s_stats.."' | alfred -s "..system_data)

    --VPN info to Alfred--
    require("rdOpenvpnstats")
    local vpn       = rdOpenvpnstats()
    local vpn_stats = vpn:getStats()
    os.execute("echo '"..vpn_stats.."' | alfred -s "..vpn_data)       

end

main()
