<?php
App::uses('AppModel', 'Model');

class FinMyGateTransactions extends AppModel {

    public $name        = 'FinMyGateTransactions';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
		'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
        'FinMyGateTokens' => array(
            'className'     => 'FinMyGateTokens',
			'foreignKey'    => 'fin_my_gate_token_id'
        )
	);

    public $hasMany = array(
        'FinMyGateTransactionNote'  => array(
            'dependent'     => true   
        )
    );
/*
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
*/
}
?>
