<?php
App::uses('AppController', 'Controller');

class MeshesController extends AppController {

    public $name        = 'Meshes';
    public $components  = array('Aa');
    public $uses        = array('Mesh','User');
    protected $base     = "Access Providers/Controllers/Meshes/";
    protected $itemNote = 'MeshNote';

//------------------------------------------------------------------------

/*
    //____ Access Provider _________
    public function index_ap(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = null;
        $admin_flag = true;

        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $user_id    = $user['id'];
            $admin_flag = true;
        }

        if($user['group_name'] == Configure::read('group.ap')){  //Or AP
            $user_id = $user['id'];
        }
        $items      = array();

        if($admin_flag){
            $this->Profile->contain(array('Radusergroup'  => array('Radgroupcheck')));
            $r = $this->Profile->find('all');
            foreach($r as $j){
                $id     = $j['Profile']['id'];
                $name   = $j['Profile']['name'];
                $data_cap_in_profile = false; 
                $time_cap_in_profile = false; 
                foreach($j['Radusergroup'] as $cmp){
                    foreach($cmp['Radgroupcheck'] as $chk){
                      //  print_r($chk);
                        if($chk['attribute'] == 'Rd-Reset-Type-Data'){
                            $data_cap_in_profile = true;
                        }
                        if($chk['attribute'] == 'Rd-Reset-Type-Time'){
                            $time_cap_in_profile = true;
                        }
                    } 
                    unset($cmp['Radgroupcheck']);
                }
                array_push($items,
                    array(
                        'id'                    => $id, 
                        'name'                  => $name,
                        'data_cap_in_profile'   => $data_cap_in_profile,
                        'time_cap_in_profile'   => $time_cap_in_profile
                    )
                );
            }

        }else{
            //Access Providers needs more work...
            if(isset($this->request->query['ap_id'])){
                $ap_id      = $this->request->query['ap_id'];
                if($ap_id == 0){
                    $ap_id = $user_id;
                }
                $q_r        = $this->User->getPath($ap_id); //Get all the parents up to the root           
                foreach($q_r as $i){               
                    $user_id    = $i['User']['id'];
                    $this->Profile->contain(array('Radusergroup'  => array('Radgroupcheck')));
                    $r        = $this->Profile->find('all',array('conditions' => array('Profile.user_id' => $user_id, 'Profile.available_to_siblings' => true)));
                    foreach($r  as $j){
                        $id     = $j['Profile']['id'];
                        $name   = $j['Profile']['name'];

                        $data_cap_in_profile = false; 
                        $time_cap_in_profile = false; 
                        foreach($j['Radusergroup'] as $cmp){
                            foreach($cmp['Radgroupcheck'] as $chk){
                                if($chk['attribute'] == 'Rd-Reset-Type-Data'){
                                    $data_cap_in_profile = true;
                                }
                                if($chk['attribute'] == 'Rd-Reset-Type-Time'){
                                    $time_cap_in_profile = true;
                                }
                            } 
                            unset($cmp['Radgroupcheck']);
                        }
                        
                        array_push($items,
                            array(
                                'id'                    => $id, 
                                'name'                  => $name,
                                'data_cap_in_profile'   => $data_cap_in_profile,
                                'time_cap_in_profile'   => $time_cap_in_profile
                            )
                        );
                    }
                }
            }

        }
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }
*/
    //____ BASIC CRUD Manager ________
    public function index(){

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

        $total  = $this->{$this->modelClass}->find('count',$c);       
        $q_r    = $this->{$this->modelClass}->find('all',$c_page);

        $items      = array();

        foreach($q_r as $i){

           // print_r($i);

            //Create notes flag
            $notes_flag  = false;
            foreach($i['MeshNote'] as $nn){
                if(!$this->_test_for_private_parent($nn['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

            $owner_id       = $i['Mesh']['user_id'];
            $owner_tree     = $this->_find_parents($owner_id);
            $action_flags   = $this->_get_action_flags($owner_id,$user);

            //Add the components (already from the highest priority
            $components = array();
          
            $node_count = count($i['Node']);
            $nodes_up   = $node_count;
            $nodes_down = 10;

            array_push($items,array(
                'id'                    => $i['Mesh']['id'], 
                'name'                  => $i['Mesh']['name'],
                'ssid'                  => $i['Mesh']['ssid'],
                'bssid'                 => $i['Mesh']['bssid'],
                'node_count'            => $node_count,
                'nodes_up'              => $nodes_up,
                'nodes_down'            => $nodes_down,
                'owner'                 => $owner_tree, 
                'notes'                 => $notes_flag,
                'update'                => $action_flags['update'],
                'delete'                => $action_flags['delete']
            ));
        }
       
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }

    

/*
    //____ BASIC CRUD Manager ________
    public function index_for_filter(){
    //Display a list of items with their owners
    //This will be dispalyed to the Administrator as well as Access Providers who has righs

       //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];


        //_____ ADMIN _____
        $items = array();
        if($user['group_name'] == Configure::read('group.admin')){  //Admin

            $this->Profile->contain();
            $q_r = $this->Profile->find('all');

            foreach($q_r as $i){   
                array_push($items,array(
                    'id'            => $i['Profile']['name'], 
                    'text'          => $i['Profile']['name']
                ));
            }
        }

        //_____ AP _____
        if($user['group_name'] == Configure::read('group.ap')){  

            //If it is an Access Provider that requested this list; we should show:
            //1.) all those NAS devices that he is allowed to use from parents with the available_to_sibling flag set (no edit or delete)
            //2.) all those he created himself (if any) (this he can manage, depending on his right)
            //3.) all his children -> check if they may have created any. (this he can manage, depending on his right)
       
            $q_r = $this->Profile->find('all');

            //Loop through this list. Only if $user_id is a sibling of $creator_id we will add it to the list
            $ap_child_count = $this->User->childCount($user_id);

            foreach($q_r as $i){
                $add_flag   = false;
                $owner_id   = $i['Profile']['user_id'];
                $a_t_s      = $i['Profile']['available_to_siblings'];
                $add_flag   = false;
                
                //Filter for parents and children
                //NAS devices of parent's can not be edited, where realms of childern can be edited
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($owner_id,$user_id)){ //Is the user_id an upstream parent of the AP
                        //Only those available to siblings:
                        if($a_t_s == 1){
                            $add_flag = true;
                        }
                    }
                }

                if($ap_child_count != 0){ //See if this NAS device is perhaps not one of those created by a sibling of the Access Provider
                    if($this->_is_sibling_of($user_id,$owner_id)){ //Is the creator a downstream sibling of the AP - Full rights
                        $add_flag = true;
                    }
                }

                //Created himself
                if($owner_id == $user_id){
                    $add_flag = true;
                }

                if($add_flag == true ){
                    $owner_tree = $this->_find_parents($owner_id);                      
                    //Add to return items
                    array_push($items,array(
                        'id'            => $i['Profile']['name'], 
                        'text'          => $i['Profile']['name']
                    ));
                }
            }
        }

        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

*/
    public function add() {

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
            $item           = $this->{$this->modelClass}->findById($this->data['id']);
            $owner_id       = $item['Mesh']['user_id'];
            $profile_name   = $item['Mesh']['name'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->{$this->modelClass}->id = $this->data['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->{$this->modelClass}->id = $this->data['id'];
                $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item           = $this->{$this->modelClass}->findById($d['id']);
                $owner_id       = $item['Mesh']['user_id'];
                $profile_name   = $item['Mesh']['name'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->{$this->modelClass}->id = $d['id'];
                        $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->{$this->modelClass}->id = $d['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
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


    public function note_index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();
        if(isset($this->request->query['for_id'])){
            $pc_id = $this->request->query['for_id'];
            $q_r    = $this->{$this->modelClass}->{$this->itemNote}->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('MeshNote.mesh_id' => $pc_id)
                )
            );
            foreach($q_r as $i){
                if(!$this->_test_for_private_parent($i['Note'],$user)){
                    $owner_id   = $i['Note']['user_id'];
                    $owner      = $this->_find_parents($owner_id);
                    $afs        = $this->_get_action_flags($owner_id,$user);
                    array_push($items,
                        array(
                            'id'        => $i['Note']['id'], 
                            'note'      => $i['Note']['note'], 
                            'available_to_siblings' => $i['Note']['available_to_siblings'],
                            'owner'     => $owner,
                            'delete'    => $afs['delete']
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
        $this->{$this->modelClass}->{$this->itemNote}->Note->create(); 
        //print_r($this->request->data);
        if ($this->{$this->modelClass}->{$this->itemNote}->Note->save($this->request->data)) {
            $d                      = array();
            $d['MeshNote']['mesh_id']   = $this->request->data['for_id'];
            $d['MeshNote']['note_id'] = $this->{$this->modelClass}->MeshNote->Note->id;
            $this->{$this->modelClass}->{$this->itemNote}->create();
            if ($this->{$this->modelClass}->{$this->itemNote}->save($d)) {
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
        $fail_flag  = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:   
            $item       = $this->{$this->modelClass}->{$this->itemNote}->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->{$this->modelClass}->{$this->itemNote}->Note->id = $this->data['id'];
                    $this->{$this->modelClass}->{$this->itemNote}->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->{$this->modelClass}->MeshNote->Note->id = $this->data['id'];
                $this->{$this->modelClass}->MeshNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->{$this->modelClass}->{$this->itemNote}->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->{$this->modelClass}->{$this->itemNote}->Note->id = $d['id'];
                        $this->{$this->modelClass}->{$this->itemNote}->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->{$this->modelClass}->{$this->itemNote}->Note->id = $d['id'];
                    $this->{$this->modelClass}->{$this->itemNote}->Note->delete($d['id'],true);
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
    //======= MESH entries ============
    public function mesh_entries_index(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $items      = array();
        $total      = 0;
        $entry      = ClassRegistry::init('MeshEntry');
        $entry->contain();
        $mesh_id    = $this->request->query['mesh_id'];
        $q_r        = $entry->find('all',array('conditions' => array('MeshEntry.mesh_id' => $mesh_id)));

        foreach($q_r as $m){
            array_push($items,array( 
                'id'            => $m['MeshEntry']['id'],
                'mesh_id'       => $m['MeshEntry']['mesh_id'],
                'name'          => $m['MeshEntry']['name'],
                'hidden'        => $m['MeshEntry']['hidden'],
                'isolate'       => $m['MeshEntry']['isolate'],
                'apply_to_all'  => $m['MeshEntry']['apply_to_all'],
                'encryption'    => $m['MeshEntry']['encryption'],
                'key'           => $m['MeshEntry']['key'],
                'auth_server'   => $m['MeshEntry']['auth_server'],
                'auth_secret'   => $m['MeshEntry']['auth_secret'],
                'dynamic_vlan'  => $m['MeshEntry']['dynamic_vlan']

            ));
        }
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }

    public function mesh_entry_add(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $entry = ClassRegistry::init('MeshEntry'); 
        $entry->create();
        if ($entry->save($this->request->data)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';
            $this->set(array(
                'errors'    => $entry->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }

    public function mesh_entry_edit(){


        if ($this->request->is('post')) {

            $check_items = array('hidden','isolate','apply_to_all');
            foreach($check_items as $i){
                if(isset($this->request->data[$i])){
                    $this->request->data[$i] = 1;
                }else{
                    $this->request->data[$i] = 0;
                }
            }

            $entry = ClassRegistry::init('MeshEntry');
            // If the form data can be validated and saved...
            if ($entry->save($this->request->data)) {
                   $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }
        } 
    }

    public function mesh_entry_view(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $entry = ClassRegistry::init('MeshEntry');

        $id    = $this->request->query['entry_id'];
        $q_r   = $entry->findById($id);

        $this->set(array(
            'data'     => $q_r['MeshEntry'],
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    public function mesh_entry_delete(){

       if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag  = false;
        $entry      = ClassRegistry::init('MeshEntry'); 

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id']; 
            $entry->id = $this->data['id'];
            $entry->delete($entry->id, true);
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                    $entry->id = $d['id'];
                    $entry->delete($entry->id, true);
            }
        }  
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

    //======= MESH settings =======
    public function mesh_settings_view(){
        $id         = $this->request->query['mesh_id'];  
        $data       = Configure::read('mesh_settings'); //Read the defaults
        $setting    = ClassRegistry::init('MeshSetting');
        $setting->contain();

        $q_r = $setting->find('first', array('conditions' => array('MeshSetting.mesh_id' => $id)));
        if($q_r){  
            $data = $q_r['MeshSetting'];  
        }

        $this->set(array(
            'data'      => $data,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    public function mesh_settings_edit(){

        if ($this->request->is('post')) {

            //Unfortunately there are many check items which means they will not be in the POST if unchecked
            //so we have to check for them
            $check_items = array('ap','bl','ag','b','f');
            foreach($check_items as $i){
                if(isset($this->request->data[$i])){
                    $this->request->data[$i] = 1;
                }else{
                    $this->request->data[$i] = 0;
                }
            }

            $mesh_id = $this->request->data['mesh_id'];
            //See if there is not already a setting entry
            $setting    = ClassRegistry::init('MeshSetting');
            $q_r        = $setting->find('first', array('conditions' => array('MeshSetting.mesh_id' => $mesh_id)));
            if($q_r){
                $this->request->data['id'] = $q_r['MeshSetting']['id']; //Set the ID
            }

            if ($setting->save($this->request->data)) {
                   $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }
        }
    }

    //======= MESH exits ============
    public function mesh_exits_index(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $items      = array();
        $total      = 0;
        $exit      = ClassRegistry::init('MeshExit');
        $exit->contain('MeshExitMeshEntry.MeshEntry.name');
        $mesh_id    = $this->request->query['mesh_id'];
        $q_r        = $exit->find('all',array('conditions' => array('MeshExit.mesh_id' => $mesh_id)));
       // print_r($q_r);

        foreach($q_r as $m){
            $exit_entries = array();

            foreach($m['MeshExitMeshEntry'] as $m_e_ent){
                array_push($exit_entries,array('name' => $m_e_ent['MeshEntry']['name']));
            }

            array_push($items,array( 
                'id'            => $m['MeshExit']['id'],
                'mesh_id'       => $m['MeshExit']['mesh_id'],
                'name'          => $m['MeshExit']['name'],
                'type'          => $m['MeshExit']['type'],
                'connects_with' => $exit_entries,
                'auto_detect'   => $m['MeshExit']['auto_detect'],

            ));
        }
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

    public function mesh_exit_add(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

       // print_r($this->request->data);
       // exit;

        $entry_point    = ClassRegistry::init('MeshExitMeshEntry');
        $exit           = ClassRegistry::init('MeshExit'); 
        $exit->create();
        if ($exit->save($this->request->data)) {
            $new_id = $exit->id;

            //===== Captive Portal ==========
            if($this->request->data['type'] == 'captive_portal'){

                $this->request->data['mesh_exit_id'] = $new_id;

                $captive_portal = ClassRegistry::init('MeshExitCaptivePortal');
                $captive_portal->create();
                if(!($captive_portal->save($this->request->data))){
                    $exit->delete($new_id, true); //Remove the newly created exit point since the captive portal add failed
                    $this->set(array(
                        'errors'    => $captive_portal->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not create item')),
                        '_serialize' => array('errors','success','message')
                    ));
                    return;
                }
            }
            //==== End of Captive Portal ====

            //Add the entry points
            $count      = 0;
            $entry_ids  = array();
            $empty_flag = false;

            if (array_key_exists('entry_points', $this->request->data)) {
                foreach($this->request->data['entry_points'] as $e){
                    if($this->request->data['entry_points'][$count] == 0){
                        $empty_flag = true;
                        break;
                    }else{
                        array_push($entry_ids,$this->request->data['entry_points'][$count]);
                    }
                    $count++;
                }
            }

            //Only if empty was not specified
            if((!$empty_flag)&&(count($entry_ids)>0)){
                $entry_point->create();
                $data = array();
                foreach($entry_ids as $id){
                    $data['MeshExitMeshEntry']['mesh_exit_id']  = $new_id;
                    $data['MeshExitMeshEntry']['mesh_entry_id'] = $id;
                    $entry_point->save($data);
                }
            }

            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }else{
            $message = 'Error';
            $this->set(array(
                'errors'    => $exit->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }

    public function mesh_exit_edit(){


        if ($this->request->is('post')) {

            $entry_point    = ClassRegistry::init('MeshExitMeshEntry');
            $exit           = ClassRegistry::init('MeshExit');


            //===== Captive Portal ==========
            //== First see if we can save the captive portal data ====
            if($this->request->data['type'] == 'captive_portal'){

                $captive_portal = ClassRegistry::init('MeshExitCaptivePortal');
                $cp_data        = $this->request->data;
                $mesh_exit_id   = $this->request->data['id'];
                $q_r            = $captive_portal->find(
                                    'first',array('conditions' => array('MeshExitCaptivePortal.mesh_exit_id' => $mesh_exit_id)));               
                if($q_r){
                    $cp_id = $q_r['MeshExitCaptivePortal']['id'];
                    $cp_data['id'] = $cp_id;
                    $captive_portal->id = $cp_id;
                   // print_r($cp_data);
                    if(!($captive_portal->save($cp_data))){
                        $this->set(array(
                            'errors'    => $captive_portal->validationErrors,
                            'success'   => false,
                            'message'   => array('message' => __('Could not create item')),
                            '_serialize' => array('errors','success','message')
                        ));
                        return;
                    }
                }
            }
            //==== End of Captive Portal ====

            // If the form data can be validated and saved...
            if ($exit->save($this->request->data)) {

                //Add the entry points
                $count      = 0;
                $entry_ids  = array();
                $empty_flag = false;
                $new_id     = $this->request->data['id'];

                //Clear previous ones first:
                $entry_point->deleteAll(array('MeshExitMeshEntry.mesh_exit_id' => $new_id), false);

                if (array_key_exists('entry_points', $this->request->data)) {
                    foreach($this->request->data['entry_points'] as $e){
                        if($this->request->data['entry_points'][$count] == 0){
                            $empty_flag = true;
                            break;
                        }else{
                            array_push($entry_ids,$this->request->data['entry_points'][$count]);
                        }
                        $count++;
                    }
                }

                //Only if empty was not specified
                if((!$empty_flag)&&(count($entry_ids)>0)){
                    $entry_point->create();
                    $data = array();
                    foreach($entry_ids as $id){
                        $entry_point->create();
                        $data['MeshExitMeshEntry']['mesh_exit_id']  = $new_id;
                        $data['MeshExitMeshEntry']['mesh_entry_id'] = $id;
                        $entry_point->save($data);
                    }
                }

                $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }
        } 
    }

    public function mesh_exit_view(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $exit = ClassRegistry::init('MeshExit');
        $exit->contain('MeshExitMeshEntry','MeshExitCaptivePortal');

        $id    = $this->request->query['exit_id'];
        $q_r   = $exit->findById($id);

        //entry_points
        $q_r['MeshExit']['entry_points'] = array();
        foreach($q_r['MeshExitMeshEntry'] as $i){
            array_push($q_r['MeshExit']['entry_points'],$i['id']);
        }

        if($q_r['MeshExitCaptivePortal']){
            $q_r['MeshExit']['radius_1']        = $q_r['MeshExitCaptivePortal']['radius_1'];
            $q_r['MeshExit']['radius_2']        = $q_r['MeshExitCaptivePortal']['radius_2'];
            $q_r['MeshExit']['radius_secret']   = $q_r['MeshExitCaptivePortal']['radius_secret'];
            $q_r['MeshExit']['radius_nasid']    = $q_r['MeshExitCaptivePortal']['radius_nasid'];
            $q_r['MeshExit']['uam_url']         = $q_r['MeshExitCaptivePortal']['uam_url'];
            $q_r['MeshExit']['uam_secret']      = $q_r['MeshExitCaptivePortal']['uam_secret'];
            $q_r['MeshExit']['walled_garden']   = $q_r['MeshExitCaptivePortal']['walled_garden'];
            $q_r['MeshExit']['swap_octets']     = $q_r['MeshExitCaptivePortal']['swap_octets'];
        }

        $data = $q_r['MeshExit'];

      //  print_r($q_r);

        $this->set(array(
            'data'     => $data,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    public function mesh_exit_delete(){

       if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag  = false;
        $exit       = ClassRegistry::init('MeshExit'); 

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id']; 
            $exit->id = $this->data['id'];
            $exit->delete($exit->id, true);
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                    $exit->id = $d['id'];
                    $exit->delete($exit->id, true);
            }
        }  
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }


    //===== Mesh nodes ======
    public function mesh_nodes_index(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $items      = array();
        $total      = 0;
        $node       = ClassRegistry::init('Node');
        $node->contain(array('NodeMeshEntry.MeshEntry','NodeMeshExit.MeshExit'));
        $mesh_id    = $this->request->query['mesh_id'];
        $q_r        = $node->find('all',array('conditions' => array('Node.mesh_id' => $mesh_id)));

        //Create a hardware lookup for proper names of hardware
            $hardware = array();        
        $hw   = Configure::read('hardware');
        foreach($hw as $h){
            $id     = $h['id'];
            $name   = $h['name']; 
            $hardware["$id"]= $name;
        }

		//Check if we need to show the override on the power
		$node_setting	= ClassRegistry::init('NodeSetting');
		$node_setting->contain();

		$power_override = false;

		$ns				= $node_setting->find('first', array('conditions' => array('NodeSetting.mesh_id' => $mesh_id)));
		if($ns){
			if($ns['NodeSetting']['all_power'] == 1){
				$power_override = true;
				$power 			= $ns['NodeSetting']['power'];
			}
		}else{
			$data       = Configure::read('common_node_settings'); //Read the defaults
			if($data['all_power'] == true){
				$power_override = true;
				$power 			= $data['power'];
			}
		}

        foreach($q_r as $m){
            $static_entries = array();
            $static_exits   = array();
            foreach($m['NodeMeshEntry'] as $m_e_ent){
                array_push($static_entries,array('name' => $m_e_ent['MeshEntry']['name']));
            }

            foreach($m['NodeMeshExit'] as $m_e_exit){
                array_push($static_exits,array('name'   => $m_e_exit['MeshExit']['name']));
            }

			if($power_override){
				$p = $power;
			}else{
				$p = $m['Node']['power'];
			}
			

            $hw_id = $m['Node']['hardware'];
            array_push($items,array( 
                'id'            => $m['Node']['id'],
                'mesh_id'       => $m['Node']['mesh_id'],
                'name'          => $m['Node']['name'],
                'description'   => $m['Node']['description'],
                'mac'           => $m['Node']['mac'],
                'hardware'      => $hardware["$hw_id"],
                'power'         => $p,
                'static_entries'=> $static_entries,
                'static_exits'  => $static_exits,
                'ip'            => $m['Node']['ip'],
            ));
        }
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

    public function mesh_node_add(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $static_entry   = ClassRegistry::init('NodeMeshEntry');
        $static_exit    = ClassRegistry::init('NodeMeshExit');
        $node           = ClassRegistry::init('Node');
 
        $node->create();
        if ($node->save($this->request->data)) {
            $new_id = $node->id;

            //Add the entry points
            $count      = 0;
            $entry_ids  = array();
            $empty_flag = false;

            if (array_key_exists('static_entries', $this->request->data)) {
                foreach($this->request->data['static_entries'] as $e){
                    if($this->request->data['static_entries'][$count] == 0){
                        $empty_flag = true;
                        break;
                    }else{
                        array_push($entry_ids,$this->request->data['static_entries'][$count]);
                    }
                    $count++;
                }
            }

            //Only if empty was not specified
            if((!$empty_flag)&&(count($entry_ids)>0)){
                $static_entry->create();
                $data = array();
                foreach($entry_ids as $id){
                    $data['NodeMeshEntry']['node_id']       = $new_id;
                    $data['NodeMeshEntry']['mesh_entry_id'] = $id;
                    $static_entry->save($data);
                }
            }

            //Add the exit points
            $count      = 0;
            $exit_ids  = array();
            $e_flag = false;

            if (array_key_exists('static_exits', $this->request->data)) {
                foreach($this->request->data['static_exits'] as $e){
                    if($this->request->data['static_exits'][$count] == 0){
                        $e_flag = true;
                        break;
                    }else{
                        array_push($entry_ids,$this->request->data['static_exits'][$count]);
                    }
                    $count++;
                }
            }

            //Only if empty was not specified
            if((!$e_flag)&&(count($exit_ids)>0)){
                $static_exit->create();
                $data = array();
                foreach($entry_ids as $id){
                    $data['NodeMeshExit']['node_id']       = $new_id;
                    $data['NodeMeshExit']['mesh_exit_id']  = $id;
                    $static_exit->save($data);
                }
            }

            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }else{
            $message = 'Error';
            $this->set(array(
                'errors'    => $node->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }

    public function mesh_node_edit(){

        if ($this->request->is('post')) {

            $static_entry   = ClassRegistry::init('NodeMeshEntry');
            $static_exit    = ClassRegistry::init('NodeMeshExit');
            $node           = ClassRegistry::init('Node');
     
            if ($node->save($this->request->data)) {
                $new_id = $node->id;

                //Add the entry points
                $count      = 0;
                $entry_ids  = array();
                $empty_flag = false;

                if (array_key_exists('static_entries', $this->request->data)) {
                    foreach($this->request->data['static_entries'] as $e){
                        if($this->request->data['static_entries'][$count] == 0){
                            $empty_flag = true;
                            break;
                        }else{
                            array_push($entry_ids,$this->request->data['static_entries'][$count]);
                        }
                        $count++;
                    }
                }

                //Only if empty was not specified
                if((!$empty_flag)&&(count($entry_ids)>0)){
                    $static_entry->create();
                    $data = array();
                    foreach($entry_ids as $id){
                        $data['NodeMeshEntry']['node_id']       = $new_id;
                        $data['NodeMeshEntry']['mesh_entry_id'] = $id;
                        $static_entry->save($data);
                    }
                }

                //Add the exit points
                $count      = 0;
                $exit_ids  = array();
                $e_flag = false;

                if (array_key_exists('static_exits', $this->request->data)) {
                    foreach($this->request->data['static_exits'] as $e){
                        if($this->request->data['static_exits'][$count] == 0){
                            $e_flag = true;
                            break;
                        }else{
                            array_push($entry_ids,$this->request->data['static_exits'][$count]);
                        }
                        $count++;
                    }
                }

                //Only if empty was not specified
                if((!$e_flag)&&(count($exit_ids)>0)){
                    $static_exit->create();
                    $data = array();
                    foreach($entry_ids as $id){
                        $data['NodeMeshExit']['node_id']       = $new_id;
                        $data['NodeMeshExit']['mesh_exit_id']  = $id;
                        $static_exit->save($data);
                    }
                }

                $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }else{
                $message = 'Error';
                $this->set(array(
                    'errors'    => $node->validationErrors,
                    'success'   => false,
                    'message'   => array('message' => __('Could not create item')),
                    '_serialize' => array('errors','success','message')
                ));
            }
        } 
    }

    public function mesh_node_view(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $node = ClassRegistry::init('Node');

        $id    = $this->request->query['node_id'];
        $q_r   = $node->findById($id);
 
       // print_r($q_r);

        $this->set(array(
            'data'      => $q_r['Node'],
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    public function mesh_node_delete(){

       if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag  = false;
        $node       = ClassRegistry::init('Node'); 

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id']; 
            $node->id = $this->data['id'];
            $node->delete($node->id, true);
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                    $node->id = $d['id'];
                    $node->delete($node->id, true);
            }
        }  
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

    //==== END Mesh nodes ======

   public function mesh_entry_points(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        //Get the mesh id
        $mesh_id    = $this->request->query['mesh_id'];

        $exit_id = false;

        //Check if the exit_id was included
        if(isset($this->request->query['exit_id'])){
            $exit_id = $this->request->query['exit_id'];
        }

        $exit       = ClassRegistry::init('MeshExit');
        $entry      = ClassRegistry::init('MeshEntry');

        $entry->contain('MeshExitMeshEntry');
        $ent_q_r    = $entry->find('all',array('conditions' => array('MeshEntry.mesh_id' => $mesh_id))); 
        //print_r($ent_q_r);

        $items = array();
        array_push($items,array('id' => 0, 'name' => "(None)")); //Allow the user not to assign at this stage
        foreach($ent_q_r as $i){

            //If this entry point is already associated; we will NOT add it
            if(count($i['MeshExitMeshEntry'])== 0){
                $id = $i['MeshEntry']['id'];
                $n  = $i['MeshEntry']['name'];
                array_push($items,array('id' => $id, 'name' => $n));
            }

            //if $exit_id is set; we add it 
            if($exit_id){
                if(count($i['MeshExitMeshEntry'])> 0){
                    if($i['MeshExitMeshEntry'][0]['mesh_exit_id'] == $exit_id){
                        $id = $i['MeshEntry']['id'];
                        $n  = $i['MeshEntry']['name'];
                        array_push($items,array('id' => $id, 'name' => $n));
                    }
                }
            }
        }
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

    //====== Common Node settings ================
    //-- View common node settings --
    public function node_common_settings_view(){

        $id         = $this->request->query['mesh_id'];  
        $data       = Configure::read('common_node_settings'); //Read the defaults
        $setting    = ClassRegistry::init('NodeSetting');
        $setting->contain();

        $q_r = $setting->find('first', array('conditions' => array('NodeSetting.mesh_id' => $id)));
        if($q_r){  
            $data = $q_r['NodeSetting'];  
        }

        $this->set(array(
            'data'      => $data,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    public function node_common_settings_edit(){
        if ($this->request->is('post')) {

            //Unfortunately there are many check items which means they will not be in the POST if unchecked
            //so we have to check for them
            $check_items = array('all_power');
            foreach($check_items as $i){
                if(isset($this->request->data[$i])){
                    $this->request->data[$i] = 1;
                }else{
                    $this->request->data[$i] = 0;
                }
            }

            $mesh_id = $this->request->data['mesh_id'];
            //See if there is not already a setting entry
            $setting    = ClassRegistry::init('NodeSetting');
			$setting->contain();
            $q_r        = $setting->find('first', array('conditions' => array('NodeSetting.mesh_id' => $mesh_id)));

            if($q_r){
                $this->request->data['id'] = $q_r['NodeSetting']['id']; //Set the ID
				//Check if the value of 
				if($this->request->data['password'] != $q_r['NodeSetting']['password']){
					//Create a new hash
					$new_pwd = $this->_make_linux_password($this->request->data['password']);
					$this->request->data['password_hash'] = $new_pwd;

				}
            }

            if ($setting->save($this->request->data)) {
                   $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }
        }
    }


    //-- List static entry point options for mesh --
    public function static_entry_options(){

        if(isset($this->request->query['mesh_id'])){
            $mesh_id = $this->request->query['mesh_id'];
        }

        $entry  = ClassRegistry::init('MeshEntry');
        $entry->contain();
        $q_r    = $entry->find('all',array('conditions' => array('MeshEntry.apply_to_all' => 0)));
        $items = array();
        array_push($items,array('id' => 0, 'name' => "(None)")); //Allow the user not to assign at this stage
        foreach($q_r as $i){
            $id = $i['MeshEntry']['id'];
            $n  = $i['MeshEntry']['name'];
            array_push($items,array('id' => $id, 'name' => $n));
        }

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
        

    }

    public function static_exit_options(){

         if(isset($this->request->query['mesh_id'])){
            $mesh_id = $this->request->query['mesh_id'];
        }

        $exit  = ClassRegistry::init('MeshExit');
        $exit->contain();
        $q_r    = $exit->find('all',array('conditions' => array('MeshExit.auto_detect' => 0)));
        $items = array();
        array_push($items,array('id' => 0, 'name' => "(None)")); //Allow the user not to assign at this stage
        foreach($q_r as $i){
            $id = $i['MeshExit']['id'];
            $n  = $i['MeshExit']['name'];
            array_push($items,array('id' => $id, 'name' => $n));
        }

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));

    }


    //-- List available encryption options --
    public function encryption_options(){

        $items = array();
        $ct = Configure::read('encryption');
        foreach($ct as $i){
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

    //-- List available hardware options --
    public function hardware_options(){

        $items = array();
        $ct = Configure::read('hardware');
        foreach($ct as $i){
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

	public function map_pref_view(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $items		= array();

		if(!isset($this->request->query['mesh_id'])){
			$this->set(array(
		        'message'	=> array("message"	=>"Mesh ID (mesh_id) missing"),
		        'success' => false,
		        '_serialize' => array('success','message')
		    ));
			return;
		}

		$mesh_id = $this->request->query['mesh_id'];

    	$this->MeshSpecific = ClassRegistry::init('MeshSpecific');

    	$zoom = Configure::read('mesh_specifics.map.zoom');
    	//Check for personal overrides
    	$q_r = $this->MeshSpecific->find('first',array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_zoom')));
        if($q_r){
            $zoom = intval($q_r['MeshSpecific']['value']);
        }

        $type = Configure::read('mesh_specifics.map.type');
        //Check for overrides
        $q_r = $this->MeshSpecific->find('first',array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_type')));
        if($q_r){
            $type = $q_r['MeshSpecific']['value'];
        }

        $lat = Configure::read('mesh_specifics.map.lat');
        //Check for overrides
        $q_r = $this->MeshSpecific->find('first',array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_lat')));
        if($q_r){
            $lat = $q_r['MeshSpecific']['value']+0;
        }

        $lng = Configure::read('mesh_specifics.map.lng');
        //Check for overrides
        $q_r = $this->MeshSpecific->find('first',array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_lng')));
        if($q_r){
            $lng = $q_r['MeshSpecific']['value']+0;
        }

        $items['zoom'] = $zoom;
        $items['type'] = $type;
        $items['lat']  = $lat;
        $items['lng']  = $lng;

        $this->set(array(
            'data'   => $items, //For the form to load we use data instead of the standard items as for grids
            'success' => true,
            '_serialize' => array('success','data')
        ));
    }

	public function map_pref_edit(){
		  $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $this->MeshSpecific = ClassRegistry::init('MeshSpecific');

		$mesh_id 	= $this->request->data['mesh_id'];

        if(array_key_exists('zoom',$this->request->data)){        
            $q_r = $this->MeshSpecific->find('first',
				array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_zoom'))
			);
            if(!empty($q_r)){
                $this->MeshSpecific->id = $q_r['MeshSpecific']['id'];    
                $this->MeshSpecific->saveField('value', $this->request->data['zoom']);
            }else{
                $d['MeshSpecific']['mesh_id']	= $mesh_id;
                $d['MeshSpecific']['name']   	= 'map_zoom';
                $d['MeshSpecific']['value']  	= $this->request->data['zoom'];
                $this->MeshSpecific->create();
                $this->MeshSpecific->save($d);
                $this->MeshSpecific->id = null;
            }
        }

        if(array_key_exists('type',$this->request->data)){        
            $q_r = $this->MeshSpecific->find('first',
				array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_type'))
			);
            if(!empty($q_r)){
                $this->MeshSpecific->id = $q_r['MeshSpecific']['id'];    
                $this->MeshSpecific->saveField('value', $this->request->data['type']);
            }else{
                $d['MeshSpecific']['mesh_id']	= $mesh_id;
                $d['MeshSpecific']['name']   	= 'map_type';
                $d['MeshSpecific']['value']  	= $this->request->data['type'];
                $this->MeshSpecific->create();
                $this->MeshSpecific->save($d);
                $this->MeshSpecific->id = null;
            }
        }

        if(array_key_exists('lat',$this->request->data)){        
            $q_r = $this->MeshSpecific->find('first',
				array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_lat'))
			);
            if(!empty($q_r)){
                $this->MeshSpecific->id = $q_r['MeshSpecific']['id'];    
                $this->MeshSpecific->saveField('value', $this->request->data['lat']);
            }else{
                $d['MeshSpecific']['mesh_id']	= $mesh_id;
                $d['MeshSpecific']['name']   	= 'map_lat';
                $d['MeshSpecific']['value']  	= $this->request->data['lat'];

                $this->MeshSpecific->create();
                $this->MeshSpecific->save($d);
                $this->MeshSpecific->id = null;
            }
        }

        if(array_key_exists('lng',$this->request->data)){        
            $q_r = $this->MeshSpecific->find('first',
				array('conditions' => array('MeshSpecific.mesh_id' => $mesh_id,'MeshSpecific.name' => 'map_lng'))
			);
            if(!empty($q_r)){
                $this->MeshSpecific->id = $q_r['MeshSpecific']['id'];    
                $this->MeshSpecific->saveField('value', $this->request->data['lng']);
            }else{
                $d['MeshSpecific']['mesh_id']= $mesh_id;
                $d['MeshSpecific']['name']   = 'map_lng';
                $d['MeshSpecific']['value']  = $this->request->data['lng'];
                $this->MeshSpecific->create();
                $this->MeshSpecific->save($d);
                $this->MeshSpecific->id = null;
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

	public function map_node_save(){
		$this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

	public function map_node_delete(){
		$this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}


	public function nodes_avail_for_map(){
		//List all the nodes that has not yet been assigned a lat (and lon) value for a mesh

		$user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $items		= array();

		if(!isset($this->request->query['mesh_id'])){
			$this->set(array(
		        'message'	=> array("message"	=>"Mesh ID (mesh_id) missing"),
		        'success' => false,
		        '_serialize' => array('success','message')
		    ));
			return;
		}
		$mesh_id = $this->request->query['mesh_id'];

		$this->Node = ClassRegistry::init('Node');
		$this->Node->contain();
		$q_r		= $this->Node->find('all',array('conditions' => array('Node.mesh_id' => $mesh_id,'Node.lat' => null)));
		$items 		= array();
		foreach($q_r as $i){
			array_push($items,array(
				'id' 			=> $i['Node']['id'],
				'name'			=> $i['Node']['name'],
				'description'	=> $i['Node']['description']
			));
		}

		$this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
	}

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
                     array( 
                        'xtype'     =>  'splitbutton',  
                        'iconCls'   => 'b-reload',
                        'glyph'     => Configure::read('icnReload'),   
                        'scale'     => 'large', 
                        'itemId'    => 'reload',   
                        'tooltip'   => __('Reload'),
                            'menu'  => array( 
                                'items' => array( 
                                    '<b class="menu-title">'.__('Reload every').':</b>',
                                    array( 'text'  => __('30 seconds'),      'itemId'    => 'mnuRefresh30s', 'group' => 'refresh','checked' => false ),
                                    array( 'text'  => __('1 minute'),        'itemId'    => 'mnuRefresh1m', 'group' => 'refresh' ,'checked' => false),
                                    array( 'text'  => __('5 minutes'),       'itemId'    => 'mnuRefresh5m', 'group' => 'refresh', 'checked' => false ),
                                    array( 'text'  => __('Stop auto reload'),'itemId'    => 'mnuRefreshCancel', 'group' => 'refresh', 'checked' => true )
                                   
                                )
                            )
                    ),
                    array('xtype' => 'button', 'iconCls' => 'b-add',     'glyph' => Configure::read('icnAdd'),'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                    array('xtype' => 'button', 'iconCls' => 'b-delete',  'glyph' => Configure::read('icnDelete'),'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                    array('xtype' => 'button', 'iconCls' => 'b-edit',    'glyph' => Configure::read('icnEdit'),'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')),
                    array('xtype' => 'button', 'iconCls' => 'b-view',    'glyph' => Configure::read('icnView'),'scale' => 'large', 'itemId' => 'view',     'tooltip'=> __('View'))
                )),
                array('xtype' => 'buttongroup','title' => __('Document'), 'width' => 100, 'items' => array(
                    array('xtype' => 'button', 'iconCls' => 'b-note',     'glyph' => Configure::read('icnNote'),'scale' => 'large', 'itemId' => 'note',    'tooltip'=> __('Add notes')),
                  //  array('xtype' => 'button', 'iconCls' => 'b-csv',     'scale' => 'large', 'itemId' => 'csv',      'tooltip'=> __('Export CSV')),
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
                'glyph'     => Configure::read('icnReload'), 
                'scale'     => 'large', 
                'itemId'    => 'reload',   
                'tooltip'   => __('Reload')));

            //Add
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base."add")){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-add',
                    'glyph'     => Configure::read('icnAdd'),     
                    'scale'     => 'large', 
                    'itemId'    => 'add',      
                    'tooltip'   => __('Add')));
            }
            //Delete
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'delete')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-delete',
                    'glyph'     => Configure::read('icnDelete'),  
                    'scale'     => 'large', 
                    'itemId'    => 'delete',
                    'disabled'  => true,   
                    'tooltip'   => __('Delete')));
            }

            //Edit
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'manage_components')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-edit',
                    'glyph'     => Configure::read('icnEdit'),    
                    'scale'     => 'large', 
                    'itemId'    => 'edit',
                    'disabled'  => true,     
                    'tooltip'   => __('Edit')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'note_index')){ 
                array_push($document_group,array(
                        'xtype'     => 'button', 
                        'iconCls'   => 'b-note',
                        'glyph'     => Configure::read('icnNote'),     
                        'scale'     => 'large', 
                        'itemId'    => 'note',      
                        'tooltip'   => __('Add Notes')));
            }
/*
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'export_csv')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-csv',     
                    'scale'     => 'large', 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Export CSV')));
            }
*/
            $menu = array(
                        array('xtype' => 'buttongroup','title' => __('Action'),        'items' => $action_group),
                        array('xtype' => 'buttongroup','title' => __('Document'), 'width' => 100,   'items' => $document_group)
                   );
        }
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    public function menu_for_entries_grid(){

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
                    array('xtype' => 'button', 'iconCls' => 'b-reload',  'glyph'     => Configure::read('icnReload'),'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload')),
                    array('xtype' => 'button', 'iconCls' => 'b-add',     'glyph'     => Configure::read('icnAdd'),'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                    array('xtype' => 'button', 'iconCls' => 'b-delete',  'glyph'     => Configure::read('icnDelete'),'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                    array('xtype' => 'button', 'iconCls' => 'b-edit',    'glyph'     => Configure::read('icnEdit'),'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')),
                ))
                
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    public function menu_for_exits_grid(){

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
                    array('xtype' => 'button', 'iconCls' => 'b-reload',  'glyph'     => Configure::read('icnReload'),'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload')),
                    array('xtype' => 'button', 'iconCls' => 'b-add',     'glyph'     => Configure::read('icnAdd'),'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                    array('xtype' => 'button', 'iconCls' => 'b-delete',  'glyph'     => Configure::read('icnDelete'),'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                    array('xtype' => 'button', 'iconCls' => 'b-edit',    'glyph'     => Configure::read('icnEdit'),'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')),
                ))
                
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    public function menu_for_nodes_grid(){

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
                    array('xtype' => 'button', 'iconCls' => 'b-reload',  'glyph'     => Configure::read('icnReload'),'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload')),
                    array('xtype' => 'button', 'iconCls' => 'b-add',     'glyph'     => Configure::read('icnAdd'),'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                    array('xtype' => 'button', 'iconCls' => 'b-delete',  'glyph'     => Configure::read('icnDelete'),'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                    array('xtype' => 'button', 'iconCls' => 'b-edit',    'glyph'     => Configure::read('icnEdit'),'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')),
					array('xtype' => 'button', 'iconCls' => 'b-map',     'glyph'     => Configure::read('icnMap'),'scale' => 'large', 'itemId' => 'map',      'tooltip'=> __('Map'))
                ))
    
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
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

    function _build_common_query($user){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']   = array(
                            'MeshNote'    => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'User',
                            'Node'
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'Mesh.name';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            if($this->request->query['sort'] == 'owner'){
                $sort = 'User.username';
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
                    if($f->field == 'owner'){
                        array_push($c['conditions'],array("User.username LIKE" => '%'.$f->value.'%'));   
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
        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show the Profiles which he is allowed to see.
        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $tree_array = array();
            $user_id    = $user['id'];

            //**AP and upward in the tree**
            $this->parents = $this->User->getPath($user_id,'User.id');
            //So we loop this results asking for the parent nodes who have available_to_siblings = true
            foreach($this->parents as $i){
                $i_id = $i['User']['id'];
                if($i_id != $user_id){ //upstream
                    array_push($tree_array,array($this->modelClass.'.user_id' => $i_id,$this->modelClass.'.available_to_siblings' => true));
                }else{
                    array_push($tree_array,array('Mesh.user_id' => $i_id));
                }
            }
            //** ALL the AP's children
            $ap_children    = $this->User->find_access_provider_children($user['id']);
            if($ap_children){   //Only if the AP has any children...
                foreach($ap_children as $i){
                    $id = $i['id'];
                    array_push($tree_array,array($this->modelClass.'.user_id' => $id));
                }       
            }       
            //Add it as an OR clause
            array_push($c['conditions'],array('OR' => $tree_array));  
        }       
        //====== END AP FILTER =====      
        return $c;
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

	private function _make_linux_password($pwd){
		return exec("openssl passwd -1 $pwd");
	}
}
