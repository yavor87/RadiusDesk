<?php
App::uses('AppModel', 'Model');
class AutoGroup extends AppModel {

    public $actsAs = array('Containable');

    public $hasMany = array(
                    'AutoSetup' => array(
                    'className' => 'AutoSetup',
                    'order' => 'AutoSetup.created DESC'
                    )
        );

}

?>
