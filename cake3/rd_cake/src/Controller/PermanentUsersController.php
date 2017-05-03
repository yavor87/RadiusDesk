<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class PermanentUsersController extends AppController{

    protected $base         = "Access Providers/Controllers/PermanentUsers/";
    protected $owner_tree   = array();
    protected $main_model   = 'PermanentUsers';

    public function initialize(){  
        parent::initialize();
        $this->loadModel('PermanentUsers'); 
        $this->loadModel('Users');
        $this->loadModel('Realms');
        $this->loadModel('Profiles');
        
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtons');
        $this->loadComponent('CommonQuery', [ //Very important to specify the Model
            'model' => 'PermanentUsers'
        ]); 
        
        $this->loadComponent('Notes', [
            'model'     => 'PermanentUserNotes',
            'condition' => 'permanent_user_id'
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
            
            #FIXME We need to determine the rights of the user in terms of the REALM not its position wrt the Owner tree
            #For the action flags
            
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
    
    public function add(){
    
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        /*__ To incorporate __
            -> Check if the owner of the new PermanentUser and the Realm we want it to belong to has sufficient rights
            -> Check if the realm this user belongs to has suffix_permanent_users set and if so the value of the suffix
            -> Add the RADIUS things ... maybe a behaviour?
       
       */
        
        //---Get the language and country---
        $country_language                   = explode( '_', $this->request->data['language'] );
        $country                            = $country_language[0];
        $language                           = $country_language[1];
        $this->request->data['language_id'] = $language;
        $this->request->data['country_id']  = $country;
        
        //---Set Realm related things--- 
        $realm_entity           = $this->Realms->entityBasedOnPost($this->request->data);
        if($realm_entity){
            $this->request->data['realm']   = $realm_entity->name;
            $this->request->data['realm_id']= $realm_entity->id;
            
            //Test to see if we need to auto-add a suffix
            $suffix                 =  $realm_entity->suffix; 
            $suffix_permanent_users = $realm_entity->suffix_permanent_users;
            if(($suffix != '')&&($suffix_permanent_users)){
                $this->request->data['username'] = $this->request->data['username'].'@'.$suffix;
            }
        
        }else{
            $this->set(array(
                'success' => false,
                'message'   => array('message' => 'realm or realm_id not found in DB or not supplied'),
                '_serialize' => array('success','message')
            ));
            return;
        }
        
        //---Set profile related things---
        $profile_entity = $this->Profiles->entityBasedOnPost($this->request->data);
        if($profile_entity){
            $this->request->data['profile']   = $profile_entity->name;
            $this->request->data['profile_id']= $profile_entity->id;
        }else{
            $this->set(array(
                'success' => false,
                'message'   => array('message' => 'profile or profile_id not found in DB or not supplied'),
                '_serialize' => array('success','message')
            ));
            return;
        }
        
        //Zero the token to generate a new one for this user:
        $this->request->data['token'] = '';

        //Set the owner
        if(($this->request->data['user_id'] == '0')||($this->request->data['user_id'] == '')){ //This is the holder of the token
            $this->request->data['user_id'] = $user['id'];
        }

        //Set the date and time
        $extDateSelects = [
                'from_date',
                'to_date'
        ];
        foreach($extDateSelects as $d){
            if(isset($this->request->data[$d])){
                $newDate = date_create_from_format('d/m/Y', $this->request->data[$d]);
                $this->request->data[$d] = $newDate;
            }  
        }
        
        $check_items = array(
			'active'
		);

        foreach($check_items as $i){
            if(isset($this->request->data[$i])){
                $this->request->data[$i] = 1;
            }else{
                $this->request->data[$i] = 0;
            }
        }
        
        //The rest of the attributes should be same as the form..
        $entity = $this->{$this->main_model}->newEntity($this->request->data());
         
        if($this->{$this->main_model}->save($entity)){
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }else{
            $message    = 'Error';
            $errors     = $entity->errors();
            $a          = [];
            foreach(array_keys($errors) as $field){
                $detail_string = '';
                $error_detail =  $errors[$field];
                foreach(array_keys($error_detail) as $error){
                    $detail_string = $detail_string." ".$error_detail[$error];   
                }
                $a[$field] = $detail_string;
            }   
            $this->set(array(
                'errors'    => $a,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }      
    }

    public function delete() {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id   = $user['id'];
        $fail_flag = false;

	    if(isset($this->request->data['id'])){   //Single item delete
            $message = "Single item ".$this->request->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:         
            $entity     = $this->{$this->main_model}->get($this->request->data['id']);   
            $owner_id   = $entity->user_id;
            
            if($owner_id != $user_id){
                if($this->Users->is_sibling_of($user_id,$owner_id)== true){
                    $this->{$this->main_model}->delete($entity);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->{$this->main_model}->delete($entity);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->request->data as $d){
                $entity     = $this->{$this->main_model}->get($d['id']);  
                $owner_id   = $entity->user_id;
                if($owner_id != $user_id){
                    if($this->Users->is_sibling_of($user_id,$owner_id) == true){
                        $this->{$this->main_model}->delete($entity);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->{$this->main_model}->delete($entity);
                }
            }
        }

        if($fail_flag == true){
            $this->set(array(
                'success'   => false,
                'message'   => array('message' => __('Could not delete some items')),
                '_serialize' => array('success','message')
            ));
        }else{
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }
	}


    public function enableDisable(){
        
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $rb         = $this->request->data['rb'];
        $d          = array();

        if($rb == 'enable'){
            $d['active'] = 1;
        }else{
            $d['active'] = 0;
        }

        foreach(array_keys($this->request->data) as $key){
            if(preg_match('/^\d+/',$key)){
                $entity = $this->{$this->main_model}->get($key);
                $this->{$this->main_model}->patchEntity($entity, $d);
                $this->{$this->main_model}->save($entity);
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success',)
        ));
    }

    public function changePassword(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $this->request->data['token'] = ''; //Clear the token so it can generate a new one
        $entity = $this->{$this->main_model}->get($this->request->data['user_id']);
         $this->{$this->main_model}->patchEntity($entity, $this->request->data());

        if ($this->{$this->main_model}->save($entity)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';       
            $errors = $entity->errors();
            $a = [];
            foreach(array_keys($errors) as $field){
                $detail_string = '';
                $error_detail =  $errors[$field];
                foreach(array_keys($error_detail) as $error){
                    $detail_string = $detail_string." ".$error_detail[$error];   
                }
                $a[$field] = $detail_string;
            }

            $this->set(array(
                'errors'    => $a,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }        
        
    }

    
    public function menuForGrid(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        $menu = $this->GridButtons->returnButtons($user,true,'permanent_users');
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
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
