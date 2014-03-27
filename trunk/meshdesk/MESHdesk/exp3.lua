#!/usr/bin/lua

--[[--

Startup script to get the config of the device from the config server

--]]--

-- Include libraries
package.path = "libs/?.lua;" .. package.path

function main()
	require("rdNetstats")
	local a = rdNetstats()
	a:getWifi()

end

main()
