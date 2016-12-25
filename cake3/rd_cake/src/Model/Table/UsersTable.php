<?php

// src/Model/Table/UsersTable.php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class UsersTable extends Table
{

    //Used to build the list of children an Access Provider may have up to the end nodes.
    private $ap_children    = array();

    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
        $this->addBehavior('Tree');
          
        $this->belongsTo('Groups');
    }
      
    public function find_access_provider_children($ap_id){

        $ap_name = Configure::read('group.ap'); 
        $descendants = $this->find('children', ['for' => $ap_id]);

        foreach ($descendants as $c) {
            array_push($this->ap_children,array('id' => $c->id, 'username' => $c->username));
        }
        return $this->ap_children;      
    }
}
