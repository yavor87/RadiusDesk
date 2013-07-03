#! /bin/sh

#__________________________________
#---- Script for heartbeat ------
#_________________________________

#source ./util_functions.sh
. /etc/heartbeat/util_functions.sh


#------------------------------
#--- Some Global Variables ----
#------------------------------
g_keywords_file='/tmp/keywords'
g_mac='';
g_shell="/bin/sh"
g_tmp_script="/tmp/tmp_script"


#____________________________________________
#_____ Configuration options ________________
#____________________________________________
HEARTBEAT_SERVER='198.23.131.219'
HEARTBEAT_URL='http://'$HEARTBEAT_SERVER'/cake2/rd_cake/webroot/files/heartbeat.php?mac='
FEEDBACK_FILE='/tmp/fb.txt';
DEBUG=true

#The maximum time that the random sleep will take (between 0 and WAIT_MAX seconds - can not be more than 999 - should be same as cron interval)
WAIT_MAX=60 

##INTERFACE='eth1'
INTERFACE='eth0'


#See if we were called with the 'start' or 'stop' argument                                       
if [ $1 ];then
    if [ $1 = 'start' ];
    then
        echo "Get Coova settings and add heartbeat to crontab"                                                                                    
        active_check                               
        exit                                       
    fi  

    if [ $1 = 'stop' ];then                                                                                                                  
        echo "Remove heartbeat from crontab"                                                                                    
        disable_heartbeat                              
        exit                                       
    fi  
fi                                 

#Sleep a random value to avoid 'dos'-ing the server
sleep_random

#Send a heartbeat pulse to the RADIUSdesk server
#First we need to get the device's MAC to send as a unique ID to identify its heartbeat
get_mac
 
#Send a heartbeat to the server
send_beat

#Check if we need to respond
evaluate_feedback 
