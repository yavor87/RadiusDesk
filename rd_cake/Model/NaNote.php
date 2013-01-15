<?php
App::uses('AppModel', 'Model');

class NaNote extends AppModel {

     public $actsAs = array('Containable');

     public $belongsTo = array(
        'Na' => array(
                    'className' => 'Na',
                    'foreignKey' => 'na_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    ),
        );
}

?>
