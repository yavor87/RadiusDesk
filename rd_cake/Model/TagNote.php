<?php
App::uses('AppModel', 'Model');

class TagNote extends AppModel {

     public $actsAs = array('Containable');
     public $belongsTo = array(
        'Tag' => array(
                    'className' => 'Tag',
                    'foreignKey' => 'tag_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    ),
        );
}

?>
