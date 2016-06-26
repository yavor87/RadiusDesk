#! /bin/sh
cd /etc/MESHdesk/alfred_scripts

#Clean up stuck reads
./alfred_clean_up_stuck_reads.lua &

#First we update all our stats
./alfred_update_stats.lua &
#Now we check if the gateway is still the same
./alfred_dynamic_gateway.lua &
#Then we report it to the server
#We do this independently to 1.) Avoid all report the same time 2.) to be able to adjust heartbeat intervals
#./alfred_report_to_server.lua
#Then we set our Interwebs LED
./alfred_check_for_internet.lua &
