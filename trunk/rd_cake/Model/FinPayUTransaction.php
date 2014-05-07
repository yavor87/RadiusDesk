<?php
App::uses('AppModel', 'Model');

class FinPayUTransaction extends AppModel {

    public $name        = 'FinPayUTransaction';
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
        'FinPayUTransactionNote'  => array(
            'dependent'     => true   
        )
    );
}
?>
