<?php
class MeshReportsController extends AppController {

    public $name    = 'MeshReports';
    public $uses    = array('Node','NodeLoad','NodeStation','NodeSystem','MeshEntry','NodeIbssConnection','NodeSetting');

    public function submit_report(){

        //Source the vendors file and keep in memory
        $vendor_file        = APP.DS."Setup".DS."Scripts".DS."mac_lookup.txt";
        $this->vendor_list  = file($vendor_file);

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

	public function overview(){
		if(isset($this->request->query['mesh_id'])){

			$d 			= array();
			$mesh_id 	= $this->request->query['mesh_id'];

			//Find all the nodes for this mesh
			$this->Node->contain('NodeNeighbor');
			$q_r = $this->Node->find('all',array('conditions' => array('Node.mesh_id' => $mesh_id)));
			if($q_r){

				$d = array();

				$no_neighbors  	= true; //If none of the nodes has neighbor entries this will stay true
				$grey_list		= array(); //List of nodes with no neighbors

				foreach($q_r as $n){
					if(count($n['NodeNeighbor']) == 0){	//We handle nodes without any entries and grey nodes
						array_push($d,array(
							'id'	=> $n['Node']['id'],
							'name'	=> $n['Node']['name'],
							'data'	=> array(
								'$color'		=> "#5c88e0",
								'$type'			=> "circle",
								'$dim'			=> 10,
								'type'			=> 'no_neighbors',
								'description'	=> $n['Node']['description'],
								'mac'			=> $n['Node']['mac'],
								'hardware'		=> $n['Node']['hardware'],
								'ip'			=> $n['Node']['ip'],
								'last_contact'	=> $n['Node']['last_contact']
							)));
						array_push($grey_list,array( 'nodeTo' => $n['Node']['id'],'data' => array('$alpha'	=> 0.0)));
					}else{
						$no_neighbors 	= false;
						$adjacencies 	= array();
						$gw				= false;
						//Some defaults
						$color			= '#4bd765'; //light green
						$size			= 10;
						$type			= 'node';

						foreach($n['NodeNeighbor'] as $neighbor){
							if($neighbor['gateway'] == 'yes'){
								$gw = true;
							}
							array_push($adjacencies,array( 
								'nodeTo' 	=> $neighbor['neighbor_id'],
								'data' 		=> array(
									'$color'	=> "green",
									'$lineWidth'=> 6,
									'$alpha'	=> 0.5
								)
							));
						}

						if($gw){
							$type = 'gateway';
							$size = 20;
							$color= "#117c25"; 
						}

						array_push($d,array(
							'id'	=> $n['Node']['id'],
							'name'	=> $n['Node']['name'],
							'gw'	=> true,
							'data'	=> array(
								'$color'		=> $color,
								'$type'			=> "circle",
								'$dim'			=> $size,
								'type'			=> $type,
								'description'	=> $n['Node']['description'],
								'mac'			=> $n['Node']['mac'],
								'hardware'		=> $n['Node']['hardware'],
								'ip'			=> $n['Node']['ip'],
								'last_contact'	=> $n['Node']['last_contact']
							),
							'adjacencies'		=> $adjacencies
						));
					}
				}

				if($no_neighbors){
					array_push($d,array(
						'id'	=> 'center',
						'name'	=> '',
						'data'	=> array(
							'$color'	=> "grey",
							'$type'		=> "circle",
							'$dim'		=> 0
						),
						'adjacencies'	=> $grey_list
					));
				}else{
					//Attach those to the list of adjacencies of the gateway node
					$count = 0;
					foreach($d as $item){
						//Attach to the first one
						if(isset($item['gw'])){

							if(isset($item['adjacencies'])){
								
								$d[$count]['adjacencies'] = array_merge((array)$item['adjacencies'],(array)$grey_list);

							}else{
								$d[$count]['adjacencies'] = $grey_list;
							}
						}
						$count ++;
					}
				}
				//print_r($q_r);
				
			}else{
				$d = array(
					array(
						'id' 	=> "empty1",
						'name' 	=> "Please add nodes.....",
						'data'	=> array(
							'$color' 	=> "#f8d908",
							'$type'		=> "star",
							'$dim'		=> 30
						)
					)
				);
			}

			$this->set(array(
		        'data' => $d,
		        'success' => true,
		        '_serialize' => array('data','success')
		    ));
		}
	}

    public function view_entries(){

        $items  = array();
        $id     = 1;
        $hour   = (60*60);
        $day    = $hour*24;
        $week   = $day*7;

        $timespan = 'hour';  //Default
        if(isset($this->request->query['timespan'])){
            $timespan = $this->request->query['timespan'];
        }

        if($timespan == 'hour'){
            //Get entries created modified during the past hour
            $modified = date("Y-m-d H:i:s", time()-$hour);
        }

        if($timespan == 'day'){
            //Get entries created modified during the past hour
            $modified = date("Y-m-d H:i:s", time()-$day);
        }

        if($timespan == 'week'){
            //Get entries created modified during the past hour
            $modified = date("Y-m-d H:i:s", time()-$week);
        }

        if(isset($this->request->query['mesh_id'])){
           
            //Find all the entries for this mesh
            $mesh_id = $this->request->query['mesh_id'];
            $this->MeshEntry->contain();
            $q_r = $this->MeshEntry->find('all',array('conditions' => array(
                'MeshEntry.mesh_id' => $mesh_id
            )));

            //Create a lookup of all the nodes for this mesh
            $q_nodes = $this->Node->find('all',array('conditions' => array(
                'Node.mesh_id'      => $mesh_id
            )));
            $this->node_lookup = array();
            foreach($q_nodes as $n){
                $n_id   = $n['Node']['id'];
                $n_name = $n['Node']['name'];               
                $this->node_lookup[$n_id] = $n_name;
            }
        

            //Find all the distinct MACs for this Mesh entry...
            foreach($q_r as $i){
                $mesh_entry_id  = $i['MeshEntry']['id'];
                $entry_name     = $i['MeshEntry']['name'];
                $q_s = $this->NodeStation->find('all',array(
                    'conditions'    => array(
                        'NodeStation.mesh_entry_id' => $mesh_entry_id,
                        'NodeStation.modified >='   => $modified
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
                                'NodeStation.mesh_entry_id' => $mesh_entry_id,
                                'NodeStation.modified >='   => $modified
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
                        $signal_avg = round($q_t[0]['signal_avg']); 
                        if($signal_avg < -95){
                            $signal_avg_bar = 0.01;
                        }
                        if(($signal_avg >= -95)&($signal_avg <= -35)){
                                $p_val = 95-(abs($signal_avg));
                                $signal_avg_bar = round($p_val/60,1);
                        }
                        if($signal_avg > -35){
                            $signal_avg_bar = 1;
                        }

                        //Get the latest entry
                        $lastCreated = $this->NodeStation->find('first', array(
                            'conditions'    => array(
                                'NodeStation.mac'           => $mac,
                                'NodeStation.mesh_entry_id' => $mesh_entry_id
                            ),
                            'order' => array('NodeStation.created' => 'desc')
                        ));

                       // print_r($lastCreated);

                        $signal = $lastCreated['NodeStation']['signal'];

                        if($signal < -95){
                            $signal_bar = 0.01;
                        }
                        if(($signal >= -95)&($signal <= -35)){
                                $p_val = 95-(abs($signal));
                                $signal_bar = round($p_val/60,1);
                        }
                        if($signal > -35){
                            $signal_bar = 1;
                        }
                        
                        $last_node_id = $lastCreated['NodeStation']['node_id'];

                        array_push($items,array(
                            'id'                => $id,
                            'name'              => $entry_name, 
                            'mesh_entry_id'     => $mesh_entry_id, 
                            'mac'               => $mac,
                            'vendor'            => $lastCreated['NodeStation']['vendor'],
                            'tx_bytes'          => $t_bytes,
                            'rx_bytes'          => $r_bytes, 
                            'signal_avg'        => $signal_avg ,
                            'signal_avg_bar'    => $signal_avg_bar,
                            'signal_bar'        => $signal_bar,
                            'signal'            => $signal,
                            'l_tx_bitrate'      => $lastCreated['NodeStation']['tx_bitrate'],
                            'l_rx_bitrate'      => $lastCreated['NodeStation']['rx_bitrate'],
                            'l_signal'          => $lastCreated['NodeStation']['signal'],
                            'l_signal_avg'      => $lastCreated['NodeStation']['signal_avg'],
                            'l_MFP'             => $lastCreated['NodeStation']['MFP'],
                            'l_tx_failed'       => $lastCreated['NodeStation']['tx_failed'],
                            'l_tx_retries'      => $lastCreated['NodeStation']['tx_retries'],
                            'l_modified'        => $lastCreated['NodeStation']['modified'],
                            'l_authenticated'   => $lastCreated['NodeStation']['authenticated'],
                            'l_authorized'      => $lastCreated['NodeStation']['authorized'],
                            'l_tx_bytes'        => $lastCreated['NodeStation']['tx_bytes'],
                            'l_rx_bytes'        => $lastCreated['NodeStation']['rx_bytes'],
                            'l_node'            => $this->node_lookup[$last_node_id]
                        ));
                        $id++;
                    }
                }else{
                     array_push($items,array(
                            'id'                => $id,
                            'name'              => $entry_name, 
                            'mesh_entry_id'     => $mesh_entry_id, 
                            'mac'               => 'N/A',
                            'tx_bytes'          => 0,
                            'rx_bytes'          => 0, 
                            'signal_avg'        => null ,
                            'signal_bar'        => 'N/A' ,
                            'signal_avg_bar'    => 'N/A',
                            'signal_bar'        => 'N/A',
                            'signal'            => null,
                            'tx_bitrate'        => 0,
                            'rx_bitrate'        => 0,
                            'vendor'            => 'N/A'
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


     public function view_nodes(){

        $items  = array();
        $id     = 1;
        $hour   = (60*60);
        $day    = $hour*24;
        $week   = $day*7;

        $timespan = 'hour';  //Default
        if(isset($this->request->query['timespan'])){
            $timespan = $this->request->query['timespan'];
        }

        if($timespan == 'hour'){
            //Get entries created modified during the past hour
            $modified = date("Y-m-d H:i:s", time()-$hour);
        }

        if($timespan == 'day'){
            //Get entries created modified during the past hour
            $modified = date("Y-m-d H:i:s", time()-$day);
        }

        if($timespan == 'week'){
            //Get entries created modified during the past hour
            $modified = date("Y-m-d H:i:s", time()-$week);
        }

        if(isset($this->request->query['mesh_id'])){

            //Find all the nodes for this mesh
            $mesh_id = $this->request->query['mesh_id'];

            $this->Node->contain();
            $q_r = $this->Node->find('all',array('conditions' => array(
                'Node.mesh_id'      => $mesh_id
            )));

           
            //Create a lookup of all the entries for this mesh 
            $this->MeshEntry->contain();
            $q_entries = $this->MeshEntry->find('all',array('conditions' => array(
                'MeshEntry.mesh_id' => $mesh_id
            )));

            $this->entry_lookup = array();
            foreach($q_entries as $e){
                $e_id   = $e['MeshEntry']['id'];
                $e_name = $e['MeshEntry']['name'];               
                $this->entry_lookup[$e_id] = $e_name;
            }

            
            //Find all the distinct MACs for this Mesh node...
            foreach($q_r as $i){
                $node_id    = $i['Node']['id'];
                $node_name  = $i['Node']['name'];
                $l_contact  = $i['Node']['last_contact'];
                $dead_after = '660'; //11Minutes

                //Find the dead time (only once)
                if($l_contact == null){
                    $state = 'never';
                }else{
                    $n_s = $this->NodeSetting->find('first',array(
                        'conditions'    => array(
                            'NodeSetting.mesh_id' => $mesh_id
                        )
                    )); 
                    if($n_s){
                        $dead_after = $n_s['NodeSetting']['heartbeat_dead_after'];
                    }
                    $last_timestamp = strtotime($l_contact);
                    if($last_timestamp+$dead_after <= time()){
                        $state = 'down';
                    }else{
                        $state = 'up';
                    }
                }

                $q_s = $this->NodeStation->find('all',array(
                    'conditions'    => array(
                        'NodeStation.node_id'       => $node_id,
                        'NodeStation.modified >='   => $modified
                    ),
                    'fields'        => array(
                        'DISTINCT(mac)'
                    )
                ));

                if($q_s){
                    foreach($q_s as $j){
                        //print_r($j);
                        $mac = $j['NodeStation']['mac'];
                        //Get the sum of Bytes and avg of signal
                        $q_t = $this->NodeStation->find('first', array(
                            'conditions'    => array(
                                'NodeStation.mac'           => $mac,
                                'NodeStation.node_id'       => $node_id,
                                'NodeStation.modified >='   => $modified
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
                        $signal_avg = round($q_t[0]['signal_avg']); 
                        if($signal_avg < -95){
                            $signal_avg_bar = 0.01;
                        }
                        if(($signal_avg >= -95)&($signal_avg <= -35)){
                                $p_val = 95-(abs($signal_avg));
                                $signal_avg_bar = round($p_val/60,1);
                        }
                        if($signal_avg > -35){
                            $signal_avg_bar = 1;
                        }

                        //Get the latest entry
                        $lastCreated = $this->NodeStation->find('first', array(
                            'conditions'    => array(
                                'NodeStation.mac'       => $mac,
                                'NodeStation.node_id'   => $node_id
                            ),
                            'order' => array('NodeStation.created' => 'desc')
                        ));

                       // print_r($lastCreated);

                        $signal = $lastCreated['NodeStation']['signal'];

                        if($signal < -95){
                            $signal_bar = 0.01;
                        }
                        if(($signal >= -95)&($signal <= -35)){
                                $p_val = 95-(abs($signal));
                                $signal_bar = round($p_val/60,1);
                        }
                        if($signal > -35){
                            $signal_bar = 1;
                        }
                        
                        $last_mesh_entry_id = $lastCreated['NodeStation']['mesh_entry_id'];

                        

                        array_push($items,array(
                            'id'                => $id,
                            'name'              => $node_name, 
                            'node_id'           => $node_id, 
                            'mac'               => $mac,
                            'vendor'            => $lastCreated['NodeStation']['vendor'],
                            'tx_bytes'          => $t_bytes,
                            'rx_bytes'          => $r_bytes, 
                            'signal_avg'        => $signal_avg ,
                            'signal_avg_bar'    => $signal_avg_bar,
                            'signal_bar'        => $signal_bar,
                            'signal'            => $signal,
                            'l_tx_bitrate'      => $lastCreated['NodeStation']['tx_bitrate'],
                            'l_rx_bitrate'      => $lastCreated['NodeStation']['rx_bitrate'],
                            'l_signal'          => $lastCreated['NodeStation']['signal'],
                            'l_signal_avg'      => $lastCreated['NodeStation']['signal_avg'],
                            'l_MFP'             => $lastCreated['NodeStation']['MFP'],
                            'l_tx_failed'       => $lastCreated['NodeStation']['tx_failed'],
                            'l_tx_retries'      => $lastCreated['NodeStation']['tx_retries'],
                            'l_modified'        => $lastCreated['NodeStation']['modified'],
                            'l_authenticated'   => $lastCreated['NodeStation']['authenticated'],
                            'l_authorized'      => $lastCreated['NodeStation']['authorized'],
                            'l_tx_bytes'        => $lastCreated['NodeStation']['tx_bytes'],
                            'l_rx_bytes'        => $lastCreated['NodeStation']['rx_bytes'],
                            'l_entry'           => $this->entry_lookup[$last_mesh_entry_id],
                            'l_contact'         => $l_contact,
                            'state'             => $state
                        ));
                        $id++;
                    }
                }else{
                     array_push($items,array(
                            'id'                => $id,
                            'name'              => $node_name, 
                            'mesh_entry_id'     => $node_id, 
                            'mac'               => 'N/A',
                            'tx_bytes'          => 0,
                            'rx_bytes'          => 0, 
                            'signal_avg'        => null ,
                            'signal_bar'        => 'N/A' ,
                            'signal_avg_bar'    => 'N/A',
                            'signal_bar'        => 'N/A',
                            'signal'            => null,
                            'tx_bitrate'        => 0,
                            'rx_bitrate'        => 0,
                            'vendor'            => 'N/A',
                            'l_contact'         => $l_contact,
                            'state'             => $state
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
                    $this->_update_last_contact($node_id);
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
                            //--Check the last entry for this MAC
                            $q_mac = $this->NodeStation->find('first',array(
                                'conditions'    => array(
                                    'NodeStation.mesh_entry_id' => $entry_id,
                                    'NodeStation.node_id'       => $node_id,
                                    'NodeStation.mac'           => $data['mac'],
                                ),
                                'order' => array('NodeStation.created' => 'desc')
                            ));
                            $new_flag = true;
                            if($q_mac){
                                $old_tx = $q_mac['NodeStation']['tx_bytes'];
                                $old_rx = $q_mac['NodeStation']['rx_bytes'];
                                if(($data['tx_bytes'] >= $old_tx)&($data['rx_bytes'] >= $old_rx)){
                                    $data['id'] =  $q_mac['NodeStation']['id'];
                                    $new_flag = false;   
                                }
                            }
                            if($new_flag){
                                $this->NodeStation->create();
                            }   
                            $this->NodeStation->save($data);
                        }
                    }
                }

                //If the type is IBSS we will try to determine which nodes are connected
                if($i['type'] == 'IBSS'){
                     foreach($i['stations'] as $s){
                            $data = $this->_prep_station_data($s);
                            $data['node_id']    = $node_id;

                            //--Check the last entry for this MAC
                            $q_mac = $this->NodeIbssConnection->find('first',array(
                                'conditions'    => array(
                                    'NodeIbssConnection.node_id'    => $node_id,
                                    'NodeIbssConnection.mac'        => $data['mac'],
                                ),
                                'order' => array('NodeIbssConnection.created' => 'desc')
                            ));
                            $new_flag = true;
                            if($q_mac){
                                $old_tx = $q_mac['NodeIbssConnection']['tx_bytes'];
                                $old_rx = $q_mac['NodeIbssConnection']['rx_bytes'];
                                if(($data['tx_bytes'] >= $old_tx)&($data['rx_bytes'] >= $old_rx)){
                                    $data['id'] =  $q_mac['NodeIbssConnection']['id'];
                                    $new_flag = false;   
                                }
                            }
                            if($new_flag){
                                $this->NodeIbssConnection->create(); 
                            }    
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

    private function _update_last_contact($node_id){
        $this->Node->id = $node_id;
        if($this->Node->id){
            $this->Node->saveField('last_contact', date("Y-m-d H:i:s", time()));
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
        //Convert the MAC to be in the same format as the file 
        $mac    = strtoupper($mac);
        $pieces = explode(":", $mac);

        $big_match      = $pieces[0].":".$pieces[1].":".$pieces[2].":".$pieces[3].":".$pieces[4];
        $small_match    = $pieces[0].":".$pieces[1].":".$pieces[2];
        $lines          = $this->vendor_list;

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
