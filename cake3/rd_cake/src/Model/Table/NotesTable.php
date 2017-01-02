<?php

// src/Model/Table/NotesTable.php

namespace App\Model\Table;

use Cake\ORM\Table;

use Cake\Utility\Text;

class NotesTable extends Table
{
    public function initialize(array $config){  
        $this->addBehavior('Timestamp');       
        $this->belongsTo('Users');
        
        $this->hasMany('UserNotes',['dependent' => true]);
        
    }
      
}
