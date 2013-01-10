<?php
App::uses('AppController', 'Controller');

class NasController extends AppController {


    public $name       = 'Nas';
    public $components = array('Aa');
    private $base      = "Access Providers/Controllers/Nas/";

//------------------------------------------------------------------------

    //____ BASIC CRUD Realm Manager ________
    public function index(){
        //Display a list of realms with their owners
        //This will be dispalyed to the Administrator as well as Access Providers who has righs

        //This works nice :-)
        if(!$this->_ap_right_check()){
            return;
        }
 
        $user       = $this->Aa->user_for_token($this);
        $user_id    = $user['id'];

        //Empty to start with
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']       = array(
                                'NaRealm'   => array('Realm.name','Realm.id','Realm.available_to_siblings'),
                                'NaTag'     => array('Tag.name','Tag.id','Tag.available_to_siblings'),
                                'User'
                            );

        

        //===== SORT =====

        //Default values for sort and dir
        $sort   = 'nasname';
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

        //_____________________
        

        //====== FILTER =====

        //--- Filter protion --------
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){
                //Lists
                if($f->type == 'list'){

                    //The tags field has to be treated specially
                    if($f->field == 'tags'){

                        $list_array = array();
                        foreach($f->value as $filter_list){
                            $col = 'Tag.name';
                            array_push($list_array,array("$col" => "$filter_list"));
                        }

                        array_push($c['joins'],array(
                            'table'         => 'na_tags',
                            'alias'         => 'NaTag',
                            'type'          => 'INNER',
                            'conditions'    => array('NaTag.na_id = Na.id')
                        ));
                        array_push($c['joins'],array(
                            'table'         => 'tags',
                            'alias'         => 'Tag',
                            'type'          => 'INNER',
                            'conditions'    => array('Tag.id = NaTag.tag_id',array('OR' => $list_array))
                        ));

                    }elseif($f->field == 'realms'){
                        $list_array = array();
                        foreach($f->value as $filter_list){
                            $col = 'Realm.name';
                            array_push($list_array,array("$col" => "$filter_list"));
                        }
                        array_push($c['joins'],array(
                            'table'         => 'na_realms',
                            'alias'         => 'NaRealm',
                            'type'          => 'INNER',
                            'conditions'    => array('NaRealm.na_id = Na.id')
                        ));
                        array_push($c['joins'],array(
                            'table'         => 'realms',
                            'alias'         => 'Realm',
                            'type'          => 'INNER',
                            'conditions'    => array('Realm.id = NaRealm.realm_id',array('OR' => $list_array))
                        ));                     
                    }else{
                        $list_array = array();
                        foreach($f->value as $filter_list){
                            $col = $this->modelClass.'.'.$f->field;
                            array_push($list_array,array("$col" => "$filter_list"));
                        }
                        //Add it as an OR condition
                        array_push($c['conditions'],array('OR' => $list_array));
                    }
                }
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

        array_push($c['conditions'],array('OR' => array(array('User.id' => 58,'Na.available_to_siblings' => false),array('User.id' => 44,'Na.available_to_siblings' => false))));

        //--- End filter protion ----
        //_____________________

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

        //_____________________

        //_____ ADMIN _____
        $items = array();
        if($user['group_name'] == Configure::read('group.admin')){  //Admin

            $total  = $this->Na->find('count',$c);       
            $q_r    = $this->Na->find('all',$c_page);

            //Init before the loop
            $this->User = ClassRegistry::init('User');
            foreach($q_r as $i){
                $id         = $i['Na']['id'];
                $nasname    = $i['Na']['nasname'];
                $shortname  = $i['Na']['shortname'];
                $owner_id   = $i['Na']['user_id'];
                $owner_tree = $this->_find_parents($owner_id);
                $a_t_s      = $i['Na']['available_to_siblings'];
                $realms     = array();
                //Realms
                foreach($i['NaRealm'] as $nr){
                    array_push($realms, 
                        array(
                            'id'                    => $nr['Realm']['id'],
                            'name'                  => $nr['Realm']['name'],
                            'available_to_siblings' => $nr['Realm']['available_to_siblings']
                        ));
                } 

                //Create tags list
                $tags       = array();
                foreach($i['NaTag'] as $nr){
                    array_push($tags, 
                        array(
                            'id'                    => $nr['Tag']['id'],
                            'name'                  => $nr['Tag']['name'],
                            'available_to_siblings' => $nr['Tag']['available_to_siblings']
                    ));
                }

                array_push($items,array(
                    'id'                    => $id, 
                    'nasname'               => $nasname,
                    'shortname'             => $shortname,
                    'owner'                 => $owner_tree, 
                    'available_to_siblings' => $a_t_s,
                    'realms'                => $realms,
                    'tags'                  => $tags,
                    'connection_type'       => $i['Na']['connection_type'],
                    'update'                => true,
                    'delete'                => true,
                    'manage_tags'           => true
                ));
            }
        }

        //_____ AP _____
        if($user['group_name'] == Configure::read('group.ap')){  

            //If it is an Access Provider that requested this list; we should show:
            //1.) all those NAS devices that he is allowed to use from parents with the available_to_sibling flag set (no edit or delete)
            //2.) all those he created himself (if any) (this he can manage, depending on his right)
            //3.) all his children -> check if they may have created any. (this he can manage, depending on his right)

            $total  = $this->Na->find('count',$c);
          /*  $this->Na->contain(
                array(  'NaRealm'   => array('Realm.name','Realm.id','Realm.available_to_siblings'),
                        'NaTag'     => array('Tag.name','Tag.id','Tag.available_to_siblings'),
                        'User'
            )); */
            $q_r    = $this->Na->find('all',$c_page);


            //Loop through this list. Only if $user_id is a sibling of $creator_id we will add it to the list
            $this->User = ClassRegistry::init('User');
            $ap_child_count = $this->User->childCount($user_id);

            foreach($q_r as $i){

                $owner_id   = $i['Na']['user_id'];
                $a_t_s      = $i['Na']['available_to_siblings'];
                $add_flag   = false;
                
                //Filter for parents and children
                //NAS devices of parent's can not be edited, where realms of childern can be edited
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($owner_id,$user_id)){ //Is the user_id an upstream parent of the AP
                        //Only those available to siblings:
                        if($a_t_s == 1){
                            $add_flag = true;
                            $edit     = false;
                            $delete   = false;
                            $manage_tags = false;
                        }
                    }
                }

                if($ap_child_count != 0){ //See if this NAS device is perhaps not one of those created by a sibling of the Access Provider
                    if($this->_is_sibling_of($user_id,$owner_id)){ //Is the creator a downstream sibling of the AP - Full rights
                        $add_flag = true;
                        $edit     = true;
                        $delete   = true;
                        $manage_tags = true; 
                    }
                }

                //Created himself
                if($owner_id == $user_id){
                    $add_flag = true;
                    $edit     = true;
                    $delete   = true;
                    $manage_tags = true;
                }

                if($add_flag == true ){
                    $owner_tree = $this->_find_parents($owner_id);

                    //Create realms list
                    $realms     = array();
                    foreach($i['NaRealm'] as $nr){
                        array_push($realms, 
                            array(
                                'id'                    => $nr['Realm']['id'],
                                'name'                  => $nr['Realm']['name'],
                                'available_to_siblings' => $nr['Realm']['available_to_siblings']
                        ));
                    }

                    //Create tags list
                    $tags       = array();
                    foreach($i['NaTag'] as $nr){
                        array_push($tags, 
                            array(
                                'id'                    => $nr['Tag']['id'],
                                'name'                  => $nr['Tag']['name'],
                                'available_to_siblings' => $nr['Tag']['available_to_siblings']
                        ));
                    }
                
                    //Add to return items
                    array_push($items,array(
                        'id'            => $i['Na']['id'], 
                        'nasname'       => $i['Na']['nasname'],
                        'shortname'     => $i['Na']['shortname'],
                        'owner'         => $owner_tree, 
                        'available_to_siblings' => $a_t_s,
                        'realms'                => $realms,
                        'tags'                  => $tags,
                        'connection_type'       => $i['Na']['connection_type'],
                        'update'                => $edit,
                        'delete'                => $delete,
                        'manage_tags'           => $manage_tags
                    ));
                }
            }
        }

        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }

    public function add() {

        //This works nice :-)
        if(!$this->_ap_right_check()){
            return;
        }
     
        $user       = $this->Aa->user_for_token($this);
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

        //If this attribute is not present it will fail empty check
        if(!isset($this->request->data['nasname'])){
            $this->request->data['nasname'] = ''; //Make it empty if not present
        }

        //We need to see what the connection type was that was chosen
        $connection_type = 'direct'; //Default
        if(isset($this->request->data['connection_type'])){
            if($this->request->data['connection_type'] == 'openvpn'){   //Add the OpenVPN item
                $d = array();
                $d['OpenvpnClient']['username'] = $this->request->data['vpn_username'];
                $d['OpenvpnClient']['password'] = $this->request->data['vpn_password'];
                $this->Na->OpenvpnClient->create();
                if(!$this->Na->OpenvpnClient->save($d)){
                    $first_error = reset($this->Na->OpenvpnClient->validationErrors);
                    $this->set(array(
                        'errors'    => $this->Na->OpenvpnClient->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => 'Could not create OpenVPN Client <br>'.$first_error[0]),
                        '_serialize' => array('errors','success','message')
                    ));
                    return;
                }else{
                    //Derive the nasname (ip address) from the new OpenvpnClient entry
                    $qr = $this->Na->OpenvpnClient->findById($this->Na->OpenvpnClient->id);
                    //IP Address =
                    $nasname = Configure::read('openvpn.ip_half').$qr['OpenvpnClient']['subnet'].'.'.$qr['OpenvpnClient']['peer1'];
                    $this->request->data['nasname'] = $nasname;
                }
            }
        }

        if(isset($this->request->data['connection_type'])){
            if($this->request->data['connection_type'] == 'dynamic'){   //Add discover the next dynamic-<number>

                $qr = $this->Na->find('first',array('conditions' => array('Na.nasname LIKE' => 'dynamic-%'), 'order' => 'Na.nasname DESC'));
                if($qr == ''){
                    $this->request->data['nasname'] = 'dynamic-1';
                }else{
                    $last_id = $qr['Na']['nasname'];
                    $last_nr = preg_replace('/^dynamic-/', "", $last_id);
                    //See if there are not any holes:
                    $start_id = 1;
                    $hole_flag = false;
                    while($start_id < $last_nr){
                        $nn = 'dynamic-'.$start_id;
                        $count = $this->Na->find('count', array('conditions' => array('Na.nasname' => $nn))); //This name is missing; we can take it
                        if($count == 0){
                            $this->request->data['nasname'] = $nn; 
                            $hole_flag = true;
                            break;
                        }
                        $start_id++;
                    }
                    if(!$hole_flag){ //There was no gap; take the next number
                        $this->request->data['nasname'] = 'dynamic-'.($last_nr+1);
                    }     
                }   
            }
        }

        $this->{$this->modelClass}->create();
        //print_r($this->request->data);
        if ($this->{$this->modelClass}->save($this->request->data)) {

            

            //Check if we need to add na_realms table
            if(isset($this->request->data['avail_for_all'])){
            //Available to all does not add any na_realm entries
            }else{
                foreach(array_keys($this->request->data) as $key){
                    if(preg_match('/^\d+/',$key)){
                        //----------------
                        $this->_add_nas_realm($this->{$this->modelClass}->id,$key);
                        //-------------
                    }
                }
            }

            //If it was an OpenvpnClient we need to update the na_id field
            if($this->request->data['connection_type'] == 'openvpn'){
                $this->Na->OpenvpnClient->saveField('na_id', $this->{$this->modelClass}->id);
            }
          
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';

            //If it was an OpenvpnClient we need to remove the created openvpnclient entry since there was a failure
            if($this->request->data['connection_type'] == 'openvpn'){
                $this->Na->OpenvpnClient->delete();
            }

            $first_error = reset($this->{$this->modelClass}->validationErrors);
            $this->set(array(
                'errors'    => $this->{$this->modelClass}->validationErrors,
                'success'   => false,
                'message'   => array('message' => 'Could not create item <br>'.$first_error[0]),
                '_serialize' => array('errors','success','message')
            ));
        }

	}

    public function manage_tags(){

        //This works nice :-)
        if(!$this->_ap_right_check()){
            return;
        }

        $tag_id = $this->request->data['tag_id'];
        $rb     = $this->request->data['rb'];

        foreach(array_keys($this->request->data) as $key){
            if(preg_match('/^\d+/',$key)){
                //----------------
                if($rb == 'add'){
                    $this->_add_nas_tag($key,$tag_id);
                }
                if($rb == 'remove'){
                    $this->Na->NaTag->deleteAll(array('NaTag.na_id' => $key,'NaTag.tag_id' => $tag_id), false);
                }
                //-------------
            }
        }
     
        $this->set(array(
                'success' => true,
                '_serialize' => array('success')
        ));
    }

    public function edit() {

        if(!$this->_ap_right_check()){
            return;
        }

        //We will not modify user_id
        unset($this->request->data['user_id']);

		if ($this->Realm->save($this->request->data)) {
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


    public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        if(!$this->_ap_right_check()){
            return;
        }

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];
            $this->Realm->id = $this->data['id'];
            $this->Realm->delete();
      
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                $this->Realm->id = $d['id'];
                $this->Realm->delete();
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

//------------------ EXPERIMENTAL WORK --------------------------

    public function display_realms_and_users($id = 0){

        if(isset($this->request->query['id'])){
            $id = $this->request->query['id'];
        }

        $items = array();

        if($id == 0){ //the root node
            $q = $this->{$this->modelClass}->find('all', array(
                'contain' => array('User' => array('fields' => 'User.id'))
            ));

            foreach($q as $i){
                //We will precede the id with 'grp_'
                $total_users = count($i['User']);

                $i[$this->modelClass]['qtip'] = $total_users." users<br>4 online";
                $i[$this->modelClass]['text'] = $i[$this->modelClass]['name'];
               // $i[$this->modelClass]['id']   = 'grp_'.$i[$this->modelClass]['id'];
              //  $i[$this->modelClass]['leaf'] = true;
                $total_users = count($i['User']);
                array_push($items,$i[$this->modelClass]);
            }

        }else{
            $q = $this->{$this->modelClass}->find('first', array(
                'conditions'    => array('Realm.id' => $id),
                'contain'       => array('User')
            ));
            foreach($q['User'] as $i){

                array_push($items, array('id' => $i['id'],'text' => $i['username'], 'leaf'=> true));
            }
            $count = 10;
            while($count < 20000){
                array_push($items, array('id' => $count,'text' => "Number $count", 'leaf'=> true));
                $count++;
            }
        }

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

//------------------ END EXPERIMENTAL WORK ------------------------------

    //------ List of available connection types ------
    public function conn_types_available(){

        $items = array();

        $ct = Configure::read('conn_type');
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

    //------ List of configured dynamic attributes types ------
    public function dynamic_attributes(){
        $items = array();
        $ct = Configure::read('dynamic_attributes');
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
                array('xtype' => 'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload')),
                array('xtype' => 'button', 'iconCls' => 'b-add',     'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                array('xtype' => 'button', 'iconCls' => 'b-delete',  'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                array('xtype' => 'button', 'iconCls' => 'b-edit',    'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')),
                array('xtype' => 'button', 'iconCls' => 'b-meta_edit','scale' => 'large', 'itemId' => 'meta',    'tooltip'=> __('Manage tags')),
                array('xtype' => 'button', 'iconCls' => 'b-filter',  'scale' => 'large', 'itemId' => 'filter',   'tooltip'=> __('Filter')),
                array('xtype' => 'button', 'iconCls' => 'b-map',     'scale' => 'large', 'itemId' => 'map',      'tooltip'=> __('Map')),
                array('xtype' => 'tbfill') 
            );
        }

        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id     = $user['id'];
            $menu   = array(
                array('xtype' => 'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload'))
            );

            //Add
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base."add")){
                array_push($menu,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-add',     
                    'scale'     => 'large', 
                    'itemId'    => 'add',      
                    'tooltip'   => __('Add')));
            }
            //Delete
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'delete')){
                array_push($menu,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-delete',  
                    'scale'     => 'large', 
                    'itemId'    => 'delete',
                    'disabled'  => true,   
                    'tooltip'   => __('Delete')));
            }

            //Edit
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'edit')){
                array_push($menu,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-edit',    
                    'scale'     => 'large', 
                    'itemId'    => 'edit',
                    'disabled'  => true,     
                    'tooltip'   => __('Edit')));
            }

            //Tags
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'manage_tags')){
                array_push($menu,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-meta_edit',    
                    'scale'     => 'large', 
                    'itemId'    => 'tag',
                    'disabled'  => true,     
                    'tooltip'=> __('Manage tags')));
            }

            array_push($menu,array('xtype' => 'button', 'iconCls' => 'b-filter',  'scale' => 'large', 'itemId' => 'filter',   'tooltip'=> __('Filter')));

            array_push($menu,array('xtype' => 'tbfill'));
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
            return "orphaned!!!!";
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

    private function _ap_right_check(){

        $action = $this->request->action;
        //___AA Check Starts ___
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        $user_id = null;
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $user_id = $user['id'];
        }elseif($user['group_name'] == Configure::read('group.ap')){  //Or AP
            $user_id = $user['id'];
            if(!$this->Acl->check(array('model' => 'User', 'foreign_key' => $user_id), $this->base.$action)){  //Does AP have right?
                $this->Aa->fail_no_rights($this);
                return;
            }
        }else{
           $this->Aa->fail_no_rights($this);
           return;
        }

        return true;
        //__ AA Check Ends ___
    }

    private function _add_nas_realm($nas_id,$realm_id){
        $d                          = array();
        $d['NaRealm']['id']         = '';
        $d['NaRealm']['na_id']      = $nas_id;
        $d['NaRealm']['realm_id']   = $realm_id;

        $this->Na->NaRealm->create();
        $this->Na->NaRealm->save($d);
        $this->Na->NaRealm->id      = false;
    }

    private function _add_nas_tag($nas_id,$tag_id){
        //Delete any previous tags if there were any
        $this->Na->NaTag->deleteAll(array('NaTag.na_id' => $nas_id,'NaTag.tag_id' => $tag_id), false);

        $d                      = array();
        $d['NaTag']['id']       = '';
        $d['NaTag']['na_id']    = $nas_id;
        $d['NaTag']['tag_id']   = $tag_id;
        $this->Na->NaTag->create();
        $this->Na->NaTag->save($d);
        $this->Na->NaTag->id    = false;
    }

}
