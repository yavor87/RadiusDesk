<?php
App::uses('AppModel', 'Model');

class FinPaymentPlan extends AppModel {

    public $name        = 'FinPaymentPlan';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
        'Profile'   => array(
            'className'     => 'Voucher',
			'foreignKey'    => 'profile_id'
        )
	);

    public $hasMany = array(
        'FinPaymentPlanNote'  => array(
            'dependent'     => true   
        )
    );
}
?>
