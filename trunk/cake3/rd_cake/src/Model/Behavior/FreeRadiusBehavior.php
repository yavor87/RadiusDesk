<?php

namespace App\Model\Behavior;

use Cake\ORM\Behavior;
use Cake\ORM\TableRegistry;
use Cake\Routing\Router;

class FreeRadiusBehavior extends Behavior {

    protected $Radchecks;
    
    protected $_defaultConfig = [
        'for_model' => 'Vouchers' //Can be Vouchers / PermanentUsers / Devices
    ];
    
    protected $puChecks = [
        'profile'           => 'User-Profile',
        'realm'             => 'Rd-Realm',
        'time_cap_type'     => 'Rd-Cap-Type-Time',
        'data_cap_type'     => 'Rd-Cap-Type-Data',
        'active'            => 'Rd-Account-Disabled',
        'from_date'         => 'Rd-Account-Activation-Time',
        'to_date'           => 'Expiration',
        'static_ip'         => 'Framed-IP-Address',
        'auto_add'          => 'Rd-Auto-Mac',
        'auth_type'         => 'Rd-Auth-Type',
        'ssid_only'         => 'Rd-Ssid-Check',
        'cleartext_password'=> 'Cleartext-Password' 
    ];

    protected $binaries = [
        'ssid_only',
        'auto_add',
    ];

    protected $reverse_binaries = [
        'active'
    ];

    protected $fr_dates = [
        'from_date',
        'to_date'
    ];

    protected $tables_to_delete_username= [
        'Radchecks',
        'Radreplies',
        'Radaccts',
        'Radpostauths',
        'UserStats',
        'UserSsids'
    ];


    public function initialize(array $config){
        // Some initialization code here
        $this->Radchecks = TableRegistry::get('Radchecks'); 
        $this->UserSsids = TableRegistry::get('UserSsids');
    }

    //This checks if the $username has a Rd-Ssid-Check and if set to 1 wit return true 
    public function hasSsidCheck($username){
        
        $count = $this->Radchecks->find()->where([
            'username'  => $username,
            'attribute' => 'rd-Ssid-Check',
            'value'     => '1'
        ])->count();

        if($count > 0){
            return true;
        }
        return false;
    }

    public function listRestrictedSsids($username){

        $q_us = $this->UserSsids->find()->where(['username' => $username])->all();
        $ssids = array();
        foreach($q_us as $i){
            array_push($ssids, array('name' => $i->ssidname));
        }

        $s = TableRegistry::get('Ssids');
        $q_r = $s->find()->where(['OR' =>$ssids])->all();
        $ssid_list = array();
        foreach($q_r as $j){
            array_push($ssid_list , array('id' => $j->id, 'name' => $j->name));
        }
        return $ssid_list;
    }

    public function afterSave($event, $entity){
        $this->_doAfterSave($entity);   
    }

    public function afterDelete($event, $entity){
        $this->_doAfterDelete($entity);
    }

    private function _doAfterDelete($entity){
        $config = $this->config();
        if($config['for_model']== 'PermanentUsers'){
            $this->_deleteUsernameEntriesFromTables($entity->username);
        }
    }

    private function _deleteUsernameEntriesFromTables($username){

        //NOTE This might slow down delete actions - Just a heads-up
        foreach($this->tables_to_delete_username as $t){
            $table = TableRegistry::get($t);
            $table->deleteAll(['username' => $username]);
        }
    }
    
    private function _doAfterSave($entity){
        $config = $this->config();
        if ($entity->isNew()){
            if($config['for_model']== 'PermanentUsers'){
                $this->_forPermanentUserAdd($entity);
            }
        }else{
            //We do the update bit
            if($config['for_model']== 'PermanentUsers'){
                 $this->_forPermanentUserEdit($entity);
            }
        }
    }

    private function _forPermanentUserEdit($entity){

        $username       = $entity->username;
        $ssid_only      = false;
        $auto_add       = false;
        foreach(array_keys($this->puChecks) as $key){
            if($entity->dirty("$key")){
                $value = $entity->{$key};
                if(in_array($key,$this->binaries)){
                    $value = 1;
                    if($key == 'ssid_only'){
                        $ssid_only = true;
                    }  
                }
                if(in_array($key,$this->reverse_binaries)){
                    if($value == 0){
                        $value = 1;
                    }else{
                        $value = 0;
                    }
                }
                if(in_array($key,$this->fr_dates)){
                    $value = $this->_radius_format_date($value);
                }  
                $this->_replace_radcheck_item($username,$this->puChecks["$key"],$value);
                if($key =='static_ip'){
                    if($entity->{$key} !== ''){
                        $this->_replace_radcheck_item($username,'Service-Type','Framed-User');
                    }else{
                        //Remove it if it is empty
                        $this->_remove_radcheck_item($username,'Service-Type');
                        $this->_remove_radcheck_item($username,$this->puChecks["$key"]);
                    }
                }
            }  
        }
        //If there are a restriction on SSID level we need to add those SSID's;
        if($ssid_only == true){
            $request = Router::getRequest();
            $this->_replace_user_ssids($username,$request->data['ssid_list']);
        }

        //IF the binaries is false remove them (if they were perhaps active)
        if($ssid_only == false){
            $this->_remove_radcheck_item($username,$this->puChecks["ssid_only"]);
        }

        if($auto_add == false){
            $this->_remove_radcheck_item($username,$this->puChecks["auto_add"]);
        }

        //If always_active is selected remove fr->dates
        $request = Router::getRequest();
        if(isset($request->data['always_active'])){
            foreach($this->fr_dates as $d){
                $this->_remove_radcheck_item($username,$this->puChecks["$d"]);
            }
        }
    }

    
    private function _forPermanentUserAdd($entity){
        $username = $entity->username;
        //Remove any references if there are perhaps any
        $this->{'Radchecks'}->deleteAll(['username' => $username]);
        $this->{'UserSsids'}->deleteAll(['username' => $username]);

        $ssid_only = false;
        foreach(array_keys($this->puChecks) as $key){
            //print("Looking at ".$entity->{$key}."\n");
            if(($entity->{$key} !== '')&&($entity->{$key} !== null)){
                $value = $entity->{$key};
                //We override the value of value under certain conditions
                if(in_array($key,$this->binaries)){
                    $value = 1;

                    if($key == 'ssid_only'){
                        $ssid_only = true;
                    }  
                }
                if(in_array($key,$this->reverse_binaries)){
                    if($value == 0){
                        $value = 1;
                    }else{
                        $value = 0;
                    }
                }
                if(in_array($key,$this->fr_dates)){
                    $value = $this->_radius_format_date($value);
                }
                $this->_add_radcheck_item($username,$this->puChecks["$key"],$value);
                if($key =='static_ip'){
                     $this->_add_radcheck_item($username,'Service-Type','Framed-User');
                } 
            }
        }

        //If there are a restriction on SSID level we need to add those SSID's;
        if($ssid_only == true){
            $request = Router::getRequest();
            $this->_replace_user_ssids($username,$request->data['ssid_list']);
        }
    }

    private function _replace_user_ssids($username,$ssid_list){
		//Clean up previous ones
		$this->UserSsids->deleteAll(['username' => $username]);
		//Get all the SSID names from the $ssid_list
		$s =  TableRegistry::get('Ssids');
		$id_list = array();
		foreach($ssid_list as $i){
			array_push($id_list, array('id' => strval($i)));
		}

		$q_r = $s->find()->where(['OR' =>$id_list])->all();
		foreach($q_r as $j){
			$name = $j->name;
			$data = [];
			$data['username'] = $username;
			$data['ssidname'] = $name;
			$entity = $this->{'UserSsids'}->newEntity($data);
            $this->{'UserSsids'}->save($entity);	
		}
	}

    
    private function _add_radcheck_item($username,$item,$value,$op = ":="){
        $data = [
            'username'  => $username,
            'op'        => $op,
            'attribute' => $item,
            'value'     => $value
        ];
        $entity = $this->{'Radchecks'}->newEntity($data);
        $this->{'Radchecks'}->save($entity);
    }

    private function _replace_radcheck_item($username,$item,$value,$op = ":="){
        $this->{'Radchecks'}->deleteAll(['username' => $username,'attribute' => $item]);
        $data = [
            'username'  => $username,
            'op'        => $op,
            'attribute' => $item,
            'value'     => $value
        ];
        $entity = $this->{'Radchecks'}->newEntity($data);
        $this->{'Radchecks'}->save($entity);
    }

    private function _remove_radcheck_item($username,$item){
        $this->{'Radchecks'}->deleteAll(['username' => $username,'attribute' => $item]);
    }


    private function _radius_format_date($d){
        //Format will be month/date/year eg 03/06/2013 we need it to be 6 Mar 2013
        $formatted  = $d->format("d/m/Y"); //We added this since we fixed a bug that actually made this a datetime object
        $arr_date   = explode('/',$formatted);
        $month      = intval($arr_date[0]);
        $m_arr      = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        $day        = intval($arr_date[1]);
        $year       = intval($arr_date[2]);
        return "$day ".$m_arr[($month-1)]." $year";
    }

}

?>
