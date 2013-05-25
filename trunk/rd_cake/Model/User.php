<?php
App::uses('AppModel', 'Model');
App::uses('AuthComponent', 'Controller/Component');

/**
 * User Model
 *
 * @property Group $Group
 */
class User extends AppModel {

    //Used to build the list of children an Access Provider may have up to the end nodes.
    private $ap_children    = array();

/**
 * Validation rules
 *
 * @var array
 */
	public $validate = array(
		'username' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
            )
        ),
		'password' => array(
			'notempty' => array(
				'rule' => array('notempty'),
				//'message' => 'Your custom message here',
				//'allowEmpty' => false,
				//'required' => false,
				//'last' => false, // Stop validation after this rule
				//'on' => 'create', // Limit validation to 'create' or 'update' operations
			),
		),
		'group_id' => array(
			'numeric' => array(
				'rule' => array('numeric'),
				//'message' => 'Your custom message here',
				//'allowEmpty' => false,
				//'required' => false,
				//'last' => false, // Stop validation after this rule
				//'on' => 'create', // Limit validation to 'create' or 'update' operations
			),
		),
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * belongsTo associations
 *
 * @var array
 */
	public $belongsTo = array(
        'Country' => array(
            'className'     => 'Country',
			'foreignKey'    => 'country_id'
        ),
		'Group' => array(
			'className' => 'Group',
			'foreignKey' => 'group_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
        'Language' => array(
            'className'     => 'Language',
			'foreignKey'    => 'language_id'
        ),
        'Owner' => array(
            'className'     => 'User',
            'foreignKey'    => 'parent_id'
        )    
	);

    public $hasMany = array(
        'Na',
        'Tag',
        'Realm',
        'UserNote' => array(
            'dependent'     => true   
        ),
        'UserSetting' => array(
            'dependent'     => true   
        ),
        'Radcheck' => array(
            'className'     => 'Radcheck',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radcheck.* FROM radcheck AS Radcheck, users WHERE users.username=Radcheck.username AND users.id={$__cakeID__$}',
            'dependent'     => true
        ),
        'Radreply' => array(
            'className'     => 'Radreply',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radreply.* FROM radreply AS Radreply, users WHERE users.username=Radreply.username AND users.id={$__cakeID__$}',
            'dependent'     => true
        ),
        'Device' => array(
            'dependent'     => true   
        ),
    );

    public $actsAs = array('Acl' => array('type' => 'requester'),'Containable','Tree');


    public function beforeSave($options = array()) {

        if((isset($this->data['User']['token']))&&($this->data['User']['token']=='')){
            App::uses('String', 'Utility');
            $this->data['User']['token'] = String::uuid();
        }

        if(isset($this->data['User']['password'])){
            $this->clearPwd = $this->data['User']['password']; //Keep a copy of the original one
            $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
        }
        return true;
    }

    public function afterSave($created){

        if($created){
            $group_name  = Configure::read('group.user');
            $q_r        = $this->Group->find('first',array('conditions' =>array('Group.name' => $group_name)));
            $group_id   = $q_r['Group']['id'];
            //Check if this is a permanent user
            if($this->data['User']['group_id'] == $group_id){
                $this->_add_radius_user();
            }
        }else{
            if(array_key_exists('group_id',$this->data['User'])){
               
                $group_name  = Configure::read('group.user');
                $q_r        = $this->Group->find('first',array('conditions' =>array('Group.name' => $group_name)));
                $group_id   = $q_r['Group']['id'];
                //Check if this is a permanent user
                if($this->data['User']['group_id'] == $group_id){
                    $this->_update_radius_user();
                }
            }
        }
    }

    private function _update_radius_user(){

        $user_id    = $this->data['User']['id']; //The user's ID should always be present!
        //Get the username
        $q_r        = $this->findById($user_id);
        $username   = $q_r['User']['username'];

        //enabled or disabled (Rd-Account-Disabled)
        if(array_key_exists('active',$this->data['User'])){ //It may be missing; you never know...
          //  if($this->data['User']['active'] != null){ //TODO Figure out why it takes a zero (0) as '' or null??? //So we had to leave this out to allow for disabling
                if($this->data['User']['active'] == 1){ //Reverse the logic...
                    $dis = 0;
                }else{
                    $dis = 1;
                }
                
                $this->_replace_radcheck_item($username,'Rd-Account-Disabled',$dis);
          //  }
        }

        //Password (Cleartext-Password)
        if(array_key_exists('password',$this->data['User'])){ //Usually used to change the password               
            $this->_replace_radcheck_item($username,'Cleartext-Password',$this->clearPwd);
        }

    }

    private function _add_radius_user(){
        //The username with it's password (Cleartext-Password)
        $username                   = $this->data['User']['username'];
        $this->_add_radcheck_item($username,'Cleartext-Password',$this->clearPwd);
        $this->_add_radcheck_item($username,'Rd-User-Type','user');

        //Realm (Rd-Realm)
        if(array_key_exists('realm_id',$this->data['User'])){ //It may be missing; you never know...
            if($this->data['User']['realm_id'] != ''){
                $q_r = ClassRegistry::init('Realm')->findById($this->data['User']['realm_id']);
                $realm_name = $q_r['Realm']['name'];
                $this->_add_radcheck_item($username,'Rd-Realm',$realm_name);
            }
        }

        //Auth Type (Rd-Auth-Type) = sql by default

        //$this->_add_radcheck_item($username,'Rd-Auth-Type','sql');

        //Profile name (User-Profile)
        if(array_key_exists('profile_id',$this->data['User'])){ //It may be missing; you never know...
            if($this->data['User']['profile_id'] != ''){
                $q_r = ClassRegistry::init('Profile')->findById($this->data['User']['profile_id']);
                $profile_name = $q_r['Profile']['name'];
                $this->_add_radcheck_item($username,'User-Profile',$profile_name);
            }
        }

        //cap type (Rd-Cap-Type this will dertermine if we enforce a counter or not) 
        if(array_key_exists('cap',$this->data['User'])){ //It may be missing; you never know...
            if($this->data['User']['cap'] != ''){      
                $this->_add_radcheck_item($username,'Rd-Cap-Type',$this->data['User']['cap']);
            }
        }  
        
        //enabled or disabled (Rd-Account-Disabled)
        if(array_key_exists('active',$this->data['User'])){ //It may be missing; you never know...
            if($this->data['User']['active'] != ''){
                if($this->data['User']['active'] == 1){ //Reverse the logic...
                    $dis = 0;
                }else{
                    $dis = 1;
                }
                $this->_add_radcheck_item($username,'Rd-Account-Disabled',$dis);
            }
        }

        //Activation date (Rd-Account-Activation-Time)
        if(array_key_exists('from_date',$this->data['User'])){ //It may be missing; you never know...
            if($this->data['User']['from_date'] != ''){       
                $expiration = $this->_radius_format_date($this->data['User']['from_date']);
                $this->_add_radcheck_item($username,'Rd-Account-Activation-Time',$expiration);
            }
        }  

        //Expiration date (Expiration)
        if(array_key_exists('to_date',$this->data['User'])){ //It may be missing; you never know...
            if($this->data['User']['to_date'] != ''){       
                $expiration = $this->_radius_format_date($this->data['User']['to_date']);
                $this->_add_radcheck_item($username,'Expiration',$expiration);
            }
        }

        //Not Track auth (Rd-Not-Track-Auth) *By default we will (in post-auth)
        if(!array_key_exists('track_auth',$this->data['User'])){ //It may be missing; you never know...     
            $this->_add_radcheck_item($username,'Rd-Not-Track-Auth',1);
        }

        //Not Track acct (Rd-Not-Track-Acct) *By default we will (in pre-acct)
        if(!array_key_exists('track_acct',$this->data['User'])){ //It may be missing; you never know...
            $this->_add_radcheck_item($username,'Rd-Not-Track-Acct',1);
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

    //This function is required for the Acl behaviour....
    public function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        if (isset($this->data['User']['group_id'])) {
            $groupId = $this->data['User']['group_id'];
        } else {
            $groupId = $this->field('group_id');
        }
        if (!$groupId) {
            return null;
        } else {
            return array('Group' => array('id' => $groupId));
        }
    }

    //Used to get a list of all the access provider's owned by $ap_id, including their children and children's children etc...
    public function find_access_provider_children($ap_id){

        $ap_name = Configure::read('group.ap');

        $this->contain();
        $parent = $this->findById($ap_id);
        $this->contain('Group');
        $parentAndChildren = $this->find('threaded', array(
            'conditions' => array(
                'User.lft >='    => $parent['User']['lft'], 
                'User.rght <='   => $parent['User']['rght'],
                'Group.name'    => $ap_name
            )
        ));

        $this->_build_access_provider_children($parentAndChildren);
        return $this->ap_children;
    }

    //Called recusrively to find the children downward from an AP
    private function _build_access_provider_children($results){
        foreach($results as $i){
            $id         = $i['User']['id'];
            $username   = $i['User']['username'];
            array_push($this->ap_children,array('id' => $id, 'username' => $username));
            if(count($i['children']) > 0){ //Call recursivley
                $this->_build_access_provider_children($i['children']);
            }
        }
    }
}
