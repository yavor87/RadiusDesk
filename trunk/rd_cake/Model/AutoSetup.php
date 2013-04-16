<?php
App::uses('AppModel', 'Model');
class AutoSetup extends AppModel {

    public $actsAs = array('Containable');

    public $belongsTo = array(
        'AutoGroup' => array(
            'className'     => 'AutoGroup',
            'foreignKey'    => 'auto_group_id'
        ),
        'AutoMac' => array(
            'className'    => 'AutoMac',
            'foreignKey'    => 'auto_mac_id'
        )
    );

}

?>
