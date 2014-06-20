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

function main()

    --Network info to Alfred--
    require("rdNetstats")
    local n         = rdNetstats()
    local n_stats   = n:getWifi()
    os.execute("echo '"..n_stats.."' | alfred -s "..network_data)

    --System info to Alfred--
    require("rdSystemstats")
    local s         = rdSystemstats()
    local s_stats   = s:getStats()
    os.execute("echo '"..s_stats.."' | alfred -s "..system_data)

end

main()
