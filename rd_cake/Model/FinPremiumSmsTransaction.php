<?php
App::uses('AppModel', 'Model');

class FinPremiumSmsTransaction extends AppModel {

    public $name        = 'FinPremiumSmsTransaction';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
        'Voucher'   => array(
            'className'     => 'Voucher',
			'foreignKey'    => 'voucher_id'
        )
	);

    public $hasMany = array(
        'FinPremiumSmsTransactionNote'  => array(
            'dependent'     => true   
        )
    );
}
?>
