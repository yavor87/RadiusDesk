<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class DashboardController extends AppController{
  
    public function initialize(){
    
        parent::initialize();

        //$this->loadComponent('Aa');
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
          //  'tabs'          =>  $tabs,
          //  'data_usage'    => array('realm_id' => $this->realm_id, 'realm_name' => $this->realm_name),
            'user'          =>  array('id' => $id, 'username' => $username,'group' => $group,'cls' => $cls)
        );
        
    }


}

