<?php
App::uses('AppModel', 'Model');

class Voucher extends AppModel {

    public $actsAs          = array('Containable');
	public $displayField    = 'name';

	public $validate = array(
        'name' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This Voucher is already taken'
            )
        )
    );

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        )
	);


    public $hasMany = array(
        'Radcheck' => array(
            'className'     => 'Radcheck',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radcheck.* FROM radcheck AS Radcheck, vouchers WHERE vouchers.name=Radcheck.username AND vouchers.id={$__cakeID__$}',
            'dependent'     => true
        ),
        'Radreply' => array(
            'className'     => 'Radreply',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radreply.* FROM radreply AS Radreply, vouchers WHERE vouchers.name=Radreply.username AND vouchers.id={$__cakeID__$}',
            'dependent'     => true
        ),
    );

    public function beforeSave(){

        //Try to detect if it is an existing (edit):
        $existing_flag = false;
        if(!isset($this->data['Voucher']['id'])){
            $this->data['Voucher']['name'] = $this->_detemine_voucher_name();     
        }  
    }

    public function afterSave($created){
        if($created){
            $this->_add_radius_user();
        }else{
            $this->_update_radius_user();
        }
    }

    private function _update_radius_user(){

        $voucher_id  = $this->data['Voucher']['id']; //The user's ID should always be present!
        //Get the username
        $q_r        = $this->findById($voucher_id);
        $name       = $q_r['Voucher']['name'];

        //enabled or disabled (Rd-Account-Disabled)
        if(array_key_exists('active',$this->data['Voucher'])){ //It may be missing; you never know...    
                if($this->data['Voucher']['active'] == 1){ //Reverse the logic...
                    $dis = 0;
                }else{
                    $dis = 1;
                }
                $this->_replace_radcheck_item($name,'Rd-Account-Disabled',$dis);
        }
    }

    private function _add_radius_user(){

        $username   = $this->data['Voucher']['name'];
        $this->_add_radcheck_item($username,'Cleartext-Password',$this->_generatePassword());
        $this->_add_radcheck_item($username,'Rd-User-Type','voucher');

        //Realm (Rd-Realm)
        if(array_key_exists('realm_id',$this->data['Voucher'])){ //It may be missing; you never know...
            if($this->data['Voucher']['realm_id'] != ''){
                $q_r = ClassRegistry::init('Realm')->findById($this->data['Voucher']['realm_id']);
                $realm_name = $q_r['Realm']['name'];
                $this->_add_radcheck_item($username,'Rd-Realm',$realm_name);
            }
        }

        //Profile name (User-Profile)
        if(array_key_exists('profile_id',$this->data['Voucher'])){ //It may be missing; you never know...
            if($this->data['Voucher']['profile_id'] != ''){
                $q_r = ClassRegistry::init('Profile')->findById($this->data['Voucher']['profile_id']);
                $profile_name = $q_r['Profile']['name'];
                $this->_add_radcheck_item($username,'User-Profile',$profile_name);
            }
        }

    }

    private function _radius_format_date($d){
        //Format will be month/date/year eg 03/06/2013 we need it to be 6 Mar 2013
        $arr_date   = explode('/',$d);
        $month      = intval($arr_date[0]);
        $m_arr      = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        $day        = intval($arr_date[1]);
        $year       = intval($arr_date[2]);
        return "$day ".$m_arr[($month-1)]." $year";
    }

    private function _add_radcheck_item($username,$item,$value,$op = ":="){

        $this->Radcheck = ClassRegistry::init('Radcheck');
        $this->Radcheck->create();
        $d['Radcheck']['username']  = $username;
        $d['Radcheck']['op']        = $op;
        $d['Radcheck']['attribute'] = $item;
        $d['Radcheck']['value']     = $value;
        $this->Radcheck->save($d);
        $this->Radcheck->id         = null;
    }

    private function _replace_radcheck_item($username,$item,$value,$op = ":="){

        $this->Radcheck = ClassRegistry::init('Radcheck');
        $this->Radcheck->deleteAll(
            array('Radcheck.username' => $username,'Radcheck.attribute' => $item), false
        );
        $this->Radcheck->create();
        $d['Radcheck']['username']  = $username;
        $d['Radcheck']['op']        = $op;
        $d['Radcheck']['attribute'] = $item;
        $d['Radcheck']['value']     = $value;
        $this->Radcheck->save($d);
        $this->Radcheck->id         = null;
    }

    function _detemine_voucher_name(){

        $precede = $this->data['Voucher']['precede'];
        if($precede == ''){
            $this->contain();
            $reply  =   $this->find('first',array(
                            'order'         => array('Voucher.name DESC'))
                        );
            $last_value = 0;
            if($reply){
                $last_value = $reply['Voucher']['name'];    
            }
            $next_number = sprintf("%06d", $last_value+1); 
            return $next_number;
        }else{

            $precede        = $precede.'-';
            $this->contain();
            $reply          = $this->find('first',array(
                                                        'fields'=>array('Voucher.name'),
                                                        'conditions'=>array('Voucher.name LIKE' => $precede.'%'),
                                                        'order'=> array( 'Voucher.name DESC'))
                                            );
            $last_entry     =($reply['Voucher']['name']);
            $voucher_name;

            if(!$last_entry){
                $voucher_name = $precede."000001";
            }else{

                //Get the last number
                $number = preg_replace("/^$precede/",'',$last_entry);
                $number = sprintf("%06d", $number+1);
                $voucher_name = $precede.$number;
            }
            return $voucher_name;
        }
    }

    function _generatePassword ($length = 8){

        $length = $this->data['Voucher']['pwd_length'];
        if($length == ''){
            $length = 8;
        }
        // start with a blank password
        $password = "";
        // define possible characters
       // $possible = "!#$%^&*()+=?0123456789bBcCdDfFgGhHjJkmnNpPqQrRstTvwxyz";
        $possible = "0123456789bBcCdDfFgGhHjJkmnNpPqQrRstTvwxyz";
        // set up a counter
        $i = 0; 
        // add random characters to $password until $length is reached
        while ($i < $length) { 

            // pick a random character from the possible ones
            $char = substr($possible, mt_rand(0, strlen($possible)-1), 1);
            // we don't want this character if it's already in the password
            if (!strstr($password, $char)) { 
                $password .= $char;
                $i++;
            }
        }
        // done!
        return $password;
    }
}
