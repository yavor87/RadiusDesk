<?php
App::uses('AppModel', 'Model');

class FinMyGateTokenFailure extends AppModel {

    public $name        = 'FinMyGateTokenFailure';
    public $actsAs      = array('Containable');
    public $belongsTo 	= array(
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

	public $validate 	= array(
		
	);
}
?>
