<?php
App::uses('AppController', 'Controller');

class PermanentUsersController extends AppController {

    public $name       = 'PermanentUsers';
    public $uses       = array('User');
    public $components = array('Aa');


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
                    'realm'     => $realm,
                    'profile'   => $profile,
                    'active'    => $i['User']['active'], 
                    'monitor'   => $i['User']['monitor'],
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

    public function test_joins(){

        $this->{$this->modelClass}->contain('Radcheck');

        
        $c                  = array();
        $c['joins']         = array();
        $c['conditions']    = array('Radcheck.attribute' => 'User-Profile','Radcheck.value' => 'Profile-A','Radcheck.attribute' => 'Rd-Realm','Radcheck.value' => 'realm_for_dp');

        array_push($c['joins'],array(
            'table'         => 'radcheck',
            'alias'         => 'Radcheck',
            'type'          => 'LEFT',
            'conditions'    => array('Radcheck.username = User.username')
        ));

        $q_r = $this->{$this->modelClass}->find('all',$c);
        print_r($q_r);
        exit;
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

    public function edit(){

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
                    array('xtype' => 'button', 'iconCls' => 'b-note',     'scale' => 'large', 'itemId' => 'note',     'tooltip'=> __('Add notes')),
                    array('xtype' => 'button', 'iconCls' => 'b-csv',     'scale' => 'large', 'itemId' => 'csv',      'tooltip'=> __('Export CSV')),
                )),
                array('xtype' => 'buttongroup','title' => __('Extra actions'), 'items' => array(
                    array('xtype' => 'button', 'iconCls' => 'b-password','scale' => 'large', 'itemId' => 'password', 'tooltip'=> __('Change password')),
                    array('xtype' => 'button', 'iconCls' => 'b-disable', 'scale' => 'large', 'itemId' => 'enable_disable','tooltip'=> __('Enable / Disable')),
                    array('xtype' => 'button', 'iconCls' => 'b-message', 'scale' => 'large', 'itemId' => 'send_message', 'tooltip'=> __('Send massage')),
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

                        //Join it dynamically
                        array_push($c['joins'],array(
                            'table'         => 'radcheck',
                            'alias'         => 'Radcheck',
                            'type'          => 'LEFT',
                            'conditions'    => array('Radcheck.username = User.username')
                        )); 
                        //Add a search clause
                        array_push($c['conditions'],array(
                            'Radcheck.attribute'  => 'Rd-Realm',
                            "Radcheck.value LIKE" => '%'.$f->value.'%'
                        ));
                    }

                    if($f->field == 'owner'){
                        array_push($c['conditions'],array("Owner.username LIKE" => '%'.$f->value.'%'));   
                    }else{
                      //  $col = $this->modelClass.'.'.$f->field;
                      //  array_push($c['conditions'],array("$col LIKE" => '%'.$f->value.'%'));
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

}
