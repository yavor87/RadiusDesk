<?php
// app/Model/Radgroupcheck.php
class Radcheck extends AppModel {

    public $name        = 'Radcheck';
    public $useTable    = 'radcheck'; 
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'    => 'User',
            'foreignKey'   => 'username'
        )
    );
}
?>
