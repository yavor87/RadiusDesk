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
       // $this->User->contain();
       // $q_r = $this->User->find('all');
      //  print_r($q_r);
       // $this->User->recover(); //This is a (potential) ugly hack since the left and right values is not calculated correct due to the Acl

        $total = 10;
        $i     = 1;

        while($i < $total){
            $this->{$this->modelClass}->create();
            $d['User']['username'] = 'user__cp_'.$i;
            $d['User']['password'] = 'user_cp_'.$i;
            $d['User']['group_id'] = 10;
            $d['User']['parent_id']= 80;
            $d['User']['active']   = 1;
            $d['User']['token']    = '';
            $this->{$this->modelClass}->save($d);
            $this->{$this->modelClass}->id = null;
            $i++;
        } 

        exit;
    }

    public function add(){

    }

    public function edit(){

    }

    public function view(){

    }

    //--------- END BASIC CRUD ---------------------------


}
