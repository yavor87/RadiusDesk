<?php
/**
 * Created by PhpStorm.
 * User: stevenkusters
 * Date: 18/01/2017
 * Time: 16:48
 */

namespace App\Model\Table;


use Cake\ORM\Table;

class ProfilesTable extends Table
{
    public function initialize(array $config){
        $this->addBehavior('Timestamp');
        $this->belongsTo('Users');
        $this->hasMany('ProfileNotes');
        $this->hasMany('Radusergroups', [
            'className'     => 'Radusergroups',
            'foreignKey'	=> 'username',
            'bindingKey'    => 'name',
            'sort'          => ['Radusergroups.priority' => 'ASC'],
            'dependent'     => true
        ]);
    }
}
