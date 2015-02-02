<?php
App::uses('AppModel', 'Model');

class FinMyGateTransaction extends AppModel {

    public $name        = 'FinMyGateTransaction';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
        'FinMyGateToken'   => array(
            'className'     => 'Profile',
			'foreignKey'    => 'fin_my_gate_token_id'
        )
	);

	public $validate 	= array(
		'name' => array(
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
}
?>
