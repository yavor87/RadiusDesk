<?php
App::uses('AppModel', 'Model');

class FinMyGateToken extends AppModel {

    public $name        = 'FinMyGateToken';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
		'PermanentUser'   => array(
            'className'     => 'PermanentUser',
			'foreignKey'    => 'permanent_user_id'
        ),
        'FinPaymentPlan'   => array(
            'className'     => 'FinPaymentPlan',
			'foreignKey'    => 'fin_payment_plan_id'
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
                'rule' => array('notBlank'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
            )
        ),
		'client_pin' => array(
            'required' => array(
                'rule' => array('notBlank'),
                'message' => 'Value is required'
            ),
            'unique' => array(
                'rule'    => 'isUnique',
                'message' => 'This name is already taken'
            )
        ),
		'client_uci' => array(
            'required' => array(
                'rule' => array('notBlank'),
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
