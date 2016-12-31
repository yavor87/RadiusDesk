<?php

// src/Model/Table/UsersTable.php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;
use Cake\Utility\Text;

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
      
    public function find_access_provider_children($id){

        $ap_name = Configure::read('group.ap'); 
        $descendants = $this->find('children', ['for' => $id]);

        foreach ($descendants as $c) {
            array_push($this->ap_children,array('id' => $c->id, 'username' => $c->username));
        }
        return $this->ap_children;      
    } 
      
    public function find_parents($id){
      
        $q_r = $this->find('path',['for' => $id]);
        $path_string= '';
        if($q_r){
            foreach($q_r as $line_num => $i){
                $username       = $i->username;
                if($line_num == 0){
                    $path_string    = $username;
                }else{
                    $path_string    = $path_string.' -> '.$username;
                }
            }
            if($line_num > 0){
                return $username." (".$path_string.")";
            }else{
                return $username;
            }
        }else{
            return __("orphaned");
        }
    }
    
    public function is_sibling_of($parent_id,$user_id){
        $q_r = $this->find('path',['for' => $user_id]);
        foreach($q_r as $i){
            $id = $i->id;
            if($id == $parent_id){
                return true;
            }
        }
        //No match
        return false; 
    }
}
