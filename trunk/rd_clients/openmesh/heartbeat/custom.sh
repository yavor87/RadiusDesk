#! /bin/sh

#Replace this IP with your server's one 
RD_IP="7.3.9.6"

#_____________________
# Increase the version in order for cloudtrax to force a run of this script
# Version 1.0.3
#______________


if [ ! -d "/etc/heartbeat" ];
then
    mkdir "/etc/heartbeat"
fi

#Download the latest files
wget -t 3 -T 15 "http://$RD_IP/heartbeat/heartbeat.sh"        -O "/etc/heartbeat/heartbeat.sh"
wget -t 3 -T 15 "http://$RD_IP/heartbeat/util_functions.sh"   -O "/etc/heartbeat/util_functions.sh"

#Run the script with the "check" argument
cd "/etc/heartbeat"
sh /etc/heartbeat/heartbeat.sh start

