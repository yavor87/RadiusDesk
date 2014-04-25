<?php
App::uses('AppModel', 'Model');

class FinPaypalTransaction extends AppModel {

    public $name        = 'FinPaypalTransaction';
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
        'FinPaypalTransactionNote'  => array(
            'dependent'     => true   
        )
    );
}
?>
