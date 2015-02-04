<?php
App::uses('AppModel', 'Model');

class FinMyGateTokens extends AppModel {

    public $name        = 'FinMyGateTokens';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
		'PermanentUser'   => array(
            'className'     => 'PermanentUser',
			'foreignKey'    => 'permanent_user_id'
        )
        'PaymentPlan'   => array(
            'className'     => 'PaymentPlan',
			'foreignKey'    => 'payment_plan_id'
        )
	);

    public $hasMany = array(
        'FinMyGateTokenNote'  => array(
            'dependent'     => true   
        )
    );

	public $validate 	= array(
		'client_uid' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
            )
        ),
		'client_pin' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
            )
        ),
		'client_uci' => array(
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
