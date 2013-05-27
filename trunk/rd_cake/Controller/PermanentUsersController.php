<?php
App::uses('AppController', 'Controller');

class PermanentUsersController extends AppController {

    public $name       = 'PermanentUsers';
    public $uses       = array('User');
    public $components = array('Aa');
    protected $base    = "Access Providers/Controllers/PermanentUsers/";

    //--- FROM THE OLD ---
    /* json_index json_add json_del json_view json_edit 
        // json_prepaid_list json_tabs json_send_message csv json_change_profile 
        // json_private_attributes json_add_private json_del_private json_edit_private
        // json_test_auth json_disable json_usage json_kick json_notify_detail json_notify_save
        // json_view_activity json_del_activity json_password 
        // json_actions json_actions_for_user_private json_actions_for_user_profile json_actions_for_user_activity
    */

    //-- NOTES on users:
    //-- Each user belongs to (A) group (group_id) = Permanent Users. (B) a realm (realm_id) (C) a creator (user_id)
    //-- (D) Profile ID (profile_id) (E) a Language ID (language_id) (F) an Auth Method id (auth_method_id)

    //-- Each user will have a token which should be used in the URL to do Ajax calls

    //-- NOTES on rights:
    //-- Most controller actions will require a token in the query string to determine who originated the request
    //-- The rights of that person will then be checked and also against who it is attempting to be done.


    //-------- BASIC CRUD -------------------------------


     public function export_csv(){

        $this->autoRender   = false;

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        //Build query
        $user_id    = $user['id'];
        $c          = $this->_build_common_query($user);
        $q_r        = $this->{$this->modelClass}->find('all', $c);

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
                        foreach($i['UserNote'] as $n){
                            if(!$this->_test_for_private_parent($n['Note'],$user)){
                                $notes = $notes.'['.$n['Note']['note'].']';    
                            }
                        }
                        array_push($csv_line,$notes);
                    }elseif($column_name =='owner'){
                        $owner_id       = $i['User']['parent_id'];
                        $owner_tree     = $this->_find_parents($owner_id);
                        array_push($csv_line,$owner_tree); 
                    }elseif($column_name =='realm'){
                        $realm = 'n/a';
                        foreach($i['Radcheck'] as $rc){       
                            if($rc['attribute'] == 'Rd-Realm'){
                                $realm = $rc['value'];
                            }
                        }
                        array_push($csv_line,$realm); 
                    }elseif($column_name =='profile'){
                        $profile = 'n/a';
                        foreach($i['Radcheck'] as $rc){       
                            if($rc['attribute'] == 'User-Profile'){
                                $profile = $rc['value'];
                            }
                        }
                        array_push($csv_line,$profile); 
                    }else{
                        array_push($csv_line,$i['User']["$column_name"]);  
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


    public function index(){
        //-- Required query attributes: token;
        //-- Optional query attribute: sel_language (for i18n error messages)
        //-- also LIMIT: limit, page, start (optional - use sane defaults)
        //-- FILTER <- This will need fine tunning!!!!
        //-- AND SORT ORDER <- This will need fine tunning!!!!

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        $c = $this->_build_common_query($user); 

        //===== PAGING (MUST BE LAST) ======
        $limit  = 50;   //Defaults
        $page   = 1;
        $offset = 0;
        if(isset($this->request->query['limit'])){
            $limit  = $this->request->query['limit'];
            $page   = $this->request->query['page'];
            $offset = $this->request->query['start'];
        }

        $c_page             = $c;
        $c_page['page']     = $page;
        $c_page['limit']    = $limit;
        $c_page['offset']   = $offset;

        $total  = $this->{$this->modelClass}->find('count'  , $c);  
        $q_r    = $this->{$this->modelClass}->find('all'    , $c_page);

        $items  = array();
        foreach($q_r as $i){ 

            

            $owner_id       = $i['Owner']['id'];
            $owner_tree     = $this->_find_parents($owner_id);

            //Create notes flag
            $notes_flag  = false;
            foreach($i['UserNote'] as $un){
                if(!$this->_test_for_private_parent($un['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

            //Find the realm and profile names
            $realm  = 'not defined';
            $profile= 'not defined';
            foreach($i['Radcheck'] as $rc){

                if($rc['attribute'] == 'User-Profile'){
                    $profile = $rc['value'];
                }

                if($rc['attribute'] == 'Rd-Realm'){
                    $realm = $rc['value'];
                }

            }

            array_push($items,
                array(
                    'id'        => $i['User']['id'], 
                    'owner'     => $owner_tree,
                    'username'  => $i['User']['username'],
                    'name'      => $i['User']['name'],
                    'surname'   => $i['User']['surname'], 
                    'phone'     => $i['User']['phone'], 
                    'email'     => $i['User']['email'],
                    'address'   => $i['User']['address'],
                    'auth_type' => $i['User']['auth_type'],
                    'realm'     => $realm,
                    'profile'   => $profile,
                    'active'    => $i['User']['active'], 
                    'monitor'   => $i['User']['monitor'],
                    'last_accept_time'      => $i['User']['last_accept_time'],
                    'last_accept_nas'       => $i['User']['last_accept_nas'],
                    'last_reject_time'      => $i['User']['last_reject_time'],
                    'last_reject_nas'       => $i['User']['last_reject_nas'],
                    'last_reject_message'   => $i['User']['last_reject_message'],
                    'data_cap'              => 80,
                    'time_cap'              => 20,
                    'notes'     => $notes_flag
                )
            );
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

        $this->request['active']       = 0;
        $this->request['monitor']      = 0;     


        //Two fields should be tested for first:
        if(array_key_exists('active',$this->request->data)){
            $this->request->data['active'] = 1;
        }

        if(array_key_exists('monior',$this->request->data)){
            $this->request->data['monitor'] = 1;
        }

        if($this->request->data['parent_id'] == '0'){ //This is the holder of the token
            $this->request->data['parent_id'] = $user['id'];
        }

        if(!array_key_exists('language',$this->request->data)){
            $this->request->data['language'] = Configure::read('language.default');
        }

        //Get the language and country
        $country_language   = explode( '_', $this->request->data['language'] );

        $country            = $country_language[0];
        $language           = $country_language[1];

        $this->request->data['language_id'] = $language;
        $this->request->data['country_id']  = $country;

        //Get the group ID for AP's
        $group_name = Configure::read('group.user');
        $q_r        = ClassRegistry::init('Group')->find('first',array('conditions' =>array('Group.name' => $group_name)));
        $group_id   = $q_r['Group']['id'];
        $this->request->data['group_id'] = $group_id;

        //Zero the token to generate a new one for this user:
        $this->request->data['token'] = '';

        //The rest of the attributes should be same as the form..
        $this->{$this->modelClass}->create();
        if ($this->{$this->modelClass}->save($this->request->data)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';
            $this->set(array(
                'errors'    => $this->{$this->modelClass}->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }

    public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:   
            $item       = $this->{$this->modelClass}->findById($this->data['id']);
            $owner_id   = $item['User']['parent_id'];
            $username   = $item['User']['username'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->{$this->modelClass}->id = $this->data['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    $this->{$this->modelClass}->recover();     //This is a (potential) ugly hack
                    $this->_delete_clean_up_user($username);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->{$this->modelClass}->id = $this->data['id'];
                $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                $this->{$this->modelClass}->recover();     //This is a (potential) ugly hack
                $this->_delete_clean_up_user($username);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->{$this->modelClass}->findById($d['id']);
                $owner_id   = $item['User']['parent_id'];
                $username   = $item['User']['username'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->{$this->modelClass}->id = $d['id'];
                        $this->{$this->modelClass}->delete($this->{$this->modelClass}->id,true);
                        $this->{$this->modelClass}->recover();     //This is a (potential) ugly hack
                        $this->_delete_clean_up_user($username);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->{$this->modelClass}->id = $d['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    $this->{$this->modelClass}->recover();     //This is a (potential) ugly hack
                    $this->_delete_clean_up_user($username);
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


    public function edit(){

    }

    public function view_basic_info(){

        //We need the user_id;
        //We supply the profile_id; realm_id; cap; always_active; from_date; to_date

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];

        $items = array();

        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->query['user_id'])){

            $profile        = false;
            $realm          = false;
            $always_active  = true;
            $to_date        = false;
            $from_date      = false;
            $cap            = false;

            $this->{$this->modelClass}->contain('Radcheck');
            $q_r = $this->{$this->modelClass}->findById($this->request->query['user_id']);

            foreach($q_r['Radcheck'] as $rc){

                if($rc['attribute'] == 'Rd-Realm'){
                  $realm =  $rc['value'];
                }

                if($rc['attribute'] == 'User-Profile'){
                  $profile =  $rc['value'];
                }

                if($rc['attribute'] == 'Rd-Account-Activation-Time'){
                  $from_date =  $rc['value'];
                }

                if($rc['attribute'] == 'Expiration'){
                  $to_date =  $rc['value'];
                }
                
                if($rc['attribute'] == 'Rd-Cap-Type'){
                  $cap =  $rc['value'];
                }
            }
        
            //Now we do the rest....
            if($profile){
                $q_r = $this->User = ClassRegistry::init('Profile')->findByName($profile);
                $items['profile_id'] = intval($q_r['Profile']['id']);
            }

            if($realm){
                $q_r = $this->User = ClassRegistry::init('Realm')->findByName($realm);
                $items['realm_id'] = intval($q_r['Realm']['id']);
            }

            if($cap){
                $items['cap'] = $cap;
            }

            if(($from_date)&&($to_date)){
                $items['always_active'] = false;
                $items['from_date']     = $this->_extjs_format_radius_date($from_date);
                $items['to_date']       = $this->_extjs_format_radius_date($to_date);
            }else{
                $items['always_active'] = true;
            }
        }
               // $items = array('realm_id' => 26, 'profile_id' => 2, 'always_active' => false,'cap' => 'soft');

        $this->set(array(
            'data'   => $items, //For the form to load we use data instead of the standard items as for grids
            'success' => true,
            '_serialize' => array('success','data')
        ));
    }

    public function edit_basic_info(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->data['id'])){
            $q_r        = $this->{$this->modelClass}->findById($this->request->data['id']);
            $username   = $q_r['User']['username'];

            if(isset($this->request->data['profile_id'])){
                $q_r = ClassRegistry::init('Profile')->findById($this->data['profile_id']);
                $profile_name = $q_r['Profile']['name'];
                $this->_replace_radcheck_item($username,'User-Profile',$profile_name);
            }

            if(isset($this->request->data['realm_id'])){
                $q_r = ClassRegistry::init('Realm')->findById($this->data['realm_id']);
                $realm_name = $q_r['Realm']['name'];
                $this->_replace_radcheck_item($username,'Rd-Realm',$realm_name);
            }

            if(isset($this->request->data['to_date'])){
                $expiration = $this->_radius_format_date($this->request->data['to_date']);
                $this->_replace_radcheck_item($username,'Expiration',$expiration);
            }

            if(isset($this->request->data['from_date'])){
                $expiration = $this->_radius_format_date($this->request->data['from_date']);
                $this->_replace_radcheck_item($username,'Rd-Account-Activation-Time',$expiration);
            }

            
            if(isset($this->request->data['always_active'])){ //Clean up if there were previous ones
                ClassRegistry::init('Radcheck')->deleteAll(
                    array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Account-Activation-Time'), false
                );

                ClassRegistry::init('Radcheck')->deleteAll(
                    array('Radcheck.username' => $username,'Radcheck.attribute' => 'Expiration'), false
                );
            }
            
            if(isset($this->request->data['cap'])){
                $this->_replace_radcheck_item($username,'Rd-Cap-Type',$this->request->data['cap']);
            }else{              //Clean up if there were previous ones
                ClassRegistry::init('Radcheck')->deleteAll(
                    array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Cap-Type'), false
                );
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

    public function view_personal_info(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        $items = array();
        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->query['user_id'])){

            $this->{$this->modelClass}->contain();
            $q_r = $this->{$this->modelClass}->findById($this->request->query['user_id']);
           // print_r($q_r);
            if($q_r){
                $language = $q_r['User']['country_id'].'_'.$q_r['User']['language_id'];
                $items['language']  = $language;
                $items['name']      = $q_r['User']['name'];
                $items['surname']   = $q_r['User']['surname'];
                $items['phone']     = $q_r['User']['phone'];
                $items['address']   = $q_r['User']['address'];
                $items['email']     = $q_r['User']['email'];
            }
        }

        $this->set(array(
            'data'   => $items, //For the form to load we use data instead of the standard items as for grids
            'success' => true,
            '_serialize' => array('success','data')
        ));

    }

    public function edit_personal_info(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        //TODO Check if the owner of this user is in the chain of the APs

        unset($this->request->data['token']);
        //Get the language and country
        $country_language   = explode( '_', $this->request->data['language'] );

        $country            = $country_language[0];
        $language           = $country_language[1];

        $this->request->data['language_id'] = $language;
        $this->request->data['country_id']  = $country;

        if ($this->User->save($this->request->data)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));

        }else{
             $this->set(array(
                'success' => false,
                '_serialize' => array('success')
            ));
        }
    }

    public function private_attr_index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();

        $read_only_attributes = array(
            'Rd-User-Type', 'Rd-Device-Owner', 'Rd-Account-Disabled', 'User-Profile', 'Expiration',
            'Rd-Account-Activation-Time', 'Rd-Not-Track-Acct', 'Rd-Not-Track-Auth', 'Rd-Auth-Type', 
            'Rd-Cap-Type', 'Rd-Realm', 'Cleartext-Password'
        );

       // $exclude_attribues = array(
       //     'Cleartext-Password'
       // )

        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->query['username'])){
            $username = $this->request->query['username'];
            $q_r = ClassRegistry::init('Radcheck')->find('all',array('conditions' => array('Radcheck.username' => $username)));
            foreach($q_r as $i){
                $edit_flag      = true;
                $delete_flag    = true;
                if(in_array($i['Radcheck']['attribute'],$read_only_attributes)){
                    $edit_flag      = false;
                    $delete_flag    = false;
                }     

                array_push($items,array(
                    'id'        => 'chk_'.$i['Radcheck']['id'],
                    'type'      => 'check', 
                    'attribute' => $i['Radcheck']['attribute'],
                    'op'        => $i['Radcheck']['op'],
                    'value'     => $i['Radcheck']['value'],
                    'edit'      => $edit_flag,
                    'delete'    => $delete_flag
                ));
            }

            $q_r = ClassRegistry::init('Radreply')->find('all',array('conditions' => array('Radreply.username' => $username)));
            foreach($q_r as $i){
                $edit_flag      = true;
                $delete_flag    = true;
                if(in_array($i['Radreply']['attribute'],$read_only_attributes)){
                    $edit_flag      = false;
                    $delete_flag    = false;
                }     

                array_push($items,array(
                    'id'        => 'rpl_'.$i['Radreply']['id'],
                    'type'      => 'reply', 
                    'attribute' => $i['Radreply']['attribute'],
                    'op'        => $i['Radreply']['op'],
                    'value'     => $i['Radreply']['value'],
                    'edit'      => $edit_flag,
                    'delete'    => $delete_flag
                ));
            }
        }

        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    public function private_attr_add(){

         if(isset($this->request->query['username'])){
            $username = $this->request->query['username'];
            $this->request->data['username'] = $username;

            //CHECK
            if($this->request->data['type'] == 'check'){
                $rc = ClassRegistry::init('Radcheck');
                $rc->create();
                if ($rc->save($this->request->data)) {
                    $id = 'chk_'.$rc->id;
                    $this->request->data['id'] = $id;
                    $this->set(array(
                        'items'     => $this->request->data,
                        'success'   => true,
                        '_serialize' => array('success','items')
                    ));
                } else {
                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $rc->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not create item')),
                        '_serialize' => array('errors','success','message')
                    ));
                }
            }

            //REPLY
            if($this->request->data['type'] == 'reply'){
                $rr = ClassRegistry::init('Radreply');
                $rr->create();
                if ($rr->save($this->request->data)) {
                    $id = 'rpl_'.$rr->id;
                    $this->request->data['id'] = $id;
                    $this->set(array(
                        'items'     => $this->request->data,
                        'success'   => true,
                        '_serialize' => array('success','items')
                    ));
                } else {
                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $rr->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not create item')),
                        '_serialize' => array('errors','success','message')
                    ));
                }
            }
        }
    }

   public function private_attr_edit(){

         if(isset($this->request->query['username'])){
            $username = $this->request->query['username'];
            $this->request->data['username'] = $username;

            //Check if the type check was not changed
            if((preg_match("/^chk_/",$this->request->data['id']))&&($this->request->data['type']=='check')){ //check Type remained the same
                //Get the id for this one
                $type_id            = explode( '_', $this->data['id']);
                $this->request->data['id']   = $type_id[1];
                $rc = ClassRegistry::init('Radcheck');
                if ($rc->save($this->request->data)) {
                    $id = 'chk_'.$rc->id;
                    $this->request->data['id'] = $id;
                    $this->set(array(
                        'items'     => $this->request->data,
                        'success'   => true,
                        '_serialize' => array('success','items')
                    ));
                }else{
                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $rc->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not update item')),
                        '_serialize' => array('errors','success','message')
                    ));
                }
            }

            //Check if the type reply was not changed
            if((preg_match("/^rpl_/",$this->request->data['id']))&&($this->data['type']=='reply')){ //reply Type remained the same
                //Get the id for this one
                $type_id            = explode( '_', $this->request->data['id']);
                $this->request->data['id']   = $type_id[1];
                $rr = ClassRegistry::init('Radreply');
                if ($rr->save($this->request->data)) {
                    $id = 'rpl_'.$rr->id;
                    $this->request->data['id'] = $id;
                    $this->set(array(
                        'items'     => $this->request->data,
                        'success'   => true,
                        '_serialize' => array('success','items')
                    ));
                } else {
                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $rr->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not update item')),
                        '_serialize' => array('errors','success','message')
                    ));
                }
            }

            //____ Attribute Type changes ______
            if((preg_match("/^chk_/",$this->request->data['id']))&&($this->request->data['type']=='reply')){
                //Delete the check; add a reply
                $type_id            = explode( '_', $this->request->data['id']);
                $rc = ClassRegistry::init('Radcheck');
                $rc->id = $type_id[1];
                $rc->delete();

                //Create
                $rr = ClassRegistry::init('Radreply');
                $rr->create();
                if ($rr->save($this->request->data)) {
                    $id = 'rpl_'.$rr->id;
                    $this->request->data['id'] = $id;
                    $this->set(array(
                        'items'     => $this->request->data,
                        'success'   => true,
                        '_serialize' => array('success','items')
                    ));
                } else {
                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $rr->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not update item')),
                        '_serialize' => array('errors','success','message')
                    ));
                }
            }

            if((preg_match("/^rpl_/",$this->request->data['id']))&&($this->request->data['type']=='check')){

                //Delete the check; add a reply
                $type_id            = explode( '_', $this->request->data['id']);
                $rr = ClassRegistry::init('Radreply');
                $rr->id = $type_id[1];
                $rr->delete();

                //Create
                $rc = ClassRegistry::init('Radcheck');
                $rc->create();
                if ($rc->save($this->request->data)) {
                    $id = 'chk_'.$rc->id;
                    $this->request->data['id'] = $id;
                    $this->set(array(
                        'items'     => $this->request->data,
                        'success'   => true,
                        '_serialize' => array('success','items')
                    ));
                } else {
                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $rc->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not update item')),
                        '_serialize' => array('errors','success','message')
                    ));
                }
            }
        }
    }

    public function private_attr_delete(){

        $fail_flag = true;

        $rc = ClassRegistry::init('Radcheck');
        $rr = ClassRegistry::init('Radreply');

        if(isset($this->data['id'])){   //Single item delete
            $type_id            = explode( '_', $this->request->data['id']);
            if(preg_match("/^chk_/",$this->request->data['id'])){
                $rc->id = $type_id[1];
                $rc->delete();
            }

            if(preg_match("/^rpl_/",$this->request->data['id'])){   
                $rr->id = $type_id[1];
                $rr->delete();
            }
            
            $fail_flag = false;
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                $type_id            = explode( '_', $d['id']);
                if(preg_match("/^chk_/",$d['id'])){
                    $rc->id = $type_id[1];
                    $rc->delete();
                }
                if(preg_match("/^rpl_/",$d['id'])){   
                    $rr->id = $type_id[1];
                    $rr->delete();
                }          
                $fail_flag = false;  
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

    public function view_tracking(){

         //We need the user_id;
        //We supply the track_auth, track_acct

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $items = array();

        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->query['user_id'])){

            $acct           = true;
            $auth           = true;

            $this->{$this->modelClass}->contain('Radcheck');
            $q_r = $this->{$this->modelClass}->findById($this->request->query['user_id']);

            foreach($q_r['Radcheck'] as $rc){

                if($rc['attribute'] == 'Rd-Not-Track-Acct'){
                    if($rc['value'] == 1){
                        $acct = false;
                    }
                }

                if($rc['attribute'] == 'Rd-Not-Track-Auth'){
                  if($rc['value'] == 1){
                        $auth = false;
                  }
                } 
            }
            $items['track_auth'] = $auth;
            $items['track_acct'] = $acct;
            
        }

        $this->set(array(
            'data'   => $items, //For the form to load we use data instead of the standard items as for grids
            'success' => true,
            '_serialize' => array('success','data')
        ));
    }

    public function edit_tracking(){

          //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->data['id'])){
            $q_r        = $this->{$this->modelClass}->findById($this->request->data['id']);
            $username   = $q_r['User']['username'];
           
            //Not Track auth (Rd-Not-Track-Auth) *By default we will (in post-auth) 
            if(!isset($this->request->data['track_auth'])){
                $this->_replace_radcheck_item($username,'Rd-Not-Track-Auth',1);
            }else{              //Clean up if there were previous ones
                ClassRegistry::init('Radcheck')->deleteAll(
                    array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Not-Track-Auth'), false
                );
            }

            //Not Track acct (Rd-Not-Track-Acct) *By default we will (in pre-acct)
            if(!isset($this->request->data['track_acct'])){
                $this->_replace_radcheck_item($username,'Rd-Not-Track-Acct',1);
            }else{              //Clean up if there were previous ones
                ClassRegistry::init('Radcheck')->deleteAll(
                    array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Not-Track-Acct'), false
                );
            }

        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

    //Adds of removes the special Rd-Mac-Check check attribute to a permanent user to restrict the devices they can use
    public function restrict_list_of_devices(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        if((isset($this->request->query['username']))&&(isset($this->request->query['restrict']))){
            $username = $this->request->query['username'];
            if($this->request->query['restrict'] == 'true'){
                $this->_replace_radcheck_item($username,'Rd-Mac-Check',1);       
            }else{
                ClassRegistry::init('Radcheck')->deleteAll(
                    array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Mac-Check'), false
                ); 
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

    public function change_password(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //For this action to sucees on the User model we need: 
        // id; group_id; password; token should be empty ('')
        $success = false;

        if(isset($this->request->data['user_id'])){

            $d           = array();
            //We need to give the group_id to trigger the radcheck modifications.
            $group_name  = Configure::read('group.user');
            $q_r         = $this->{$this->modelClass}->Group->find('first',array('conditions' =>array('Group.name' => $group_name)));
            $group_id    = $q_r['Group']['id'];

            $d['User']['id']        = $this->request->data['user_id'];
            $d['User']['group_id']  = $group_id;  
            $d['User']['password']  = $this->request->data['password'];
            $d['User']['token']     = '';
            $this->{$this->modelClass}->id  = $this->request->data['user_id'];
            $this->{$this->modelClass}->save($d);
            $success               = true;  
        }

        $this->set(array(
            'success' => $success,
            '_serialize' => array('success',)
        ));
    }

    public function enable_disable(){
        
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $rb     = $this->request->data['rb'];
        $d      = array();
        //For this action to sucees on the User model we need: 
        // id; group_id; active


        if($rb == 'enable'){
            $d['User']['active'] = 1;
        }else{
            $d['User']['active'] = 0;
        }

        //We need to give the group_id to trigger the radcheck modifications.
        $group_name  = Configure::read('group.user');
        $q_r         = $this->{$this->modelClass}->Group->find('first',array('conditions' =>array('Group.name' => $group_name)));
        $group_id    = $q_r['Group']['id'];

        $d['User']['group_id'] = $group_id;

        foreach(array_keys($this->request->data) as $key){
            if(preg_match('/^\d+/',$key)){
                $d['User']['id']                = $key;
                $this->{$this->modelClass}->id  = $key;
                $this->{$this->modelClass}->save($d);   
            }
        }
        $this->set(array(
            'success' => true,
            '_serialize' => array('success',)
        ));
    }


    public function note_index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();
        if(isset($this->request->query['for_id'])){
            $u_id   = $this->request->query['for_id'];
            $q_r    = $this->User->UserNote->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('UserNote.user_id' => $u_id)
                )
            );
            foreach($q_r as $i){
                if(!$this->_test_for_private_parent($i['Note'],$user)){
                    $owner_id   = $i['Note']['user_id'];
                    $owner      = $this->_find_parents($owner_id);
                    array_push($items,
                        array(
                            'id'        => $i['Note']['id'], 
                            'note'      => $i['Note']['note'], 
                            'available_to_siblings' => $i['Note']['available_to_siblings'],
                            'owner'     => $owner,
                            'delete'    => true
                        )
                    );
                }
            }
        } 
        $this->set(array(
            'items'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'items')
        ));
    }

    public function note_add(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //Get the creator's id
        if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }

        //Make available to siblings check
        if(isset($this->request->data['available_to_siblings'])){
            $this->request->data['available_to_siblings'] = 1;
        }else{
            $this->request->data['available_to_siblings'] = 0;
        }

        $success    = false;
        $msg        = array('message' => __('Could not create note'));
        $this->User->UserNote->Note->create(); 
        //print_r($this->request->data);
        if ($this->User->UserNote->Note->save($this->request->data)) {
            $d                          = array();
            $d['UserNote']['user_id']   = $this->request->data['for_id'];
            $d['UserNote']['note_id']   = $this->User->UserNote->Note->id;
            $this->User->UserNote->create();
            if ($this->User->UserNote->save($d)) {
                $success = true;
            }
        }

        if($success){
            $this->set(array(
                'success' => $success,
                '_serialize' => array('success')
            ));
        }else{
             $this->set(array(
                'success' => $success,
                'message' => $message,
                '_serialize' => array('success','message')
            ));
        }
    }

    public function note_del(){

        if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $this->User = ClassRegistry::init('User');
        $fail_flag  = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:   
            $item       = $this->User->UserNote->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->User->UserNote->Note->id = $this->data['id'];
                    $this->User->UserNote->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->User->UserNote->Note->id = $this->data['id'];
                $this->User->UserNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->User->UserNote->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->User->UserNote->Note->id = $d['id'];
                        $this->User->UserNote->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->User->UserNote->Note->id = $d['id'];
                    $this->User->UserNote->Note->delete($d['id'],true);
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


    //--------- END BASIC CRUD ---------------------------

    //----- Menus ------------------------
    public function menu_for_grid(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        //Empty by default
        $menu = array();

        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin

            $menu = array(
                    array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                        array( 'xtype' =>  'splitbutton',  'iconCls' => 'b-reload',   'scale'   => 'large', 'itemId'    => 'reload',   'tooltip'    => _('Reload'),
                            'menu'  => array( 
                                'items' => array( 
                                    '<b class="menu-title">Reload every:</b>',
                                  //  array( 'text'   => _('Cancel auto reload'),   'itemId' => 'mnuRefreshCancel', 'group' => 'refresh', 'checked' => true ),
                                    array( 'text'  => _('30 seconds'),      'itemId'    => 'mnuRefresh30s', 'group' => 'refresh','checked' => false ),
                                    array( 'text'  => _('1 minute'),        'itemId'    => 'mnuRefresh1m', 'group' => 'refresh' ,'checked' => false),
                                    array( 'text'  => _('5 minutes'),       'itemId'    => 'mnuRefresh5m', 'group' => 'refresh', 'checked' => false ),
                                    array( 'text'  => _('Stop auto reload'),'itemId'    => 'mnuRefreshCancel', 'group' => 'refresh', 'checked' => true )
                                   
                                )
                            )
                    ),
                   // array('xtype' => 'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload')),
                    array('xtype' => 'button', 'iconCls' => 'b-add',     'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                    array('xtype' => 'button', 'iconCls' => 'b-delete',  'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                    array('xtype' => 'button', 'iconCls' => 'b-edit',    'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit'))
                )),
                array('xtype' => 'buttongroup','title' => __('Document'), 'items' => array(
                    array('xtype' => 'button', 'iconCls' => 'b-note',     'scale' => 'large', 'itemId' => 'note',     'tooltip'=> __('Add notes')),
                    array('xtype' => 'button', 'iconCls' => 'b-csv',     'scale' => 'large', 'itemId' => 'csv',      'tooltip'=> __('Export CSV')),
                )),
                array('xtype' => 'buttongroup','title' => __('Extra actions'), 'items' => array(
                    array('xtype' => 'button', 'iconCls' => 'b-password','scale' => 'large', 'itemId' => 'password', 'tooltip'=> __('Change password')),
                    array('xtype' => 'button', 'iconCls' => 'b-disable', 'scale' => 'large', 'itemId' => 'enable_disable','tooltip'=> __('Enable / Disable')),
                 //   array('xtype' => 'button', 'iconCls' => 'b-message', 'scale' => 'large', 'itemId' => 'send_message', 'tooltip'=> __('Send massage')),
                    array('xtype' => 'button', 'iconCls' => 'b-test',    'scale' => 'large', 'itemId' => 'test_radius',  'tooltip'=> __('Test RADIUS')),
                )) 
            );
        }

        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)

            $id             = $user['id'];
            $action_group   = array();
            $document_group = array();
            $specific_group = array();
            array_push($action_group,array(  
                'xtype'     => 'button',
                'iconCls'   => 'b-reload',  
                'scale'     => 'large', 
                'itemId'    => 'reload',   
                'tooltip'   => __('Reload')));

            //Add
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base."add")){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-add',     
                    'scale'     => 'large', 
                    'itemId'    => 'add',      
                    'tooltip'   => __('Add')));
            }
            //Delete
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'delete')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-delete',  
                    'scale'     => 'large', 
                    'itemId'    => 'delete',
                    'disabled'  => true,   
                    'tooltip'   => __('Delete')));
            }

            //Edit
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'edit')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-edit',    
                    'scale'     => 'large', 
                    'itemId'    => 'edit',
                    'disabled'  => true,     
                    'tooltip'   => __('Edit')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'note_index')){ 
                array_push($document_group,array(
                        'xtype'     => 'button', 
                        'iconCls'   => 'b-note',     
                        'scale'     => 'large', 
                        'itemId'    => 'note',      
                        'tooltip'   => __('Add Notes')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'export_csv')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-csv',     
                    'scale'     => 'large', 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Export CSV')));
            }

            //Tags
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'manage_tags')){
                array_push($specific_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-meta_edit',    
                    'scale'     => 'large', 
                    'itemId'    => 'tag',
                    'disabled'  => true,     
                    'tooltip'=> __('Change password')));
            }

           


           // array_push($menu,array('xtype' => 'tbfill'));

            $menu = array(
                        array('xtype' => 'buttongroup','title' => __('Action'),         'items' => $action_group),
                        array('xtype' => 'buttongroup','title' => __('Document'),       'items' => $document_group),
                        array('xtype' => 'buttongroup','title' => __('Extra actions'),  'items' => $specific_group)
                    );
        }
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    function menu_for_accounting_data(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        //Empty by default
        $menu = array();

        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array(
                    array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                        array( 'xtype'=>  'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'   => _('Reload')),
                        array('xtype' => 'button',  'iconCls' => 'b-delete',  'scale' => 'large', 'itemId' => 'delete',   'tooltip'   => __('Delete')), 
                )) 
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));


    }

     function menu_for_authentication_data(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        //Empty by default
        $menu = array();

        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array(
                    array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                        array( 'xtype'=>  'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'   => _('Reload')),
                        array('xtype' => 'button',  'iconCls' => 'b-delete',  'scale' => 'large', 'itemId' => 'delete',   'tooltip'   => __('Delete')), 
                )) 
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    function menu_for_user_devices(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        //Empty by default
        $menu = array();

        $checked = false;
        if(isset($this->request->query['username'])){
            $count = $this->{$this->modelClass}->Radcheck->find('count',array('conditions' => 
                array(
                    'Radcheck.username'     => $this->request->query['username'], 
                    'Radcheck.attribute'    => 'Rd-Mac-Check',
                    'Radcheck.value'        => '1',
                )
            ));
            if($count > 0){
                $checked = true;
            }
        }
        

        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array(
                    array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                        array( 'xtype'=>  'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'   => _('Reload')),
                        array( 
                            'xtype'         => 'checkbox', 
                            'boxLabel'      => 'Connect only from listed devices', 
                            'itemId'        => 'chkListedOnly',
                            'checked'       => $checked, 
                            'boxLabelCls'   => 'lblRdCheck',
                            'margin'        => 5
                        )
                )) 
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));

    }

    //______ END EXT JS UI functions ________


     function _build_common_query($user){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']   = array(
                            'UserNote'  => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'Owner'     => array('Owner.username'),
                            'Group',
                            'Radcheck'       
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'User.username';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            if($this->request->query['sort'] == 'owner'){
                $sort = 'User.username';
            }elseif(($this->request->query['sort'] == 'profile')||($this->request->query['sort'] == 'realm')){
                $sort = 'Radcheck.value';
            }else{
                $sort = $this->modelClass.'.'.$this->request->query['sort'];
            }
            $dir  = $this->request->query['dir'];
        } 

        $c['order'] = array("$sort $dir");
        //==== END SORT ===


        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){
                //Strings
                if($f->type == 'string'){

                    if($f->field == 'realm'){
                        //Add a search clause
                        //Join the Radcheck table - only together with clause:
                        array_push($c['joins'],array(
                            'table'         => 'radcheck',
                            'alias'         => 'Radcheck',
                            'type'          => 'LEFT',
                            'conditions'    => array('Radcheck.username = User.username')
                        )); 
                        array_push($c['conditions'],array(
                            'Radcheck.attribute'  => 'Rd-Realm',
                            "Radcheck.value LIKE" => '%'.$f->value.'%'
                        ));
                    }elseif($f->field == 'profile'){                       
                        //Add a search clause
                        //Join the Radcheck table - only together with clause:
                        array_push($c['joins'],array(
                            'table'         => 'radcheck',
                            'alias'         => 'Radcheck',
                            'type'          => 'LEFT',
                            'conditions'    => array('Radcheck.username = User.username')
                        ));
                        array_push($c['conditions'],array(
                            'Radcheck.attribute'  => 'User-Profile',
                            "Radcheck.value LIKE" => '%'.$f->value.'%'
                        ));
                    }elseif($f->field == 'owner'){
                        array_push($c['conditions'],array("Owner.username LIKE" => '%'.$f->value.'%'));   
                    }else{
                        $col = $this->modelClass.'.'.$f->field;
                        array_push($c['conditions'],array("$col LIKE" => '%'.$f->value.'%'));
                    }
                }
                //Bools
                if($f->type == 'boolean'){
                     $col = $this->modelClass.'.'.$f->field;
                     array_push($c['conditions'],array("$col" => $f->value));
                }
            }
        }
    
        //== ONLY Permanent Users ==
        $p_user_name = Configure::read('group.user');
        array_push($c['conditions'],array('Group.name' => $p_user_name ));

        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show all the AP's downward from its position in the tree
        if($user['group_name'] == Configure::read('group.ap')){  //AP 
            $ap_children    = $this->User->find_access_provider_children($user['id']);
            if($ap_children){   //Only if the AP has any children...
                $ap_clause      = array();
                foreach($ap_children as $i){
                    $id = $i['id'];
                    array_push($ap_clause,array($this->modelClass.'.parent_id' => $id));
                }      
                //Add it as an OR clause
                array_push($c['conditions'],array('OR' => $ap_clause));  
            }
        }      
        //====== END AP FILTER =====
        return $c;
    }

    private function _find_parents($id){

        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($id);
        $path_string= '';
        if($q_r){

            foreach($q_r as $line_num => $i){
                $username       = $i['User']['username'];
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

    private function _delete_clean_up_user($username){

        $this->{$this->modelClass}->Radcheck->deleteAll(   //Delete a previous one
            array('Radcheck.username' => $username), false
        );

        $this->{$this->modelClass}->Radreply->deleteAll(   //Delete a previous one
            array('Radreply.username' => $username), false
        );

        $acct = ClassRegistry::init('Radacct');
        $acct->deleteAll( 
            array('Radacct.username' => $username), false
        );

        $post_a = ClassRegistry::init('Radpostauth');
        $post_a->deleteAll( 
            array('Radpostauth.username' => $username), false
        );


    }

    private function _is_sibling_of($parent_id,$user_id){
        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($user_id);
        foreach($q_r as $i){
            $id = $i['User']['id'];
            if($id == $parent_id){
                return true;
            }
        }
        //No match
        return false;
    }

    private function _replace_radcheck_item($username,$item,$value,$op = ":="){
        $rc = ClassRegistry::init('Radcheck');
        $rc->deleteAll(
            array('Radcheck.username' => $username,'Radcheck.attribute' => $item), false
        );
        $rc->create();
        $d['Radcheck']['username']  = $username;
        $d['Radcheck']['op']        = $op;
        $d['Radcheck']['attribute'] = $item;
        $d['Radcheck']['value']     = $value;
        $rc->save($d);
        $rc->id         = null;
    }

    private function _radius_format_date($d){
        //Format will be month/date/year eg 03/06/2013 we need it to be 6 Mar 2013
        $arr_date   = explode('/',$d);
        $month      = intval($arr_date[0]);
        $m_arr      = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        $day        = intval($arr_date[1]);
        $year       = intval($arr_date[2]);
        return "$day ".$m_arr[($month-1)]." $year";
    }

    private function _extjs_format_radius_date($d){
        //Format will be day month year 20 Mar 2013 and need to be month/date/year eg 03/06/2013 
        $arr_date   = explode(' ',$d);
        $month      = $arr_date[1];
        $m_arr      = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        $day        = intval($arr_date[0]);
        $year       = intval($arr_date[2]);

        $month_count = 1;
        foreach($m_arr as $m){
            if($month == $m){
                break;
            }
            $month_count ++;
        }
        return "$month_count/$day/$year";
    }



}
