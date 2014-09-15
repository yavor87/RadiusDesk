<?php
App::uses('AppController', 'Controller');

class NodesController extends AppController {

    public $name        = 'Nodes';
    public $uses        = array('Mesh');
    public $components  = array('OpenWrt');
    protected $NodeId   = '';
	protected $Hardware = 'dragino'; //Some default value
	protected $Power	= '10'; //Some default


    public function get_config_for_node(){

        if(isset($this->request->query['mac'])){

            $mac    = $this->request->query['mac'];
           // $mac    = 'AC-86-74-10-03-10'; //manual override
            $node   = ClassRegistry::init('Node');
            $mesh   = ClassRegistry::init('Mesh');
            $node->contain();
            $q_r    = $node->findByMac($mac);

            if($q_r){
               // print_r($q_r);
                $mesh_id        = $q_r['Node']['mesh_id'];

                $this->NodeId   = $q_r['Node']['id'];
				$this->Hardware	= $q_r['Node']['hardware'];
				$this->Power	= $q_r['Node']['power'];

                $mesh->contain(
                    'Node.NodeMeshEntry',
                    'Node.NodeMeshExit',
                    'MeshExit.MeshExitMeshEntry',
                    'MeshEntry',
                    'NodeSetting',
                    'MeshSetting',
                    'MeshExit.MeshExitCaptivePortal'
                );
                $m          = $mesh->findById($mesh_id);

                $m['NodeDetail'] = $q_r['Node'];
                //print_r($m);
                $gw = false;
                if(isset($this->request->query['gateway'])){
                    if($this->request->query['gateway'] == 'true'){
                        $gw = true;
                    }
                }
                
                $json = $this->_build_json($m,$gw);
                $this->set(array(
                    'config_settings'   => $json['config_settings'],
                    'timestamp'         => $json['timestamp'],
                    'success' => true,
                    '_serialize' => array('config_settings','success','timestamp')
                ));

            }else{
                //Write this to an "unknown nodes" table....
                $this->set(array(
                    'error' => "MAC Address: ".$mac." not defined on system",
                    'success' => false,
                    '_serialize' => array('error','success')
                ));
            }

        }else{
             $this->set(array(
                'error' => "MAC Address of node not specified",
                'success' => false,
                '_serialize' => array('error','success')
            ));

        }
    }


    private function  _build_json($mesh,$gateway = false){

        //Basic structure
        $json = array();
        $json['timestamp']                      = 1; //FIXME replace with the last change timestamp
        $json['config_settings']                = array();
        $json['config_settings']['wireless']    = array();
        $json['config_settings']['network']     = array();
		$json['config_settings']['system']		= array();

        //============ Network ================
        $net_return         = $this->_build_network($mesh,$gateway);
        $json_network       = $net_return[0];
        $json['config_settings']['network'] = $json_network;

        //=========== Wireless ===================
        $entry_data         = $net_return[1];
        $json_wireless      = $this->_build_wireless($mesh,$entry_data);
        $json['config_settings']['wireless'] = $json_wireless;

        //========== Gateway or NOT? ======
        if($gateway){   
            $json['config_settings']['gateways']        = $net_return[2]; //Gateways
            $json['config_settings']['captive_portals'] = $net_return[3]; //Captive portals
        }

		//======== System related settings ======
		$system_data 		= $this->_build_system($mesh);
		$json['config_settings']['system'] = $system_data;

		//====== Batman-adv specific config settings ======

        $batman_adv       = Configure::read('mesh_settings'); //Read the defaults
		if($mesh['MeshSetting']['id']!=null){
			unset($mesh['MeshSetting']['id']);
			unset($mesh['MeshSetting']['mesh_id']);
			unset($mesh['MeshSetting']['created']);
			unset($mesh['MeshSetting']['modified']);
			$batman_adv = $mesh['MeshSetting'];
		}
		$json['config_settings']['batman_adv'] = $batman_adv;


		//=====What if is a MP2 -> do we have settings for the mesh_potato?
		if(
			($this->Hardware == 'mp2_phone')||
			($this->Hardware == 'mp2_basic')
		){
			$mp_data 								= $this->_build_mesh_potato($mesh);
			$json['config_settings']['mesh_potato'] = $mp_data;
		}

        return $json; 
    }

	private function _build_system($mesh){
		//Get the root password
		$ss = array();
		if($mesh['NodeSetting']['password_hash'] != ''){
			$ss['password_hash'] 		= $mesh['NodeSetting']['password_hash'];
			$ss['heartbeat_interval']	= $mesh['NodeSetting']['heartbeat_interval'];
			$ss['heartbeat_dead_after']	= $mesh['NodeSetting']['heartbeat_dead_after'];

		}else{
			$data = Configure::read('common_node_settings'); //Read the defaults
			$ss['password_hash'] 		= $data['password_hash'];
			$ss['heartbeat_interval']	= $data['heartbeat_interval'];
			$ss['heartbeat_dead_after']	= $data['heartbeat_dead_after'];
		}

		foreach($mesh['Node'] as $n){
			if($n['id'] == $this->NodeId){
				$ss['hostname'] = $n['name'];
				break;
			}
		}
		//print_r($mesh);
		return $ss;
	}

    private function _build_network($mesh,$gateway = false){

        $network 				= array();
        $nat_data				= array();
        $captive_portal_data 	= array();


//=================================

        //loopback if
        array_push( $network,
            array(
                "interface"    => "loopback",
                "options"   => array(
                    "ifname"        => "lo",
                    "type"          => "bridge",
                    "proto"         => "static",
                    "ipaddr"        => "127.0.0.1",
                    "netmask"       => "255.0.0.0"
               )
            ));

//---------------------
		//We add a new feature - we can specify for NON Gateway nodes to which their LAN port should be connected with
		if($mesh['NodeSetting']['eth_br_chk'] != ''){
			$eth_br_chk 		= $mesh['NodeSetting']['eth_br_chk'];
			$eth_br_with	    = $mesh['NodeSetting']['eth_br_with'];
			$eth_br_for_all	    = $mesh['NodeSetting']['eth_br_for_all'];
		}else{
			$c_n_s 				= Configure::read('common_node_settings'); //Read the defaults
			$eth_br_chk 		= $c_n_s['eth_br_chk'];
			$eth_br_with	    = $c_n_s['eth_br_with'];
			$eth_br_for_all	    = $c_n_s['eth_br_for_all'];
		}

		$lan_bridge_flag 	= false;

		//If we need to bridge and it is with the LAN (the easiest)
		if(
			($eth_br_chk)&&
			($eth_br_with == 0)
		){
			$lan_bridge_flag = true;
		}

        //LAN
		$br_int = $this->_eth_br_for($this->Hardware);
		if($lan_bridge_flag){
			$br_int = "$br_int bat0.100";
		}
//----------------------


        array_push( $network,
            array(
                "interface"    => "lan",
                "options"   => array(
                    "ifname"        => "$br_int", 
                    "type"          => "bridge",
                    "proto"         => "dhcp"
               )
            ));

        //Mesh
        array_push( $network,
            array(
                "interface"    => "mesh",
                "options"   => array(
                    "ifname"    => "mesh0",
                    "mtu"       => "1560",
                    "proto"     => "batadv",
                    "mesh"      => "bat0"
               )
            ));

        $ip = $mesh['NodeDetail']['ip'];

        //Admin interface
        array_push($network,
            array(
                "interface"    => "one",
                "options"   => array(
                    "ifname"    => "bat0.1",
                    "proto"     => "static",
                    "ipaddr"    => $ip,
                    "netmask"   => "255.255.255.0",
                    "type"      => "bridge"
               )
            ));

//================================

        //Now we will loop all the defined exits **that has entries assigned** to them and add them as bridges as we loop. 
        //The members of these bridges will be determined by which entries are assigned to them and specified
        //in the wireless configuration file

        $start_number = 2;

        //We create a data structure which will be used to add the entry points and bridge them with
        //The correct network defined here
        $entry_point_data = array();

        

     //   print_r($mesh['MeshExit']);

        //Add the auto-attach entry points
        foreach($mesh['MeshExit'] as $me){

            $has_entries_attached   = false;
            $if_name                = 'ex_'.$this->_number_to_word($start_number);
            $exit_id                = $me['id'];
            $type                   = $me['type'];
            $vlan                   = $me['vlan'];

            //This is used to fetch info eventually about the entry points
            if(count($me['MeshExitMeshEntry']) > 0){
                $has_entries_attached = true;
                foreach($me['MeshExitMeshEntry'] as $entry){
                    if(($type == 'bridge')&&($gateway)){ //The gateway needs the entry points to be bridged to the LAN
                        array_push($entry_point_data,array('network' => 'lan','entry_id' => $entry['mesh_entry_id']));
                    }else{
                        array_push($entry_point_data,array('network' => $if_name,'entry_id' => $entry['mesh_entry_id']));
                    }
                }
            }
            
            if($has_entries_attached == true){

				//____ Check if we need to bridge the Ethernet ports ____
				if(
					($eth_br_chk)&&
					($eth_br_with != 0)
				){
					if(
						($exit_id == $eth_br_with)&&
						(!$gateway)		//Bridge only non gateway nodes's LANs
					){
						$n_count = 0;
						foreach($network as $nw){
							if($nw['interface'] == 'lan'){
								$current = $network[$n_count]['options']['ifname'];
								$network[$n_count]['options']['ifname'] ="$current bat0.".$start_number;
								break;
							}
							$n_count++;	
						}
					}
				}

                //=======================================
                //========= GATEWAY NODES ===============
                //=======================================

                if(($type == 'tagged_bridge')&&($gateway)){

					$br_int = $this->_eth_br_for($this->Hardware);
					if(preg_match('/eth1/', $br_int)){	//If it has two add both
                    	$interfaces =  "bat0.".$start_number." eth0.".$vlan." eth1.".$vlan;
					}else{
						$interfaces =  "bat0.".$start_number." eth0.".$vlan; //only one
					}
                    array_push($network,
                        array(
                            "interface"    => "$if_name",
                            "options"   => array(
                                "ifname"    => $interfaces,
                                "type"      => "bridge"
                        ))
                    );
                    $start_number++;
                    continue;   //We don't car about the other if's
                }

                if(($type == 'nat')&&($gateway)){

                    $interfaces =  "bat0.".$start_number;
                    array_push($network,
                        array(
                            "interface"    => "$if_name",
                            "options"   => array(
                                "ifname"    => $interfaces,
                                "type"      => "bridge",
                                'ipaddr'    =>  "10.200.".(100+$start_number).".1",
                                'netmask'   =>  "255.255.255.0",
                                'proto'     => 'static'
                        ))
                    );
                    //Push the nat data
                    array_push($nat_data,$if_name);
                    $start_number++;
                    continue; //We dont care about the other if's
                }

                if(($type=='bridge')&&($gateway)){
                    $current_interfaces = $network[1]['options']['ifname'];
                    $interfaces =  "bat0.".$start_number;
                    $network[1]['options']['ifname'] = $current_interfaces." ".$interfaces;
                    $start_number++;
                    continue; //We dont care about the other if's
                }

                if(($type == 'captive_portal')&&($gateway)){

                    //Add the captive portal's detail
                    if($type =='captive_portal'){
                        $a = $me['MeshExitCaptivePortal'];
                        $a['hslan_if'] = 'br-'.$if_name;
                        $a['network']  = $if_name;
                        array_push($captive_portal_data,$a);             
                    }

                    $interfaces =  "bat0.".$start_number;
                    array_push($network,
                        array(
                            "interface"    => "$if_name",
                            "options"   => array(
                                "ifname"    => $interfaces,
                                "type"      => "bridge" 
                        ))
                    );
                    $start_number++;
                    continue; //We dont care about the other if's

                }


                //=======================================
                //==== STANDARD NODES ===================
                //=======================================

                if(($type == 'nat')||($type == 'tagged_bridge')||($type == 'bridge')||($type =='captive_portal')){
                    $interfaces =  "bat0.".$start_number;
                    array_push($network,
                        array(
                            "interface"    => "$if_name",
                            "options"   => array(
                                "ifname"    => $interfaces,
                                "type"      => "bridge" 
                        ))
                    );
                    $start_number++;
                    continue; //We dont care about the other if's
                }

            }
        }

        return array($network,$entry_point_data,$nat_data,$captive_portal_data);
    }


    private function _build_wireless($mesh,$entry_point_data){

        $wireless = array();

        //Get the channel
        $channel    = $mesh['NodeSetting']['two_chan'];
	
		//Hardware mode for 5G
		$hwmode		= '11ng';	//Sane default
		$hw_temp    = $this->_get_hardware_setting($this->Hardware,'hwmode');
		if($hw_temp){
			$hwmode	= $hw_temp;
		}

		//Channel (if 5)
		if($this->_get_hardware_setting($this->Hardware,'five')){
			$channel    = $mesh['NodeSetting']['five_chan'];
		}

        //The radio's channel
		//Get the power - If the node settings has it to apply to all we do not consider the node's individual power setting
		//The dbm value also depends on the node's hardware
		if($mesh['NodeSetting']['all_power'] == 1){
			$power_perc = $mesh['NodeSetting']['power'];
			$db_power   = $this->_db_power_for($this->Hardware,$power_perc);
		}else{
			$db_power   = $this->_db_power_for($this->Hardware,$this->Power);
		}

        array_push( $wireless,
                array(
                    "wifi-device"   => "radio0",
                    "options"       => array(
                        'channel'       => $channel,
                        'disabled'      => 0,
                        'hwmode'        => $hwmode,
						'txpower'		=> $db_power
                    ),
                    'lists'          => array(
                        //array('name'    => 'ht_capab', 'value'  => 'SHORT-GI-20'),
                        //array('name'    => 'ht_capab', 'value'  => 'SHORT-GI-40'),  
                        //array('name'    => 'ht_capab', 'value'  => 'RX-STBC1'),
                        //array('name'    => 'ht_capab', 'value'  => 'DSSS_CCK-40')  
                    )
                ));


        //Get the mesh's BSSID and SSID
        $bssid      = $mesh['Mesh']['bssid'];
        $ssid       = $mesh['Mesh']['ssid'];

        //Add the ad-hoc if for mesh
        $zero = $this->_number_to_word(0);
        array_push( $wireless,
                array(
                    "wifi-iface"   => "$zero",
                    "options"       => array(
                        "device"        => "radio0",
                        "ifname"        => "mesh0",
                        "network"       => "mesh",
                        "mode"          => "adhoc",
                        "ssid"          => $ssid,
                        "bssid"         => $bssid
                    )
                ));

        //Add the hidden config VAP
        $one = $this->_number_to_word(1);
        array_push( $wireless,
                array(
                    "wifi-iface"    => "$one",
                    "options"   => array(
                        "device"        => "radio0",
                        "ifname"        => "$one"."0",
                        "mode"          => "ap",
                        "encryption"    => "psk-mixed",
                        "network"       => $one,
                        "ssid"          => "meshdesk_config",
                        "key"           => "radiusdesk",
                        "hidden"        => "1"
                   )
                ));

        $start_number = 2;

        //Check if we need to add this wireless VAP
        foreach($mesh['MeshEntry'] as $me){
            $to_all     = false;
            $if_name    = $this->_number_to_word($start_number);
            $entry_id   = $me['id'];
            $start_number++;
            if($me['apply_to_all'] == 1){

                //Check if it is assigned to an exit point
                foreach($entry_point_data as $epd){
                    if($epd['entry_id'] == $entry_id){ //We found our man :-)
                        array_push( $wireless,
                            array(
                                "wifi-iface"    => "$if_name",
                                "options"   => array(
                                    "device"        => "radio0",
                                    "ifname"        => "$if_name"."0",
                                    "mode"          => "ap",
                                    "network"       => $epd['network'],
                                    "encryption"    => $me['encryption'],
                                    "ssid"          => $me['name'],
                                    "key"           => $me['key'],
                                    "hidden"        => $me['hidden'],
                                    "isolate"       => $me['isolate'],
                                    "auth_server"   => $me['auth_server'],
                                    "auth_secret"   => $me['auth_secret']
                               )
                            ));
                        break;
                    }
                }
            }else{
                //Check if this entry point is statically attached to the node
               // print_r($mesh['Node']);
                foreach($mesh['Node'] as $node){
                    if($node['id'] == $this->NodeId){   //We have our node
                        foreach($node['NodeMeshEntry'] as $nme){
                            if($nme['mesh_entry_id'] == $entry_id){
                                //Check if it is assigned to an exit point
                                foreach($entry_point_data as $epd){
                                    //We have a hit; we have to  add this entry
                                    if($epd['entry_id'] == $entry_id){ //We found our man :-)
                                        array_push( $wireless,
                                            array(
                                                "wifi-iface"    => "$if_name",
                                                "options"   => array(
                                                    "device"        => "radio0",
                                                    "ifname"        => "$if_name"."0",
                                                    "mode"          => "ap",
                                                    "network"       => $epd['network'],
                                                    "encryption"    => $me['encryption'],
                                                    "ssid"          => $me['name'],
                                                    "key"           => $me['key'],
                                                    "hidden"        => $me['hidden'],
                                                    "isolate"       => $me['isolate'],
                                                    "auth_server"   => $me['auth_server'],
                                                    "auth_secret"   => $me['auth_secret']
                                               )
                                            ));
                                            break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
       // print_r($wireless);
        return $wireless;
    }

	private function _build_mesh_potato($mesh){

		$mp_settings = array();
		$node_mp_setting	= ClassRegistry::init('NodeMpSetting');
		$node_mp_setting->contain();
		$q_r	= $node_mp_setting->find('all', array('conditions' => array('NodeMpSetting.node_id' => $this->NodeId)));
		foreach($q_r as $i){
			$key = $i['NodeMpSetting']['name'];
			$val = $i['NodeMpSetting']['value'];
			$mp_settings["$key"] = $val;
		}
		return $mp_settings;
	}

    private function _number_to_word($number) {
   
   
        $dictionary  = array(
            0                   => 'zero',
            1                   => 'one',
            2                   => 'two',
            3                   => 'three',
            4                   => 'four',
            5                   => 'five',
            6                   => 'six',
            7                   => 'seven',
            8                   => 'eight',
            9                   => 'nine',
            10                  => 'ten',
            11                  => 'eleven',
            12                  => 'twelve',
            13                  => 'thirteen',
            14                  => 'fourteen',
            15                  => 'fifteen',
            16                  => 'sixteen',
            17                  => 'seventeen',
            18                  => 'eighteen',
            19                  => 'nineteen',
            20                  => 'twenty'
        );

        return($dictionary[$number]);
    }

	private function _db_power_for($hw,$power_perc){
		$return_val = 10; //some default
		$ct = Configure::read('hardware');
        foreach($ct as $i){
            if($i['id'] ==$hw){
				$return_val = intval($i['max_power'] *($power_perc/100));
				break;
            }
        }
		return $return_val;
	}

	private function _get_hardware_setting($hw,$setting){
		$return_val = false; //some default
		$ct = Configure::read('hardware');
        foreach($ct as $i){
            if($i['id'] ==$hw){
				$return_val = $i["$setting"];
				break;
            }
        }
		return $return_val;
	}

	private function _eth_br_for($hw){
		$return_val = 'eth0'; //some default
		$ct = Configure::read('hardware');
        foreach($ct as $i){
            if($i['id'] ==$hw){
				$return_val = $i['eth_br'];
				break;
            }
        }
		return $return_val;
	}

}
