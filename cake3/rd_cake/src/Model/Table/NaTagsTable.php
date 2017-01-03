<?php

// src/Model/Table/GlobalDomainGlobalTagsTable.php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class GlobalDomainGlobalTagsTable extends Table
{
    public function initialize(array $config){
        $this->addBehavior('Timestamp');  
        $this->belongsTo('Na'); 
        $this->belongsTo('Tags');      
    }      
}
