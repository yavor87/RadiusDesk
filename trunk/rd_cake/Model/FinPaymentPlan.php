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
            'className'     => 'Profile',
			'foreignKey'    => 'profile_id'
        )
	);

    public $hasMany = array(
        'FinPaymentPlanNote'  => array(
            'dependent'     => true   
        )
    );

	public $validate 	= array(
		'name' => array(
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
