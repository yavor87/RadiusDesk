<?php

class TemplateAttribute extends AppModel {
     var $belongsTo = array(
        'Template' => array(
                    'className' => 'Template',
                    'foreignKey' => 'template_id'
                    )
        ); 
    
}

?>
