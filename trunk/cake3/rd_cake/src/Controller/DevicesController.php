<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class DevicesController extends AppController{

    protected $base         = "Access Providers/Controllers/Devices/";
    protected $owner_tree   = array();
    protected $main_model   = 'Devices';

    public function initialize(){  
        parent::initialize();
        $this->loadModel('PermanentUsers'); 
        $this->loadModel('Users');
        
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtons');
        $this->loadComponent('CommonQuery', [ //Very important to specify the Model
            'model' => 'Devices'
        ]); 
        
        $this->loadComponent('Notes', [
            'model'     => 'DeviceNotes',
            'condition' => 'device_id'
        ]);        
    }

    public function index(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
                
        $query = $this->{$this->main_model}->find();
        $this->CommonQuery->build_common_query($query,$user,['Users','PermanentUserNotes' => ['Notes']]);
 
        $limit  = 50;
        $page   = 1;
        $offset = 0;
        if(isset($this->request->query['limit'])){
            $limit  = $this->request->query['limit'];
            $page   = $this->request->query['page'];
            $offset = $this->request->query['start'];
        }
        
        $query->page($page);
        $query->limit($limit);
        $query->offset($offset);

        $total  = $query->count();       
        $q_r    = $query->all();
        $items  = array();
        
        foreach($q_r as $i){
              
            $owner_id   = $i->user_id;
            if(!array_key_exists($owner_id,$this->owner_tree)){
                $owner_tree     = $this->Users->find_parents($owner_id);
            }else{
                $owner_tree = $this->owner_tree[$owner_id];
            }
            
            $action_flags   = $this->Aa->get_action_flags($owner_id,$user);          
            $row            = array();
            $fields         = $this->{$this->main_model}->schema()->columns();
            foreach($fields as $field){
                $row["$field"]= $i->{"$field"};
            }
            
            //Unset password and token fields
            unset($row["password"]);
            unset($row["token"]);
            
            $notes_flag     = false;
            foreach($i->permanent_user_notes as $pun){
                if(!$this->Aa->test_for_private_parent($pun->note,$user)){
                    $notes_flag = true;
                    break;
                }
            }
                      
            $row['owner']   = $owner_tree;
            $row['owner_id']= $owner_id;
            $row['notes']   = $notes_flag;
			$row['update']	= $action_flags['update'];
			$row['delete']	= $action_flags['delete']; 
            array_push($items,$row);      
        }
       
        $this->set(array(
            'items'         => $items,
            'success'       => true,
            'totalCount'    => $total,
            '_serialize'    => array('items','success','totalCount')
        ));
    }
     	
    public function noteIndex(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $items = $this->Notes->index($user); 
    }
    
    public function noteAdd(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }   
        $this->Notes->add($user);
    }
    
    public function noteDel(){  
        if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $this->Notes->del($user);
    }  
}

?>
