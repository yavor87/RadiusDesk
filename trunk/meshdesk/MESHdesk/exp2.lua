#!/usr/bin/lua

--[[--

Startup script to get the config of the device from the config server

--]]--

-- Include libraries
package.path = "libs/?.lua;" .. package.path

function main()
	require("rdGateway")
	local a = rdGateway()
	a:enable({'ex_five'})

end

main()
