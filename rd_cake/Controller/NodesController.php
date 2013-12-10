<?php
App::uses('AppController', 'Controller');

class NodesController extends AppController {

    public $name    = 'Nodes';
    public $uses    = array('Mesh');
    public $components  = array('OpenWrt');


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

}
