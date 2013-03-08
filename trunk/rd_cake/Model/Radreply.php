<?php
// app/Model/Radreply.php
class Radreply extends AppModel {

    public $name        = 'Radreply';
    public $useTable    = 'radreply'; 
    public $actsAs      = array('Containable');

    public $belongsTo = array(
        'User' => array(
            'className'    => 'User',
            'foreignKey'   => 'username'
        )
    );
}
?>
