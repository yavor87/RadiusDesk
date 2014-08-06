#!/usr/bin/lua

-- Include libraries
package.path = "../libs/?.lua;" .. package.path

function main()
	require("rdActions")
	local a = rdActions()
	a:check()
end

main()
