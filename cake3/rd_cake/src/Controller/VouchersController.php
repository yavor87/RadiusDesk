<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\Utility\Inflector;

class VouchersController extends AppController{
  
    protected $base         = "Access Providers/Controllers/Vouchers/";   
    protected $owner_tree   = array();
    protected $main_model   = 'Vouchers';
  
    public function initialize(){  
        parent::initialize();
        $this->loadModel('Vouchers'); 
        $this->loadModel('Users');
        $this->loadModel('Realms');
        $this->loadModel('Profiles');   
       
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtons');
        $this->loadComponent('CommonQuery', [ //Very important to specify the Model
            'model' => 'Vouchers'
        ]);  
        $this->loadComponent('JsonErrors'); 
        $this->loadComponent('VoucherGenerator'); 

    }

    public function pdfExportSettings(){
		Configure::load('Vouchers'); 
        $data       = Configure::read('voucher_dafaults'); //Read the defaults

		$this->set(array(
            'data'     => $data,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
	}
    
    //____ BASIC CRUD Manager ________
    public function index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
                
        $query = $this->{$this->main_model}->find();

        $this->CommonQuery->build_with_realm_query($query,$user,['Users','Realms']);
 
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
            
            $row        = array();
            $fields    = $this->{$this->main_model}->schema()->columns();
            foreach($fields as $field){
                $row["$field"]= $i->{"$field"};
            } 
            
            $row['owner']   = $owner_tree;
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

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //Get the owner's id
        if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }

        $check_items = array(
			'activate_on_login',
            'never_expire'
		);

        foreach($check_items as $i){
            if(isset($this->request->data[$i])){
                $this->request->data[$i] = 1;
            }else{
                $this->request->data[$i] = 0;
            }
        }

        //---Set Realm related things--- 
        $realm_entity           = $this->Realms->entityBasedOnPost($this->request->data);
        if($realm_entity){
            $this->request->data['realm']   = $realm_entity->name;
            $this->request->data['realm_id']= $realm_entity->id;
            
            //Test to see if we need to auto-add a suffix
            $suffix          =  $realm_entity->suffix; 
            $suffix_vouchers = $realm_entity->suffix_vouchers;
           
        }else{
            $this->JsonErrors->errorMessage('realm or realm_id not found in DB or not supplied');
            return;
        }
        
        //---Set profile related things---
        $profile_entity = $this->Profiles->entityBasedOnPost($this->request->data);
        if($profile_entity){
            $this->request->data['profile']   = $profile_entity->name;
            $this->request->data['profile_id']= $profile_entity->id;
        }else{
            $this->JsonErrors->errorMessage('profile or profile_id not found in DB or not supplied');
            return;
        }

        //--Here we start with the work!
        $qty        = 1;//Default value
        $counter    = 0;
        $repl_fields= [
            'id', 'name', 'batch','created','extra_name','extra_value',
            'realm','realm_id','profile','profile_id','expire','time_valid'
        ];

        $created    = [];

        if(array_key_exists('quantity',$this->request->data)){
            $qty = $this->request->data['quantity'];
        }

        while($counter < $qty){
            $pwd = $this->VoucherGenerator->generateVoucher();
            if(($suffix != '')&&($suffix_vouchers)){
                $pwd = $pwd.'@'.$suffix;
            }

            $this->request->data['name']      = $pwd; 
            $this->request->data['password']  = $pwd;
            
            $entity = $this->{$this->main_model}->newEntity($this->request->data());
            $this->{$this->main_model}->save($entity);
            if(!$entity->errors()){ //Hopefully taking care of duplicates is as simple as this :-)
                $counter = $counter + 1;
                $row     = array();
                foreach($repl_fields as $field){
                    $row["$field"]= $entity->{"$field"};
                }
                array_push($created,$row);
            } 
        }

        $this->set(array(
            'success' => true,
            'data'    => $created,
            '_serialize' => array('success','data')
        ));
    } 

    public function viewBasicInfo(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $entity     = $this->{$this->main_model}->get( $this->request->query['voucher_id']);
        $username   = $entity->name;

        //List these items
        $include_items = [
            'realm','realm_id','profile','profile_id',
            'extra_name','extra_value', 'expire' ,
            'time_valid'
        ];

        $items = [];
        foreach($include_items as $i){
            $items[$i] = $entity->{$i};
        }

        if($items['expire'] == ''){
            $items['never_expire'] = true;
        }else{
           $items['never_expire'] = false; 
        }

        if($items['time_valid'] != ''){
            $items['activate_on_login'] = 'activate_on_login';
            $pieces                     = explode("-", $items['time_valid']);
            $items['days_valid']        = $pieces[0];  
            $items['hours_valid']       = $pieces[1];
            $items['minutes_valid']     = $pieces[2]; 
        }

        //Check if it has an SSID limitation
        $items['ssid_only'] = false;
        if($this->{$this->main_model}->hasSsidCheck($username)){
            $items['ssid_only'] = true;
            $items['ssid_list'] = $this->{$this->main_model}->listRestrictedSsids($username);
        }

        $this->set(array(
            'data'   => $items, //For the form to load we use data instead of the standard items as for grids
            'success' => true,
            '_serialize' => array('success','data')
        ));
    }

    public function editBasicInfo(){ 
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        //---Set Realm related things--- 
        $realm_entity           = $this->Realms->entityBasedOnPost($this->request->data);
        if($realm_entity){
            $this->request->data['realm']   = $realm_entity->name;
            $this->request->data['realm_id']= $realm_entity->id;
            //FIXME WE HAVE TO CHECK AND CHANGE USERNAME IF CHANGE ...
        
        }else{
            $message = __('realm or realm_id not found in DB or not supplied');
            $this->JsonErrors->errorMessage($message);
            return;
        }
        
        //---Set profile related things---
        $profile_entity = $this->Profiles->entityBasedOnPost($this->request->data);
        if($profile_entity){
            $this->request->data['profile']   = $profile_entity->name;
            $this->request->data['profile_id']= $profile_entity->id;
        }else{
            $message = __('profile or profile_id not found in DB or not supplied');
            $this->JsonErrors->errorMessage($message);
            return;
        }

        $this->request->data['status'] = 'new'; //Make it new so it changes visibly
        
        $entity = $this->{$this->main_model}->get($this->request->data['id']);
        $this->{$this->main_model}->patchEntity($entity, $this->request->data());
     
        if ($this->{$this->main_model}->save($entity)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = __('Could not update item');
            $this->JsonErrors->entityErros($entity,$message);
        }
    }

	
    public function menuForGrid(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
         
        $menu = $this->GridButtons->returnButtons($user,true,'basic'); 
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
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

     public function privateAttrIndex(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $username   = $this->request->query['username'];
        $items      =  $this->{$this->main_model}->privateAttrIndex($username);

        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    public function privateAttrAdd(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $entity =  $this->{$this->main_model}->privateAttrAdd();
        $errors = $entity->errors();
        if($errors){
            $message = __('Could not create item');
            $this->JsonErrors->entityErros($entity,$message);
        }else{        
            $this->request->data['id'] = $entity->id;
            $this->set(array(
                'items'     => $this->request->data,
                'success'   => true,
                '_serialize' => array('success','items')
            ));
        }
    }

    public function privateAttrEdit(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $entity =  $this->{$this->main_model}->privateAttrEdit();    
        $errors = $entity->errors();
        if($errors){
            $message = __('Could not edit item');
            $this->JsonErrors->entityErros($entity,$message);
        }else{        
            $this->request->data['id'] = $entity->id;
            $this->set(array(
                'items'     => $this->request->data,
                'success'   => true,
                '_serialize' => array('success','items')
            ));
        }
    }

    public function privateAttrDelete(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        if($this->{$this->main_model}->privateAttrDelete()){
            $message = __('Could not delete some items');
            $this->JsonErrors->errorMessage($message);  
        }else{
            $this->set(array(
                'success'   => true,
                '_serialize' => array('success')
            ));
        }
    }


}
