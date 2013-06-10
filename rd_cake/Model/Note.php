<?php
App::uses('AppModel', 'Model');
/**
 * Na Model
 *
 * @property User $User
 */
class Note extends AppModel {

    public $actsAs = array('Containable');
	public $displayField = 'note';

	public $validate = array(
        'note' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Value is required'
            )
        )
    );

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        )
	);

    public $hasMany = array(
        'NaNote'    => array('dependent'    => true),
        'TagNote'   => array('dependent'    => true),
        'RealmNote' => array('dependent'    => true),
        'UserNote'  => array('dependent'    => true),
        'ProfileComponentNote'  => array('dependent'    => true),
        'DynamicDetailNote'  => array('dependent'    => true),
        'AutoMacNote'  => array('dependent'    => true),
    );
}
