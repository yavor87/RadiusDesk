<?php
App::uses('AppController', 'Controller');

class AccessProvidersController extends AppController {

    public $name       = 'AccessProviders';
    public $components = array('Aa');
    public $uses       = array('User'); //This has primaraly to do with users :-)

    public $ap_acl     = 'Access Providers/Controllers/';    


    //-- NOTES on users:
    //-- Each user belongs to (A) group (group_id) = Permanent Users. (B) a realm (realm_id) (C) a creator (user_id)
    //-- (D) Profile ID (profile_id) (E) a Language ID (language_id) (F) an Auth Method id (auth_method_id)

    //-- Each user will have a token which should be used in the URL to do Ajax calls

    //-- NOTES on rights:
    //-- Most controller actions will require a token in the query string to determine who originated the request
    //-- The rights of that person will then be checked and also against who it is attempting to be done.

    //-- Notes on AccessProviders
    //--APs can be created by Administrators or also by other Access Providers (provided they have the corrrect rights)
    //--An AP can view all those AP's he created


    //-------- BASIC CRUD -------------------------------

    public function index(){
        //-- Required query attributes: token;
        //-- Optional query attribute: sel_language (for i18n error messages)
        //-- also LIMIT: limit, page, start (optional - use sane defaults)
        //-- FILTER <- This will need fine tunning!!!!
        //-- AND SORT ORDER <- This will need fine tunning!!!!

       // $this->User->recover();

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

        $items = array();
    
        //If id is not set return an empty list:
        if($user_id != null){
            if(isset($this->request->query['node'])){
                if($this->request->query['node'] == 0){ //This is the root node.
                    $id = $user_id;
                }else{
                    $id = $this->request->query['node'];
                }
            }         
            //We only will list the first level of nodes
            $ap_name = Configure::read('group.ap');
            $q_r    = $this->User->find('all',array('conditions' => array('User.parent_id' => $id,'Group.name' => $ap_name  )));
            foreach($q_r as $i){
                $id         = $i['User']['id'];
                $parent_id  = $i['User']['parent_id'];
                $username   = $i['User']['username'];
                $name       = $i['User']['name'];
                $surname    = $i['User']['surname'];
                $phone      = $i['User']['phone'];
                $email      = $i['User']['email'];
                $active     = $i['User']['active'];
                $monitor    = $i['User']['monitor'];

                $leaf       = false;
                $icon       = 'users';

                //We do not use childcount since the admin or ap can also create users
                $child_count= $this->User->find('count',array('conditions' => array('User.parent_id' => $id,'Group.name' => $ap_name  )));
                if($child_count == 0){
                    $leaf = true;
                    $icon = 'user';
                }
                array_push($items,
                    array('id' => $id, 'username' => $username,'leaf' => $leaf,'name' => $name,'surname' => $surname, 'phone' => $phone, 'email' => $email,'active' => $active, 'monitor' => $monitor,'iconCls' => $icon,'language' => '4_4')
                ); 
            }
        }     
            
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
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
        if(array_key_exists('activate',$this->request->data)){
            $this->request->data['active'] = 1;
        }

        if(array_key_exists('monior',$this->request->data)){
            $this->request->data['monitor'] = 1;
        }

        if($this->request->data['parent_id'] == '0'){ //This is the holder of the token
            $this->request->data['parent_id'] = $user['id'];
        }

        //Get the language and country
        $country_language   = explode( '_', $this->request->data['language'] );

        $country            = $country_language[0];
        $language           = $country_language[1];

        $this->request->data['language_id'] = $language;
        $this->request->data['country_id']  = $country;

        //Get the group ID for AP's
        $ap_name    = Configure::read('group.ap');
        $q_r        = ClassRegistry::init('Group')->find('first',array('conditions' =>array('Group.name' => $ap_name)));
        $group_id   = $q_r['Group']['id'];
        $this->request->data['group_id'] = $group_id;

        //Zero the token to generate a new one for this user:
        $this->request->data['token'] = '';



        //The rest of the attributes should be same as the form..
        $this->User->create();
        $this->User->save($this->request->data);


        $this->set(array(
            'items' => array(),
            'success' => true,
            '_serialize' => array('items','success')
        ));

    }

    //Extjs specific workaround for treestore that has a defined model
    public function dummy_delete(){
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

    public function delete(){

        if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];
            $this->User->id = $this->data['id'];
            $this->User->delete();
            $this->User->recover();     //This is a (potential) ugly hack since the left and right values is not calculated correct due to the Acl behaviour
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                $this->User->id = $d['id'];
                $this->User->delete();
                $this->User->recover(); //This is a (potential) ugly hack since the left and right values is not calculated correct due to the Acl behaviour
            }
        }
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));

    }

    public function edit(){

        //We need to unset a few of the values submitted:
        unset($this->request->data['token']);
        unset($this->request->data['password']);
        unset($this->request->data['parent_id']);

        //Monitor checkbox
        if(isset($this->request->data['monitor'])){
            $this->request->data['monitor'] = 1;
        }else{
            $this->request->data['monitor'] = 0;
        }

         //Active checkbox
        if(isset($this->request->data['active'])){
            $this->request->data['active'] = 1;
        }else{
            $this->request->data['active'] = 0;
        }


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

    public function view(){

    }

    //--------- END BASIC CRUD ---------------------------

    //----- Menus ------------------------

    public function menu_for_tree(){

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
                array('xtype' => 'button', 'iconCls' => 'b-expand',  'scale' => 'large', 'itemId' => 'expand',   'tooltip'=> __('Expand')),
                array('xtype' => 'button', 'iconCls' => 'b-edit',    'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')),
                array('xtype' => 'button', 'iconCls' => 'b-password','scale' => 'large', 'itemId' => 'password', 'tooltip'=> __('Change Password')),
                array('xtype' => 'tbfill') 
            );
        }

        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id     = $user['id'];
            $base   = "Access Providers/Controllers/AccessProviders/";
            $menu   = array(
                array('xtype' => 'button', 'iconCls' => 'b-reload',  'scale' => 'large', 'itemId' => 'reload',   'tooltip'=> __('Reload'))
            );

            //Add
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."add")){
                array_push($menu,array('xtype' => 'button', 'iconCls' => 'b-add',     'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')));
            }
            //Delete
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base.'delete')){
                array_push($menu,array('xtype' => 'button', 'iconCls' => 'b-delete',  'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')));
            }

            //Edit
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base.'edit')){
                array_push($menu,array('xtype' => 'button', 'iconCls' => 'b-edit',    'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit')));
            }
            array_push($menu,array('xtype' => 'button', 'iconCls' => 'b-expand',  'scale' => 'large', 'itemId' => 'expand',   'tooltip'=> __('Expand')));

             //Edit
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base.'change_password')){      
                array_push($menu,array('xtype' => 'button', 'iconCls' => 'b-password','scale' => 'large', 'itemId' => 'password', 'tooltip'=> __('Change Password')));
            }

            array_push($menu,array('xtype' => 'tbfill'));
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));

    }

    public function record_activity_checkbox(){

        //Status: DONE
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        $items = array('checked' => 'true', 'disabled' => true);
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $items = array('checked' => true, 'disabled' => false);
        }

        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)

            //This is an Access Provider; we need to check the rights:
            $right_to_check = "Access Providers/Other Rights/Can disable activity recording";

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $user['id']),$right_to_check)){  //The user can adjust recording

                if($user['monitor'] == 0){
                    $items = array('checked' => 'false', 'disabled' => false);   //The parent does not record, the child either
                }else{
                    $items = array('checked' => 'true', 'disabled' => false);   //The parent records, the child also
                }
         
            }else{
                //Inherit from creator
                
                if($user['monitor'] == 0){
                    $items = array('checked' => 'false', 'disabled' => true);   //The parent does not record, the child either
                }else{
                    $items = array('checked' => 'true', 'disabled' => true);   //The parent records, the child also
                }
            }
        }
        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }


    public function child_check(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        $items = array();
        $this->User = ClassRegistry::init('User');
        $this->User->contain();

        $tree = false;
        if(
            ($user['group_name'] == Configure::read('group.admin'))||
            ($user['group_name'] == Configure::read('group.ap'))
        ){  //Admin or AP
            if($this->User->childCount($user['id']) > 0){
                $tree = true;
            }
        }

        $items['tree'] = $tree;

        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }
}
