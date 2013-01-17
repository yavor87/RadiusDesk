<?php
App::uses('AppModel', 'Model');

class UserNote extends AppModel {

     public $actsAs = array('Containable');
     public $belongsTo = array(
        'User' => array(
                    'className' => 'User',
                    'foreignKey' => 'user_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    ),
        );
}

?>
