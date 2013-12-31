<?php
App::uses('AppController', 'Controller');

class NodesController extends AppController {

    public $name    = 'Nodes';
    public $uses    = array('Mesh');
    public $components  = array('OpenWrt');

   protected $NodeId = '';

/*
    public function get_config(){

        $items      = array();
        $items    = $this->OpenWrt->getEntries('koos');

      //  array_push($items,array('action'=>'execute','data'=> 'ls -l'));
    
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }
*/

    public function get_config_for_node(){

        if(isset($this->request->query['mac'])){

            $mac    = $this->request->query['mac'];
            $node   = ClassRegistry::init('Node');
            $mesh   = ClassRegistry::init('Mesh');
            $node->contain();
            $q_r    = $node->findByMac($mac);

            if($q_r){
               // print_r($q_r);
                $mesh_id        = $q_r['Node']['mesh_id'];
                $this->NodeId   = $q_r['Node']['id'];
                $mesh->contain('Node.NodeMeshEntry','Node.NodeMeshExit','MeshExit','MeshEntry','NodeSetting','MeshSetting');
                $m          = $mesh->findById($mesh_id);

                $m['NodeDetail'] = $q_r['Node'];
                //print_r($m);
                $json = $this->_build_json($m);
                $this->set(array(
                    'config_settings'   => $json['config_settings'],
                    'timestamp'         => $json['timestamp'],
                    'success' => true,
                    '_serialize' => array('config_settings','success','timestamp')
                ));

            }else{
                //Write this to an "unknown nodes" table....
                $this->set(array(
                    'error' => "MAC Address: ".$node_id." not defined on system",
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


    private function  _build_json($mesh){

        //Basic structure
        $json = array();
        $json['timestamp']                      = 1; //FIXME replace with the last change timestamp
        $json['config_settings']                = array();
        $json['config_settings']['wireless']    = array();
        $json['config_settings']['network']     = array();

        //========== WIRELESS ===========
        //Get the channel
        $channel    = $mesh['NodeSetting']['two_chan'];
        //The radio's channel
        array_push( $json['config_settings']['wireless'],
                array(
                    "wifi-device"   => "radio0",
                    "options"       => array(
                        'channel'       => $channel,
                        'disabled'      => 0
                    )
                ));

        //Get the mesh's BSSID and SSID
        $bssid      = $mesh['Mesh']['bssid'];
        $ssid       = $mesh['Mesh']['ssid'];

        //Add the ad-hoc if for mesh
        $zero = $this->_number_to_word(0);
        array_push( $json['config_settings']['wireless'],
                array(
                    "wifi-iface"   => "$zero",
                    "options"       => array(
                        "device"        => "radio0",
                        "network"       => "mesh",
                        "mode"          => "adhoc",
                        "ssid"          => $ssid,
                        "bssid"         => $bssid
                    )
                ));

        //Add the hidden config VAP
        $one = $this->_number_to_word(1);
        array_push( $json['config_settings']['wireless'],
                array(
                    "wifi-iface"    => "$one",
                    "options"   => array(
                        "device"        => "radio0",
                        "mode"          => "ap",
                        "encryption"    => "psk-mixed",
                        "network"       => $one,
                        "ssid"          => "meshdesk_config",
                        "key"           => "radiusdesk",
                        "hidden"        => "1"
                   )
                ));

        $start_number = 2;
        //Add the auto-attach entry points
        foreach($mesh['MeshEntry'] as $me){
            $to_all     = false;
            $if_name    = $this->_number_to_word($start_number);
            $entry_id   = $me['id'];
            $start_number++;
            if($me['apply_to_all'] == 1){
                array_push( $json['config_settings']['wireless'],
                    array(
                        "wifi-iface"    => "$if_name",
                        "options"   => array(
                            "device"        => "radio0",
                            "mode"          => "ap",
                            "network"       => $if_name,
                            "encryption"    => $me['encryption'],
                            "ssid"          => $me['name'],
                            "key"           => $me['key'],
                            "hidden"        => $me['hidden'],
                            "isolate"       => $me['isolate'],
                            "auth_server"   => $me['auth_server'],
                            "auth_secret"   => $me['auth_secret']
                       )
                    ));
            }else{
                //Check if this entry point is statically attached to the node
              //  print_r($mesh['Node']);
                foreach($mesh['Node'] as $node){
                    if($node['id'] == $this->NodeId){   //We have our node
                        foreach($node['NodeMeshEntry'] as $nme){
                            if($nme['mesh_entry_id'] == $entry_id){
                                //We have a hit; we have to  add this entry
                                array_push( $json['config_settings']['wireless'],
                                    array(
                                        "wifi-iface"    => "$if_name",
                                        "options"   => array(
                                            "device"        => "radio0",
                                            "mode"          => "ap",
                                            "network"       => $if_name,
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
                        break;
                    }
                }
            }
        }


        //============ NETWORK ================
        $json['config_settings']['network'] = $this->_build_network($mesh);
        return $json; 
    }

    private function _build_network($mesh){

        $network = array();
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

        //LAN
        array_push( $network,
            array(
                "interface"    => "lan",
                "options"   => array(
                    "ifname"        => "eth0 eth1",
                    "type"          => "bridge",
                    "proto"         => "dhcp"
               )
            ));

        //Mesh
        array_push( $network,
            array(
                "interface"    => "mesh",
                "options"   => array(
                    "ifname"    => "wlan0",
                    "mtu"       => "1544",
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

        //Now we will loop all the entries and add bridges as we loop

        $start_number = 2;
        //Add the auto-attach entry points
        foreach($mesh['MeshEntry'] as $me){
            $to_all     = false;
            $if_name    = $this->_number_to_word($start_number);
            $entry_id   = $me['id'];
            
            if($me['apply_to_all'] == 1){
                array_push($network,
                array(
                    "interface"    => "$if_name",
                    "options"   => array(
                        "ifname"    => "bat0.".$start_number,
                        "type"      => "bridge"
                   )
                ));
            }else{
                //Check if this entry point is statically attached to the node
              //  print_r($mesh['Node']);
                foreach($mesh['Node'] as $node){
                    if($node['id'] == $this->NodeId){   //We have our node
                        foreach($node['NodeMeshEntry'] as $nme){
                            if($nme['mesh_entry_id'] == $entry_id){
                                //We have a hit; we have to  add this entry
                                if($me['apply_to_all'] == 1){
                                    array_push($network,
                                    array(
                                        "interface"    => "$if_name",
                                        "options"   => array(
                                            "ifname"    => "bat0.".$start_number,
                                            "type"      => "bridge"
                                       )
                                    ));
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            $start_number++;
        }

        return $network;
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

}
