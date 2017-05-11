<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class TopUpsTable extends Table
{
    public function initialize(array $config){
        $this->addBehavior('Timestamp');     
        $this->belongsTo('PermanentUsers');
        $this->belongsTo('Users');    
    }
           
}
