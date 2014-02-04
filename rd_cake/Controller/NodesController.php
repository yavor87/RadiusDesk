<?php
App::uses('AppController', 'Controller');

class NodesController extends AppController {

    public $name        = 'Nodes';
    public $uses        = array('Mesh');
    public $components  = array('OpenWrt');
    protected $NodeId   = '';


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
                $mesh->contain('Node.NodeMeshEntry','Node.NodeMeshExit','MeshExit.MeshExitMeshEntry','MeshEntry','NodeSetting','MeshSetting');
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


    private function  _build_json($mesh,$gateway = false){

        //Basic structure
        $json = array();
        $json['timestamp']                      = 1; //FIXME replace with the last change timestamp
        $json['config_settings']                = array();
        $json['config_settings']['wireless']    = array();
        $json['config_settings']['network']     = array();

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
            $json['config_settings']['gateways'] =$net_return[2];
        }

        return $json; 
    }

    private function _build_network($mesh,$gateway = false){

        $network = array();
        $nat_data= array();
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

        //Now we will loop all the defined exits **that has entries assigned** to them and add them as bridges as we loop. 
        //The members of these bridges will be determined by which entries are assigned to them and specified
        //in the wireless configuration file

        $start_number = 2;

        //We create a data structure which will be used to add the entry points and bridge them with
        //The correct network defined here
        $entry_point_data = array();

        //Add the auto-attach entry points
        foreach($mesh['MeshExit'] as $me){

            $has_entries_attached   = false;
            $if_name                = 'ex_'.$this->_number_to_word($start_number);
            $entry_id               = $me['id'];
            $type                   = $me['type'];
            $vlan                   = $me['vlan'];

            //This is used to fetch info eventually about the entry points
            if(count($me['MeshExitMeshEntry']) >= 0){
                $has_entries_attached = true;
                foreach($me['MeshExitMeshEntry'] as $entry){
                    array_push($entry_point_data,array('network' => $if_name,'entry_id' => $entry['mesh_entry_id']));
                }
            }
            
            if($has_entries_attached){

                //print($type);
                //If type == tagged_bridge and it is a gateway; bridge it with a tagged ethernet IF
                if(($type == 'tagged_bridge')&&($gateway)){
                    $interfaces =  "bat0.".$start_number." eth0.".$vlan." eth1.".$vlan;
                    array_push($network,
                        array(
                            "interface"    => "$if_name",
                            "options"   => array(
                                "ifname"    => $interfaces,
                                "type"      => "bridge"
                        ))
                    );

                }elseif($type == 'nat'){
                    if($gateway==true){
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

                    }else{
                        $interfaces =  "bat0.".$start_number;
                        array_push($network,
                            array(
                                "interface"    => "$if_name",
                                "options"   => array(
                                    "ifname"    => $interfaces,
                                    "type"      => "bridge" 
                            ))
                        );
                    }

                }else{
                    $interfaces =  "bat0.".$start_number;
                    array_push($network,
                    array(
                        "interface"    => "$if_name",
                        "options"   => array(
                            "ifname"    => $interfaces,
                            "type"      => "bridge"
                       )
                    ));
                }
                array_push($network,
                    array(
                        "interface"    => "$if_name",
                        "options"   => array(
                            "ifname"    => $interfaces,
                            "type"      => "bridge"
                       )
                    ));
                $start_number++;
            }
        }
        //print_r($entry_point_data);

        return array($network,$entry_point_data,$nat_data);
    }


    private function _build_wireless($mesh,$entry_point_data){

        $wireless = array();

        //Get the channel
        $channel    = $mesh['NodeSetting']['two_chan'];
        //The radio's channel
        array_push( $wireless,
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
        array_push( $wireless,
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
        array_push( $wireless,
                array(
                    "wifi-iface"    => "$one",
                    "options"   => array(
                        "device"        => "radio0",
                        "mode"          => "ap",
                        "encryption"    => "psk-mixed",
                        "network"       => $one,
                        "ssid"          => "meshdesk_config",
                        "key"           => "radiusdesk",
                        "hidden"        => "0"
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
