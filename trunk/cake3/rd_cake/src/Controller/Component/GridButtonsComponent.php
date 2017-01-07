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
    
    public function returnButtons($user,$title = true,$type='basic'){
        //First we will ensure there is a token in the request
        $this->controller = $this->_registry->getController();
        
        if($title){
            $this->t = __('Action');
        }else{
            $this->t = null;
        }
        
        $menu = array();
        $this->user = $user;
        
        if($type == 'basic'){
            $b = $this->_fetchBasic();
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
        
        return $menu;
    }
    
    private function _fetchBasic(){
    
        $user = $this->user;
        
        $menu = array();
        
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $menu = array('xtype' => 'buttongroup','title' => $this->t, 'items' => array(
                    array(
                        'xtype'     => 'button', 
                        'iconCls'   => 'b-reload',  
                        'glyph'     => Configure::read('icnReload'), 
                        'scale'     => 'large', 
                        'itemId'    => 'reload',   
                        'tooltip'=> __('Reload')
                    ),
                    array(
                        'xtype'     => 'button',
                        'iconCls'   => 'b-add',
                        'glyph'     => Configure::read('icnAdd'),
                        'scale'     => 'large',
                        'itemId'    => 'add',
                        'tooltip'   => __('Add')
                    ),
                    array(
                        'xtype'     => 'button',
                        'iconCls'   => 'b-delete',
                        'glyph'     => Configure::read('icnDelete'),
                        'scale'     => 'large',
                        'itemId'    => 'delete',
                        'tooltip'   => __('Delete')
                    ),
                    array(
                        'xtype'     => 'button',
                        'iconCls'   => 'b-edit',
                        'glyph'     => Configure::read('icnEdit'),
                        'scale'     => 'large',
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

            array_push($action_group,array(  
                'xtype'     => 'button',
                'iconCls'   => 'b-reload',
                'glyph'     => Configure::read('icnReload'),   
                'scale'     => 'large', 
                'itemId'    => 'reload',   
                'tooltip'   => __('Reload')));

            //Add
            if($this->controller->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base."add")){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-add',
                    'glyph'     => Configure::read('icnAdd'),      
                    'scale'     => 'large', 
                    'itemId'    => 'add',
                    'tooltip'   => __('Add')));
            }
            //Delete
            if($this->controller->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'delete')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-delete',
                    'glyph'     => Configure::read('icnDelete'),   
                    'scale'     => 'large', 
                    'itemId'    => 'delete',
                    'disabled'  => true,   
                    'tooltip'   => __('Delete')));
            }

            //Edit
            if($this->controller->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'edit')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-edit',
                    'glyph'     => Configure::read('icnEdit'),     
                    'scale'     => 'large', 
                    'itemId'    => 'edit',
                    'disabled'  => true,     
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
                        'iconCls'   => 'b-note',    
                        'glyph'     => Configure::read('icnNote'), 
                        'scale'     => 'large', 
                        'itemId'    => 'note',    
                        'tooltip'   => __('Add notes')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'iconCls'   => 'b-csv',     
                        'glyph'     => Configure::read('icnCsv'), 
                        'scale'     => 'large', 
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
                    'iconCls'   => 'b-note',
                    'glyph'     => Configure::read('icnNote'),    
                    'scale'     => 'large', 
                    'itemId'    => 'note',      
                    'tooltip'   => __('Add Notes')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'exportCsv')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-csv',
                    'glyph'     => Configure::read('icnCsv'),     
                    'scale'     => 'large', 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Export CSV')));
            }

            $menu = array('xtype' => 'buttongroup', 'title' => __('Document'),        'items' => $document_group );
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
                        'iconCls'   => 'b-password', 
                        'glyph'     => Configure::read('icnLock'), 
                        'scale'     => 'large', 
                        'itemId'    => 'password', 
                        'tooltip'   => __('Change Password')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'iconCls'   => 'b-disable',  
                        'glyph'     => Configure::read('icnLight'),
                        'scale'     => 'large', 
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
                    'iconCls'   => 'b-password',
                    'glyph'     => Configure::read('icnLock'),
                    'scale'     => 'large', 
                    'itemId'    => 'password', 
                    'tooltip'   => __('Change Password')));
           }
            
           if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->controller->base.'enableDisable')){      
                array_push($specific_group, array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-disable',
                    'glyph'     => Configure::read('icnLight'),
                    'scale'     => 'large', 
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
                    'scale'     => 'large', 
                    'itemId'    => 'graph',
                    'tooltip'   => __('Graphs')
                ),
                array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnCamera'),
                    'scale'     => 'large', 
                    'itemId'    => 'logo',     
                    'tooltip'   => __('Edit logo')
                )
            )
        );             
        return $menu;
    }
    
}
