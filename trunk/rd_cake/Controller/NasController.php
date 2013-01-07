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


        //_____ ADMIN _____
        $items = array();
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            //This contain behaviour is something else man!
            //http://www.youtube.com/watch?v=mgQg4ze1_KU
            $this->Na->contain(array('NaRealm' => array('Realm.name','Realm.id','Realm.available_to_siblings')));
            $q_r = $this->Na->find('all');

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
                array_push($items,array(
                    'id'                    => $id, 
                    'nasname'               => $nasname,
                    'shortname'             => $shortname,
                    'owner'                 => $owner_tree, 
                    'available_to_siblings' => $a_t_s,
                    'realms'                => $realms,
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

            $this->Na->contain(
                array(  'NaRealm'   => array('Realm.name','Realm.id','Realm.available_to_siblings'),
                        'NaTag'     => array('Tag.name','Tag.id','Tag.available_to_siblings')
            ));
            $q_r = $this->Na->find('all');

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
            '_serialize' => array('items','success')
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

        $this->{$this->modelClass}->create();
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

            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';
            $this->set(array(
                'errors'    => $this->{$this->modelClass}->validationErrors,
                'success'   => false,
                'message'   => array('message' => 'Could not create item'),
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
