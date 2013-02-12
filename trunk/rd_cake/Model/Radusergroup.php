<?php
// app/Model/Radusergroup.php
class Radusergroup extends AppModel {

    public $name        = 'Radgusergroup';
    public $useTable    = 'radusergroup'; 
    public $actsAs      = array('Containable');
    public $belongsTo = array(
        'Profile' => array(
            'className'    => 'Profile',
            'foreignKey'   => 'username'
        )
    );
}
?>
