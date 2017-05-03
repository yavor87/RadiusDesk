<?php

namespace App\Model\Behavior;

use Cake\ORM\Behavior;
use Cake\ORM\TableRegistry;

class FreeRadiusBehavior extends Behavior {

    protected $Radchecks;
    
    protected $_defaultConfig = [
        'for_model' => 'Vouchers' //Can be Vouchers / PermanentUsers / Devices
    ];
    
    protected $puChecks = [
        'profile'   => 'User-Profile',
        'realm'     => 'Rd-Realm',
        'cap_time'  => 'Rd-Cap-Type-Time',
        'cap_data'  => 'Rd-Cap-Type-Data',
        'active'    => 'Rd-Account-Disabled',
        'from_date' => 'Rd-Account-Activation-Time',
        'to_date'   => 'Expiration',
        'static_ip' => 'Framed-IP-Address',
        'auto_add'  => 'Rd-Auto-Mac',
        'auth_type' => 'Rd-Auth-Type',
        'ssid_only' => 'Rd-Ssid-Check',
        'cleartext_password' => 'Cleartext-Password' 
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

        $username = $entity->username;

        //We check if the active flag changed
        if($entity->dirty('active')){
            if($entity->active == 1){ //Reverse the logic...
                $dis = 0;
            }else{
                $dis = 1;
            }                
           	$this->_replace_radcheck_item($username,'Rd-Account-Disabled',$dis);
        }

        //We check if the password changed
        if($entity->dirty('password')){
            $pwd = $entity->cleartext_password;             
           	$this->_replace_radcheck_item($username,'Cleartext-Password',$pwd);
        }

        //Also need to do one for from_date and to_date and a few others
    }

    
    private function _forPermanentUserAdd($entity){
        $username = $entity->username;
        //Remove any references if there are perhaps any
        $this->{'Radchecks'}->deleteAll(['username' => $username]);

        foreach(array_keys($this->puChecks) as $key){
            //print("Looking at ".$entity->{$key}."\n");
            if(($entity->{$key} !== '')&&($entity->{$key} !== null)){
                $value = $entity->{$key};
                //We override the value of value under certain conditions
                if(in_array($key,$this->binaries)){
                    $value = 1;  
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
            }
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
