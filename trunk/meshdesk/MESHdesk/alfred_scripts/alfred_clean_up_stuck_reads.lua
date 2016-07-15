#!/usr/bin/lua


--[[--

Script which is periodically run by crond to see if there were 'alfred -r ' processes stuck and then it cleans them up

--]]--

-- Include libraries
package.path = "../libs/?.lua;" .. package.path

function main()
    require("rdAlfred")
    local a  = rdAlfred()
    a:cleanUp()
end

main()
