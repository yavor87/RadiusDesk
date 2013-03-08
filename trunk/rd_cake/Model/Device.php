<?php
App::uses('AppModel', 'Model');

class Device extends AppModel {

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
                'message' => 'This MAC is already taken'
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
        'DeviceNote' => array(
            'dependent'     => true   
        ),
        'Radcheck' => array(
            'className'     => 'Radcheck',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radcheck.* FROM radcheck AS Radcheck, devices WHERE devices.name=Radcheck.username AND users.id={$__cakeID__$}',
            'dependent'     => true
        ),
        'Radreply' => array(
            'className'     => 'Radreply',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radreply.* FROM radreply AS Radreply, devices WHERE devicess.name=Radreply.username AND users.id={$__cakeID__$}',
            'dependent'     => true
        ),
    );
}
