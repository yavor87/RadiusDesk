<?php
App::uses('AppController', 'Controller');

class RealmsController extends AppController {


    public $name       = 'Realms';
    public $components = array('Aa');
    private $base      = "Access Providers/Controllers/Realms/";

//------------------------------------------------------------------------

    //____ Access Providers application ______
  
    public function index_ap(){
    //This method will display the Access Provider we are looking at's list of available realms.
    //This will be:
    // ALL the upstream AP's who has realms that is flagged as 'available_to_siblings' (And That's it :-))
    //The Access Provider creating a sub-provider can create a private realm that is not listed in any of the sub-provider's lists (but that is under the realms application)
    //We will also go through each of these ones to determine if the AP has CRUD access to the realm and reflect it in the feedback...

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        $user_id = null;
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $user_id = $user['id'];
        }

        if($user['group_name'] == Configure::read('group.ap')){  //Or AP
            $user_id = $user['id'];
        }

        if(isset($this->request->query['ap_id'])){
            $ap_id      = $this->request->query['ap_id'];
            $this->User = ClassRegistry::init('User');
            $q_r        = $this->User->getPath($ap_id); //Get all the parents up to the root
            $items      = array();
            foreach($q_r as $i){
                
                $user_id    = $i['User']['id'];
                $this->Realm->contain();
                $r        = $this->Realm->find('all',array('conditions' => array('Realm.user_id' => $user_id, 'Realm.available_to_siblings' => true)));
                foreach($r  as $j){
                    $id     = $j['Realm']['id'];
                    $name   = $j['Realm']['name'];
                    $create = $this->Acl->check(
                                array('model' => 'User', 'foreign_key' => $ap_id), 
                                array('model' => 'Realm','foreign_key' => $id), 'create');
                    $read   = $this->Acl->check(
                                array('model' => 'User', 'foreign_key' => $ap_id), 
                                array('model' => 'Realm','foreign_key' => $id), 'read');
                    $update = $this->Acl->check(
                                array('model' => 'User', 'foreign_key' => $ap_id), 
                                array('model' => 'Realm','foreign_key' => $id), 'update');
                    $delete = $this->Acl->check(
                                array('model' => 'User', 'foreign_key' => $ap_id), 
                                array('model' => 'Realm','foreign_key' => $id), 'delete');
                    array_push($items,array('id' => $id, 'name' => $name, 'create' => $create, 'read' => $read, 'update' => $update, 'delete' => $delete));
                }
            }
        }  

        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

    public function edit_ap(){

        //The ap_id who's realm rights HAS to be a sibling of the user who initiated the request
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
        }else{
           $this->Aa->fail_no_rights($this);
           return;
        }
        //__ AA Check Ends ___


        if(isset($this->request->query['ap_id'])){

            //Make sure the $ap_id is a child of $user_id - perhaps we should sub-class the Behaviaour...
            //TODO Complete this check

            $ap_id  = $this->request->query['ap_id'];
            $id     = $this->request->data['id'];
            if($this->request->data['create'] == true){
                $this->Acl->allow(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'create');
            }else{
                $this->Acl->deny(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'create');
            } 

            if($this->request->data['read'] == true){
                $this->Acl->allow(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'read');
            }else{
                $this->Acl->deny(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'read');
            }

            if($this->request->data['update'] == true){
                $this->Acl->allow(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'update');
            }else{
                $this->Acl->deny(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'update');
            } 
            
            if($this->request->data['delete'] == true){
                $this->Acl->allow(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'delete');
            }else{
                $this->Acl->deny(
                array('model' => 'User', 'foreign_key' => $ap_id), 
                array('model' => 'Realm','foreign_key' => $id), 'delete');
            } 
  
    
        }

        $this->set(array(
            'items' => array(),
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }
    //____ END :: Access Providers application ______


//----------------------------------------------------------------------------

    //____ BASIC CRUD Realm Manager ________
    public function index(){
    //Display a list of realms with their owners
    //This will be dispalyed to the Administrator as well as Access Providers who has righs

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        $user_id = null;

        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $user_id = $user['id'];
        }

        if($user['group_name'] == Configure::read('group.ap')){  //Or AP
            $user_id = $user['id'];
        }

        //_____ ADMIN _____
        $items = array();
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $q_r = $this->Realm->find('all');

            //Init before the loop
            $this->User = ClassRegistry::init('User');
            foreach($q_r as $i){
                $id     = $i['Realm']['id'];
                $name   = $i['Realm']['name'];
                $creator_id     = $i['Realm']['user_id'];
                $creator_tree   = $this->_find_parents($creator_id);
                $a_t_s  = $i['Realm']['available_to_siblings'];

                //Rest of the fields
                //'phone','fax', 'cell', 'email','url', 'street_no', 'street','town_suburb','city','country','lat','lon'
                $phone          = $i['Realm']['phone'];
                $fax            = $i['Realm']['fax'];
                $cell           = $i['Realm']['cell'];
                $email          = $i['Realm']['email'];
                $url            = $i['Realm']['url'];
                $street_no      = $i['Realm']['street_no'];
                $street         = $i['Realm']['street'];
                $town_suburb    = $i['Realm']['town_suburb'];
                $city           = $i['Realm']['city'];
                $country        = $i['Realm']['country'];
                $lat            = $i['Realm']['lat'];
                $lon            = $i['Realm']['lon'];

                array_push($items,array(
                    'id'                    => $id, 
                    'name'                  => $name, 
                    'creator'               => $creator_tree, 
                    'available_to_siblings' => $a_t_s,
                    'phone'                 => $phone,
                    'fax'                   => $fax,
                    'cell'                  => $cell,
                    'email'                 => $email,
                    'url'                   => $url,
                    'street_no'             => $street_no,
                    'street'                => $street,
                    'town_suburb'           => $town_suburb,
                    'city'                  => $city,
                    'country'                => $country,
                    'lat'                   => $lat,
                    'lon'                   => $lon, 
                    'update'                => true,
                    'delete'                =>true
                ));
            }
        }

        //_____ AP _____
        if($user['group_name'] == Configure::read('group.ap')){  

            //If it is an Access Provider that requested this list; we should show:
            //1.) all those realms that he is allowed to use from parents with the available_to_sibling flag set (no edit or delete)
            //2.) all those he created himself (if any) (this he can manage, depending on his right)
            //3.) all his children -> check if they may have created any. (this he can manage, depending on his right)

            $this->Realm->contain();
            $q_r = $this->Realm->find('all');

            //Loop through this list. Only if $user_id is a sibling of $creator_id we will add it to the list
            $this->User = ClassRegistry::init('User');
            $ap_child_count = $this->User->childCount($user_id);

            foreach($q_r as $i){
                $id             = $i['Realm']['id'];
                $name           = $i['Realm']['name'];
                $a_t_s          = $i['Realm']['available_to_siblings'];
                $creator_id     = $i['Realm']['user_id'];
                $creator_tree   = $this->_find_parents($creator_id);

                //Rest of the fields
                //'phone','fax', 'cell', 'email','url', 'street_no', 'street','town_suburb','city','country','lat','lon'
                $phone          = $i['Realm']['phone'];
                $fax            = $i['Realm']['fax'];
                $cell           = $i['Realm']['cell'];
                $email          = $i['Realm']['email'];
                $url            = $i['Realm']['url'];
                $street_no      = $i['Realm']['street_no'];
                $street         = $i['Realm']['street'];
                $town_suburb    = $i['Realm']['town_suburb'];
                $city           = $i['Realm']['city'];
                $country        = $i['Realm']['country'];
                $lat            = $i['Realm']['lat'];
                $lon            = $i['Realm']['lon'];
                
 
                //Filter for parents and children
                //Realms of parent's can not be edited, where realms of childern can be edited
                if($creator_id != $user_id){
                    if($this->_is_sibling_of($creator_id,$user_id)){ //Is the user_id an upstream parent of the AP
                        //Only those available to siblings:
                        if($a_t_s == 1){
                            array_push($items,array(
                                'id'                    => $id, 
                                'name'                  => $name, 
                                'creator'               => $creator_tree, 
                                'available_to_siblings' => $a_t_s,
                                'phone'                 => $phone,
                                'fax'                   => $fax,
                                'cell'                  => $cell,
                                'email'                 => $email,
                                'url'                   => $url,
                                'street_no'             => $street_no,
                                'street'                => $street,
                                'town_suburb'           => $town_suburb,
                                'city'                  => $city,
                                'country'                => $country,
                                'lat'                   => $lat,
                                'lon'                   => $lon,
                                'update'                => false, //AP can not manage Realms of parents
                                'delete'                => false
                            ));
                        }
                    }
                    if($ap_child_count != 0){ //See if this realm is perhaps not one of those created by a sibling of the Access Provider
                        if($this->_is_sibling_of($user_id,$creator_id)){ //Is the creator a downstream sibling of the AP - Full rights
                            array_push($items,array(
                                'id'                    => $id, 
                                'name'                  => $name, 
                                'creator'               => $creator_tree, 
                                'available_to_siblings' => $a_t_s,
                                'phone'                 => $phone,
                                'fax'                   => $fax,
                                'cell'                  => $cell,
                                'email'                 => $email,
                                'url'                   => $url,
                                'street_no'             => $street_no,
                                'street'                => $street,
                                'town_suburb'           => $town_suburb,
                                'city'                  => $city,
                                'country'                => $country,
                                'lat'                   => $lat,
                                'lon'                   => $lon,
                                'update'                => true, //AP can manage realms of siblings
                                'delete'                => true
                            ));
                        }
                    }
                }

                //Created himself
                if($creator_id == $user_id){    
                    array_push($items,array(
                        'id'                    => $id, 
                        'name'                  => $name, 
                        'creator'               => $creator_tree, 
                        'available_to_siblings' => $a_t_s,
                        'phone'                 => $phone,
                        'fax'                   => $fax,
                        'cell'                  => $cell,
                        'email'                 => $email,
                        'url'                   => $url,
                        'street_no'             => $street_no,
                        'street'                => $street,
                        'town_suburb'           => $town_suburb,
                        'city'                  => $city,
                        'country'                => $country,
                        'lat'                   => $lat,
                        'lon'                   => $lon,
                        'update'                => true, //AP can manage their own
                        'delete'                => true
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
                'message'   => array('message' => 'Could not create item'),
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
}
