<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\Utility\Inflector;


class DynamicDetailsController extends AppController{
  
    protected $base  = "Access Providers/Controllers/DynamicDetails/";
    
    protected $owner_tree = array();
    
    protected $main_model = 'DynamicDetails';
  
    public function initialize(){  
        parent::initialize();  
          
        $this->loadModel('DynamicDetails');
        $this->loadModel('DynamicPairs'); 
        $this->loadModel('Users');
        $this->loadModel('DynamicPhotos');
        
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtons');
        $this->loadComponent('CommonQuery', [ //Very important to specify the Model
            'model' => $this->main_model
        ]);
        
        $this->loadComponent('Notes', [
            'model'     => 'DynamicDetailNotes',
            'condition' => 'dynamic_detail_id'
        ]);    
    }
    
    
    public function infoFor(){

        $items      = array();
		$sl_items	= array();
		$social_enable = false;

        if(isset($this->request->query['dynamic_id'])){ //preview link will call this page ?dynamic_id=<id>
        
            $dynamic_id = $this->request->query['dynamic_id'];

            $q_r = $this->{$this->main_model}
                ->find()
                ->contain(['DynamicPages','DynamicPhotos','DynamicDetailSocialLogins'])
                ->where([$this->main_model.'.id' =>$dynamic_id])
                ->first();                

            if($q_r){
                //Modify the photo path:
                $c = 0;
                foreach($q_r->dynamic_photos as $i){
                    $q_r->dynamic_photos[$c]['file_name'] = Configure::read('paths.dynamic_photos').$i->file_name;
                    $c++;
                }
                $items['photos']    = $q_r->dynamic_photos;
                $items['pages']     = $q_r->dynamic_pages;
				$sl_items           = $q_r->dynamic_detail_social_logins;
				$icon_file_name     = Configure::read('paths.dynamic_detail_icon').$q_r->icon_file_name;
				if($q_r->social_enable == true){
				    $social_enable = true;
				}
            }

        }else{ //Build a query since it was not called from the preview link
            $conditions = array("OR" =>array());
      
            foreach(array_keys($this->request->query) as $key){
                array_push($conditions["OR"],
                    array("DynamicPairs.name" => $key, "DynamicPairs.value" =>  $this->request->query[$key])
                ); //OR query all the keys
            }
           	
			$q_r = $this->DynamicPairs
                ->find()
                ->contain(['DynamicDetails' => ['DynamicPhotos','DynamicPages','DynamicDetailSocialLogins']])
                ->where([$conditions])
                ->order(['DynamicPairs.priority' => 'DESC'])
                ->first();                

            if($q_r){
                
                //Modify the photo path:
                $c = 0;
                foreach($q_r->dynamic_detail->dynamic_photos as $i){
                    $q_r->dynamic_detail->dynamic_photos[$c]['file_name'] = Configure::read('paths.dynamic_photos').$i->file_name;
                    $c++;
                }
                $items['photos']    = $q_r->dynamic_detail->dynamic_photos;
                $items['pages']     = $q_r->dynamic_detail->dynamic_pages;
				$sl_items           = $q_r->dynamic_detail->dynamic_detail_social_logins;
				$icon_file_name     = Configure::read('paths.dynamic_detail_icon').$q_r->dynamic_detail->icon_file_name;
				if($q_r->dynamic_detail->social_enable == true){
				    $social_enable = true;
				}
            }
            
        }
        
        $detail_fields  = array(
			'id',		'name',			'phone',		'fax',			'cell',		'email',
			'url',		'street_no',	'street',		'town_suburb',	'city',		'country',
			'lat',		'lon',	       
		);
		
		$settings_fields    = array(
			't_c_check',	        't_c_url',	        'redirect_check',   'redirect_url',
			'slideshow_check',      'seconds_per_slide','connect_check',    'connect_username', 'connect_suffix',
			'connect_delay',        'connect_only',     'user_login_check', 'voucher_login_check',
			'auto_suffix_check',    'auto_suffix',      'usage_show_check', 'usage_refresh_interval', 
			'register_users',       'lost_password'
		);
        
		//print_r($q_r);

        //Get the detail for the page
        if($q_r){
        
                $direct_flag = true;
                if($q_r->dynamic_detail != null){
                    $direct_flag = false;
                }
        
                foreach($detail_fields as $field){
                    if($direct_flag){
                        $items['detail']["$field"]= $q_r->{"$field"};  
                    }else{
                        $items['detail']["$field"]= $q_r->dynamic_detail->{"$field"}; 
                    }
                }
                $items['detail']['icon_file_name'] = $icon_file_name;
                
                foreach($settings_fields as $field){
                    if($direct_flag){
                        $items['settings']["$field"]= $q_r->{"$field"};  
                    }else{
                        $items['settings']["$field"]= $q_r->dynamic_detail->{"$field"}; 
                    }
                }
        

			if($social_enable){
				$items['settings']['social_login']['active'] = true;			
				//Find the temp username and password
				if($direct_flag){
                    $temp_user_id   = $q_r->social_temp_permanent_user_id;  
                }else{
                    $temp_user_id   = $q_r->dynamic_detail->social_temp_permanent_user_id; 
                }
				
				$user_detail  = $this->_find_username_and_password($temp_user_id);
				$items['settings']['social_login']['temp_username'] = $user_detail['username'];
				$items['settings']['social_login']['temp_password'] = $user_detail['password'];
				//Find if there are any defined
				$items['settings']['social_login']['items'] = array();
				foreach($sl_items as $i){
					$n = $i->name;
					array_push($items['settings']['social_login']['items'], array('name' => $n));
				}

			}else{
				$items['settings']['social_login']['active'] = false;
			}

        }

        $success = true;
        if(count($items) == 0){ //Not found
            $success = false;
        }

        $this->set(array(
            'data' => $items,
            'success' => $success,
            '_serialize' => array('data','success')
        ));
    }
    
    public function idMe(){
       // $this->layout = 'rd';
        $u_a = $this->request->header('User-Agent');
        $this->set('u_a',$u_a);
        $this->set(array(
            'data' => array("User-Agent" => $u_a),
            'success' => true,
            '_serialize' => array('data','success')
        ));
    }
    
    public function chilliBrowserDetect(){  
		$redir_to = $this->_doBrowserDetectFor('coova');
		$this->response->header('Location', $redir_to);
        return $this->response;	
    }
    
    public function ruckusBrowserDetect(){  
		$redir_to = $this->_doBrowserDetectFor('ruckus');
		$this->response->header('Location', $redir_to);
        return $this->response;	
    }
    
    //----- Give better preview pages -----
    public function previewChilliDesktop(){
        $redir_to = $this->_doPreviewChilli('desktop');
		$this->response->header('Location', $redir_to);
        return $this->response;	
    }
    
    public function previewChilliMobile(){
        $redir_to = $this->_doPreviewChilli('mobile');
		$this->response->header('Location', $redir_to);
        return $this->response;	
    }
    
    public function i18n(){
        $items = array();
        Configure::load('DynamicLogin','default');
        $i18n = Configure::read('DynamicLogin.i18n');
        foreach($i18n as $i){
            if($i['active']){
                array_push($items, $i);
            }
        }

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }
       
    public function exportCsv(){

        $this->autoRender   = false;

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $query = $this->{$this->main_model}->find(); 
        $this->CommonQuery->build_common_query($query,$user,['Users','DynamicDetailNotes' => ['Notes']]);
        
        $q_r    = $query->all();

        //Create file
        $this->ensureTmp();     
        $tmpFilename    = TMP . $this->tmpDir . DS .  strtolower( Inflector::pluralize($this->modelClass) ) . '-' . date('Ymd-Hms') . '.csv';
        $fp             = fopen($tmpFilename, 'w');

        //Headings
        $heading_line   = array();
        if(isset($this->request->query['columns'])){
            $columns = json_decode($this->request->query['columns']);
            foreach($columns as $c){
                array_push($heading_line,$c->name);
            }
        }
        fputcsv($fp, $heading_line,';','"');
        foreach($q_r as $i){

            $columns    = array();
            $csv_line   = array();
            if(isset($this->request->query['columns'])){
                $columns = json_decode($this->request->query['columns']);
                foreach($columns as $c){
                    $column_name = $c->name;
                    if($column_name == 'notes'){
                        $notes   = '';
                        foreach($i->dynamic_detail_notes as $un){
                            if(!$this->Aa->test_for_private_parent($un->note,$user)){
                                $notes = $notes.'['.$un->note->note.']';    
                            }
                        }
                        array_push($csv_line,$notes);
                    }elseif($column_name =='owner'){
                        $owner_id       = $i->user_id;
                        $owner_tree     = $this->Users->find_parents($owner_id);
                        array_push($csv_line,$owner_tree); 
                    }else{
                        array_push($csv_line,$i->{$column_name});  
                    }
                }
                fputcsv($fp, $csv_line,';','"');
            }
        }

        //Return results
        fclose($fp);
        $data = file_get_contents( $tmpFilename );
        $this->cleanupTmp( $tmpFilename );
        $this->RequestHandler->respondAs('csv');
        $this->response->download( strtolower( Inflector::pluralize( $this->modelClass ) ) . '.csv' );
        $this->response->body($data);
    } 
       
    //____ BASIC CRUD Manager ________
    public function index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        
        //Fields
		$fields  	= array(
			'id',		'name',			'user_id',		'available_to_siblings',
			'phone',    'fax',			'cell',		    'email',
			'url',		'street_no',	'street',		'town_suburb',	'city',		'country',
			'lat',		'lon',			't_c_check',	't_c_url',		'theme',	'register_users',
			'lost_password'
		);
		
        $query = $this->{$this->main_model}->find();

        $this->CommonQuery->build_common_query($query,$user,['Users','DynamicDetailNotes' => ['Notes']]);
 
        //===== PAGING (MUST BE LAST) ======
        $limit  = 50;   //Defaults
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

        $items      = array();

        foreach($q_r as $i){    
            $owner_id   = $i->user_id;
            if(!array_key_exists($owner_id,$this->owner_tree)){
                $owner_tree     = $this->Users->find_parents($owner_id);
            }else{
                $owner_tree = $this->owner_tree[$owner_id];
            }
            
            $action_flags   = $this->Aa->get_action_flags($owner_id,$user);
            
            $notes_flag     = false;
            foreach($i->dynamic_detail_notes as $un){
                if(!$this->Aa->test_for_private_parent($un->note,$user)){
                    $notes_flag = true;
                    break;
                }
            }
            
            $row = array();
            foreach($fields as $field){
                $row["$field"]= $i->{"$field"};
            }
            
            $row['owner']		= $owner_tree;
			$row['notes']		= $notes_flag;
			$row['update']		= $action_flags['update'];
			$row['delete']		= $action_flags['delete'];
            array_push($items,$row);
        }
       
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }
     
    public function indexForFilter(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $query  = $this->{$this->main_model}->find();
        $this->CommonQuery->build_common_query($query,$user,[]);        
        $q_r    = $query->all();
        $items      = array();
        foreach($q_r as $i){
            array_push($items,array(
                'id'                    => $i->id, 
                'text'                  => $i->name
            ));
        }   

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }
      
    public function add() {

        if(!$this->_ap_right_check()){
            return;
        }

        $user       = $this->Aa->user_for_token($this);
        $user_id    = $user['id'];

        //Get the owner's id
         if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }
        
        $check_items = array('available_to_siblings', 't_c_check', 'register_users', 'lost_password');
        foreach($check_items as $ci){
            if(isset($this->request->data[$ci])){
                $this->request->data[$ci] = 1;
            }else{
                $this->request->data[$ci] = 0;
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
      
    public function edit() {

        if(!$this->_ap_right_check()){
            return;
        }

        //We will not modify user_id
        unset($this->request->data['user_id']);

        //Make available to siblings check
        if(isset($this->request->data['available_to_siblings'])){
            $this->request->data['available_to_siblings'] = 1;
        }else{
            $this->request->data['available_to_siblings'] = 0;
        }

		$entity = $this->{$this->main_model}->get($this->request->data['id']);
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
                'message'   => array('message' => __('Could not update item')),
                '_serialize' => array('errors','success','message')
            ));
        }
	}
	
	
    public function editSettings(){

        if(!$this->_ap_right_check()){
            return;
        }
            
        //We will not modify user_id
        unset($this->request->data['user_id']);
        $check_items = array(
            'reg_email',
            'reg_auto_add',
            'reg_mac_check',
            'register_users',
            't_c_check',
            'redirect_check',
            'slideshow_check',
            'user_login_check',
            'voucher_login_check',
            'auto_suffix_check',
            'usage_show_check',
            'lost_password'
	    );
	    
        foreach($check_items as $i){
            if(isset($this->request->data[$i])){
                $this->request->data[$i] = 1;
            }else{
                $this->request->data[$i] = 0;
            }
        }
        
        $entity = $this->{$this->main_model}->get($this->request->data['id']);
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
                'message'   => array('message' => __('Could not update item')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }
    
    public function editClickToConnect(){

        if(!$this->_ap_right_check()){
            return;
        }
        //We will not modify user_id
        unset($this->request->data['user_id']);

        //connect_check compulsory check
        if(isset($this->request->data['connect_check'])){
            $this->request->data['connect_check'] = 1;
        }else{
            $this->request->data['connect_check'] = 0;
        }

        //connect_only compulsory check
        if(isset($this->request->data['connect_only'])){
            $this->request->data['connect_only'] = 1;
        }else{
            $this->request->data['connect_only'] = 0;
        }

        $entity = $this->{$this->main_model}->get($this->request->data['id']);
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
                'message'   => array('message' => __('Could not update item')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }
    
    public function delete() {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        if(!$this->_ap_right_check()){
            return;
        }
           
	    if(isset($this->request->data['id'])){   //Single item delete

            //First find all the photos for this item then delete them           
            $q_r = $this->DynamicPhotos
                ->find()
                ->where(['DynamicPhotos.dynamic_detail_id' => $this->request->data['id']])
                ->all();
            foreach($q_r as $i){
                $file_to_delete = WWW_ROOT."img/dynamic_photos/".$i->file_name;
                $entity = $this->DynamicPhotos->get($i->id);
                if($this->DynamicPhotos->delete($entity)){
                    if(file_exists($file_to_delete)){
                        unlink($file_to_delete);
                    }
                }
            }
                    
            $this->DynamicDetail->id = $this->request->data['id'];
            $this->DynamicDetail->delete($this->DynamicDetail->id,true);
      
        }else{                          //Assume multiple item delete
            foreach($this->request->data as $d){

                //First find all the photos for this item then delete them             
                $q_r = $this->DynamicPhotos
                    ->find()
                    ->where(['DynamicPhotos.dynamic_detail_id' => $d['id']])
                    ->all();
                foreach($q_r as $i){
                    $file_to_delete = WWW_ROOT."img/dynamic_photos/".$i->file_name;
                    $entity = $this->DynamicPhotos->get($i->id);
                    if($this->DynamicPhotos->delete($entity)){
                        if(file_exists($file_to_delete)){
                            unlink($file_to_delete);
                        }
                    }
                }
                $e = $this->{$this->main_model}->get($d['id']);
                $this->{$this->main_model}->delete($e);
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

    public function view(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        
        $user_id    = $user['id'];
        $items      = array();
        
        if(isset($this->request->query['dynamic_detail_id'])){

            $q_r = $this->{$this->main_model}->get($this->request->query['dynamic_detail_id']);
            if($q_r){
            
                $fields = $this->{$this->main_model}->schema()->columns();
                $realm  = '';
            
                if($q_r->realm_id != null){
                    $this->loadModel('Realms'); 
                    $q_realm    = $this->Realms->get($q_r->realm_id);
                    if($q_r){
                        $realm = $q_realm->name;
                    }
                }
                $profile = '';
                
                if($q_r->profile_id != null){
                    $this->loadModel('Profiles');
                    $q_profile    = $this->Profiles->get($q_r->profile_id);
                    if($q_profile){
                        $profile = $q_profile->name;
                    }
                }
                
                $owner_tree     = $this->Users->find_parents($q_r->user_id);
                
                foreach($fields as $field){
	                $items["$field"]= $q_r->{"$field"};
		        }      
		           
                $items['owner']     = $owner_tree; 
                $items['realm']     = $realm;
                $items['profile']   = $profile;               
            }
        }
        
        $this->set(array(
            'data'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }
    
    public function uploadLogo($id = null){   
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        //This is a deviation from the standard JSON serialize view since extjs requires a html type reply when files
        //are posted to the server.    
        $this->viewBuilder()->layout('ext_file_upload');

        $path_parts     = pathinfo($_FILES['photo']['name']);
        $unique         = time();
        $dest           = WWW_ROOT."img/dynamic_details/".$unique.'.'.$path_parts['extension'];
        $dest_www       = "/cake3/rd_cake/webroot/img/dynamic_details/".$unique.'.'.$path_parts['extension'];
       
        $entity         = $this->{$this->main_model}->get($this->request->data['id']);
        $icon_file_name = $unique.'.'.$path_parts['extension'];
        $old_file       = $entity->icon_file_name;
        $entity->icon_file_name = $icon_file_name;
        
        if($this->{$this->main_model}->save($entity)){
            move_uploaded_file ($_FILES['photo']['tmp_name'] , $dest);
            $json_return['id']                  = $this->request->data['id'];
            $json_return['success']             = true;
            $json_return['icon_file_name']      = $icon_file_name;
            
            //Remove old file
            $file_to_delete = WWW_ROOT."img/dynamic_details/".$old_file;
            if(file_exists($file_to_delete)){
                unlink($file_to_delete);
            }
    
        }else{       
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
                  
            $json_return['errors']      = $a;
            $json_return['message']     = array("message"   => __('Problem uploading photo'));
            $json_return['success']     = false;
        }
        $this->set('json_return',$json_return);
    }
    
    public function indexPhoto(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();
        if(isset($this->request->query['dynamic_detail_id'])){
            $dd_id = $this->request->query['dynamic_detail_id'];

            $q_r = $this->DynamicPhotos
                ->find()
       	        ->where(['DynamicPhotos.dynamic_detail_id' =>$dd_id])
       	        ->all();
       	        
            foreach($q_r as $i){
                $id     = $i->id;
                $dd_id  = $i->dynamic_detail_id;
                $t      = $i->title;
                $d      = $i->description;
                $u      = $i->url;
                $f      = $i->file_name;
                $location = Configure::read('paths.dynamic_photos').$f;
                array_push($items,
                    array(
                        'id'                => $id, 
                        'dynamic_detail_id' => $dd_id, 
                        'title'             => $t, 
                        'description'       => $d,
                        'url'               => $u, 
                        'file_name'         => $f,
                        'img'               => "/cake3/rd_cake/webroot/files/image.php?width=400&height=200&image=".$location
                    )
                );
            }
        }
        
        $this->set(array(
            'items'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'items')
        ));
    }
    
    public function uploadPhoto($id = null){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        //This is a deviation from the standard JSON serialize view since extjs requires a html type reply when files
        //are posted to the server.
        $this->viewBuilder()->layout('ext_file_upload');

        $path_parts   = pathinfo($_FILES['photo']['name']);
        $unique       = time();
        $dest         = WWW_ROOT."img/dynamic_photos/".$unique.'.'.$path_parts['extension'];
        $dest_www     = "/cake3/rd_cake/webroot/img/dynamic_photos/".$unique.'.'.$path_parts['extension'];
        
        $this->request->data['file_name'] = $unique.'.'.$path_parts['extension'];
        
        $entity = $this->DynamicPhotos->newEntity($this->request->data()); 
        if($this->DynamicPhotos->save($entity)){
            move_uploaded_file ($_FILES['photo']['tmp_name'] , $dest);
            $json_return['id']                  = $entity->id;
            $json_return['success']             = true;       
        }else{
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
            
            $json_return['errors']      = $a;
            $json_return['message']     = array("message"   => __('Problem uploading photo'));
            $json_return['success']     = false;
           
        }
        
        $this->set('json_return',$json_return);   
    }
    
    public function deletePhoto($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        if(!$this->_ap_right_check()){
            return;
        }

	    if(isset($this->request->data['id'])){   //Single item delete

            //Get the filename to delete
            $entity = $this->DynamicPhotos->get($this->request->data['id']);
            if($entity){
                $file_to_delete = WWW_ROOT."img/dynamic_photos/".$entity->file_name;
                if($this->DynamicPhotos->delete($entity)){
                    if(file_exists($file_to_delete)){
                        unlink($file_to_delete);
                    }
                }
            }     
        }else{                          //Assume multiple item delete
            foreach($this->request->data as $d){
                //Get the filename to delete
                $entity = $this->DynamicPhotos->get($d['id']);
                if($entity){
                    $file_to_delete = WWW_ROOT."img/dynamic_photos/".$entity->file_name;
                    if($this->DynamicPhotos->delete($entity)){
                        if(file_exists($file_to_delete)){
                            unlink($file_to_delete);
                        }
                    }
                }
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}
	
	public function editPhoto(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $this->viewBuilder()->layout('ext_file_upload'); 
        $entity = $this->DynamicPhotos->get($this->request->data['id']);
        
        if($entity){ 
            $new_photo = false;
            if($_FILES['photo']['size'] > 0){  
                $file_name      = $entity->file_name;
                $file_to_delete = WWW_ROOT."img/dynamic_photos/".$file_name;
                unlink($file_to_delete);

                $path_parts     = pathinfo($_FILES['photo']['name']);
                $unique         = time();
                $dest           = WWW_ROOT."img/dynamic_photos/".$unique.'.'.$path_parts['extension'];
                move_uploaded_file ($_FILES['photo']['tmp_name'] , $dest);
                $new_photo = true;
            }
             
            $this->DynamicPhotos->patchEntity($entity, $this->request->data());
            if($new_photo){
                $entity->file_name = $unique.'.'.$path_parts['extension']; 
            }  
            $this->DynamicPhotos->save($entity);
        }  

        $json_return['success'] = true;
        $this->set('json_return',$json_return);
    }

 

    public function availableThemes(){
 
        $items = array();
        Configure::load('DynamicLogin','default'); 
        $data       = Configure::read('DynamicLogin.theme');
        foreach(array_keys($data) as $i){
            array_push($items, array('name' => $i,'id' => $i));   
        }
        
        if(
            (isset($this->request->query['exclude_custom']))&&
            ($this->request->query['exclude_custom'] == 'true')
        ){
           array_shift($items); //Remove the first item which will be "Custom" in the config file
        }
            
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

	 
    public function menuForGrid(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        $menu = $this->GridButtons->returnButtons($user,true,'dynamic_details');
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }
    
    public function menuForPhotos(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        $menu = $this->GridButtons->returnButtons($user,false,'basic');
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }
    
    public function menuForDynamicPages(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        $menu = $this->GridButtons->returnButtons($user,false,'basic');
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }
    
    public function menuForDynamicPairs(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        $menu = $this->GridButtons->returnButtons($user,false,'basic');
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
    
    private function _find_username_and_password($id){
    
        $this->loadModel('PermanentUsers');

		$q_r = $this->PermanentUsers->get($id);
		$user_data = array('username' => 'notfound','password' => 'notfound');
		if($q_r){
			$un                     = $q_r->username;
			$user_data['username']  = $un;	
			$this->loadModel('Radchecks');
			$q_pw = $this->Radchecks
			    ->find() 
				->where(['Radchecks.username' => $un,'Radchecks.attribute' => 'Cleartext-Password'])
				->first();

			if($q_pw){
				$user_data['password'] = $q_pw->value;
			}
		}
		return $user_data;
	}
	
	private function _doBrowserDetectFor($captive_portal = 'coova' ){ //Can be 'coova' / 'mikrotik' / 'ruckus'
    
        $conditions     = array("OR" =>array());
		$query_string   = $_SERVER['QUERY_STRING'];

		foreach(array_keys($this->request->query) as $key){
                array_push($conditions["OR"],
                    array("DynamicPairs.name" => $key, "DynamicPairs.value" =>  $this->request->query[$key])
                ); //OR query all the keys
       	}

       	$q_r = $this->DynamicPairs
       	    ->find()
       	    ->contain('DynamicDetails')
       	    ->where($conditions)
       	    ->order(['DynamicPairs.priority' => 'DESC'])
       	    ->first();
      	

		//See which Theme are selected
		$theme          = 'Default';
		$theme_selected = 'Default';	
		$i18n           = 'en_GB';
		if($q_r){
            $theme_selected =  $q_r->dynamic_detail->theme;
            if($q_r->dynamic_detail->default_language != ''){
                $i18n = $q_r->dynamic_detail->default_language;
            }
		}
		if (strpos($query_string, '&i18n') == false){
		    $query_string = $query_string."&i18n=$i18n";
	    }
		
        if($theme_selected == 'Custom'){ //With custom themes we read the valuse out of the DB
        
            //ruckus is special
            if($captive_portal == 'ruckus'){
                $captive_portal = 'coova'; //We use Coova's URLs for the Custom Ruckus
            }
        
		    $redir_to = $q_r->dynamic_detail->{$captive_portal."_desktop_url"}.'?'.$query_string;
		    if($this->request->is('mobile')){
                $redir_to = $q_r->dynamic_detail->{$captive_portal."_mobile_url"}.'?'.$query_string;
            }    
		}else{  //Else we fetch the 'global' theme's value from the file

     	    Configure::load('DynamicLogin','default');
            $pages       = Configure::read('DynamicLogin.theme.'.$theme_selected); //Read the defaults
		    if(!$pages){
			    $pages       = Configure::read('DynamicLogin.theme.'.$theme); //Read the defaults
		    }

		    $redir_to = $pages[$captive_portal.'_desktop'].'?'.$query_string;
            if($this->request->is('mobile')){
                $redir_to = $pages[$captive_portal.'_mobile'].'?'.$query_string;
            }
        }     
        return $redir_to;     
    }
    
    private function _doPreviewChilli(){
	
	    if(isset($this->request->query['wizard_name'])){
	        $w_name = $this->request->query['wizard_name'];
	        $q_r = $this->{$this->main_model}
                ->find()
                ->where([$this->main_model.'.name' => $w_name])
                ->first();
		    if($q_r){
		        $this->request->query['dynamic_id'] = $q_r->id;
		        $_SERVER['QUERY_STRING'] = $_SERVER['QUERY_STRING'].'&dynamic_id='.$this->request->query['dynamic_id'].'&uamip=10.1.0.1&uamport=3990';
		    }   
	    }else{
		    $q_r = $this->{$this->modelClass}->get($this->request->query['dynamic_id']);
        }
      	
		//See which Theme are selected
		$theme = 'Default';
		$i18n = 'en_GB';
		if($q_r){
            $theme_selected =  $q_r->theme;
            if($q_r->default_language != ''){
                $i18n = $q_r->default_language;
            }
		}

		if($theme_selected == 'Custom'){ //With custom themes we read the valuse out of the DB
		
		    $redir_to = $q_r['DynamicDetail']['coova_desktop_url'].'?'.$_SERVER['QUERY_STRING']."&i18n=$i18n";
		    
        }else{   
		    Configure::load('DynamicLogin','default'); 
            $pages       = Configure::read('DynamicLogin.theme.'.$theme_selected); //Read the defaults
		    if(!$pages){
			    $pages       = Configure::read('DynamicLogin.theme.'.$theme); //Read the defaults
		    }
		    $redir_to = $pages['coova_desktop'].'?'.$_SERVER['QUERY_STRING']."&i18n=$i18n";
		}
        return $redir_to;
	}	
}
