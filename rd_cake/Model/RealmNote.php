<?php
App::uses('AppModel', 'Model');

class RealmNote extends AppModel {

     public $actsAs = array('Containable');
     public $belongsTo = array(
        'Realm' => array(
                    'className' => 'Realm',
                    'foreignKey' => 'realm_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    )
        );
}

?>
