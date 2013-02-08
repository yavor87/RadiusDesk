<?php
App::uses('AppModel', 'Model');

class TemplateNote extends AppModel {

     public $actsAs = array('Containable');
     public $belongsTo = array(
        'Template' => array(
                    'className' => 'Template',
                    'foreignKey' => 'template_id'
                    ),
        'Note' => array(
                    'className' => 'Note',
                    'foreignKey' => 'note_id'
                    ),
        );
}

?>
