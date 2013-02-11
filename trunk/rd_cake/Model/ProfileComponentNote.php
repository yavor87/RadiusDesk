<?php
App::uses('AppModel', 'Model');

class ProfileComponentNote extends AppModel {

     public $actsAs = array('Containable');
     public $belongsTo = array(
        'ProfileComponent' => array(
                    'className' => 'ProfileComponent',
                    'foreignKey' => 'profile_component_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    ),
        );
}

?>
