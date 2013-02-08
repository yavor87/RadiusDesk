<?php
App::uses('AppModel', 'Model');
/**
 * Na Model
 *
 * @property User $User
 */
class Template extends AppModel {

    public $actsAs = array('Containable');
	public $displayField = 'name';

	public $validate = array(
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

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        )
	);

    public $hasMany = array(
        'TemplateAttribute' => array(
            'className' => 'TemplateAttribute',
            'order'     => 'TemplateAttribute.created DESC'
        ),
        'TemplateNote'
    );
    
}
