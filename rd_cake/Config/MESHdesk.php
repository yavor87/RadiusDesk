<?php
/*

This file is used to match the authorize.net Simple Payment button id's with a product.
Here we will use it to pick which voucher it will generate
The silent POST function of A.net will contain this:

x_catalog_link_id=1abacb70-d45d-4d12-ba51-98f01523720d

We will then use this in the controller to determine what the voucher should contain by means of this lookup

Since we have no means to know what the description of the catalog is, we have to add our own which will be inserted 
when a transaction is recorded.

*/

//===== MESHdesk ======
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
		'hwmode'	=> '11ng'	
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
		'hwmode'	=> '11ng'	
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
		'hwmode'	=> '11ng'	
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
		'hwmode'	=> '11ng'	
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
		'hwmode'	=> '11ng'
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
		'hwmode'	=> '11na'
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
		'hwmode'	=> '11ng'
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
		'hwmode'	=> '11na'	
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
		'hwmode'	=> '11ng'	
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
		'hwmode'	=> '11ng'	
);

$config['hardware'][10]      = array(
		'name' 		=> __('TP-Link N600 (Dual Radio)'),	
		'id'    	=> 'tplink_n600',
		'radios'	=> 2, 
		'active'    => true,
		'eth_br'	=> 'eth0 eth1',

		//First radio 
		'max_power' => '20',
		'two'		=> true,
		'five'		=> false,
		'hwmode'	=> '11ng',

		//Second radio - This is extra for two radio devices
		'max_power1'=> '23',
		'two1'		=> false,
		'five1'		=> true,
		'hwmode1'	=> '11na'
);

$config['hardware'][11]      = array(
                'name'          => __('Alix 3D2 (Dual Radio)'),
                'id'            => 'alix3d2',
                'radios'        => 2,
                'active'    	=> true,
                'eth_br'        => 'eth0',

                //First radio 
                'max_power' => '23',
                'two'           => true,
                'five'          => false,
                'hwmode'        => '11ng',

                //Second radio - This is extra for two radio devices
                'max_power1'=> '23',
                'two1'          => false,
                'five1'         => true,
                'hwmode1'       => '11na'
);




//== MESHdesk SSID/BSSID
$config['MEHSdesk']['bssid'] = "02:CA:FE:CA:00:00"; //This will be the first one; subsequent ones will be incremented 

//== MESHdesk Defaul MAP settings ==
$config['mesh_specifics']['map']['type']     = "ROADMAP";
$config['mesh_specifics']['map']['zoom']     = 18;
$config['mesh_specifics']['map']['lng']      = -71.0955740216735;
$config['mesh_specifics']['map']['lat']      = 42.3379770178396;


?>
