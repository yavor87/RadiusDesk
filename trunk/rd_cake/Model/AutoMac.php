<?php
App::uses('AppModel', 'Model');
class AutoMac extends AppModel {

    public $actsAs = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        )
	);

    public $hasMany = array(
        'AutoSetup' => array(
            'className'     => 'AutoSetup',
            'order'         => 'AutoSetup.created DESC',
            'dependent'     => true
        ),
        'AutoContact' => array(
            'className'     => 'AutoContact',
            'order'         => 'AutoContact.created DESC',
            'dependent'     => true 
        ),
        'AutoMacNote'    => array(
            'dependent'     => true   
        )
    );

    public $validate = array(
        'name' => array(
            'required' => array(
                'rule' => array('notBlank'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This MAC already exists'
            )
        ),
        'dns_name' => array(
            'required' => array(
                'rule' => array('notBlank'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This DNS name already exists'
            )
        )
    );

}

?>
