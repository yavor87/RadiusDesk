<?php
// app/Model/Profile.php
class Profile extends AppModel {

    public $name        = 'Profile';
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        )
	);

    public $hasMany = array(
        'ProfileNote'   => array(
            'dependent'     => true   
        ),
        'Radusergroup'  => array(
            'className'     => 'Radusergroup',
            'foreignKey'	=> false,
            'finderQuery'   => 'SELECT Radusergroup.* FROM radusergroup AS Radusergroup, profiles WHERE profiles.name=Radusergroup.username AND profiles.id={$__cakeID__$} ORDER BY Radusergroup.priority ASC',
            'dependent'     => true
        )
    );

/*
    public $validate = array(
        'name' => array(
            'validate' => array(
                'rule' => array('validateUnique', array('name','iso_code')),
                'message' => 'You already have an entry',
                'required' => true
            ),
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Country name is required',
                'required' => true
            )
        ),
        'iso_code' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'ISO code is required',
                'required' => true
            ),
            'maxl' => array(
                'rule'    => array('maxLength', 2),
                'message' => 'Iso codes can not be more than two characters'
            ),
            'minl' => array(
                'rule'    => array('minLength', 2),
                'message' => 'Minimum length of 2 characters'
            )
        ),
        'icon_file' => array(
            'required' => array(
                'rule' => array('notEmpty'),
                'message' => 'Supply a name for the icon file'
            )
        )
    );
*/
}
?>
