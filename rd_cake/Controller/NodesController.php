<?php
App::uses('AppController', 'Controller');

class NodesController extends AppController {

    public $name    = 'Nodes';
    public $uses    = array('Mesh');
    public $components  = array('OpenWrt');

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

    public function get_config_for_node($mac){

        if(isset($this->request->query['node_id'])){

            $node_id= $this->request->query['node_id'];
            $node   = ClassRegistry::init('Node');
            $q_r    = $node->findByName($node_id);

            if($q_r){



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

}
