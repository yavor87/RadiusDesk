#! /bin/sh
sleep_random(){
    #---This random sleep is to avoid cron jobs hitting the server at the start of each x minutes---
    if [ $WAIT_MAX -lt 100 ]; then
        head_chars=2
    else
        head_chars=3
    fi

    rand=`tr -cd 0-9 < /dev/urandom | head -c $head_chars`
    while [ $rand -ge $WAIT_MAX ] ; do
        rand=`tr -cd 0-9 < /dev/urandom | head -c $head_chars`
    done

    if  $DEBUG; then
        echo "DEBUG - Sleeping a random value is $rand seconds"
    fi 
    sleep $rand
}

get_mac(){
    #---Get the MAC of the defined interface---
    g_mac=`/sbin/ifconfig $INTERFACE | sed -e's/^.*HWaddr \([^ ]*\) .*$/\1/;t;d'`
    #Replace : with - and make upper case
    g_mac=`echo $g_mac | sed s/:/-/g | tr '[abcdef]' '[ABCDEF]'`; 
    if  $DEBUG; then
        echo "DEBUG - MAC is: $g_mac"
    fi 
}

send_beat(){

    if  $DEBUG; then
        echo "DEBUG - URL to fetch: ${HEARTBEAT_URL}${g_mac}"
    fi

    wget -q -O ${FEEDBACK_FILE} ${HEARTBEAT_URL}${g_mac}
   
    if $DEBUG; then
        echo "DEBUG - feedback:"
        cat ${FEEDBACK_FILE}
    fi 
     
}

#If we had openvpn going we will want to turn it off
disable_openvpn(){
    if [ -f /etc/init.d/openvpn ];
    then
	    /etc/init.d/openvpn disable
    fi

    if [ -f /etc/openvpn/up ];
    then
	    rm /etc/openvpn/up
        reboot
    fi	
}

disable_heartbeat(){
    local c_t="/tmp/cron_temp"
    local c="/etc/crontabs/root"
    cp $c $c_t
    sed -i '/heartbeat/d'  $c_t
    crontab $c_t
}

enable_heartbeat(){

    local ip=$1
    local defaults=/etc/chilli/defaults
    local c_t="/tmp/cron_temp"
    local c="/etc/crontabs/root"
    cp $c $c_t  
    sed -i '/heartbeat/d'  $c_t
    echo "* * * * * sh /etc/heartbeat/heartbeat.sh" 		>> $c_t
    crontab $c_t
}

active_check(){
    get_mac
    check_url="http://$HEARTBEAT_SERVER/cake2/rd_cake/nas/get_coova_detail/$g_mac"
    echo $check_url
    wget  "$check_url"  -O "/tmp/heartbeat_check"
    eval grep_heartbeat_no=$(grep "HEARTBEAT=NO" /tmp/heartbeat_check)
	if [ $grep_heartbeat_no ];
	then  
        disable_heartbeat
	    exit
	fi

    eval grep_heartbeat_yes=$(grep "HEARTBEAT=" /tmp/heartbeat_check)
    if [ $grep_heartbeat_yes ];
	then
        eval IP=$(echo $grep_heartbeat_yes | sed -e "s/HEARTBEAT=//g")
        if [ $IP ];
        then
            configure_nvram_for_coova
            enable_heartbeat $IP
        fi
        exit 
    fi
}


configure_nvram_for_coova(){
    #This assumes that the /tmp/heartbeat_check file exists

    #Set hs_rdnasid
    eval grep_for_nas_id=$(grep "NAS-ID=" /tmp/heartbeat_check)
    if [ $grep_for_nas_id ];
	then
        eval ID=$(echo $grep_for_nas_id | sed -e "s/NAS-ID=//g")
        if [ $ID ];
        then
            eval CURRENT_ID=$(nvram get hs_rdnasid)
            if [ $CURRENT_ID != $ID ];
            then
                nvram set hs_rdnasid="$ID"
                nvram commit
            fi
        fi
    fi

    #Set hs_rdnasip
    eval grep_for_nas_ip=$(grep "NAS-IP=" /tmp/heartbeat_check)
    if [ $grep_for_nas_ip ];
	then
        eval IP=$(echo $grep_for_nas_ip | sed -e "s/NAS-IP=//g")
        if [ $IP ];
        then
            eval CURRENT_IP=$(nvram get hs_rdnasip)
            if [ $CURRENT_IP != $IP ];
            then
                nvram set hs_rdnasip="$IP"
                nvram commit
            fi
        fi
    fi

}



evaluate_feedback(){
#____________________________________________________________
# Description: This function eveluates the feedback (if any)_
# it recieved from the RADIUSdesk system upon sending it a _________
# heartbeat pulse ___________________________________________
#____________________________________________________________

#This is the first important part of the heartbeat script. The script will look for a lines that start with the following:
#'unique_id:' The next line will be the instruction's unique ID. This will be followed by 'action:' and an action
# We can have 'execute' and a command to execute on the next line EG
# unique_id: 8908908908fdddsf
# action: execute
# /bin/ls

    #Test to see if the feedback file is present
    if [ ! -s $FEEDBACK_FILE ]; then
        echo "File $FEEDBACK_FILE missing or empty";
        return 1;
    fi

    #Start by recording the places where 'action:' is found in the file
    if [ -s $g_keywords_file ];then
        rm $g_keywords_file
    fi


     #We start by recording all the lines where a line starts with unique_id: in the file
    key_word_found=$(grep -n "^unique_id:" $FEEDBACK_FILE | sed -e "s/:unique_id.*//")
    for index in $key_word_found ; do
        echo $index >> $g_keywords_file
    done

    #Return if there was no keywords found
    if [ ! -s $g_keywords_file ]; then
        echo "No keywords found";
        return 1;
    fi

    counter=1

    #Record the last place in the file where an action is listed
    last_id_line=$(head -n 5000 $g_keywords_file | tail -n 1)

    #Do we need to know this???
    lines_in_feedback_file=$(wc -l $FEEDBACK_FILE | sed -e "s%$FEEDBACK_FILE%%" )
    lines_in_feedback_file=$(( $lines_in_feedback_file + 0 ))
    if $DEBUG; then
        echo "DEBUG - There are $lines_in_feedback_file lines in feedback file"
    fi
 
    while true ; do
    
        #Get the location of the key_word
        id_on_line=$(head -n $counter $g_keywords_file | tail -n 1)

        if $DEBUG; then
            echo "DEBUG -ID on line: $id_on_line"
        fi

        counter=$(($counter+1))

        #We need to determine what the ID is:
        id=$(head -n $id_on_line $FEEDBACK_FILE | tail -n 1)
        id=$(echo "$id" | sed -e "s/unique_id:\s*//")
        if $DEBUG; then
            echo "DEBUG - ID is: $id";
        fi

        #We need to determine what the action is:
        action_on_line=$(($id_on_line+1))
        action=$(head -n $action_on_line $FEEDBACK_FILE | tail -n 1)
        action=$(echo "$action" | sed -e "s/action:\s*//")
        echo "Action is: $action";

        #=== ACTION: execute ===
        #if action is execute then we need to read the next line to execute it
        if [ $action = 'execute' ]; then
            echo "We need to execute"
            what_to_execute_line=$(($action_on_line+1))
            what_to_execute=$(head -n $what_to_execute_line $FEEDBACK_FILE | tail -n 1)
            #Execute the command:
            echo $what_to_execute
            #We add this to allow for multiple commands seperated by ; to be executed
            echo "#! $g_shell" > $g_tmp_script
            echo $what_to_execute >> $g_tmp_script
            $g_shell $g_tmp_script
            #$what_to_execute 
        fi
        #=== END ACTION: execute ===
        
        
        if [ $id_on_line = $last_id_line ]; then #DIRK Had to change == to = for bash
            break   
        fi

    done

}

