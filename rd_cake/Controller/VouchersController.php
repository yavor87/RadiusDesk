<?php
App::uses('AppController', 'Controller');

class VouchersController extends AppController {

    public $name       = 'Vouchers';
    public $components = array('Aa');
    public $uses       = array('Voucher','User');
    protected $base    = "Access Providers/Controllers/Vouchers/"; //Required for AP Rights

    //-------- BASIC CRUD -------------------------------

    public function index(){
        //-- Required query attributes: token;
        //-- Optional query attribute: sel_language (for i18n error messages)
        //-- also LIMIT: limit, page, start (optional - use sane defaults)
        //-- FILTER 
        //-- AND SORT ORDER 

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
                    'id'            => $i['Voucher']['id'], 
                    'user'          => $i['User']['username'],
                    'user_id'       => $i['User']['id'],
                    'name'          => $i['Voucher']['name'],
                    'realm'         => $realm,
                    'profile'       => $profile,
                    'active'        => $i['Voucher']['active'],
                    'last_accept_time'      => $i['Voucher']['last_accept_time'],
                    'last_accept_nas'       => $i['Voucher']['last_accept_nas'],
                    'last_reject_time'      => $i['Voucher']['last_reject_time'],
                    'last_reject_nas'       => $i['Voucher']['last_reject_nas'],
                    'last_reject_message'   => $i['Voucher']['last_reject_message']
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
   
        //Two fields should be tested for first:
        if(array_key_exists('active',$this->request->data)){
            $this->request->data['active'] = 1;
        }

        //Ensure the MAC is UC
        $this->request->data['name'] = strtolower($this->request->data['name']);

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
            $this->{$this->modelClass}->contain('User');
            $item       = $this->{$this->modelClass}->findById($this->data['id']);
            $ap_id      = $item['User']['parent_id'];
            $username   = $item['Voucher']['name'];
            if($ap_id != $user_id){
                if($this->_is_sibling_of($user_id,$ap_id)== true){
                    $this->{$this->modelClass}->id = $this->data['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    $this->_delete_clean_up_voucher($username);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->{$this->modelClass}->id = $this->data['id'];
                $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                $this->_delete_clean_up_voucher($username);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->{$this->modelClass}->findById($d['id']);
                $ap_id      = $item['User']['parent_id'];
                $username   = $item['Voucher']['name'];
                if($ap_id != $user_id){
                    if($this->_is_sibling_of($user_id,$ap_id) == true){
                        $this->{$this->modelClass}->id = $d['id'];
                        $this->{$this->modelClass}->delete($this->{$this->modelClass}->id,true);
                        $this->_delete_clean_up_voucher($username);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->{$this->modelClass}->id = $d['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    $this->_delete_clean_up_voucher($username);
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

        //We need the voucher_id;
        //We supply the profile_id; realm_id; cap; always_active; from_date; to_date

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];

        $items = array();

        //TODO Check if the owner of this voucher is in the chain of the APs
        if(isset($this->request->query['voucher_id'])){

            $profile        = false;
            $realm          = false;
            $always_active  = true;
            $to_date        = false;
            $from_date      = false;
            $cap            = false;
            $owner          = false;
            $description    = false;

            $this->{$this->modelClass}->contain('Radcheck');
            $q_r = $this->{$this->modelClass}->findById($this->request->query['voucher_id']);

            $items['description'] = $q_r['Voucher']['description'];

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


            if($owner){
                $q_r = $this->User = ClassRegistry::init('User')->findByUsername($owner);
                $items['user_id'] = intval($q_r['User']['id']);
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

        $this->{$this->modelClass}->save($this->request->data);

        //TODO Check if the owner of this user is in the chain of the APs
        if(isset($this->request->data['id'])){
            $q_r        = $this->{$this->modelClass}->findById($this->request->data['id']);
            $username   = $q_r['Voucher']['name'];

            if(isset($this->request->data['profile_id'])){
                $q_r = ClassRegistry::init('Profile')->findById($this->data['profile_id']);
                $profile_name = $q_r['Profile']['name'];
                $this->_replace_radcheck_item($username,'User-Profile',$profile_name);
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

    public function private_attr_index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();

        $read_only_attributes = array(
            'Rd-User-Type', 'Rd-Voucher-Owner', 'Rd-Account-Disabled', 'User-Profile', 'Expiration',
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
        if(isset($this->request->query['voucher_id'])){

            $acct           = true;
            $auth           = true;

            $this->{$this->modelClass}->contain('Radcheck');
            $q_r = $this->{$this->modelClass}->findById($this->request->query['voucher_id']);

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
            $username   = $q_r['Voucher']['name'];
           
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



    public function view(){

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
                    array('xtype' => 'button', 'iconCls' => 'b-pdf',     'scale' => 'large', 'itemId' => 'pdf',     'tooltip'=> __('Export to PDF')),
                    array('xtype' => 'button', 'iconCls' => 'b-csv',     'scale' => 'large', 'itemId' => 'csv',      'tooltip'=> __('Export CSV')),
                )),
                array('xtype' => 'buttongroup','title' => __('Extra actions'), 'items' => array(
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

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'export_csv')){

                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-pdf',     
                    'scale'     => 'large', 
                    'itemId'    => 'pdf',      
                    'tooltip'   => __('Export to PDF')));

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



    //______ END EXT JS UI functions ________


     function _build_common_query($user){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']   = array(
                            'User',     
                            'Radcheck',                           
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'Voucher.name';
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

        //======= For a specified owner filter *Usually on the edit permanent user ======
        if(isset($this->request->query['user_id'])){
            $u_id = $this->request->query['user_id'];
            array_push($c['conditions'],array($this->modelClass.".user_id" => $u_id));
        }


        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){
                //Strings
                if($f->type == 'string'){

                   
                }
                //Bools
                if($f->type == 'boolean'){
                     $col = $this->modelClass.'.'.$f->field;
                     array_push($c['conditions'],array("$col" => $f->value));
                }
            }
        }

        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show all the AP's downward from its position in the tree
        if($user['group_name'] == Configure::read('group.ap')){  //AP 
            $ap_children    = $this->User->find_access_provider_children($user['id']);
            if($ap_children){   //Only if the AP has any children...
                $ap_clause      = array();
                foreach($ap_children as $i){
                    $id = $i['id'];
                    array_push($ap_clause,array('User.parent_id' => $id));
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

    private function _delete_clean_up_device($username){

        $this->{$this->modelClass}->Radcheck->deleteAll(   //Delete a previous one
            array('Radcheck.username' => $username), false
        );

        $this->{$this->modelClass}->Radreply->deleteAll(   //Delete a previous one
            array('Radreply.username' => $username), false
        );

        $acct = ClassRegistry::init('Radacct'); //With devices we use callingstaton id instead of username
        $acct->deleteAll( 
            array('Radacct.callingstationid' => $username), false
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

     private function _get_action_flags($owner_id,$user){
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            return array('update' => true, 'delete' => true);
        }

        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $user_id = $user['id'];

            //test for self
            if($owner_id == $user_id){
                return array('update' => true, 'delete' => true );
            }
            //Test for Parents
            foreach($this->parents as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => false, 'delete' => false );
                }
            }

            //Test for Children
            foreach($this->children as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => true, 'delete' => true);
                }
            }  
        }
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
