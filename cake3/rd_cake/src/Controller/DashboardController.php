<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class DashboardController extends AppController{
  
    public function initialize(){
    
        parent::initialize();

    }
    
    public function index() {
    
        $this->loadModel('Users');
        
        $users = $this->Users->find('all');
        $this->set(compact('users'));
        
        $this->set('_serialize',['users']);
	}
	
	 public function checkToken(){

        if((isset($this->request->query['token']))&&($this->request->query['token'] != '')){
        
            $token      = $this->request->query['token'];           
            $this->loadModel('Users');
            $user = $this->Users->find()->contain(['Groups'])->where(['Users.token' => $token])->first();
            
            if(!$user){
                $this->set(array(
                    'errors'        => array('token'=>'invalid'),
                    'success'       => false,
                    '_serialize'    => array('errors','success')
                ));
            
            }else{
               // print_r($user);
                $data = $this->_get_user_detail($user);
                $this->set(array(
                    'data'          => $data,
                    'success'       => true,
                    '_serialize'    => array('data','success')
                ));
            }
                     
        }else{

            $this->set(array(
                'errors'        => array('token'=>'missing'),
                'success'       => false,
                '_serialize'    => array('errors','success')
            ));
        }
         
    }
    
    private function _get_user_detail($user){
    
        Configure::load('RadiusDesk','default');
        
        $group      = $user->group->name;
        $username   = $user->username;
        $token      = $user->token;
        $id         = $user->id;
        
        $cls        = 'user';
        $menu       = array();
        
        $isRootUser = false;
        
         if( $group == Configure::read('group.admin')){  //Admin
            $cls = 'admin';
            $tabs= $this->_build_admin_tabs($id);  //We do not care for rights here;
            $isRootUser = true;
        }
        
        if( $group == Configure::read('group.ap')){  //Or AP
            $cls = 'access_provider';
            $tabs= $this->_build_ap_tabs($id);  //We DO care for rights here!
            
        
            
        }
        
/*
        $this->User->contain('Group');
        $q_r        = $this->User->find('first',array('conditions'    => array('User.username' => $username)));
        $token      = $q_r['User']['token'];
        $id         = $q_r['User']['id'];
        $group      = $q_r['Group']['name'];
        $username   = $q_r['User']['username'];

        $cls        = 'user';
        $menu       = array();

        $isRootUser = false;

        if( $group == Configure::read('group.admin')){  //Admin
            $cls = 'admin';
            $tabs= $this->_build_admin_tabs($id);  //We do not care for rights here;
            $isRootUser = true;
        }
        if( $group == Configure::read('group.ap')){  //Or AP
            $cls = 'access_provider';
            $tabs= $this->_build_ap_tabs($id);  //We DO care for rights here!
        }

        $wp_url = Configure::read('paths.wallpaper_location').Configure::read('user_settings.wallpaper');
        //Check for personal overrides
        $q = $this->UserSetting->find('first',array('conditions' => array('UserSetting.user_id' => $id,'UserSetting.name' => 'wallpaper')));
        if($q){
            $wp_base = $q['UserSetting']['value'];
            $wp_url = Configure::read('paths.wallpaper_location').$wp_base;
        }
*/
        return array(
            'token'         =>  $token,
            'isRootUser'    =>  $isRootUser,
            'tabs'          =>  $tabs,
            'data_usage'    => array('realm_id' => $this->realm_id, 'realm_name' => $this->realm_name),
            'user'          =>  array('id' => $id, 'username' => $username,'group' => $group,'cls' => $cls)
        );
        
    }
    
    private function _build_ap_tabs($id){
        $tabs   = array();
        $user_id = $id;
        
        //Base to start looking from.
        $base   = "Access Providers/Controllers/"; 
           
        
        //____ Overview Tab ___
        //This one is a bit different :-)
        $overview_items = array();
        
        //Find out if there is a dafault setting for the realm.
        $show_data_usage        = true;
        $show_recent_failures   = true;
        $realm_blank            = false;
        
        //Find if there is a realm specified in the settings        
        $q_rr =  $this->loadModel('UserSettings')->find()->where(['user_id' => $user_id,'name' => 'realm_id'])->first();
  
        if($q_rr){
            //Get the name of the realm
            $q_r = $this->loadModel('Realms')->find()->where(['id' => $q_rr->value])->first();
            $realm_name         = $q_r->name;
            $data['realm_name'] = $realm_name;
            $data['realm_id']   = $q_rr->value;
            
            $this->realm_name   = $realm_name;
            $this->realm_id     = $q_rr->value;
           
            //Get the settings of whether to show the two tabs
            $q_rdu = $this->loadModel('UserSettings')->find()->where(['user_id' => $user_id,'name' => 'show_data_usage'])->first();
           
            if($q_rdu->value == 0){
                $show_data_usage = false;
            }
            
            $q_rf = $this->loadModel('UserSettings')->find()->where(['user_id' => $user_id,'name' => 'show_recent_failures'])->first();
            
            if($q_rf->value == 0){
                $show_recent_failures = false;
            }  
         
        //No realm specified in settings; get a default one (if there might be one )    
        }else{    
            $realm_detail = $this->_ap_default_realm($user_id);
            if(array_key_exists('realm_id',$realm_detail)){
                $data['realm_name'] = $realm_detail['realm_name'];
                $data['realm_id']   = $realm_detail['realm_id'];
                
                $this->realm_name   = $realm_detail['realm_name'];
                $this->realm_id     = $realm_detail['realm_id'];
            }else{ // Could not find a default realm
                $realm_blank = true;
            }  
        }
        
         //We found a realm and should display it
        if(($realm_blank == false)&&($show_data_usage == true)){
            array_push($overview_items, array(
                    'title'   => __('Data Usage'),
                    'glyph'   => Configure::read('icnData'),
                    'id'      => 'cDataUsage',
                    'layout'  => 'fit'
                )
            );
        }else{
        
            //We could not find a realm and should display a welcome message
            if($realm_blank == true){
                array_push($overview_items, array(
                        'title'   => __('Welcome Message'),
                        'glyph'   => Configure::read('icnNote'),
                        'id'      => 'cWelcome',
                        'layout'  => 'fit'
                    )
                );
            }
        }
        
        //We found a realm and should display it
        if(($realm_blank == false)&&($show_recent_failures == true)){
           /* array_push($overview_items, array(
                    'title'   => __('Recent Failures'),
                        'glyph'   => Configure::read('icnBan'),
                        'id'      => 'cRejects',
                        'layout'  => 'fit'
                )
            );*/
        } 
        
        array_push($overview_items, array(
                'title'   => __('Utilities'),
                'glyph'   => Configure::read('icnGears'),
                'id'      => 'cUtilities',
                'layout'  => 'fit'
            )
        );
            
        array_push($tabs, array(
                'title'     => __('Overview'),
                'xtype'     => 'tabpanel',
                'glyph'     => Configure::read('icnView'),
                'itemId'    => 'tpOverview',
                'layout'    => 'fit',
                'items'   => $overview_items
            )
        );
        
         //____ Admin Tab ____
        $admin_items = array();
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."AccessProviders/index")){
        
            array_push($admin_items, array(
                    'title'   => __('Admins'),
                    'glyph'   => Configure::read('icnAdmin'),
                    'id'      => 'cAccessProviders',
                    'layout'  => 'fit'
                )
            );
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Realms/index")){
            array_push($admin_items, array(
                    'title'   => __('Realms (Groups)'),
                    'glyph'   => Configure::read('icnRealm'),
                    'id'      => 'cRealms',
                    'layout'  => 'fit'
                )
            );
        }

        if(count($admin_items) > 0){
            array_push($tabs, array(
                    'title'   => __('Admin'),
                    'glyph'   => Configure::read('icnAdmin'),
                    'xtype'   => 'tabpanel',
                    'layout'  => 'fit',
                    'items'   => $admin_items
                )
            );
        }
       
        //____ Users Tab ____   
        $users_items = array();
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."PermanentUsers/index")){
            array_push($users_items, array(
                    'title'     => __('Permanent Users'),
                    'glyph'     => Configure::read('icnUser'),
                    'id'        => 'cPermanentUsers',
                    'layout'    => 'fit'                   
                )
            );
        
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Vouchers/index")){
            array_push($users_items, array(
                    'title'     => __('Vouchers'),
                    'glyph'     => Configure::read('icnVoucher'),
                    'id'        => 'cVouchers',
                    'layout'    => 'fit'          
                )
            );
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Devices/index")){
            array_push($users_items, array(
                    'title'     => __('BYOD'),
                    'glyph'     => Configure::read('icnDevice'),
                    'id'        => 'cDevices',
                    'layout'    => 'fit'       
                )
            );
        }
      /*  
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."TopUps/index")){
            array_push($users_items, array(
                    'title'     => __('Top-Ups'),
                    'glyph'     => Configure::read('icnTopUp'),
                    'id'        => 'cTopUps',
                    'layout'    => 'fit'
                )
            ); 
        }*/
        
        if(count($admin_items) > 0){
            array_push($tabs, array(
                    'title'   => __('Users'),
                    'xtype'   => 'tabpanel',
                    'glyph'   => Configure::read('icnUser'),
                    'layout'  => 'fit',
                    'items'   => $users_items
                )
            );
        }
        
        //____ Profiles Tab ____   
        $profile_items = array();
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."ProfileComponents/index")){
            array_push($profile_items, array(
                    'title'   => __('Profile Components'),
                    'glyph'   => Configure::read('icnComponent'),
                    'id'      => 'cProfileComponents',
                    'layout'  => 'fit'          
                )
            );
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Profiles/index")){
            array_push($profile_items, array(
                    'title'   => __('Profiles'),
                    'glyph'   => Configure::read('icnProfile'),
                    'id'      => 'cProfiles',
                    'layout'  => 'fit'            
                )
            );
        }
        
        if(count($profile_items) > 0){
            array_push($tabs, array(
                'title'   => __('Profiles'),
                'glyph'   => Configure::read('icnProfile'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => $profile_items
                )
            );
        }
        
        //____ RADIUS Tab ____  
        $radius_items = array();
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."DynamicClients/index")){
            array_push($radius_items, array(
                    'title'   => __('Dynamic RADIUS Clients'),
                    'glyph'   => Configure::read('icnDynamicNas'),
                    'id'      => 'cDynamicClients',
                    'layout'  => 'fit'             
                )
            );
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Nas/index")){
            array_push($radius_items, array(
                    'title'   => __('NAS Devices'),
                    'glyph'   => Configure::read('icnNas'),
                    'id'      => 'cNas',
                    'layout'  => 'fit'           
                )
            );
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Tags/index")){
            array_push($radius_items, array(
                    'title'   => __('NAS Device Tags'),
                    'glyph'   => Configure::read('icnTag'),
                    'id'      => 'cTags',
                    'layout'  => 'fit'
                              
                )
            );
        }
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Ssids/index")){
            array_push($radius_items, array(
                    'title'   => __('SSIDs'),
                    'glyph'   => Configure::read('icnSsid'),
                    'id'      => 'cSsids',
                    'layout'  => 'fit'             
                )
            );
        }
        
        if(count($radius_items) > 0){
            array_push($tabs, array(
                'title'   => __('RADIUS'),
                'glyph'   => Configure::read('icnRadius'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => $radius_items
                )
            );
        }
        
        //___ MESHdesk tab ___
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."Meshes/index")){
             array_push($tabs, array(
                    'title'   => __('MESHdesk'),
                    'glyph'   => Configure::read('icnMesh'),
                    'id'      => 'cMeshes',
                    'layout'  => 'fit'
                )
            );
        }
        
        //___ APdesk tab ___
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."ApProfiles/index")){
             array_push($tabs, array(
                    'title'   => __('APdesk'),
                    'glyph'   => Configure::read('icnCloud'),
                    'id'      => 'cAccessPoints',
                    'layout'  => 'fit' 
                )
            );
        }
        
        // ____ Other Tab ____
        
        $other_items = array();
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."DynamicDetails/index")){
            array_push($other_items, array(
                    'title'   => __('Dynamic Login Pages'),
                    'glyph'   => Configure::read('icnDynamic'),
                    'id'      => 'cDynamicDetails',
                    'layout'  => 'fit' 
                )
            );
        }
        
        if(count($other_items) > 0){
            array_push($tabs, array(
                'title'   => __('Other'),
                'glyph'   => Configure::read('icnGears'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => $other_items
                )
            );
        }
        
        return $tabs;
    }
    
    private function _ap_default_realm($ap_id){
    
        $realm = array();

        $this->loadModel('Users');
        $this->loadModel('Realms');
        
        $q_r = $this->Users->find('path',['for' => $ap_id]);
            
        $found_flag = false;  
               
        foreach($q_r as $i){    
            $user_id    = $i->id;
             
            $r = $this->Realms->find()->where(['Realms.user_id' => $user_id,'Realms.available_to_siblings'=> true])->all();
               
            foreach($r  as $j){
                $id     = $j->id;
                $name   = $j->name;
                $read = $this->Acl->check(
                            array('model' => 'User', 'foreign_key' => $ap_id), 
                            array('model' => 'Realm','foreign_key' => $id), 'read');
                if($read == true){
                    $realm['realm_id']      = $id;
                    $realm['realm_name']    = $name;
                    $found_flag = true;
                    break; // We only need one 
                }
            }
        }

        //All the realms owned by anyone this access provider created (and also itself) 
        //will automatically be under full controll of this access provider  
        if($found_flag == false){
            
            $this->children     = $this->Users->find_access_provider_children($ap_id);
            $or_array           = array();
            if($this->children){   //Only if the AP has any children...
                foreach($this->children as $i){
                    $id = $i['id'];
                    array_push($or_array,array('Realms.user_id' => $id));
                }       
            }
            
            $r_sub = $this->Realms->find()->where(['OR' => $or_array])->all(); 
            foreach($r_sub  as $j){
                $realm['realm_id']     = $j->id;
                $realm['realm_name']   = $j->name;
                break; //We only need one
            }   
        }
        return $realm;
    }
}

