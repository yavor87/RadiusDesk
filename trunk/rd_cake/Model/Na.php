<?php
App::uses('AppModel', 'Model');
/**
 * Na Model
 *
 * @property User $User
 */
class Na extends AppModel {

    public $actsAs = array('Containable');

	public $displayField = 'nasname';

	public $validate = array(
        'nasname' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
            )
        ),
        'shortname' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
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
        'NaRealm',
        'NaTag',
        'NaNote'    => array(
            'dependent'     => true   
        ),
        'OpenvpnClient',
        'PptpClient'
    );

    //Get the note ID before we delete it
    public function beforeDelete(){
        if($this->id){
            $class_name     = $this->name;
            $q_r            = $this->findById($this->id);
            if($q_r[$class_name]['connection_type'] == 'openvpn'){ //Open VPN needs special treatment when deleting
                $this->openvpn_id    = $q_r[$class_name]['id'];
            }

            if($q_r[$class_name]['connection_type'] == 'pptp'){ //Open VPN needs special treatment when deleting
                $this->pptp_id    = $q_r[$class_name]['id'];
            }
        }
        return true;
    }

    public function afterDelete(){
        if($this->openvpn_id){ //Clean up openvpn
            $vpn = ClassRegistry::init('OpenvpnClient');
            $vpn->contain();
            $q_r = $vpn->find('first',array('conditions' => array('OpenvpnClient.na_id' => $this->openvpn_id)));
            if($q_r){ //DeleteAll does not trigger the before and after delete callbacks!
                 $vpn->id = $q_r['OpenvpnClient']['id'];
                 $vpn->delete($q_r['OpenvpnClient']['id']);
            }
        }

        if($this->pptp_id){ //Clean up pptp
            $pptp = ClassRegistry::init('PptpClient');
            $pptp->contain();
            $q_r = $pptp->find('first',array('conditions' => array('PptpClient.na_id' => $this->pptp_id)));
            if($q_r){ //DeleteAll does not trigger the before and after delete callbacks!
                 $pptp->id = $q_r['PptpClient']['id'];
                 $pptp->delete($q_r['PptpClient']['id']);
            }
        }
    }
}
