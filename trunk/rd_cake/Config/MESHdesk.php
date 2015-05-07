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
array('id'=>1,   'name' => 'Africa/Abidjan',       'value' => 'GMT0'),
array('id'=>2,   'name' => 'Africa/Accra', 	        'value' => 'GMT0'),
array('id'=>3,   'name' => 'Africa/Addis Ababa', 	'value' => 'EAT-3'),
array('id'=>4,   'name' => 'Africa/Algiers', 	    'value' => 'CET-1'),
array('id'=>5,   'name' => 'Africa/Asmara', 	    'value' => 'EAT-3'),
array('id'=>6,   'name' => 'Africa/Bamako', 	    'value' => 'GMT0'),
array('id'=>7,   'name' => 'Africa/Bangui', 	    'value' => 'WAT-1'),
array('id'=>8,   'name' => 'Africa/Banjul', 	    'value' => 'GMT0'),
array('id'=>9,   'name' => 'Africa/Bissau', 	    'value' => 'GMT0'),
array('id'=>10,  'name' => 'Africa/Blantyre', 	    'value' => 'CAT-2'),
array('id'=>12,  'name' => 'Africa/Bujumbura', 	    'value' => 'CAT-2'),
array('id'=>13,  'name' => 'Africa/Casablanca', 	'value' => 'WET0'),
array('id'=>14,  'name' => 'Africa/Ceuta', 	        'value' => 'CET-1CEST,M3.5.0,M10.5.0/3'),
array('id'=>15,  'name' => 'Africa/Conakry', 	    'value' => 'GMT0'),
array('id'=>16,  'name' => 'Africa/Dakar', 	        'value' => 'GMT0'),
array('id'=>17,  'name' => 'Africa/Dar es Salaam',  'value' => 'EAT-3'),
array('id'=>18,  'name' => 'Africa/Djibouti', 	    'value' => 'EAT-3'),
array('id'=>19,  'name' => 'Africa/Douala', 	    'value' => 'WAT-1'),
array('id'=>20,  'name' => 'Africa/El Aaiun', 	    'value' => 'WET0'),
array('id'=>21,  'name' => 'Africa/Freetown', 	    'value' => 'GMT0'),
array('id'=>22,  'name' => 'Africa/Gaborone', 	    'value' => 'CAT-2'),
array('id'=>23,  'name' => 'Africa/Harare', 	    'value' => 'CAT-2'),
array('id'=>24,  'name' => 'Africa/Johannesburg', 	'value' => 'SAST-2'),
array('id'=>25,  'name' => 'Africa/Kampala', 	    'value' => 'EAT-3'),
array('id'=>26,  'name' => 'Africa/Khartoum', 	    'value' => 'EAT-3'),
array('id'=>27,  'name' => 'Africa/Kigali', 	    'value' => 'CAT-2'),
array('id'=>28,  'name' => 'Africa/Kinshasa', 	    'value' => 'WAT-1'),
array('id'=>29,  'name' => 'Africa/Lagos', 	        'value' => 'WAT-1'),
array('id'=>30,  'name' => 'Africa/Libreville', 	'value' => 'WAT-1'),
array('id'=>31,  'name' => 'Africa/Lome', 	        'value' => 'GMT0'),
array('id'=>32,  'name' => 'Africa/Luanda', 	    'value' => 'WAT-1'),
array('id'=>33,  'name' => 'Africa/Lubumbashi', 	'value' => 'CAT-2'),
array('id'=>34,  'name' => 'Africa/Lusaka', 	    'value' => 'CAT-2'),
array('id'=>35,  'name' => 'Africa/Malabo', 	    'value' => 'WAT-1'),
array('id'=>36,  'name' => 'Africa/Maputo', 	    'value' => 'CAT-2'),
array('id'=>37,  'name' => 'Africa/Maseru', 	    'value' => 'SAST-2'),
array('id'=>38,  'name' => 'Africa/Mbabane', 	    'value' => 'SAST-2'),
array('id'=>39,  'name' => 'Africa/Mogadishu', 	    'value' => 'EAT-3'),
array('id'=>40,  'name' => 'Africa/Monrovia', 	    'value' => 'GMT0'),
array('id'=>41,  'name' => 'Africa/Nairobi', 	    'value' => 'EAT-3'),
array('id'=>42,  'name' => 'Africa/Ndjamena', 	    'value' => 'WAT-1'),
array('id'=>43,  'name' => 'Africa/Niamey', 	    'value' => 'WAT-1'),
array('id'=>44,  'name' => 'Africa/Nouakchott', 	'value' => 'GMT0'),
array('id'=>45,  'name' => 'Africa/Ouagadougou', 	'value' => 'GMT0'),
array('id'=>46,  'name' => 'Africa/Porto-Novo', 	'value' => 'WAT-1'),
array('id'=>47,  'name' => 'Africa/Sao Tome', 	    'value' => 'GMT0'),
array('id'=>48,  'name' => 'Africa/Tripoli', 	    'value' => 'EET-2'),
array('id'=>49,  'name' => 'Africa/Tunis', 	        'value' => 'CET-1'),
array('id'=>50,  'name' => 'Africa/Windhoek', 	    'value' => 'WAT-1WAST,M9.1.0,M4.1.0'),
/*
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
array('name' => 'America/Los Angeles',              'id' => 'PST8PDT,M3.2.0,M11.1.0'),
array('name' => 'America/Maceio',                   'id' => 'BRT3'),
array('name' => 'America/Managua',                  'id' => 'CST6'),
array('name' => 'America/Manaus',                   'id' => 'AMT4'),
array('name' => 'America/Marigot',                  'id' => 'AST4'),
array('name' => 'America/Martinique',               'id' => 'AST4'),
array('name' => 'America/Matamoros',                'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Mazatlan',                 'id' => 'MST7MDT,M4.1.0,M10.5.0'),
array('name' => 'America/Menominee',                'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Merida',                   'id' => 'CST6CDT,M4.1.0,M10.5.0'),
array('name' => 'America/Mexico City',              'id' => 'CST6CDT,M4.1.0,M10.5.0'),
array('name' => 'America/Miquelon',                 'id' => 'PMST3PMDT,M3.2.0,M11.1.0'),
array('name' => 'America/Moncton',                  'id' => 'AST4ADT,M3.2.0,M11.1.0'),
array('name' => 'America/Monterrey',                'id' => 'CST6CDT,M4.1.0,M10.5.0'),
array('name' => 'America/Montevideo',               'id' => 'UYT3UYST,M10.1.0,M3.2.0'),
array('name' => 'America/Montreal',                 'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Montserrat',               'id' => 'AST4'),
array('name' => 'America/Nassau',                   'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/New York',                 'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Nipigon',                  'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Nome',                     'id' => 'AKST9AKDT,M3.2.0,M11.1.0'),
array('name' => 'America/Noronha',                  'id' => 'FNT2'),
array('name' => 'America/North Dakota/Center',      'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/North Dakota/New Salem ',  'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Ojinaga',                  'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/Panama',                   'id' => 'EST5'),
array('name' => 'America/Pangnirtung',              'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Paramaribo',               'id' => 'SRT3'),
array('name' => 'America/Phoenix',                  'id' => 'MST7'),
array('name' => 'America/Port of Spain',            'id' => 'AST4'),
array('name' => 'America/Port-au-Prince',           'id' => 'EST5'),
array('name' => 'America/Porto Velho',              'id' => 'AMT4'),
array('name' => 'America/Puerto Rico',              'id' => 'AST4'),
array('name' => 'America/Rainy River',              'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Rankin Inlet',             'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Recife',                   'id' => 'BRT3'),
array('name' => 'America/Regina',                   'id' => 'CST6'),
array('name' => 'America/Rio Branco',               'id' => 'AMT4'),
array('name' => 'America/Santa Isabel',             'id' => 'PST8PDT,M4.1.0,M10.5.0'),
array('name' => 'America/Santarem',                 'id' => 'BRT3'),
array('name' => 'America/Santo Domingo',            'id' => 'AST4'),
array('name' => 'America/Sao Paulo',                'id' => 'BRT3BRST,M10.3.0/0,M2.3.0/0'),
array('name' => 'America/Scoresbysund',             'id' => 'EGT1EGST,M3.5.0/0,M10.5.0/1'),
array('name' => 'America/Shiprock',                 'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'America/St Barthelemy',            'id' => 'AST4'),
array('name' => 'America/St Johns',                 'id' => 'NST3:30NDT,M3.2.0/0:01,M11.1.0/0:01'),
array('name' => 'America/St Kitts',                 'id' => 'AST4'),
array('name' => 'America/St Lucia',                 'id' => 'AST4'),
array('name' => 'America/St Thomas',                'id' => 'AST4'),
array('name' => 'America/St Vincent',               'id' => 'AST4'),
array('name' => 'America/Swift Current',            'id' => 'CST6'),
array('name' => 'America/Tegucigalpa',              'id' => 'CST6'),
array('name' => 'America/Thule',                    'id' => 'AST4ADT,M3.2.0,M11.1.0'),
array('name' => 'America/Thunder Bay',              'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Tijuana',                  'id' => 'PST8PDT,M3.2.0,M11.1.0'),
array('name' => 'America/Toronto',                  'id' => 'EST5EDT,M3.2.0,M11.1.0'),
array('name' => 'America/Tortola',                  'id' => 'AST4'),
array('name' => 'America/Vancouver',                'id' => 'PST8PDT,M3.2.0,M11.1.0'),
array('name' => 'America/Whitehorse',               'id' => 'PST8PDT,M3.2.0,M11.1.0'),
array('name' => 'America/Winnipeg',                 'id' => 'CST6CDT,M3.2.0,M11.1.0'),
array('name' => 'America/Yakutat',                  'id' => 'AKST9AKDT,M3.2.0,M11.1.0'),
array('name' => 'America/Yellowknife',              'id' => 'MST7MDT,M3.2.0,M11.1.0'),
array('name' => 'Antarctica/Casey',                 'id' => 'WST-8'),
array('name' => 'Antarctica/Davis',                 'id' => 'DAVT-7'),
array('name' => 'Antarctica/DumontDUrville',        'id' => 'DDUT-10'),
array('name' => 'Antarctica/Macquarie',             'id' => 'MIST-11'),
array('name' => 'Antarctica/Mawson',                'id' => 'MAWT-5'),
array('name' => 'Antarctica/McMurdo',               'id' => 'NZST-12NZDT,M9.5.0,M4.1.0/3'),
array('name' => 'Antarctica/Rothera',               'id' => 'ROTT3'),
array('name' => 'Antarctica/South Pole',            'id' => 'NZST-12NZDT,M9.5.0,M4.1.0/3'),
array('name' => 'Antarctica/Syowa',                 'id' => 'SYOT-3'),
array('name' => 'Antarctica/Vostok',                'id' => 'VOST-6'),
array('name' => 'Arctic/Longyearbyen',              'id' => 'CET-1CEST,M3.5.0,M10.5.0/3'),
/*
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

$config['MESHdesk']['countries'] = array(
	array( 'id' => 'AF', 'name' => 'Afghanistan'),
	array( 'id' => 'AX', 'name' => 'Aland Islands'),
	array( 'id' => 'AL', 'name' => 'Albania'),
	array( 'id' => 'DZ', 'name' => 'Algeria'),
	array( 'id' => 'AS', 'name' => 'American Samoa'),
	array( 'id' => 'AD', 'name' => 'Andorra'),
	array( 'id' => 'AO', 'name' => 'Angola'),
	array( 'id' => 'AI', 'name' => 'Anguilla'),
	array( 'id' => 'AQ', 'name' => 'Antarctica'),
	array( 'id' => 'AG', 'name' => 'Antigua And Barbuda'),
	array( 'id' => 'AR', 'name' => 'Argentina'),
	array( 'id' => 'AM', 'name' => 'Armenia'),
	array( 'id' => 'AW', 'name' => 'Aruba'),
	array( 'id' => 'AU', 'name' => 'Australia'),
	array( 'id' => 'AT', 'name' => 'Austria'),
	array( 'id' => 'AZ', 'name' => 'Azerbaijan'),
	array( 'id' => 'BS', 'name' => 'Bahamas'),
	array( 'id' => 'BH', 'name' => 'Bahrain'),
	array( 'id' => 'BD', 'name' => 'Bangladesh'),
	array( 'id' => 'BB', 'name' => 'Barbados'),
	array( 'id' => 'BY', 'name' => 'Belarus'),
	array( 'id' => 'BE', 'name' => 'Belgium'),
	array( 'id' => 'BZ', 'name' => 'Belize'),
	array( 'id' => 'BJ', 'name' => 'Benin'),
	array( 'id' => 'BM', 'name' => 'Bermuda'),
	array( 'id' => 'BT', 'name' => 'Bhutan'),
	array( 'id' => 'BO', 'name' => 'Bolivia'),
	array( 'id' => 'BA', 'name' => 'Bosnia And Herzegovina'),
	array( 'id' => 'BW', 'name' => 'Botswana'),
	array( 'id' => 'BV', 'name' => 'Bouvet Island'),
	array( 'id' => 'BR', 'name' => 'Brazil'),
	array( 'id' => 'IO', 'name' => 'British Indian Ocean Territory'),
	array( 'id' => 'BN', 'name' => 'Brunei Darussalam'),
	array( 'id' => 'BG', 'name' => 'Bulgaria'),
	array( 'id' => 'BF', 'name' => 'Burkina Faso'),
	array( 'id' => 'BI', 'name' => 'Burundi'),
	array( 'id' => 'KH', 'name' => 'Cambodia'),
	array( 'id' => 'CM', 'name' => 'Cameroon'),
	array( 'id' => 'CA', 'name' => 'Canada'),
	array( 'id' => 'CV', 'name' => 'Cape Verde'),
	array( 'id' => 'KY', 'name' => 'Cayman Islands'),
	array( 'id' => 'CF', 'name' => 'Central African Republic'),
	array( 'id' => 'TD', 'name' => 'Chad'),
	array( 'id' => 'CL', 'name' => 'Chile'),
	array( 'id' => 'CN', 'name' => 'China'),
	array( 'id' => 'CX', 'name' => 'Christmas Island'),
	array( 'id' => 'CC', 'name' => 'Cocos (Keeling) Islands'),
	array( 'id' => 'CO', 'name' => 'Colombia'),
	array( 'id' => 'KM', 'name' => 'Comoros'),
	array( 'id' => 'CG', 'name' => 'Congo'),
	array( 'id' => 'CD', 'name' => 'Congo, Democratic Republic'),
	array( 'id' => 'CK', 'name' => 'Cook Islands'),
	array( 'id' => 'CR', 'name' => 'Costa Rica'),
	array( 'id' => 'CI', 'name' => 'Cote D\'Ivoire'),
	array( 'id' => 'HR', 'name' => 'Croatia'),
	array( 'id' => 'CU', 'name' => 'Cuba'),
	array( 'id' => 'CY', 'name' => 'Cyprus'),
	array( 'id' => 'CZ', 'name' => 'Czech Republic'),
	array( 'id' => 'DK', 'name' => 'Denmark'),
	array( 'id' => 'DJ', 'name' => 'Djibouti'),
	array( 'id' => 'DM', 'name' => 'Dominica'),
	array( 'id' => 'DO', 'name' => 'Dominican Republic'),
	array( 'id' => 'EC', 'name' => 'Ecuador'),
	array( 'id' => 'EG', 'name' => 'Egypt'),
	array( 'id' => 'SV', 'name' => 'El Salvador'),
	array( 'id' => 'GQ', 'name' => 'Equatorial Guinea'),
	array( 'id' => 'ER', 'name' => 'Eritrea'),
	array( 'id' => 'EE', 'name' => 'Estonia'),
	array( 'id' => 'ET', 'name' => 'Ethiopia'),
	array( 'id' => 'FK', 'name' => 'Falkland Islands (Malvinas)'),
	array( 'id' => 'FO', 'name' => 'Faroe Islands'),
	array( 'id' => 'FJ', 'name' => 'Fiji'),
	array( 'id' => 'FI', 'name' => 'Finland'),
	array( 'id' => 'FR', 'name' => 'France'),
	array( 'id' => 'GF', 'name' => 'French Guiana'),
	array( 'id' => 'PF', 'name' => 'French Polynesia'),
	array( 'id' => 'TF', 'name' => 'French Southern Territories'),
	array( 'id' => 'GA', 'name' => 'Gabon'),
	array( 'id' => 'GM', 'name' => 'Gambia'),
	array( 'id' => 'GE', 'name' => 'Georgia'),
	array( 'id' => 'DE', 'name' => 'Germany'),
	array( 'id' => 'GH', 'name' => 'Ghana'),
	array( 'id' => 'GI', 'name' => 'Gibraltar'),
	array( 'id' => 'GR', 'name' => 'Greece'),
	array( 'id' => 'GL', 'name' => 'Greenland'),
	array( 'id' => 'GD', 'name' => 'Grenada'),
	array( 'id' => 'GP', 'name' => 'Guadeloupe'),
	array( 'id' => 'GU', 'name' => 'Guam'),
	array( 'id' => 'GT', 'name' => 'Guatemala'),
	array( 'id' => 'GG', 'name' => 'Guernsey'),
	array( 'id' => 'GN', 'name' => 'Guinea'),
	array( 'id' => 'GW', 'name' => 'Guinea-Bissau'),
	array( 'id' => 'GY', 'name' => 'Guyana'),
	array( 'id' => 'HT', 'name' => 'Haiti'),
	array( 'id' => 'HM', 'name' => 'Heard Island & Mcdonald Islands'),
	array( 'id' => 'VA', 'name' => 'Holy See (Vatican City State)'),
	array( 'id' => 'HN', 'name' => 'Honduras'),
	array( 'id' => 'HK', 'name' => 'Hong Kong'),
	array( 'id' => 'HU', 'name' => 'Hungary'),
	array( 'id' => 'IS', 'name' => 'Iceland'),
	array( 'id' => 'IN', 'name' => 'India'),
	array( 'id' => 'ID', 'name' => 'Indonesia'),
	array( 'id' => 'IR', 'name' => 'Iran, Islamic Republic Of'),
	array( 'id' => 'IQ', 'name' => 'Iraq'),
	array( 'id' => 'IE', 'name' => 'Ireland'),
	array( 'id' => 'IM', 'name' => 'Isle Of Man'),
	array( 'id' => 'IL', 'name' => 'Israel'),
	array( 'id' => 'IT', 'name' => 'Italy'),
	array( 'id' => 'JM', 'name' => 'Jamaica'),
	array( 'id' => 'JP', 'name' => 'Japan'),
	array( 'id' => 'JE', 'name' => 'Jersey'),
	array( 'id' => 'JO', 'name' => 'Jordan'),
	array( 'id' => 'KZ', 'name' => 'Kazakhstan'),
	array( 'id' => 'KE', 'name' => 'Kenya'),
	array( 'id' => 'KI', 'name' => 'Kiribati'),
	array( 'id' => 'KR', 'name' => 'Korea'),
	array( 'id' => 'KW', 'name' => 'Kuwait'),
	array( 'id' => 'KG', 'name' => 'Kyrgyzstan'),
	array( 'id' => 'LA', 'name' => 'Lao People\'s Democratic Republic'),
	array( 'id' => 'LV', 'name' => 'Latvia'),
	array( 'id' => 'LB', 'name' => 'Lebanon'),
	array( 'id' => 'LS', 'name' => 'Lesotho'),
	array( 'id' => 'LR', 'name' => 'Liberia'),
	array( 'id' => 'LY', 'name' => 'Libyan Arab Jamahiriya'),
	array( 'id' => 'LI', 'name' => 'Liechtenstein'),
	array( 'id' => 'LT', 'name' => 'Lithuania'),
	array( 'id' => 'LU', 'name' => 'Luxembourg'),
	array( 'id' => 'MO', 'name' => 'Macao'),
	array( 'id' => 'MK', 'name' => 'Macedonia'),
	array( 'id' => 'MG', 'name' => 'Madagascar'),
	array( 'id' => 'MW', 'name' => 'Malawi'),
	array( 'id' => 'MY', 'name' => 'Malaysia'),
	array( 'id' => 'MV', 'name' => 'Maldives'),
	array( 'id' => 'ML', 'name' => 'Mali'),
	array( 'id' => 'MT', 'name' => 'Malta'),
	array( 'id' => 'MH', 'name' => 'Marshall Islands'),
	array( 'id' => 'MQ', 'name' => 'Martinique'),
	array( 'id' => 'MR', 'name' => 'Mauritania'),
	array( 'id' => 'MU', 'name' => 'Mauritius'),
	array( 'id' => 'YT', 'name' => 'Mayotte'),
	array( 'id' => 'MX', 'name' => 'Mexico'),
	array( 'id' => 'FM', 'name' => 'Micronesia, Federated States Of'),
	array( 'id' => 'MD', 'name' => 'Moldova'),
	array( 'id' => 'MC', 'name' => 'Monaco'),
	array( 'id' => 'MN', 'name' => 'Mongolia'),
	array( 'id' => 'ME', 'name' => 'Montenegro'),
	array( 'id' => 'MS', 'name' => 'Montserrat'),
	array( 'id' => 'MA', 'name' => 'Morocco'),
	array( 'id' => 'MZ', 'name' => 'Mozambique'),
	array( 'id' => 'MM', 'name' => 'Myanmar'),
	array( 'id' => 'NA', 'name' => 'Namibia'),
	array( 'id' => 'NR', 'name' => 'Nauru'),
	array( 'id' => 'NP', 'name' => 'Nepal'),
	array( 'id' => 'NL', 'name' => 'Netherlands'),
	array( 'id' => 'AN', 'name' => 'Netherlands Antilles'),
	array( 'id' => 'NC', 'name' => 'New Caledonia'),
	array( 'id' => 'NZ', 'name' => 'New Zealand'),
	array( 'id' => 'NI', 'name' => 'Nicaragua'),
	array( 'id' => 'NE', 'name' => 'Niger'),
	array( 'id' => 'NG', 'name' => 'Nigeria'),
	array( 'id' => 'NU', 'name' => 'Niue'),
	array( 'id' => 'NF', 'name' => 'Norfolk Island'),
	array( 'id' => 'MP', 'name' => 'Northern Mariana Islands'),
	array( 'id' => 'NO', 'name' => 'Norway'),
	array( 'id' => 'OM', 'name' => 'Oman'),
	array( 'id' => 'PK', 'name' => 'Pakistan'),
	array( 'id' => 'PW', 'name' => 'Palau'),
	array( 'id' => 'PS', 'name' => 'Palestinian Territory, Occupied'),
	array( 'id' => 'PA', 'name' => 'Panama'),
	array( 'id' => 'PG', 'name' => 'Papua New Guinea'),
	array( 'id' => 'PY', 'name' => 'Paraguay'),
	array( 'id' => 'PE', 'name' => 'Peru'),
	array( 'id' => 'PH', 'name' => 'Philippines'),
	array( 'id' => 'PN', 'name' => 'Pitcairn'),
	array( 'id' => 'PL', 'name' => 'Poland'),
	array( 'id' => 'PT', 'name' => 'Portugal'),
	array( 'id' => 'PR', 'name' => 'Puerto Rico'),
	array( 'id' => 'QA', 'name' => 'Qatar'),
	array( 'id' => 'RE', 'name' => 'Reunion'),
	array( 'id' => 'RO', 'name' => 'Romania'),
	array( 'id' => 'RU', 'name' => 'Russian Federation'),
	array( 'id' => 'RW', 'name' => 'Rwanda'),
	array( 'id' => 'BL', 'name' => 'Saint Barthelemy'),
	array( 'id' => 'SH', 'name' => 'Saint Helena'),
	array( 'id' => 'KN', 'name' => 'Saint Kitts And Nevis'),
	array( 'id' => 'LC', 'name' => 'Saint Lucia'),
	array( 'id' => 'MF', 'name' => 'Saint Martin'),
	array( 'id' => 'PM', 'name' => 'Saint Pierre And Miquelon'),
	array( 'id' => 'VC', 'name' => 'Saint Vincent And Grenadines'),
	array( 'id' => 'WS', 'name' => 'Samoa'),
	array( 'id' => 'SM', 'name' => 'San Marino'),
	array( 'id' => 'ST', 'name' => 'Sao Tome And Principe'),
	array( 'id' => 'SA', 'name' => 'Saudi Arabia'),
	array( 'id' => 'SN', 'name' => 'Senegal'),
	array( 'id' => 'RS', 'name' => 'Serbia'),
	array( 'id' => 'SC', 'name' => 'Seychelles'),
	array( 'id' => 'SL', 'name' => 'Sierra Leone'),
	array( 'id' => 'SG', 'name' => 'Singapore'),
	array( 'id' => 'SK', 'name' => 'Slovakia'),
	array( 'id' => 'SI', 'name' => 'Slovenia'),
	array( 'id' => 'SB', 'name' => 'Solomon Islands'),
	array( 'id' => 'SO', 'name' => 'Somalia'),
	array( 'id' => 'ZA', 'name' => 'South Africa'),
	array( 'id' => 'GS', 'name' => 'South Georgia And Sandwich Isl.'),
	array( 'id' => 'ES', 'name' => 'Spain'),
	array( 'id' => 'LK', 'name' => 'Sri Lanka'),
	array( 'id' => 'SD', 'name' => 'Sudan'),
	array( 'id' => 'SR', 'name' => 'Suriname'),
	array( 'id' => 'SJ', 'name' => 'Svalbard And Jan Mayen'),
	array( 'id' => 'SZ', 'name' => 'Swaziland'),
	array( 'id' => 'SE', 'name' => 'Sweden'),
	array( 'id' => 'CH', 'name' => 'Switzerland'),
	array( 'id' => 'SY', 'name' => 'Syrian Arab Republic'),
	array( 'id' => 'TW', 'name' => 'Taiwan'),
	array( 'id' => 'TJ', 'name' => 'Tajikistan'),
	array( 'id' => 'TZ', 'name' => 'Tanzania'),
	array( 'id' => 'TH', 'name' => 'Thailand'),
	array( 'id' => 'TL', 'name' => 'Timor-Leste'),
	array( 'id' => 'TG', 'name' => 'Togo'),
	array( 'id' => 'TK', 'name' => 'Tokelau'),
	array( 'id' => 'TO', 'name' => 'Tonga'),
	array( 'id' => 'TT', 'name' => 'Trinidad And Tobago'),
	array( 'id' => 'TN', 'name' => 'Tunisia'),
	array( 'id' => 'TR', 'name' => 'Turkey'),
	array( 'id' => 'TM', 'name' => 'Turkmenistan'),
	array( 'id' => 'TC', 'name' => 'Turks And Caicos Islands'),
	array( 'id' => 'TV', 'name' => 'Tuvalu'),
	array( 'id' => 'UG', 'name' => 'Uganda'),
	array( 'id' => 'UA', 'name' => 'Ukraine'),
	array( 'id' => 'AE', 'name' => 'United Arab Emirates'),
	array( 'id' => 'GB', 'name' => 'United Kingdom'),
	array( 'id' => 'US', 'name' => 'United States'),
	array( 'id' => 'UM', 'name' => 'United States Outlying Islands'),
	array( 'id' => 'UY', 'name' => 'Uruguay'),
	array( 'id' => 'UZ', 'name' => 'Uzbekistan'),
	array( 'id' => 'VU', 'name' => 'Vanuatu'),
	array( 'id' => 'VE', 'name' => 'Venezuela'),
	array( 'id' => 'VN', 'name' => 'Viet Nam'),
	array( 'id' => 'VG', 'name' => 'Virgin Islands, British'),
	array( 'id' => 'VI', 'name' => 'Virgin Islands, U.S.'),
	array( 'id' => 'WF', 'name' => 'Wallis And Futuna'),
	array( 'id' => 'EH', 'name' => 'Western Sahara'),
	array( 'id' => 'YE', 'name' => 'Yemen'),
	array( 'id' => 'ZM', 'name' => 'Zambia'),
	array( 'id' => 'ZW', 'name' => 'Zimbabwe'),
);



?>
