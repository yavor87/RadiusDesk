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

                array_push($items,array(
                    'id'                    => $id, 
                    'nasname'               => $nasname,
                    'shortname'             => $shortname,
                    'owner'                 => $owner_tree, 
                    'available_to_siblings' => $a_t_s,
                    'update'                => true,
                    'delete'                =>true
                ));
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
