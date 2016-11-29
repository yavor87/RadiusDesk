<?php
App::uses('AppController', 'Controller');

class DashboardController extends AppController {

    public $name       = 'Dashboard';
    public $components = array('Aa');   //We'll use the Aa component to determine certain rights
    protected $base    = "Access Providers/Controllers/Dashboard/";


    public function authenticate(){

        $this->Auth = $this->Components->load('Auth');
        $this->request->data['User']['username']     = $this->request->data['username'];
        $this->request->data['User']['password']     = $this->request->data['password'];

        if($this->Auth->identify($this->request,$this->response)){
            
            //We can get the detail for the user
            $data = $this->_get_user_detail($this->request->data['User']['username']);
            $this->set(array(
                'data'          => $data,
                'success'       => true,
                '_serialize' => array('data','success')
            ));

        }else{
            //We can get the detail for the user

            $this->set(array(
                'errors'        => array('username' => __('Confirm this name'),'password'=> __('Type the password again')),
                'success'       => false,
                'message'       => array('message'  => __('Authentication failed')),
                '_serialize' => array('errors','success','message')
            ));
        }
    }

    public function check_token(){

        if((isset($this->request->query['token']))&&($this->request->query['token'] != '')){

            $token      = $this->request->query['token'];
            $this->User = ClassRegistry::init('User');

            $q_r        = $this->User->find('first',array(
                'conditions'    => array('User.token' => $token)
            ));

            if($q_r == ''){

                $this->set(array(
                    'errors'        => array('token'=>'invalid'),
                    'success'       => false,
                    '_serialize'    => array('errors','success')
                ));
  
            }else{
                $data = $this->_get_user_detail($q_r['User']['username']);
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

    public function change_password(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $d                      = array();
        $d['User']['id']        = $user_id;
        $d['User']['password']  = $this->request->data['password'];
        $d['User']['token']     = '';
        
        $this->User             = ClassRegistry::init('User');
        $this->User->contain();
        $this->User->id         = $user_id;
        $this->User->save($d);
        $q_r                    = $this->User->findById($user_id);
        $data['token']          = $q_r['User']['token'];

        $this->set(array(
            'success' => true,
            'data'    => $data,
            '_serialize' => array('success','data')
        ));
    }

    private function _get_user_detail($username){

        $this->User = ClassRegistry::init('User');
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
            $tabs= $this->_build_admin_tabs();  //We do not care for rights here;
            $isRootUser = true;
        }
        if( $group == Configure::read('group.ap')){  //Or AP
            $cls = 'access_provider';
            $tabs= $this->_build_ap_tabs($id);  //We DO care for rights here!
        }

        $wp_url = Configure::read('paths.wallpaper_location').Configure::read('user_settings.wallpaper');
        //Check for personal overrides
        $this->UserSetting = ClassRegistry::init('UserSetting');
        $q = $this->UserSetting->find('first',array('conditions' => array('UserSetting.user_id' => $id,'UserSetting.name' => 'wallpaper')));
        if($q){
            $wp_base = $q['UserSetting']['value'];
            $wp_url = Configure::read('paths.wallpaper_location').$wp_base;
        }

        return array(
            'token'         =>  $q_r['User']['token'],
            'isRootUser'    =>  $isRootUser,
            'tabs'          =>  $tabs,
            'data_usage'    => array('realm_id' => 55, 'realm_name' => '127 Stefano Park'),
            'user'          =>  array('id' => $id, 'username' => $username,'group' => $group,'cls' => $cls)
        );
    }

    private function _build_admin_tabs(){
    
        $tabs = array(
            array(
                'title'     => 'Overview',
                'xtype'     => 'tabpanel',
                'glyph'     => Configure::read('icnView'),
                'layout'    => 'fit',
                'items'     => array(
                    array(
                        'title'   => 'Data Usage',
                        'glyph'   => Configure::read('icnData'),
                        'id'      => 'cDataUsage',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Recent Rejects',
                        'glyph'   => Configure::read('icnBan'),
                        'id'      => 'cRejects',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Tools',
                        'glyph'   => Configure::read('icnWizard'),
                        'id'      => 'cTools',
                        'layout'  => 'fit'
                    )
                )
            ), 
            array(
                'title'   => 'Admin',
                'glyph'   => Configure::read('icnAdmin'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => 'Admins',
                        'glyph'   => Configure::read('icnAdmin'),
                        'id'      => 'cAccessProviders',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Realms (Groups)',
                        'glyph'   => Configure::read('icnRealm'),
                        'id'      => 'cRealms',
                        'layout'  => 'fit'
                    )
                )
            
            ),
            array(
                'title'   => 'Users',
                'xtype'   => 'tabpanel',
                'glyph'   => Configure::read('icnUser'),
                'layout'  => 'fit',
                'items'   => array(
                    /*{
                        title   : 'Who is online?',
                        glyph   : Rd.config.icnActivity,
                        id      : 'cActivityMonitor',
                        layout  : 'fit'
                    },*/
                    array(
                        'title'     => 'Permanent Users',
                        'glyph'     => Configure::read('icnUser'),
                        'id'        => 'cPermanentUsers',
                        'layout'    => 'fit'
                    ),
                    array(
                        'title'     => 'Vouchers',
                        'glyph'     => Configure::read('icnVoucher'),
                        'id'        => 'cVouchers',
                        'layout'    => 'fit'
                    ),
                    array(
                        'title'     => 'BYOD',
                        'glyph'     => Configure::read('icnDevice'),
                        'id'        => 'cDevices',
                        'layout'    => 'fit'
                    ),
                    array(
                        'title'     => 'Top-Ups',
                        'glyph'     => Configure::read('icnTopUp'),
                        'id'        => 'cTopUps',
                        'layout'    => 'fit'
                    ),
                    
                )
               
            ), 
            array(
                'title'   => 'Profiles',
                'glyph'   => Configure::read('icnProfile'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => 'Profile Components',
                        'glyph'   => Configure::read('icnComponent'),
                        'id'      => 'cProfileComponents',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Profiles',
                        'glyph'   => Configure::read('icnProfile'),
                        'id'      => 'cProfiles',
                        'layout'  => 'fit'
                    )   
                )
            ), 
            array(
                'title'   => 'RADIUS',
                'glyph'   => Configure::read('icnRadius'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                    array(
                        'title'   => 'Dynamic RADIUS Clients',
                        'glyph'   => Configure::read('icnDynamicNas'),
                        'id'      => 'cDynamicClients',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'NAS Devices',
                        'glyph'   => Configure::read('icnNas'),
                        'id'      => 'cNas',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'NAS Device Tags',
                        'glyph'   => Configure::read('icnTag'),
                        'id'      => 'cTags',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'SSIDs',
                        'glyph'   => Configure::read('icnSsid'),
                        'id'      => 'cSsids',
                        'layout'  => 'fit'
                    )  
                )
            ), 
            array(
                'title'   => 'MESHdesk',
                'glyph'   => Configure::read('icnMesh'),
                'id'      => 'cMeshes',
                'layout'  => 'fit'
            ),
            array(
                'title'   => 'APdesk',
                'glyph'   => Configure::read('icnCloud'),
                'id'      => 'cAccessPoints',
                'layout'  => 'fit' 
            ),
            array(
                'title'   => 'Other',
                'glyph'   => Configure::read('icnGears'),
                'xtype'   => 'tabpanel',
                'layout'  => 'fit',
                'items'   => array(
                     array(
                        'title'   => 'Dynamic Login Pages',
                        'glyph'   => Configure::read('icnDynamic'),
                        'id'      => 'cDynamicDetails',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'OpenVPN Servers',
                        'glyph'   => Configure::read('icnVPN'),
                        'id'      => 'cOpenvpnServers',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'IP Pools',
                        'glyph'   => Configure::read('icnIP'),
                        'id'      => 'cIpPools',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Rights Manager',
                        'glyph'   => Configure::read('icnKey'),
                        'id'      => 'cAcos',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Logfile Viewer',
                        'glyph'   => Configure::read('icnLog'),
                        'id'      => 'cLogViewer',
                        'layout'  => 'fit'
                    ),
                    array(
                        'title'   => 'Debug Output',
                        'glyph'   => Configure::read('icnBug'),
                        'id'      => 'cDebug',
                        'layout'  => 'fit'
                    )    
                )
              )
        );       
        return $tabs;
    }
    
    private function _build_ap_tabs($id){
        $tabs   = array();  
        return $tabs;
    }

}
