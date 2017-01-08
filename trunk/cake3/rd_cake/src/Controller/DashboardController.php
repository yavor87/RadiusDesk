<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class DashboardController extends AppController{
  
    protected $base  = "Access Providers/Controllers/Dashboard/";
  
    public function initialize(){  
        parent::initialize();
        $this->loadModel('Users');
        $this->loadModel('UserSettings');
        $this->loadModel('Realms');   
        $this->loadComponent('Aa');      
    }
    
    public function authenticate(){
    
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'userModel' => 'Users',
                    'fields' => ['username' => 'username', 'password' => 'password'],
                    'passwordHasher' => [
                        'className' => 'Fallback',
                        'hashers' => [
                            'Default',
                            'Weak' => ['hashType' => 'sha1']
                        ]
                    ]
                ]
            ]
        ]);
    
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user){
                //We can get the detail for the user
                $u = $this->Users->find()->contain(['Groups'])->where(['Users.id' => $user['id']])->first();
                $data = $this->_get_user_detail($u);
                $this->set(array(
                    'data'          => $data,
                    'success'       => true,
                    '_serialize' => array('data','success')
                ));
                
            }else{
            
                $this->set(array(
                    'errors'        => array('username' => __('Confirm this name'),'password'=> __('Type the password again')),
                    'success'       => false,
                    'message'       => array('message'  => __('Authentication failed')),
                    '_serialize' => array('errors','success','message')
                ));
                
            }
        }
    }
	
	public function checkToken(){

        if((isset($this->request->query['token']))&&($this->request->query['token'] != '')){
        
            $token  = $this->request->query['token'];           
            $user   = $this->Users->find()->contain(['Groups'])->where(['Users.token' => $token])->first();
            
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
    
     public function utilitiesItems(){       
        $data = array(
            array(
                'xtype'   => 'button',
                'text'    => 'RADIUS Client',
                'glyph'   => Configure::read('icnRadius'),
                'scale'   => 'large',
                'itemId'  => 'btnRadiusClient'
            ),
            array(
                'xtype'   => 'button',
                'text'    => 'Password Manager',
                'glyph'   => Configure::read('icnKey'),
                'scale'   => 'large',
                'itemId'  => 'btnPassword'
            ),
            array(
                'xtype'   => 'button',
                'text'    => 'Activity Monitor',
                'glyph'   => Configure::read('icnActivity'),
                'scale'   => 'large',
                'itemId'  => 'btnActivityMonitor'
            ),
            array(
                'xtype'   => 'button',
                'text'    => 'Data Usage',
                'glyph'   => Configure::read('icnData'),
                'scale'   => 'large',
                'itemId'  => 'btnDataUsage'
            ),
           /* array(
                'xtype'   => 'button',
                'text'    => 'Setup Wizard',
                'glyph'   => Configure::read('icnWizard'),
                'scale'   => 'large',
                'itemId'  => 'btnSetupWizard'
            )*/
        );
        
        $this->set(array(
            'data'   => $data,
            'success' => true,
            '_serialize' => array('success','data')
        ));
    
    }
    
     public function settingsView(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){
            return;
        }
        
        $user_id    = $user['id'];   
        $data       = array();  
        
        $data['show_data_usage']        = 'show_data_usage';
        $data['show_recent_failures']   = 'show_recent_failures';
        
           
        $q_rf = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'show_recent_failure'])->first();
        if($q_rf){
            $val_rf = 0;
            if($q_rf->value == 1){
                $val_rf = 'show_recent_failures';
            }
            $data['show_recent_failures'] = $val_rf;
        }
        
        $q_rdu = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'show_data_usage'])->first();
        if($q_rdu){
        
            $val_du = 0;
            if($q_rdu->value == 1){
                $val_du = 'show_data_usage';
            }
            $data['show_data_usage'] = $val_du;
        }
        
        //Now for the more difficult bit finding the default realm if there are not one.
        $q_rr = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'realm_id'])->first();
        if($q_rr){
            $q_r                = $this->Realms->find()->where(['id' => $q_rr->value])->first();
            $realm_name         = $q_r->name;
            $data['realm_name'] = $realm_name;
            $data['realm_id']   = $q_rr->value;
        }else{
            //We need to find the first valid realm
            if($user['group_name'] == 'Administrators'){
                $q_r            = $this->Realms->find()->first();
                if($q_r){
                    $realm_name         = $q_r->name;
                    $data['realm_name'] = $realm_name;
                    $data['realm_id']   = $q_r->id;
                }
            }
            
            if($user['group_name'] == 'Access Providers'){
                $realm_detail = $this->_ap_default_realm($user_id);
                if(array_key_exists('realm_id',$realm_detail)){
                    $data['realm_name'] = $realm_detail['realm_name'];
                    $data['realm_id']   = $realm_detail['realm_id'];
                }
            }    
        }
        
        $this->set(array(
            'data'   => $data,
            'success' => true,
            '_serialize' => array('success','data')
        ));
    }
     
     public function settingsSubmit(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        
        $this->UserSettings = $this->UserSettings;
          
        if(isset($this->request->data['realm_id'])){
        
            if(isset($this->request->data['show_data_usage'])){
                $this->request->data['show_data_usage'] = 1;
            }else{
                $this->request->data['show_data_usage'] = 0;
            }
            
            if(isset($this->request->data['show_recent_failures'])){
                $this->request->data['show_recent_failures'] = 1;
            }else{
                $this->request->data['show_recent_failures'] = 0;
            }
        
            //Delete old entries (if there are any)
            $this->UserSettings->deleteAll(['UserSetting.user_id' => $user_id,'UserSetting.name' => 'realm_id']);
            $this->UserSettings->deleteAll(['UserSetting.user_id' => $user_id,'UserSetting.name' => 'show_recent_failures']);
            $this->UserSettings->deleteAll(['UserSetting.user_id' => $user_id,'UserSetting.name' => 'show_data_usage']);
            
            $s = $this->UserSettings->newEntity();
            $s->user_id = $user_id;
            $s->name    = 'realm_id';
            $s->value   = $this->request->data['realm_id'];
            $this->UserSettings->save($s);
            
            $s = $this->UserSettings->newEntity();
            $s->user_id = $user_id;
            $s->name    = 'show_recent_failures';
            $s->value   = $this->request->data['show_recent_failures'];
            $this->UserSettings->save($s);
            
            $s = $this->UserSettings->newEntity();
            $s->user_id = $user_id;
            $s->name    = 'show_data_usage';
            $s->value   = $this->request->data['show_data_usage'];
            $this->UserSettings->save($s);
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }
    
    public function changePassword(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
        $data       = array();  
        $u          = $this->Users->get($user_id);
        
        $u->set('password',$this->request->data['password']);
        $u->set('token',''); //Setting it ti '' will trigger a new token generation
        $this->Users->save($u); 
        $data['token']  = $u->get('token');

        $this->set(array(
            'success' => true,
            'data'    => $data,
            '_serialize' => array('success','data')
        ));
    }
    
    private function _get_user_detail($user){
         
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
            //$tabs    = array();    
        }
        
        return array(
            'token'         =>  $token,
            'isRootUser'    =>  $isRootUser,
            'tabs'          =>  $tabs,
            'data_usage'    => array('realm_id' => $this->realm_id, 'realm_name' => $this->realm_name),
            'user'          =>  array('id' => $id, 'username' => $username,'group' => $group,'cls' => $cls)
        );
        
    }
    
     private function _build_admin_tabs($user_id){
    
        $tabs = array(
            array(
                'title'   => __('Admin'),
                'glyph'   => Configure::read('icnAdmin'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => __('Admins'),
                        'glyph'   => Configure::read('icnAdmin'),
                        'id'      => 'cAccessProviders',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('Realms (Groups)'),
                        'glyph'   => Configure::read('icnRealm'),
                        'id'      => 'cRealms',
                        'layout'  => 'fit'
                    )
                )
            
            ),
            array(
                'title'   => __('Users'),
                'xtype'   => 'tabpanel',
                'glyph'   => Configure::read('icnUser'),
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'     => __('Permanent Users'),
                        'glyph'     => Configure::read('icnUser'),
                        'id'        => 'cPermanentUsers',
                        'layout'    => 'fit'
                    ),
                    array(
                        'title'     => __('Vouchers'),
                        'glyph'     => Configure::read('icnVoucher'),
                        'id'        => 'cVouchers',
                        'layout'    => 'fit'
                    ),
                    array(
                        'title'     => __('BYOD'),
                        'glyph'     => Configure::read('icnDevice'),
                        'id'        => 'cDevices',
                        'layout'    => 'fit'
                    ),
                    array(
                        'title'     => __('Top-Ups'),
                        'glyph'     => Configure::read('icnTopUp'),
                        'id'        => 'cTopUps',
                        'layout'    => 'fit'
                    ),
                    
                )
               
            ), 
            array(
                'title'   => __('Profiles'),
                'glyph'   => Configure::read('icnProfile'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => __('Profile Components'),
                        'glyph'   => Configure::read('icnComponent'),
                        'id'      => 'cProfileComponents',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('Profiles'),
                        'glyph'   => Configure::read('icnProfile'),
                        'id'      => 'cProfiles',
                        'layout'  => 'fit'
                    )   
                )
            ), 
            array(
                'title'   => __('RADIUS'),
                'glyph'   => Configure::read('icnRadius'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => __('Dynamic RADIUS Clients'),
                        'glyph'   => Configure::read('icnDynamicNas'),
                        'id'      => 'cDynamicClients',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('NAS Devices'),
                        'glyph'   => Configure::read('icnNas'),
                        'id'      => 'cNas',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('NAS Device Tags'),
                        'glyph'   => Configure::read('icnTag'),
                        'id'      => 'cTags',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('SSIDs'),
                        'glyph'   => Configure::read('icnSsid'),
                        'id'      => 'cSsids',
                        'layout'  => 'fit'
                    )  
                )
            ), 
            array(
                'title'   => __('MESHdesk'),
                'glyph'   => Configure::read('icnMesh'),
                'id'      => 'cMeshes',
                'layout'  => 'fit'
            ),
            array(
                'title'   => __('APdesk'),
                'glyph'   => Configure::read('icnCloud'),
                'id'      => 'cAccessPoints',
                'layout'  => 'fit' 
            ),
          /*  
            array(
                'title'   => __('DNSdesk'),
                'glyph'   => Configure::read('icnShield'),
                'xtype'   => "tabpanel",
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => 'Domain Names',
                        'glyph'   => Configure::read('icnList'),
                        'id'      => 'cGlobalDomains',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Domain Tags',
                        'glyph'   => Configure::read('icnTag'),
                        'id'      => 'cGlobalTags',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Policies',
                        'glyph'   => Configure::read('icnScale'),
                        'id'      => 'cPolicies',
                        'layout'  => 'fit'
                    )  
                ) 
            ), */ 
            array(
                'title'   => __('Other'),
                'glyph'   => Configure::read('icnGears'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                     array(
                        'title'   => __('Dynamic Login Pages'),
                        'glyph'   => Configure::read('icnDynamic'),
                        'id'      => 'cDynamicDetails',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('OpenVPN Servers'),
                        'glyph'   => Configure::read('icnVPN'),
                        'id'      => 'cOpenvpnServers',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('IP Pools'),
                        'glyph'   => Configure::read('icnIP'),
                        'id'      => 'cIpPools',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('Rights Manager'),
                        'glyph'   => Configure::read('icnKey'),
                        'id'      => 'cAcos',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('Logfile Viewer'),
                        'glyph'   => Configure::read('icnLog'),
                        'id'      => 'cLogViewer',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => __('Debug Output'),
                        'glyph'   => Configure::read('icnBug'),
                        'id'      => 'cDebug',
                        'layout'  => 'fit'
                    )    
                )
              )
        ); 
              
        //____ Overview Tab ___
        //This one is a bit different :-)
        $overview_items = array();
        
        //Find out if there is a dafault setting for the realm.
        $show_data_usage        = true;
        $show_recent_failures   = true;
        $realm_blank            = false;
        
                
        //Find if there is a realm specified in the settings        
        $q_rr =  $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'realm_id'])->first();
        
        if($q_rr){
            //Get the name of the realm
            $q_r = $this->Realms->find()->where(['id' => $q_rr->value])->first();
            
            if($q_r){
                $realm_name         = $q_r->name;
                $data['realm_name'] = $realm_name;
                $data['realm_id']   = $q_rr->value;
                
                $this->realm_name   = $realm_name;
                $this->realm_id     = $q_rr->value;
               
                //Get the settings of whether to show the two tabs
                $q_rdu = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'show_data_usage'])->first();
                
                
                if($q_rdu->value == 0){
                    $show_data_usage = false;
                }
                
                $q_rf = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'show_recent_failures'])->first();
                
                if($q_rf->value == 0){
                    $show_recent_failures = false;
                }
            }else{            
                $realm_blank = true;
            }       
        //No realm specified in settings; get a default one (if there might be one )    
        }else{ 
            $q_r = $this->Realms->find()->first();
            if($q_r){
                $realm_name         = $q_r->name;
                $data['realm_name'] = $realm_name;
                $data['realm_id']   = $q_r->id;
                
                $this->realm_name   = $realm_name;
                $this->realm_id     = $q_r->id;
            }else{
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
         /*   array_push($overview_items, array(
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
               
        array_unshift($tabs,array(
            'title'     => __('Overview'),
            'xtype'     => 'tabpanel',
            'glyph'     => Configure::read('icnView'),
            'itemId'    => 'tpOverview',
            'layout'    => 'fit',
            'items'     => $overview_items
        ));   
                
        return $tabs;
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
        $q_rr =  $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'realm_id'])->first();
        
        if($q_rr){
            //Get the name of the realm
            $q_r = $this->Realms->find()->where(['id' => $q_rr->value])->first();
            $realm_name         = $q_r->name;
            $data['realm_name'] = $realm_name;
            $data['realm_id']   = $q_rr->value;
            
            $this->realm_name   = $realm_name;
            $this->realm_id     = $q_rr->value;
           
            //Get the settings of whether to show the two tabs
            $q_rdu = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'show_data_usage'])->first();
           
            if($q_rdu->value == 0){
                $show_data_usage = false;
            }
            
            $q_rf = $this->UserSettings->find()->where(['user_id' => $user_id,'name' => 'show_recent_failures'])->first();
            
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
        
        
        //___ DNSdesk tab ___
      /*  
        $dns_desk_items = array();
        
        if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $base."DynamicDetails/index")){
            array_push($dns_desk_items, array(
                    'title'   => 'Domain Names',
                    'glyph'   => Configure::read('icnList'),
                    'id'      => 'cGlobalDomains',
                    'layout'  => 'fit'             
                )
            );  
        }
        
         if(count($dns_desk_items) > 0){
            array_push($tabs, array(
                'title'   => __('DNSdesk'),
                'glyph'   => Configure::read('icnShield'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => $dns_desk_items
                )
            );
        }
          */
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
            if(count($or_array)>0){ //Only if there are something to 'OR'
                $r_sub = $this->Realms->find()->where(['OR' => $or_array])->all(); 
                foreach($r_sub  as $j){
                    $realm['realm_id']     = $j->id;
                    $realm['realm_name']   = $j->name;
                    break; //We only need one
                }
            }              
        }
        return $realm;
    }
}

