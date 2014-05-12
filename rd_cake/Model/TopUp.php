<?php
// app/Model/TopUp.php
class TopUp extends AppModel {
    public $name        = 'TopUp';
    public $actsAs      = array('Containable');

    public $belongsTo   = array(
        'User'          => array(
            'className'     => 'User',
			'foreignKey'    => 'user_id'
        ),
        'PermanentUser' => array(
            'className'     => 'User',
            'foreignKey'    => 'permanent_user_id'
        )
	);
}
?>
