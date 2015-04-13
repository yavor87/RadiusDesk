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

	public function list_of_pools(){

		if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }
		$items 	= array();
		$this->IpPool->contain();
		$q_r 	= $this->IpPool->find('all',array('fields' => array('DISTINCT IpPool.pool_name')));

		foreach($q_r as $i){
			$data 			= array();
			$data['name']	= $i['IpPool']['pool_name'];
			$data['id']		= $i['IpPool']['pool_name'];
			array_push($items,$data);
		}

		$this->set(array(
            'items' 		=> $items,
            'success' 		=> true,
            '_serialize' => array('items','success')
        ));
	}
 
    public function add_pool() {

        if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }

		$count  = 0;
		$junk_trigger = 300; //We limit the trigger to 300 to prevent the user from creating havoc

		//print_r($this->request->data);
		

		$this->{$this->modelClass}->create();

		//Start with the first IP
		$name 		= $this->request->data['name'];
		$current_ip	= $this->request->data['pool_start'];
		$end_ip		= $this->request->data['pool_end'];
		$next_ip	= $this->_get_next_ip($current_ip);

		while($current_ip != $end_ip){
			$count++;
			if($count > $junk_trigger){
				$this->set(array(
		            'success'   => false,
		            'message'   => array('message' => "Could not add pool - Recheck range"),
		            '_serialize' => array('success','message')
		        ));
				return;
			}

			$data 						= array();
			$data['pool_name'] 			= $name;
			$data['framedipaddress'] 	= $current_ip;

			$count 	= $this->{$this->modelClass}->find('count', 
				array('conditions' => array('IpPool.pool_name' => $name, 'IpPool.framedipaddress' => $current_ip))
			);
			if($count ==0){ //If already there we silently ignore it...
				$this->{$this->modelClass}->save($data);
				$this->{$this->modelClass}->id = null;
			}
			$current_ip = $next_ip;
			$next_ip	= $this->_get_next_ip($current_ip);
		}

		//Last one in the range
		if($current_ip == $end_ip){
			$data 						= array();
			$data['pool_name'] 			= $name;
			$data['framedipaddress'] 	= $current_ip;

			$count 	= $this->{$this->modelClass}->find('count', 
				array('conditions' => array('IpPool.pool_name' => $name, 'IpPool.framedipaddress' => $current_ip))
			);
			if($count ==0){ //If already there we silently ignore it...
				$this->{$this->modelClass}->save($data);
				$this->{$this->modelClass}->id = null;
			}
		}

		$this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
	}

	public function add_ip() {

        if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
        }

		//First check so we don't add doubles
		$name  	= $this->request->data['name'];
		$ip		= $this->request->data['ip'];
		

		$count 	= $this->{$this->modelClass}->find('count', array('conditions' => array('IpPool.pool_name' => $name, 'IpPool.framedipaddress' => $ip)));
		if($count > 0){
			$this->set(array(
	            'success'   => false,
	            'message'   => array('message' => "IP Already listed"),
	            '_serialize' => array('success','message')
	        ));	

		}else{

			$data 						= array();
			$data['pool_name'] 			= $name;
			$data['framedipaddress'] 	= $ip;
			$this->{$this->modelClass}->save($data);

			$this->set(array(
		        'success' => true,
		        '_serialize' => array('success')
		    ));
		} 
	}

    public function delete($id = null) {

		if(!$this->Aa->admin_check($this)){   //Only for admin users!
            return;
       	}
 
       	if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        $fail_flag = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];
            $this->{$this->modelClass}->id = $this->data['id'];
            $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                $this->{$this->modelClass}->id = $d['id'];
                $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
            }
        }

        if($fail_flag == true){
            $this->set(array(
                'success'   => false,
                'message'   => array('message' => __('Could not delete some items')),
                '_serialize' => array('success','message')
            ));
        }else{
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }
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

	private function _get_next_ip($ip){

        $pieces     = explode('.',$ip);
        $octet_1    = $pieces[0];
        $octet_2    = $pieces[1];
        $octet_3    = $pieces[2];
        $octet_4    = $pieces[3];

        if($octet_4 >= 254){
            $octet_4 = 1;
            $octet_3 = $octet_3 +1;
        }else{

            $octet_4 = $octet_4 +1;
        }
        $next_ip = $octet_1.'.'.$octet_2.'.'.$octet_3.'.'.$octet_4;
        return $next_ip;
    }
    
}
