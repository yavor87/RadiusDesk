<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\TableRegistry;

class TopUpsTable extends Table
{

    public function initialize(array $config){
        $this->addBehavior('Timestamp');     
        $this->belongsTo('PermanentUsers');
        $this->belongsTo('Users'); 
        
        $this->Radchecks    = TableRegistry::get('Radchecks');      
    }
    
    public function beforeDelete($event, $entity){
        $this->_doBeforeDelete($entity);
    }
    
    public function beforeSave($event, $entity){
        return $this->_doBeforeSave($entity);   
    }
     
    private function _doBeforeSave($entity){
    
        if($entity->permanent_user_id){
            $e = $this->PermanentUsers->get($entity->permanent_user_id);
            if($entity){               
                $entity->permanent_user = $e->username;
                return true;
            }else{
                return false;
            }
        }else{
            if($entity->permanent_user){
                $e = $this->PermanentUsers->find()->where(['username' => $entity->permanent_user])->first();
                if($entity){
                    $entity->permanent_user_id = $e->id;
                    return true;
                }else{
                    return false;
                } 
            }
        }
        return false;    
    }
   
    public function afterSave($event, $entity){
        $this->_doAfterSave($entity);   
    }
    
    private function _doBeforeDelete($entity){
    
        if($entity->permanent_user_id){
            $e = $this->PermanentUsers->get($entity->permanent_user_id);
            $username = $e->username;       
            if($entity->type == 'data'){
                $q_e = $this->Radchecks->find()->where(['username' => $username, 'attribute' => 'Rd-Total-Data'])->first();
                if($q_e){
                    $q_e->value = $q_e->value - $entity->data;
                    $this->Radchecks->save($q_e);
                }
            }
            
            if($entity->type == 'time'){
                $q_e = $this->Radchecks->find()->where(['username' => $username, 'attribute' => 'Rd-Total-Time'])->first();
                if($q_e){
                    $q_e->value = $q_e->value - $entity->time;
                    $this->Radchecks->save($q_e);
                }
            }
        }
    }
      
    private function _doAfterSave($entity){
        if ($entity->isNew()){
            //Data Type of Entries
            if($entity->type == 'data'){
                //See it there is a radcheck item for this permanent_user
                $q_e = $this->Radchecks->find()->where(['username' => $entity->permanent_user, 'attribute' => 'Rd-Total-Data'])->first();
                if($q_e){
                    $q_e->value = $q_e->value + $entity->data;
                    $this->Radchecks->save($q_e);
                }else{
                    $d = [];
                    $d['username']  = $entity->permanent_user;
                    $d['attribute'] = 'Rd-Total-Data';
                    $d['op']        = ':=';
                    $d['value']     = $entity->data;
                    $n_e = $this->Radchecks->newEntity($d);
                    $this->Radchecks->save($n_e);
                }
            }
            
            //Time Type of Entries
            if($entity->type == 'time'){
                //See it there is a radcheck item for this permanent_user
                $q_e = $this->Radchecks->find()->where(['username' => $entity->permanent_user, 'attribute' => 'Rd-Total-Time'])->first();
                if($q_e){
                    $q_e->value = $q_e->value + $entity->data;
                    $this->Radchecks->save($q_e);
                }else{
                    $d = [];
                    $d['username']  = $entity->permanent_user;
                    $d['attribute'] = 'Rd-Total-Time';
                    $d['op']        = ':=';
                    $d['value']     = $entity->time;
                    $n_e = $this->Radchecks->newEntity($d);
                    $this->Radchecks->save($n_e);
                }
            }
        }else{
            //Here we'll have to edit the entries
        
        }
    }
          
}
