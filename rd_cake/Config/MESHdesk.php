<?php

//===== MESHdesk ======

//== Client WPA2 Personal passphrase (key)
$config['MESHdesk']['client_key']	= 'radiusdesk'; 


//== Encryption types ==
//Define the encryption types and if they are active or not
$config['encryption'][0]     = array('name' => __('None'),              'id' => 'none',     'active' => true);
$config['encryption'][1]     = array('name' => __('WEP'),               'id' => 'wep',      'active' => true);
$config['encryption'][2]     = array('name' => __('WPA Personal'),      'id' => 'psk',      'active' => true);
$config['encryption'][3]     = array('name' => __('WPA2 Personal'),     'id' => 'psk2',     'active' => true);
$config['encryption'][4]     = array('name' => __('WPA Enterprise'),    'id' => 'wpa',      'active' => true);
$config['encryption'][5]     = array('name' => __('WPA2 Enterprise'),   'id' => 'wpa2',     'active' => true);

//== Default mesh settings ==
//Define default settings for the mesh which can be overwritten
$config['mesh_settings']['aggregated_ogms']  		= true;  //Aggregation*
$config['mesh_settings']['ap_isolation']  			= false; //AP Isolation*
$config['mesh_settings']['bonding']   				= false; //Bonding*
$config['mesh_settings']['fragmentation']   		= true;  //Fragmentation*
$config['mesh_settings']['gw_sel_class'] 			= 20; //Client Gateway switching*
$config['mesh_settings']['orig_interval']  			= 1000; //OGM Interval*
$config['mesh_settings']['bridge_loop_avoidance']  	= false; //Bridge loop avoidence*
$config['mesh_settings']['distributed_arp_table'] 	= true; //Distributed ARP table

//== Node start ip for defined mesh ==
$config['mesh_node']['start_ip']    = '10.5.5.1';

//== Default node settings ==
$config['common_node_settings']['password']  		= 'admin'; //Root password on nodes
$config['common_node_settings']['password_hash']  	= '$1$TJn8xhHP$BLhc3QEW54de0V8yCYD/T.'; //Output of 'openssl passwd -1 admin'
$config['common_node_settings']['power']     		= 100; //% of tx power to use on devices
$config['common_node_settings']['all_power'] 		= true; //Apply this power to all devices?
$config['common_node_settings']['two_chan']  		= 6; //% Channel to use on 2.4G wifi
$config['common_node_settings']['five_chan'] 		= 44; //% Channel to use on 5G wifi
$config['common_node_settings']['heartbeat_interval']  = 60; //Send a heartbeat pulse through every interval seconds
$config['common_node_settings']['heartbeat_dead_after'] = 300; //Mark a device as dead if we have not had heartbeats in this time

//New features
$config['common_node_settings']['eth_br_chk']		= false;	//set to true to bridge the ethernet ports of non-gw units	
$config['common_node_settings']['eth_br_with']		= 0; 		//Zero has a special meaning which is the LAN
$config['common_node_settings']['eth_br_for_all']	= false; 		//Apply this bridge to all non-gateway nodes

//== Device types for MESHdesk ==

$config['hardware'][0]      = array(
		'name' 		=> __('Dragino MS14'),   	
		'id'    	=> 'dragino',
		'radios'	=> 1,
		'active'    => true, 
		'max_power' => 18,
		'eth_br'	=> 'eth0 eth1',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][1]      = array(
		'name' 		=> __('MP2 Basic'),   	
		'id'    	=> 'mp2_basic',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => 18,
		'eth_br'	=> 'eth0 eth1',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][2]      = array(
		'name' 		=> __('MP2 Phone'),   	
		'id'    	=> 'mp2_phone',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => 18,
		'eth_br'	=> 'eth0 eth1',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);


$config['hardware'][3]      = array(
		'name' 		=> __('OpenMesh OM2P'),  	
		'id'    	=> 'om2p' , 
		'radios'	=> 1,  
		'active'    => true, 
		'max_power' => '20',
		'eth_br'	=> 'eth0 eth1',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][4]      = array(
		'name' 		=> __('PicoStation M2'),	
		'id'    	=> 'pico2',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => '28',
		'eth_br'	=> 'eth0',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'
);

$config['hardware'][5]      = array(
		'name' 		=> __('PicoStation M5'),	
		'id'    	=> 'pico5', 
		'radios'	=> 1,
		'active'    => true, 
		'max_power' => '28',
		'eth_br'	=> 'eth0',
		'two'		=> false,
		'five'		=> true,
		'hwmode'	=> '11a'
);

$config['hardware'][6]      = array(
		'name' 		=> __('NanoStation M2'),	
		'id'    	=> 'nano2',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => '28',
		'eth_br'	=> 'eth0',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'
);


$config['hardware'][7]      = array(
		'name' 		=> __('NanoStation M5'),	
		'id'    	=> 'nano5',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => '28',
		'eth_br'	=> 'eth0',
		'two'		=> false,
		'five'		=> true,
		'hwmode'	=> '11a'	
);

$config['hardware'][8]      = array(
		'name' 		=> __('UniFi AP'),	
		'id'    	=> 'unifiap',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => '23',
		'eth_br'	=> 'eth0',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][9]      = array(
		'name' 		=> __('UniFi AP-LR'),	
		'id'    	=> 'unifilrap',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => '27',
		'eth_br'	=> 'eth0',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][10]      = array(
		'name' 		=> __('TP-Link WR841N'),  	
		'id'    	=> 'tl841n' , 
		'radios'	=> 1,  
		'active'    => true, 
		'max_power' => '21',
		'eth_br'	=> 'eth0 eth1',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][11]      = array(
		'name' 		=> __('UniFi AP PRO (Dual Radio)'),	
		'id'    	=> 'unifiappro',
		'radios'	=> 2, 
		'active'    => true,
		'eth_br'	=> 'eth0',

		//First radio 
		'max_power' => '17',
		'two'		=> false,
		'five'		=> true,
		'hwmode'	=> '11a',

		//Second radio - This is extra for two radio devices
		'max_power1'=> '30',
		'two1'		=> true,
		'five1'		=> false,
		'hwmode1'	=> '11g'
);


$config['hardware'][12]      = array(
		'name' 		=> __('TP-Link N600 (Dual Radio)'),	
		'id'    	=> 'tplink_n600',
		'radios'	=> 2, 
		'active'    => true,
		'eth_br'	=> 'eth0 eth1',

		//First radio 
		'max_power' => '20',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g',

		//Second radio - This is extra for two radio devices
		'max_power1'=> '23',
		'two1'		=> false,
		'five1'		=> true,
		'hwmode1'	=> '11a'
);

$config['hardware'][13]      = array(
                'name'          => __('Alix 3D2 (Dual Radio)'),
                'id'            => 'alix3d2',
                'radios'        => 2,
                'active'    	=> true,
                'eth_br'        => 'eth0',

                //First radio 
                'max_power' => '23',
                'two'           => true,
                'five'          => false,
                'hwmode'        => '11g',

                //Second radio - This is extra for two radio devices
                'max_power1'=> '23',
                'two1'          => false,
                'five1'         => true,
                'hwmode1'       => '11a'
);



$config['hardware'][14]      = array(
		'name' 		=> __('Generic 1 Radio'),	
		'id'    	=> 'genoneradio',
		'radios'	=> 1, 
		'active'    => true, 
		'max_power' => '18',
		'eth_br'	=> 'eth0',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11g'	
);

$config['hardware'][15]      = array(
                'name'          => __('Generic 2 Radio'),
                'id'            => 'gentworadio',
                'radios'        => 2,
                'active'    	=> true,
                'eth_br'        => 'eth0',

                //First radio 
                'max_power' => '18',
                'two'           => true,
                'five'          => false,
                'hwmode'        => '11g',

                //Second radio - This is extra for two radio devices
                'max_power1'=> '18',
                'two1'          => false,
                'five1'         => true,
                'hwmode1'       => '11a'
);

$config['hardware'][16]      = array(
	'name'    		=> __('AirGateway'),       
    'id'          	=> 'airgw',
    'radios'      	=> 1,
    'active'    	=> true,
    'max_power' 	=> 18,
    'eth_br'      	=> 'eth0 eth1',
    'two'         	=> true,
    'five'        	=> false,
    'hwmode'      	=> '11g'     
);

$config['hardware'][17]      = array(
	'name'     		=> __('AirRouter'),        
    'id'          	=> 'airrouter' ,  
   	'radios'      	=> 1,
    'active'    	=> true,
 	'max_power' 	=> '19',
   	'eth_br'      	=> 'eth0',
   	'two'         	=> true,
   	'five'        	=> false,
  	'hwmode'      	=> '11g'     
);

$config['hardware'][18]      = array(
	'name'          => __('AirRouterHP'),      
	'id'          	=> 'airrouterhp' ,  
	'radios'      	=> 1,
	'active'    	=> true,
	'max_power'   	=> '26',
	'eth_br'      	=> 'eth0',
	'two'         	=> true,
	'five'        	=> false,
	'hwmode'      	=> '11g' 
);

$config['hardware'][19]      = array(
  	'name'          => __('BulletM2'),         
  	'id'          	=> 'bulm2',
  	'radios'      	=> 1,
	'active'    	=> true,
  	'max_power' 	=> 28,
  	'eth_br'      	=> 'eth0',
  	'two'         	=> true,
  	'five'        	=> false,
  	'hwmode'      	=> '11g'
);

$config['hardware'][20]      = array(
  	'name'          => __('RB433 (Dual Radio)'),      
  	'id'          	=> 'rb433',
  	'radios'      	=> 2,
  	'active'    	=> true,
  	'eth_br'      	=> 'eth0 eth1',
  	//First radio
  	'max_power' 	=> '27',
  	'two'         	=> true,
  	'five'        	=> false,
  	'hwmode'      	=> '11g',
  	//Second radio - This is extra for two radio devices
  	'max_power1'	=> '27',
  	'two1'        	=> false,
  	'five1'        	=> true,
  	'hwmode1'     	=> '11a'
);


//== MESHdesk SSID/BSSID
$config['MEHSdesk']['bssid'] = "02:CA:FE:CA:00:00"; //This will be the first one; subsequent ones will be incremented 

//== MESHdesk Defaul MAP settings ==
$config['mesh_specifics']['map']['type']     = "ROADMAP";
$config['mesh_specifics']['map']['zoom']     = 18;
$config['mesh_specifics']['map']['lng']      = -71.0955740216735;
$config['mesh_specifics']['map']['lat']      = 42.3379770178396;


//== OpenWrt timezones====

$config['MESHdesk']['timezones'] = array(
array('name' => 'Africa/Abidjan',       'id' => 'GMT0'),
array('name' => 'Africa/Accra', 	    'id' => 'GMT0'),
array('name' => 'Africa/Addis Ababa', 	'id' => 'EAT-3'),
array('name' => 'Africa/Algiers', 	    'id' => 'CET-1'),
array('name' => 'Africa/Asmara', 	    'id' => 'EAT-3'),
array('name' => 'Africa/Bamako', 	    'id' => 'GMT0'),
array('name' => 'Africa/Bangui', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Banjul', 	    'id' => 'GMT0'),
array('name' => 'Africa/Bissau', 	    'id' => 'GMT0'),
array('name' => 'Africa/Blantyre', 	    'id' => 'CAT-2'),
array('name' => 'Africa/Brazzaville', 	'id' => 'WAT-1'),
array('name' => 'Africa/Bujumbura', 	'id' => 'CAT-2'),
array('name' => 'Africa/Casablanca', 	'id' => 'WET0'),
array('name' => 'Africa/Ceuta', 	    'id' => 'CET-1CEST,M3.5.0,M10.5.0/3'),
array('name' => 'Africa/Conakry', 	    'id' => 'GMT0'),
array('name' => 'Africa/Dakar', 	    'id' => 'GMT0'),
array('name' => 'Africa/Dar es Salaam', 'id' => 'EAT-3'),
array('name' => 'Africa/Djibouti', 	    'id' => 'EAT-3'),
array('name' => 'Africa/Douala', 	    'id' => 'WAT-1'),
array('name' => 'Africa/El Aaiun', 	    'id' => 'WET0'),
array('name' => 'Africa/Freetown', 	    'id' => 'GMT0'),
array('name' => 'Africa/Gaborone', 	    'id' => 'CAT-2'),
array('name' => 'Africa/Harare', 	    'id' => 'CAT-2'),
array('name' => 'Africa/Johannesburg', 	'id' => 'SAST-2'),
array('name' => 'Africa/Kampala', 	    'id' => 'EAT-3'),
array('name' => 'Africa/Khartoum', 	    'id' => 'EAT-3'),
array('name' => 'Africa/Kigali', 	    'id' => 'CAT-2'),
array('name' => 'Africa/Kinshasa', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Lagos', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Libreville', 	'id' => 'WAT-1'),
array('name' => 'Africa/Lome', 	        'id' => 'GMT0'),
array('name' => 'Africa/Luanda', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Lubumbashi', 	'id' => 'CAT-2'),
array('name' => 'Africa/Lusaka', 	    'id' => 'CAT-2'),
array('name' => 'Africa/Malabo', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Maputo', 	    'id' => 'CAT-2'),
array('name' => 'Africa/Maseru', 	    'id' => 'SAST-2'),
array('name' => 'Africa/Mbabane', 	    'id' => 'SAST-2'),
array('name' => 'Africa/Mogadishu', 	'id' => 'EAT-3'),
array('name' => 'Africa/Monrovia', 	    'id' => 'GMT0'),
array('name' => 'Africa/Nairobi', 	    'id' => 'EAT-3'),
array('name' => 'Africa/Ndjamena', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Niamey', 	    'id' => 'WAT-1'),
array('name' => 'Africa/Nouakchott', 	'id' => 'GMT0'),
array('name' => 'Africa/Ouagadougou', 	'id' => 'GMT0'),
array('name' => 'Africa/Porto-Novo', 	'id' => 'WAT-1'),
array('name' => 'Africa/Sao Tome', 	    'id' => 'GMT0'),
array('name' => 'Africa/Tripoli', 	    'id' => 'EET-2'),
array('name' => 'Africa/Tunis', 	    'id' => 'CET-1'),
array('name' => 'Africa/Windhoek', 	    'id' => 'WAT-1WAST,M9.1.0,M4.1.0'),
array('name' => 'America/Adak', 	    'id' => 'HAST10HADT,M3.2.0,M11.1.0'),
array('name' => 'America/Anchorage', 	'id' => 'AKST9AKDT,M3.2.0,M11.1.0'),
array('name' => 'America/Anguilla', 	'id' => 'AST4'),
array('name' => 'America/Antigua', 	    'id' => 'AST4'),
array('name' => 'America/Araguaina', 	'id' => 'BRT3'),
array('name' => 'America/Argentina/Buenos Aires', 	'id' => 'ART3'),
array('name' => 'America/Argentina/Catamarca', 	    'id' => 'ART3'),
array('name' => 'America/Argentina/Cordoba', 	    'id' => 'ART3'),
array('name' => 'America/Argentina/Jujuy', 	        'id' => 'ART3'),
array('name' => 'America/Argentina/La Rioja', 	    'id' => 'ART3'),
array('name' => 'America/Argentina/Mendoza', 	    'id' => 'ART3'),
array('name' => 'America/Argentina/Rio Gallegos', 	'id' => 'ART3'),
array('name' => 'America/Argentina/Salta', 	        'id' => 'ART3'),
array('name' => 'America/Argentina/San Juan', 	    'id' => 'ART3'),
array('name' => 'America/Argentina/Tucuman', 	    'id' => 'ART3'),
array('name' => 'America/Argentina/Ushuaia', 	    'id' => 'ART3'),
array('name' => 'America/Aruba', 	                'id' => 'AST4'),
array('name' => 'America/Asuncion', 	            'id' => 'PYT4PYST,M10.1.0/0,M4.2.0/0'),
array('name' => 'America/Atikokan', 	            'id' => 'EST5'),
array('name' => 'America/Bahia', 	                'id' => 'BRT3'),
array('name' => 'America/Barbados', 	            'id' => 'AST4'),
array('name' => 'America/Belem', 	                'id' => 'BRT3'),
array('name' => 'America/Belize', 	                'id' => 'CST6'),
array('name' => 'America/Blanc-Sablon', 	        'id' => 'AST4'),
array('name' => 'America/Boa Vista', 	            'id' => 'AMT4'),
array('name' => 'America/Bogota', 	                'id' => 'COT5'),
array('name' => 'America/Boise', 	                'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/Cambridge Bay', 	        'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/Campo Grande', 	        'id' => 'AMT4AMST,M10.3.0/0,M2.3.0/0'),
array('name' => 'America/Cancun', 	                'id' => 'CST6CDT,M4.1.0,M10.5.0'),
array('name' => 'America/Caracas', 	                'id' => 'VET4:30'),
array('name' => 'America/Cayenne', 	                'id' => 'GFT3'),
array('name' => 'America/Cayman', 	                'id' => 'EST5'),
array('name' => 'America/Chicago', 	                'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Chihuahua', 	            'id' => 'MST7MDT,M4.1.0,M10.5.0'),
array('name' => 'America/Costa Rica', 	            'id' => 'CST6'),
array('name' => 'America/Cuiaba', 	                'id' => 'AMT4AMST,M10.3.0/0,M2.3.0/0'),
array('name' => 'America/Curacao', 	                'id' => 'AST4'),
array('name' => 'America/Danmarkshavn', 	        'id' => 'GMT0'),
array('name' => 'America/Dawson', 	                'id' => 'PST8PDT,M3.2.0,M11.1.0'),
array('name' => 'America/Dawson Creek', 	        'id' => 'MST7'),
array('name' => 'America/Denver', 	                'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/Detroit',                  'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Dominica',                 'id' => 'AST4'),
array('name' => 'America/Edmonton',                 'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/Eirunepe',                 'id' => 'AMT4'),
array('name' => 'America/El Salvador',              'id' => 'CST6'),
array('name' => 'America/Fortaleza',                'id' => 'BRT3'),
array('name' => 'America/Glace Bay',                'id' => 'AST4ADT,M3.2.0,M11.1.0'),
array('name' => 'America/Goose Bay',                'id' => 'AST4ADT,M3.2.0/0:01,M11.1.0/0:01'),
array('name' => 'America/Grand Turk',               'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Grenada',                  'id' => 'AST4'),
array('name' => 'America/Guadeloupe',               'id' => 'AST4'),
array('name' => 'America/Guatemala',                'id' => 'CST6'),
array('name' => 'America/Guayaquil',                'id' => 'ECT5'),
array('name' => 'America/Guyana',                   'id' => 'GYT4'),
array('name' => 'America/Halifax',                  'id' => 'AST4ADT,M3.2.0,M11.1.0'),
array('name' => 'America/Havana',                   'id' => 'CST5CDT,M3.2.0/0,M10.5.0/1'),
array('name' => 'America/Hermosillo',               'id' => 'MST7'),
array('name' => 'America/Indiana/Indianapolis',     'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Knox',             'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Marengo',          'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Petersburg',       'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Tell City',        'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Vevay',            'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Vincennes',        'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Indiana/Winamac',          'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Inuvik',                   'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/Iqaluit',                  'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Jamaica',                  'id' => 'EST5'),
array('name' => 'America/Juneau',                   'id' => 'AKST9AKDT,M3.2.0,M11.1.0'),
array('name' => 'America/Kentucky/Louisville',      'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Kentucky/Monticello',      'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/La Paz',                   'id' => 'BOT4'),
array('name' => 'America/Lima',                     'id' => 'PET5'),
array('name' => 'America/Los Angeles',               'id' => 'PST8PDT,M3.2.0,M11.1.0')
/*
array('name' => 'America/Maceio 	BRT3
array('name' => 'America/Managua 	CST6
array('name' => 'America/Manaus 	AMT4
array('name' => 'America/Marigot 	AST4
array('name' => 'America/Martinique 	AST4
array('name' => 'America/Matamoros 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/Mazatlan 	MST7MDT,M4.1.0,M10.5.0
array('name' => 'America/Menominee 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/Merida 	CST6CDT,M4.1.0,M10.5.0
array('name' => 'America/Mexico City 	CST6CDT,M4.1.0,M10.5.0
array('name' => 'America/Miquelon 	PMST3PMDT,M3.2.0,M11.1.0
array('name' => 'America/Moncton 	AST4ADT,M3.2.0,M11.1.0
array('name' => 'America/Monterrey 	CST6CDT,M4.1.0,M10.5.0
array('name' => 'America/Montevideo 	UYT3UYST,M10.1.0,M3.2.0
array('name' => 'America/Montreal 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/Montserrat 	AST4
array('name' => 'America/Nassau 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/New York 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/Nipigon 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/Nome 	AKST9AKDT,M3.2.0,M11.1.0
array('name' => 'America/Noronha 	FNT2
array('name' => 'America/North Dakota/Center 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/North Dakota/New Salem 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/Ojinaga 	MST7MDT,M3.2.0,M11.1.0
array('name' => 'America/Panama 	EST5
array('name' => 'America/Pangnirtung 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/Paramaribo 	SRT3
array('name' => 'America/Phoenix 	MST7
array('name' => 'America/Port of Spain 	AST4
array('name' => 'America/Port-au-Prince 	EST5
array('name' => 'America/Porto Velho 	AMT4
array('name' => 'America/Puerto Rico 	AST4
array('name' => 'America/Rainy River 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/Rankin Inlet 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/Recife 	BRT3
array('name' => 'America/Regina 	CST6
array('name' => 'America/Rio Branco 	AMT4
array('name' => 'America/Santa Isabel 	PST8PDT,M4.1.0,M10.5.0
array('name' => 'America/Santarem 	BRT3
array('name' => 'America/Santo Domingo 	AST4
array('name' => 'America/Sao Paulo 	BRT3BRST,M10.3.0/0,M2.3.0/0
array('name' => 'America/Scoresbysund 	EGT1EGST,M3.5.0/0,M10.5.0/1
array('name' => 'America/Shiprock 	MST7MDT,M3.2.0,M11.1.0
array('name' => 'America/St Barthelemy 	AST4
array('name' => 'America/St Johns 	NST3:30NDT,M3.2.0/0:01,M11.1.0/0:01
array('name' => 'America/St Kitts 	AST4
array('name' => 'America/St Lucia 	AST4
array('name' => 'America/St Thomas 	AST4
array('name' => 'America/St Vincent 	AST4
array('name' => 'America/Swift Current 	CST6
array('name' => 'America/Tegucigalpa 	CST6
array('name' => 'America/Thule 	AST4ADT,M3.2.0,M11.1.0
array('name' => 'America/Thunder Bay 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/Tijuana 	PST8PDT,M3.2.0,M11.1.0
array('name' => 'America/Toronto 	EST5EDT,M3.2.0,M11.1.0
array('name' => 'America/Tortola 	AST4
array('name' => 'America/Vancouver 	PST8PDT,M3.2.0,M11.1.0
array('name' => 'America/Whitehorse 	PST8PDT,M3.2.0,M11.1.0
array('name' => 'America/Winnipeg 	CST6CDT,M3.2.0,M11.1.0
array('name' => 'America/Yakutat 	AKST9AKDT,M3.2.0,M11.1.0
array('name' => 'America/Yellowknife 	MST7MDT,M3.2.0,M11.1.0
Antarctica/Casey 	WST-8
Antarctica/Davis 	DAVT-7
Antarctica/DumontDUrville 	DDUT-10
Antarctica/Macquarie 	MIST-11
Antarctica/Mawson 	MAWT-5
Antarctica/McMurdo 	NZST-12NZDT,M9.5.0,M4.1.0/3
Antarctica/Rothera 	ROTT3
Antarctica/South Pole 	NZST-12NZDT,M9.5.0,M4.1.0/3
Antarctica/Syowa 	SYOT-3
Antarctica/Vostok 	VOST-6
Arctic/Longyearbyen 	CET-1CEST,M3.5.0,M10.5.0/3
Asia/Aden 	AST-3
Asia/Almaty 	ALMT-6
Asia/Anadyr 	ANAT-11ANAST,M3.5.0,M10.5.0/3
Asia/Aqtau 	AQTT-5
Asia/Aqtobe 	AQTT-5
Asia/Ashgabat 	TMT-5
Asia/Baghdad 	AST-3
Asia/Bahrain 	AST-3
Asia/Baku 	AZT-4AZST,M3.5.0/4,M10.5.0/5
Asia/Bangkok 	ICT-7
Asia/Beirut 	EET-2EEST,M3.5.0/0,M10.5.0/0
Asia/Bishkek 	KGT-6
Asia/Brunei 	BNT-8
Asia/Choibalsan 	CHOT-8
Asia/Chongqing 	CST-8
Asia/Colombo 	IST-5:30
Asia/Damascus 	EET-2EEST,M4.1.5/0,M10.5.5/0
Asia/Dhaka 	BDT-6
Asia/Dili 	TLT-9
Asia/Dubai 	GST-4
Asia/Dushanbe 	TJT-5
Asia/Gaza 	EET-2EEST,M3.5.6/0:01,M9.1.5
Asia/Harbin 	CST-8
Asia/Ho Chi Minh 	ICT-7
Asia/Hong Kong 	HKT-8
Asia/Hovd 	HOVT-7
Asia/Irkutsk 	IRKT-8IRKST,M3.5.0,M10.5.0/3
Asia/Jakarta 	WIT-7
Asia/Jayapura 	EIT-9
Asia/Kabul 	AFT-4:30
Asia/Kamchatka 	PETT-11PETST,M3.5.0,M10.5.0/3
Asia/Karachi 	PKT-5
Asia/Kashgar 	CST-8
Asia/Kathmandu 	NPT-5:45
Asia/Kolkata 	IST-5:30
Asia/Krasnoyarsk 	KRAT-7KRAST,M3.5.0,M10.5.0/3
Asia/Kuala Lumpur 	MYT-8
Asia/Kuching 	MYT-8
Asia/Kuwait 	AST-3
Asia/Macau 	CST-8
Asia/Magadan 	MAGT-11MAGST,M3.5.0,M10.5.0/3
Asia/Makassar 	CIT-8
Asia/Manila 	PHT-8
Asia/Muscat 	GST-4
Asia/Nicosia 	EET-2EEST,M3.5.0/3,M10.5.0/4
Asia/Novokuznetsk 	NOVT-6NOVST,M3.5.0,M10.5.0/3
Asia/Novosibirsk 	NOVT-6NOVST,M3.5.0,M10.5.0/3
Asia/Omsk 	OMST-7
Asia/Oral 	ORAT-5
Asia/Phnom Penh 	ICT-7
Asia/Pontianak 	WIT-7
Asia/Pyongyang 	KST-9
Asia/Qatar 	AST-3
Asia/Qyzylorda 	QYZT-6
Asia/Rangoon 	MMT-6:30
Asia/Riyadh 	AST-3
Asia/Sakhalin 	SAKT-10SAKST,M3.5.0,M10.5.0/3
Asia/Samarkand 	UZT-5
Asia/Seoul 	KST-9
Asia/Shanghai 	CST-8
Asia/Singapore 	SGT-8
Asia/Taipei 	CST-8
Asia/Tashkent 	UZT-5
Asia/Tbilisi 	GET-4
Asia/Tehran 	IRST-3:30IRDT,80/0,264/0
Asia/Thimphu 	BTT-6
Asia/Tokyo 	JST-9
Asia/Ulaanbaatar 	ULAT-8
Asia/Urumqi 	CST-8
Asia/Vientiane 	ICT-7
Asia/Vladivostok 	VLAT-10VLAST,M3.5.0,M10.5.0/3
Asia/Yakutsk 	YAKT-9YAKST,M3.5.0,M10.5.0/3
Asia/Yekaterinburg 	YEKT-5YEKST,M3.5.0,M10.5.0/3
Asia/Yerevan 	AMT-4AMST,M3.5.0,M10.5.0/3
Atlantic/Azores 	AZOT1AZOST,M3.5.0/0,M10.5.0/1
Atlantic/Bermuda 	AST4ADT,M3.2.0,M11.1.0
Atlantic/Canary 	WET0WEST,M3.5.0/1,M10.5.0
Atlantic/Cape Verde 	CVT1
Atlantic/Faroe 	WET0WEST,M3.5.0/1,M10.5.0
Atlantic/Madeira 	WET0WEST,M3.5.0/1,M10.5.0
Atlantic/Reykjavik 	GMT0
Atlantic/South Georgia 	GST2
Atlantic/St Helena 	GMT0
Atlantic/Stanley 	FKT4FKST,M9.1.0,M4.3.0
Australia/Adelaide 	CST-9:30CST,M10.1.0,M4.1.0/3
Australia/Brisbane 	EST-10
Australia/Broken Hill 	CST-9:30CST,M10.1.0,M4.1.0/3
Australia/Currie 	EST-10EST,M10.1.0,M4.1.0/3
Australia/Darwin 	CST-9:30
Australia/Eucla 	CWST-8:45
Australia/Hobart 	EST-10EST,M10.1.0,M4.1.0/3
Australia/Lindeman 	EST-10
Australia/Lord Howe 	LHST-10:30LHST-11,M10.1.0,M4.1.0
Australia/Melbourne 	EST-10EST,M10.1.0,M4.1.0/3
Australia/Perth 	WST-8
Australia/Sydney 	EST-10EST,M10.1.0,M4.1.0/3
Europe/Amsterdam 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Andorra 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Athens 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Belgrade 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Berlin 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Bratislava 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Brussels 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Bucharest 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Budapest 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Chisinau 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Copenhagen 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Dublin 	GMT0IST,M3.5.0/1,M10.5.0
Europe/Gibraltar 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Guernsey 	GMT0BST,M3.5.0/1,M10.5.0
Europe/Helsinki 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Isle of Man 	GMT0BST,M3.5.0/1,M10.5.0
Europe/Istanbul 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Jersey 	GMT0BST,M3.5.0/1,M10.5.0
Europe/Kaliningrad 	EET-2EEST,M3.5.0,M10.5.0/3
Europe/Kiev 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Lisbon 	WET0WEST,M3.5.0/1,M10.5.0
Europe/Ljubljana 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/London 	GMT0BST,M3.5.0/1,M10.5.0
Europe/Luxembourg 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Madrid 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Malta 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Mariehamn 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Minsk 	EET-2EEST,M3.5.0,M10.5.0/3
Europe/Monaco 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Moscow 	MSK-4
Europe/Oslo 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Paris 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Podgorica 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Prague 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Riga 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Rome 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Samara 	SAMT-3SAMST,M3.5.0,M10.5.0/3
Europe/San Marino 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Sarajevo 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Simferopol 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Skopje 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Sofia 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Stockholm 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Tallinn 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Tirane 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Uzhgorod 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Vaduz 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Vatican 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Vienna 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Vilnius 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Volgograd 	VOLT-3VOLST,M3.5.0,M10.5.0/3
Europe/Warsaw 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Zagreb 	CET-1CEST,M3.5.0,M10.5.0/3
Europe/Zaporozhye 	EET-2EEST,M3.5.0/3,M10.5.0/4
Europe/Zurich 	CET-1CEST,M3.5.0,M10.5.0/3
Indian/Antananarivo 	EAT-3
Indian/Chagos 	IOT-6
Indian/Christmas 	CXT-7
Indian/Cocos 	CCT-6:30
Indian/Comoro 	EAT-3
Indian/Kerguelen 	TFT-5
Indian/Mahe 	SCT-4
Indian/Maldives 	MVT-5
Indian/Mauritius 	MUT-4
Indian/Mayotte 	EAT-3
Indian/Reunion 	RET-4
Pacific/Apia 	WST11
Pacific/Auckland 	NZST-12NZDT,M9.5.0,M4.1.0/3
Pacific/Chatham 	CHAST-12:45CHADT,M9.5.0/2:45,M4.1.0/3:45
Pacific/Efate 	VUT-11
Pacific/Enderbury 	PHOT-13
Pacific/Fakaofo 	TKT10
Pacific/Fiji 	FJT-12
Pacific/Funafuti 	TVT-12
Pacific/Galapagos 	GALT6
Pacific/Gambier 	GAMT9
Pacific/Guadalcanal 	SBT-11
Pacific/Guam 	ChST-10
Pacific/Honolulu 	HST10
Pacific/Johnston 	HST10
Pacific/Kiritimati 	LINT-14
Pacific/Kosrae 	KOST-11
Pacific/Kwajalein 	MHT-12
Pacific/Majuro 	MHT-12
Pacific/Marquesas 	MART9:30
Pacific/Midway 	SST11
Pacific/Nauru 	NRT-12
Pacific/Niue 	NUT11
Pacific/Norfolk 	NFT-11:30
Pacific/Noumea 	NCT-11
Pacific/Pago Pago 	SST11
Pacific/Palau 	PWT-9
Pacific/Pitcairn 	PST8
Pacific/Ponape 	PONT-11
Pacific/Port Moresby 	PGT-10
Pacific/Rarotonga 	CKT10
Pacific/Saipan 	ChST-10
Pacific/Tahiti 	TAHT10
Pacific/Tarawa 	GILT-12
Pacific/Tongatapu 	TOT-13
Pacific/Truk 	TRUT-10
Pacific/Wake 	WAKT-12
Pacific/Wallis 	WFT-12 
*/

);


?>
