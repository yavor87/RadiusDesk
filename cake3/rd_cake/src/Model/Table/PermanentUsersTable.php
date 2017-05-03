<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class PermanentUsersTable extends Table
{
    public function initialize(array $config){
        $this->addBehavior('Timestamp');
        $this->addBehavior('FreeRadius',
            [
                'for_model' => 'PermanentUsers'
            ]
        );
          
        $this->belongsTo('Users');      
        $this->belongsTo('Countries');
        $this->belongsTo('Languages');
        $this->belongsTo('Profiles',['propertyName'  => 'real_profile']);
        $this->belongsTo('Realms',['propertyName'  => 'real_realm']);  
        $this->hasMany('PermanentUserNotes');

     //   $this->hasMany('PermanentUserSettings');
     //   $this->hasMany('Devices');
    }
    
    public function validationDefault(Validator $validator){
        $validator = new Validator();
        $validator
            ->notEmpty('username', 'A name is required')
            ->add('username', [ 
                'nameUnique' => [
                    'message' => 'The username you provided is already taken. Please provide another one.',
                    'rule' => 'validateUnique', 
                    'provider' => 'table'
                ]
            ]);
        return $validator;
    }
       
}
