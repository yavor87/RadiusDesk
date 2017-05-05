<?php
//----------------------------------------------------------
//---- Author: Dirk van der Walt
//---- License: GPL v3
//---- Description: A component used to check and produce Ajax-ly called grid tooblaar items
//---- Date: 01-01-2016
//------------------------------------------------------------

namespace App\Controller\Component;
use Cake\Controller\Component;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class GridButtonsComponent extends Component {

    public $components = ['Acl'];
    protected $scale   = 'large';  //Later we will improve the code to change this to small for smaller screens
    public function returnButtons($user,$title = true,$type='basic'){
        //First we will ensure there is a token in the request
        $this->controller = $this->_registry->getController();
        
        if($title){
            $this->t = __('Action');
        }else{
            $this->t = null;
        }
        
        $menu = [];
        $this->user = $user;
        
        if($type == 'basic'){
            $b = $this->_fetchBasic();
            $menu = array($b);
        }
        
        if($type == 'basic_no_disabled'){
            $b = $this->_fetchBasic('no_disabled');
            $menu = array($b);
        }
        
        if($type == 'access_providers'){
            $b  = $this->_fetchBasic();
            $d  = $this->_fetchDocument();
            $a  = $this->_fetchApExtras();
            $menu = array($b,$d,$a);
        }
        
        if($type == 'realms'){
            $b  = $this->_fetchBasic();
            $d  = $this->_fetchDocument();
            $a  = $this->_fetchRealmExtras();
            $menu = array($b,$d,$a);
        }
        
        if($type == 'basic_and_doc'){
            $b  = $this->_fetchBasic();
            $d  = $this->_fetchDocument();
            $menu = array($b,$d);
        }
        
        if($type == 'dynamic_details'){
            $b  = $this->_fetchBasic();
            $d  = $this->_fetchDocument();
            $a  = $this->_fetchDynamicDetailExtras();
            $menu = array($b,$d,$a);
        }
        
        if($type == 'profiles'){
            $b  = $this->_fetchBasic();
            $n  = $this->_fetchNote();
            $menu = array($b,$n);
        }
        
        if($type == 'permanent_users'){
            $b  = $this->_fetchBasic('disabled',true);
            $d  = $this->_fetchDocument();
            $a  = $this->_fetchPermanentUserExtras();
            $menu = array($b,$d,$a);
        }

        if($type == 'fr_acct_and_auth'){
            $b  = $this->_fetchFrAcctAuthBasic();
            $menu = [$b];
        }
        
        return $menu;
    }

    private function _fetchFrAcctAuthBasic(){

        $user = $this->user;
        $menu = [];
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array(
                    array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                        array( 'xtype'=>  'button', 'glyph'     => Configure::read('icnReload'), 'scale' => $this->scale, 'itemId' => 'reload',   'tooltip'   => __('Reload')),
                        array('xtype' => 'button',  'glyph'     => Configure::read('icnDelete'), 'scale' => $this->scale, 'itemId' => 'delete',   'tooltip'   => __('Delete')), 
                )) 
            );
        }

        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $menu = array(
                    array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                        array( 'xtype'=>  'button', 'glyph'     => Configure::read('icnReload'), 'scale' => $this->scale, 'itemId' => 'reload',   'tooltip'   => __('Reload')),
                        array('xtype' => 'button',  'glyph'     => Configure::read('icnDelete'), 'scale' => $this->scale, 'itemId' => 'delete',   'tooltip'   => __('Delete')), 
                )) 
            );
        }

        return $menu;

    }
    
    private function _fetchBasic($action='disabled',$with_reload_timer=false){
    
        $user = $this->user;
        
        if($action == 'no_disabled'){
            $disabled = false; 
        }else{
            $disabled = true;
        }
        
        $menu = array();
        
        
        $reload = [
            'xtype'     => 'button',  
            'glyph'     => Configure::read('icnReload'), 
            'scale'     => $this->scale, 
            'itemId'    => 'reload',   
            'tooltip'=> __('Reload')
        ];
        
        if($with_reload_timer == true){
            $reload = [
                'xtype'     => "splitbutton",
                'glyph'     => Configure::read('icnReload'),
                'scale'     => $this->scale,
                'itemId'    => 'reload',
                'tooltip'   => __('Reload'),
                'menu'      => [
                    'items' => [
                        '<b class="menu-title">'.__('Reload every').':</b>',
                        array( 'text'  => __('30 seconds'),      'itemId'    => 'mnuRefresh30s', 'group' => 'refresh','checked' => false ),
                        array( 'text'  => __('1 minute'),        'itemId'    => 'mnuRefresh1m', 'group' => 'refresh' ,'checked' => false),
                        array( 'text'  => __('5 minutes'),       'itemId'    => 'mnuRefresh5m', 'group' => 'refresh', 'checked' => false ),
                        array( 'text'  => __('Stop auto reload'),'itemId'    => 'mnuRefreshCancel', 'group' => 'refresh', 'checked' => true)
                    ]
                ] 
            ];
        }
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array('xtype' => 'buttongroup','title' => $this->t, 'items' => array(
                    $reload,
                    array(
                        'xtype'     => 'button',
                        'glyph'     => Configure::read('icnAdd'),
                        'scale'     => $this->scale,
                        'itemId'    => 'add',
                        'tooltip'   => __('Add')
                    ),
                    array(
                        'xtype'     => 'button',
                        'glyph'     => Configure::read('icnDelete'),
                        'scale'     => $this->scale,
                        'itemId'    => 'delete',
                        'tooltip'   => __('Delete')
                    ),
                    array(
                        'xtype'     => 'button',
                        'glyph'     => Configure::read('icnEdit'),
                        'scale'     => $this->scale,
                        'itemId'    => 'edit',
                        'tooltip'   => __('Edit')
                    )
                )
            );
        }
        
        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id             = $user['id'];
            $action_group   = array();

            array_push($action_group,$reload);

            //Add
            if($this->controller->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base."add")){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnAdd'),      
                    'scale'     => $this->scale, 
                    'itemId'    => 'add',
                    'tooltip'   => __('Add')));
            }
            //Delete
            if($this->controller->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'delete')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnDelete'),   
                    'scale'     => $this->scale, 
                    'itemId'    => 'delete',
                    'disabled'  => $disabled,   
                    'tooltip'   => __('Delete')));
            }

            //Edit
            if($this->controller->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'edit')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnEdit'),     
                    'scale'     => $this->scale, 
                    'itemId'    => 'edit',
                    'disabled'  => $disabled,     
                    'tooltip'   => __('Edit')));
            }

            $menu = array('xtype' => 'buttongroup','title' => $this->t,        'items' => $action_group);
        }
        
        return $menu;
    }
    
    private function _fetchDocument(){

        $user = $this->user;
        $menu = array();
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array(
                'xtype' => 'buttongroup',
                'title' => __('Document'), 
                'items' => array(
                    array(
                        'xtype'     => 'button',     
                        'glyph'     => Configure::read('icnNote'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'note',    
                        'tooltip'   => __('Add notes')
                    ),
                    array(
                        'xtype'     => 'button',     
                        'glyph'     => Configure::read('icnCsv'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'csv',      
                        'tooltip'   => __('Export CSV')
                    )
                )
            );
        }
        
        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id             = $user['id'];
            $document_group = array();

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'noteIndex')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnNote'),    
                    'scale'     => $this->scale, 
                    'itemId'    => 'note',      
                    'tooltip'   => __('Add Notes')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'exportCsv')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnCsv'),     
                    'scale'     => $this->scale, 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Export CSV')));
            }

            $menu = array('xtype' => 'buttongroup', 'title' => __('Document'),        'items' => $document_group );
        }
            
        return $menu;
    }
    
    private function _fetchNote(){

        $user = $this->user;
        $menu = array();
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array(
                'xtype' => 'buttongroup',
                'title' => __('Document'), 
                'width' => 100,
                'items' => array(
                    array(
                        'xtype'     => 'button',    
                        'glyph'     => Configure::read('icnNote'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'note',    
                        'tooltip'   => __('Add notes')
                    )
                )
            );
        }
        
        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id             = $user['id'];
            $document_group = array();

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'noteIndex')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnNote'),    
                    'scale'     => $this->scale, 
                    'itemId'    => 'note',      
                    'tooltip'   => __('Add Notes')));
            }

            $menu = array('xtype' => 'buttongroup', 'title' => __('Document'), 'width' => 100,  'items' => $document_group );
        }         
        return $menu;
    }
    
    private function _fetchApExtras(){

        $user = $this->user;
        $menu = array();
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin   
             $menu = array(
                'xtype' => 'buttongroup',
                'title' => __('Extra actions'), 
                'items' => array(
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnLock'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'password', 
                        'tooltip'   => __('Change Password')
                    ),
                    array(
                        'xtype'     => 'button',  
                        'glyph'     => Configure::read('icnLight'),
                        'scale'     => $this->scale, 
                        'itemId'    => 'enable_disable',
                        'tooltip'   => __('Enable / Disable')
                    )
                )
            );    
        }
        
        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id             = $user['id'];
            $specific_group = array();

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'changePassword')){      
                array_push($specific_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnLock'),
                    'scale'     => $this->scale, 
                    'itemId'    => 'password', 
                    'tooltip'   => __('Change Password')));
           }
            
           if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'enableDisable')){      
                array_push($specific_group, array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnLight'),
                    'scale'     => $this->scale, 
                    'itemId'    => 'enable_disable',
                    'tooltip'   => __('Enable / Disable')));
            }
           
            $menu = array('xtype' => 'buttongroup', 'title' =>  __('Extra actions'), 'items' => $specific_group );
        }
            
        return $menu;
    }
    
    private function _fetchRealmExtras(){
        $menu = array(
            'xtype' => 'buttongroup',
            'title' => __('More'), 
            'items' => array(
                array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnGraph'),
                    'scale'     => $this->scale, 
                    'itemId'    => 'graph',
                    'tooltip'   => __('Graphs')
                ),
                array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnCamera'),
                    'scale'     => $this->scale, 
                    'itemId'    => 'logo',     
                    'tooltip'   => __('Edit logo')
                )
            )
        );             
        return $menu;
    }
    
    private function _fetchDynamicDetailExtras(){
    
        $menu = array(
            'xtype' => 'buttongroup',
            'title' => __('Preview'), 
            'items' => array(
                array(
                    'xtype'     => 'button',  
                    'glyph'     => Configure::read('icnMobile'),  
                    'scale'     => $this->scale, 
                    'itemId'    => 'mobile',    
                    'tooltip'   => __('Mobile')
                ),
                array(
                    'xtype'     => 'button',  
                    'glyph'     => Configure::read('icnDesktop'),  
                    'scale'     => $this->scale, 
                    'itemId'    => 'desktop',   
                    'tooltip'   => __('Desktop')
                )
            )
        );             
        return $menu;
    }
    
    private function _fetchPermanentUserExtras(){
    
        $user = $this->user;
        $menu = array();
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin   
             $menu = array(
                'xtype' => 'buttongroup',
                'title' => __('Extra actions'), 
                'items' => array(
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnLock'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'password', 
                        'tooltip'   => __('Change Password')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnLight'),
                        'scale'     => $this->scale, 
                        'itemId'    => 'enable_disable',
                        'tooltip'   => __('Enable / Disable')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnRadius'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'test_radius',  
                        'tooltip'=> __('Test RADIUS')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnGraph'),   
                        'scale'     => $this->scale, 
                        'itemId'    => 'graph',  
                        'tooltip'   => __('Graphs')
                    )
                )
            );    
        }
        
        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id             = $user['id'];
            $specific_group = array();

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'changePassword')){      
                array_push($specific_group,array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnLock'),
                    'scale'     => $this->scale, 
                    'itemId'    => 'password', 
                    'tooltip'   => __('Change Password')));
           }
            
           if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'enableDisable')){      
                array_push($specific_group, array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnLight'),
                    'scale'     => $this->scale, 
                    'itemId'    => 'enable_disable',
                    'tooltip'   => __('Enable / Disable')));
            }
            
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), 'Access Providers/Controllers/FreeRadius/testRadius')){      
                array_push($specific_group, array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnRadius'), 
                        'scale'     => $this->scale, 
                        'itemId'    => 'test_radius',  
                        'tooltip'=> __('Test RADIUS')
                    ));
            }
            
            array_push($specific_group, array(
                'xtype'     => 'button', 
                'glyph'     => Configure::read('icnGraph'),   
                'scale'     => $this->scale, 
                'itemId'    => 'graph',  
                'tooltip'   => __('Graphs')
            ));
           
            $menu = array('xtype' => 'buttongroup', 'title' =>  __('Extra actions'), 'items' => $specific_group );
        }
                
        return $menu;
    }
    
}
