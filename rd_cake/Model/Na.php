<?php
App::uses('AppModel', 'Model');
/**
 * Na Model
 *
 * @property User $User
 */
class Na extends AppModel {

    public $actsAs = array('Containable');

	public $displayField = 'nasname';

	public $validate = array(
        'nasname' => array(
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

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        )
	);
}
