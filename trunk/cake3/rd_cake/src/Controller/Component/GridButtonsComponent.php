<?php
//----------------------------------------------------------
//---- Author: Dirk van der Walt
//---- License: GPL v3
//---- Description: A component used to check and produce Ajax-ly called grid tooblaar items
//---- Date: 29-12-2016
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
        
        $this->menu = array();
        $this->user = $user;
        
        if($type == 'basic'){
            $this->_fetchBasic();
        }
        
        return $this->menu;
    }
    
    private function _fetchBasic(){
    
        $user = $this->user;
        
        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            $this->menu = array(
                array('xtype' => 'buttongroup','title' => $this->t, 'items' => array(
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
                )),
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

            $this->menu = array(
                array('xtype' => 'buttongroup','title' => $this->t,        'items' => $action_group)
            );
        }
    }
}
