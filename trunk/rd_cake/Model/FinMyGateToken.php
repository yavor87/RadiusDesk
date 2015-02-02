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
        'FinPaymentPlan'   => array(
            'className'     => 'Profile',
			'foreignKey'    => 'fin_payment_plan_id'
        ),
		'PermanentUser'   => array(
            'className'     => 'Profile',
			'foreignKey'    => 'permanent_user_id'
        )
	);

    public $hasMany = array(
        'FinMyGateTokenNote'  => array(
            'dependent'     => true   
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
