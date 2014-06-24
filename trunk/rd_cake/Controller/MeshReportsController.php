<?php
class MeshReportsController extends AppController {

    public $name    = 'MeshReports';
    public $uses    = array('Node','NodeLoad','NodeStation','NodeSystem','MeshEntry','NodeIbssConnection');

    public function submit_report(){

        $this->log('Got a new report submission', 'debug');
        $this->_new_report();
        file_put_contents('/tmp/mesh_report.txt', print_r($this->request->data, true));
        $this->set(array(
           // 'items' => $this->request->data,
            'items' => array(),
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

    public function view_entries(){

        $items  = array();
        $id     = 1;

        if(isset($this->request->query['mesh_id'])){
           
            //Find all the entries for this mesh
            $mesh_id = $this->request->query['mesh_id'];
            $this->MeshEntry->contain('Mesh');
            $q_r = $this->MeshEntry->find('all',array('conditions' => array(
                'MeshEntry.mesh_id' => $mesh_id
            )));

            //Find all the distinct MACs for this Mesh entry...
            foreach($q_r as $i){
                $mesh_entry_id  = $i['MeshEntry']['id'];
                $entry_name     = $i['MeshEntry']['name'];
                $q_s = $this->NodeStation->find('all',array(
                    'conditions'    => array(
                        'NodeStation.mesh_entry_id' => $mesh_entry_id
                    ),
                    'fields'        => array(
                        'DISTINCT(mac)'
                    )
                ));

                if($q_s){

                    foreach($q_s as $j){
                        $mac = $j['NodeStation']['mac'];
                        //Get the sum of Bytes and avg of signal
                        $q_t = $this->NodeStation->find('first', array(
                            'conditions'    => array(
                                'NodeStation.mac'           => $mac,
                                'NodeStation.mesh_entry_id' => $mesh_entry_id
                            ),
                            'fields'    => array(
                                'SUM(NodeStation.tx_bytes) as tx_bytes',
                                'SUM(NodeStation.rx_bytes)as rx_bytes',
                                'AVG(NodeStation.signal_avg)as signal_avg',
                            )
                        ));
                       // print_r($q_t);
                        $t_bytes    = $q_t[0]['tx_bytes'];
                        $r_bytes    = $q_t[0]['rx_bytes'];
                        $signal_avg = $q_t[0]['signal_avg']; 

                        //Get the latest entry
                        $lastCreated = $this->NodeStation->find('first', array(
                            'conditions'    => array(
                                'NodeStation.mac'           => $mac,
                                'NodeStation.mesh_entry_id' => $mesh_entry_id
                            ),
                            'order' => array('NodeStation.created' => 'desc')
                        ));

                        array_push($items,array(
                            'id'                => $id,
                            'name'              => $entry_name, 
                            'mesh_entry_id'     => $mesh_entry_id, 
                            'mac'               => $mac,
                            'tx_bytes'          => $t_bytes,
                            'rx_bytes'          => $r_bytes, 
                            'signal_avg'        => $signal_avg ,
                            'signal'            => $lastCreated['NodeStation']['signal'],
                            'tx_bitrate'        => $lastCreated['NodeStation']['tx_bitrate'],
                            'rx_bitrate'        => $lastCreated['NodeStation']['rx_bitrate'],
                            'vendor'            => $lastCreated['NodeStation']['vendor']
                        ));
                        $id++;
                    }
                }else{
                     array_push($items,array(
                            'id'                => $id,
                            'name'              => $entry_name, 
                            'mesh_entry_id'     => $mesh_entry_id, 
                            'mac'               => 'NA',
                            'tx_bytes'          => 0,
                            'rx_bytes'          => 0, 
                            'signal_avg'        => 'NA' ,
                            'signal'            => 'NA',
                            'tx_bitrate'        => 0,
                            'rx_bitrate'        => 0,
                            'vendor'            => 'NA'
                        ));
                        $id++;


                }            
            }
        }

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }


    //---------- Private Functions --------------

    private function _new_report(){

        //--- Check if the 'network_info' array is in the data ----
        $this->log('Checking for network_info in log', 'debug');
        if(array_key_exists('network_info',$this->request->data)){
            $this->log('Found network_info', 'debug');
            foreach($this->request->data['network_info'] as $ni){
                $id = $this->_format_mac($ni['eth0']);
                $this->log('Locating the node with MAC '.$id, 'debug');
                $this->Node->contain();
                $q_r = $this->Node->findByMac($id);
                if($q_r){
                    $node_id = $q_r['Node']['id'];
                    $mesh_id    = $q_r['Node']['mesh_id'];
                    $this->log('The node id of '.$id.' is '.$node_id, 'debug');
                    $rad_zero_int = $ni['radios'][0]['interfaces'];
                    $this->_do_radio_interfaces($mesh_id,$node_id,$rad_zero_int);
                }else{
                    $this->log('Node with MAC '.$id.' was not found', 'debug');
                }
            }
        }

       
        //--- Check if the 'system_info' array is in the data ----
        $this->log('Checking for system_info in log', 'debug');
        if(array_key_exists('system_info',$this->request->data)){
            $this->log('Found system_info', 'debug');
            foreach($this->request->data['system_info'] as $si){
                $id = $this->_format_mac($si['eth0']);
                $this->log('Locating the node with MAC '.$id, 'debug');
                $this->Node->contain();
                $q_r = $this->Node->findByMac($id);
                if($q_r){
                    $node_id    = $q_r['Node']['id'];
                    $this->log('The node id of '.$id.' is '.$node_id, 'debug');
                    $this->_do_node_system_info($node_id,$si['sys']);
                    $this->_do_node_load($node_id,$si['sys']);
                }else{
                    $this->log('Node with MAC '.$id.' was not found', 'debug');
                }
            }  
        }
    }

    private function _do_radio_interfaces($mesh_id,$node_id,$interfaces){

        foreach($interfaces as $i){
            if(count($i['stations']) > 0){
                //Try to find (if type=AP)the Entry ID of the Mesh
                if($i['type'] == 'AP'){
                    $this->MeshEntry->contain();
                    $q_r = $this->MeshEntry->find('first', array(
                        'conditions'    => array(
                            'MeshEntry.name'    => $i['ssid'],
                            'MeshEntry.mesh_id' => $mesh_id
                        )
                    ));

                    if($q_r){
                        $entry_id = $q_r['MeshEntry']['id'];
                        foreach($i['stations'] as $s){
                            $data = $this->_prep_station_data($s);
                            $data['mesh_entry_id']  = $entry_id;
                            $data['node_id']        = $node_id;
                            $this->NodeStation->create();   
                            $this->NodeStation->save($data);
                        }
                    }
                }

                //If the type is IBSS we will try to determine which nodes are connected
                if($i['type'] == 'IBSS'){
                     foreach($i['stations'] as $s){
                            $data = $this->_prep_station_data($s);
                            $data['node_id']        = $node_id;
                            $this->NodeIbssConnection->create();   
                            $this->NodeIbssConnection->save($data);
                     }
                }
                    
            }
        }
    }

    private function _do_node_load($node_id,$info){
        $this->log('====Doing the node load info for===: '.$node_id, 'debug');
        $mem_total  = $this->_mem_kb_to_bytes($info['memory']['total']);
        $mem_free   = $this->_mem_kb_to_bytes($info['memory']['free']);
        $u          = $info['uptime'];
        $time       = preg_replace('/\s+up.*/', "", $u);
        $load       = preg_replace('/.*.\s+load average:\s+/', "", $u);
        $loads      = explode(", ",$load);
        $up         = preg_replace('/.*\s+up\s+/', "", $u);
        $up         = preg_replace('/,\s*.*/', "", $up);
        $data       = array();
        $data['mem_total']  = $mem_total;
        $data['mem_free']   = $mem_free;
        $data['uptime']     = $up;
        $data['system_time']= $time;
        $data['load_1']     = $loads[0];
        $data['load_2']     = $loads[1];
        $data['load_3']     = $loads[2];
        $data['node_id']    = $node_id;
        $this->NodeLoad->create();   
        $this->NodeLoad->save($data);
    }

    private function _do_node_system_info($node_id,$info){
        $this->log('Doing the system info for node id: '.$node_id, 'debug');

        $q_r = $this->NodeSystem->findByNodeId($node_id);
        if(!$q_r){
            $this->log('EMPTY NodeSystem - Add first one', 'debug');
            $this->_new_node_system($node_id,$info);

        }else{
            $this->log('NodeSystem info exists - Update if needed', 'debug');
            //We will check the value of DISTRIB_REVISION
            $dist_rev = false;
            if(array_key_exists('release',$info)){ 
                $release_array = explode("\n",$info['release']);
                foreach($release_array as $r){  
                    $this->log("There are ".$r, 'debug'); 
                    $r_entry    = explode('=',$r);
                    $elements   = count($r_entry);
                    if($elements == 2){
                        $value          = preg_replace('/"|\'/', "", $r_entry[1]);
                        if(preg_match('/DISTRIB_REVISION/',$r_entry[0])){
                            $dist_rev = $value;
                            $this->log('Submitted DISTRIB_REVISION '.$dist_rev, 'debug');
                            break;
                        }
                        
                    }
                }
            }

            //Find the current  DISTRIB_REVISION
            $q_r = $this->NodeSystem->find('first', array('conditions' => 
                        array(
                            'NodeSystem.node_id'    => $node_id,
                            'NodeSystem.name'       => 'DISTRIB_REVISION'
            )));        
            if($q_r){
                $current = $q_r['NodeSystem']['value'];

                $this->log('Current DISTRIB_REVISION '.$dist_rev, 'debug');
                if($current !== $dist_rev){
                    $this->log('Change in DISTRIB_REVISION -> renew', 'debug');
                    $this->NodeSystem->deleteAll(array('NodeSystem.node_id' => $node_id), false);
                    $this->_new_node_system($node_id,$info);
                }else{
                    $this->log('DISTRIB_REVISION unchanged', 'debug');
                }
            }
        }
    }

    private function _new_node_system($node_id,$info){
        //--CPU Info--
        if(array_key_exists('cpu',$info)){
             $this->log('Adding  CPU info', 'debug');
            foreach(array_keys($info['cpu']) as $key){
              //  $this->log('Adding first CPU info '.$key, 'debug');
                $this->NodeSystem->create();
                $d['group']     = 'cpu';
                $d['name']      = $key;
                $d['value']     = $info['cpu']["$key"];
                $d['node_id']   = $node_id;
                $this->NodeSystem->save($d);
            }
        }

        //--
        if(array_key_exists('release',$info)){ 

            $release_array = explode("\n",$info['release']);
            foreach($release_array as $r){  
               // $this->log("There are ".$r, 'debug'); 
                $r_entry    = explode('=',$r);
                $elements   = count($r_entry);
                if($elements == 2){
                   // $this->log('Adding  Release info '.$r, 'debug');
                    $value          = preg_replace('/"|\'/', "", $r_entry[1]);
                    $this->NodeSystem->create();
                    $d['group']     = 'release';
                    $d['name']      = $r_entry[0];
                    $d['value']     = $value;
                    $d['node_id']   = $node_id;
                    $this->NodeSystem->save($d);
                }
            }
        }           
    }

    private function _format_mac($mac){
        return preg_replace('/:/', '-', $mac);
    }

    private function _mem_kb_to_bytes($kb_val){
        $kb = preg_replace('/\s*kb/i', "", $kb_val);
        return($kb * 1024);
    }

    private function _prep_station_data($station_info){
        $data       = array();
        $tx_proc    = $station_info['tx bitrate'];
        $tx_bitrate = preg_replace('/\s+.*/','',$tx_proc);
        $tx_extra   = preg_replace('/.*\s+/','',$tx_proc);
        $rx_proc    = $station_info['rx bitrate'];
        $rx_bitrate = preg_replace('/\s+.*/','',$rx_proc);
        $rx_extra   = preg_replace('/.*\s+/','',$rx_proc);
        $incative   = preg_replace('/\s+ms.*/','',$station_info['inactive time']);
        $s          = preg_replace('/\s+\[.*/','',$station_info['signal']);
        $a          = preg_replace('/\s+\[.*/','',$station_info['avg']);

        $data['vendor']        = $this->_lookup_vendor($station_info['mac']);
        $data['mac']           = $station_info['mac'];
        $data['tx_bytes']      = $station_info['tx bytes'];
        $data['rx_bytes']      = $station_info['rx bytes'];
        $data['tx_packets']    = $station_info['tx packets'];
        $data['rx_packets']    = $station_info['rx packets'];
        $data['tx_bitrate']    = $tx_bitrate;
        $data['rx_bitrate']    = $rx_bitrate;
        $data['tx_extra_info'] = $tx_extra;
        $data['rx_extra_info'] = $rx_extra;
        $data['authorized']    = $station_info['authorized'];
        $data['authenticated'] = $station_info['authenticated'];
        $data['tdls_peer']     = $station_info['TDLS peer'];
        $data['preamble']      = $station_info['preamble'];
        $data['tx_failed']     = $station_info['tx failed'];
        $data['tx_failed']     = $station_info['tx failed'];
        $data['inactive_time'] = $incative;
        $data['WMM_WME']       = $station_info['WMM/WME'];
        $data['tx_retries']    = $station_info['tx retries'];
        $data['MFP']           = $station_info['MFP'];
        $data['signal']        = $s;
        $data['signal_avg']    = $a;
        return $data;
    }

    private function _lookup_vendor($mac){
        $vendor_file = APP.DS."Setup".DS."Scripts".DS."mac_lookup.txt";

        //Convert the MAC to be in the same format as the file 
        $mac    = strtoupper($mac);
        $pieces = explode(":", $mac);

        $big_match      = $pieces[0].":".$pieces[1].":".$pieces[2].":".$pieces[3].":".$pieces[4];
        $small_match    = $pieces[0].":".$pieces[1].":".$pieces[2];
        $lines          = file($vendor_file);

        $big_match_found = false;
        foreach($lines as $i){
            if(preg_match("/^$big_match/",$i)){
                $big_match_found = true;
                //Transform this line
                $vendor = preg_replace("/$big_match\s?/","",$i);
                $vendor = preg_replace( "{[ \t]+}", ' ', $vendor );
                $vendor = rtrim($vendor);
                return $vendor;   
            }
        }
       
        if(!$big_match_found){
            foreach($lines as $i){
                if(preg_match("/^$small_match/",$i)){
                    //Transform this line
                    $vendor = preg_replace("/$small_match\s?/","",$i);
                    $vendor = preg_replace( "{[ \t]+}", ' ', $vendor );
                    $vendor = rtrim($vendor);
                    return $vendor;
                }
            }
        }
        $vendor = "Unkown";
    }


}
?>
