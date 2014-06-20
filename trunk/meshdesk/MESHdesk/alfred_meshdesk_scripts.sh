#! /bin/sh
cd /etc/MESHdesk/alfred_scripts
#First we update all our stats
./alfred_update_stats.lua
#Now we check if the gateway is still the same
./alfred_dynamic_gateway.lua
#Then we report it to the server
./alfred_report_to_server.lua
#Then we set our Interwebs LED
./alfred_check_for_internet.lua
