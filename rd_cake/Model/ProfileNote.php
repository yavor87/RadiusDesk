<?php
App::uses('AppModel', 'Model');

class ProfileNote extends AppModel {

     public $actsAs = array('Containable');
     public $belongsTo = array(
        'ProfileComponent' => array(
                    'className' => 'Profile',
                    'foreignKey' => 'profile_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    ),
        );
}

?>
