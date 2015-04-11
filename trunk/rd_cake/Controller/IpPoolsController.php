<?php
App::uses('AppController', 'Controller');

class IpPoolsController extends AppController {

    public $name        = 'IpPools';
    public $components  = array('Aa');
    public $uses        = array('IpPool','User');
    protected $base     = "Access Providers/Controllers/IpPools/";

    protected $fields  = array(
        'id',      				'pool_name',    		'framedipaddress',  'nasipaddress',
        'calledstationid',  	'callingstationid',
        'expiry_time',       	'username',            	'pool_key',
		'nasidentifier',		'extra_name',			'extra_value',
		'active',				'permanent_user_id',	'created',
		'modified'
    );

//------------------------------------------------------------------------


    //____ BASIC CRUD Manager ________
    public function index(){

        if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }
 
        $c = $this->_build_common_query(); 

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

        $total  = $this->{$this->modelClass}->find('count',$c);       
        $q_r    = $this->{$this->modelClass}->find('all',$c_page);
        $items  = array();

        foreach($q_r as $i){
            $row = array();
            foreach($this->fields as $field){
                if(array_key_exists($field,$i['IpPool'])){
                    $row["$field"]= $i['IpPool']["$field"];
                }
            } 
            array_push($items,$row);
        }
       
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }
 
    public function add() {

        if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

    public function delete($id = null) {
		if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }
 
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

    public function view(){

        $data = array(
            
        );

        $this->set(array(
            'data'      => $data,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    //----- Menus ------------------------
    public function menu_for_grid(){

        if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }

            $menu = array(
                array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
					array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnReload'), 
                    'scale'     => 'large', 
                    'itemId'    => 'reload',      
                    'tooltip'   => __('Reload')
                ),
                array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnAdd'), 
                    'scale'     => 'large', 
                    'itemId'    => 'add',      
                    'tooltip'   => __('Add')
                ),
                array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnDelete'), 
                    'scale'     => 'large', 
                    'itemId'    => 'delete',   
                    'tooltip'   => __('Delete')
                ),
                array(
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnEdit'), 
                    'scale'     => 'large', 
                    'itemId'    => 'edit',     
                    'tooltip'   => __('Edit')
                )
            )),
            array('xtype' => 'buttongroup','title' => __('Document'), 'width' => 100, 'items' => array(  
                array(
                    'xtype'     => 'button',
                    'glyph'     => Configure::read('icnCsv'), 
                    'scale'     => 'large', 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Export CSV')
                ),
            ))   
        );

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }

    function _build_common_query(){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']   = array();

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'IpPool.expiry_time';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){   
            $sort = $this->modelClass.'.'.$this->request->query['sort'];
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
                    $col = $this->modelClass.'.'.$f->field;
                    array_push($c['conditions'],array("$col LIKE" => '%'.$f->value.'%'));
                }
                //Bools
                if($f->type == 'boolean'){
                     $col = $this->modelClass.'.'.$f->field;
                     array_push($c['conditions'],array("$col" => $f->value));
                }
            }
        }
        //====== END REQUEST FILTER ====    
        return $c;
	}
    
}
