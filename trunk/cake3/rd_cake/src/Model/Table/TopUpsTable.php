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
        $this->hasMany('TopUpTransactions',['dependent' => false]);
          
        $this->Radchecks            = TableRegistry::get('Radchecks'); 
       // $this->TopUpTransactions    = TableRegistry::get('TopUpTransactions');     
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
        
            $old_value = null;
            $new_value = null;
        
            $e = $this->PermanentUsers->get($entity->permanent_user_id);
            $username = $e->username;
                   
            if($entity->type == 'data'){
                $attribute  = 'Rd-Total-Data';
                $value      = $entity->data;
            }
            
            if($entity->type == 'time'){
                $attribute  = 'Rd-Total-Time';
                $value      = $entity->time;
            }
            
            if($entity->type == 'days_to_use'){
                $attribute  = 'Expiration';
                $value      = $entity->days_to_use;
            } 
            
            $q_e = $this->Radchecks->find()->where(['username' => $username, 'attribute' => $attribute])->first();
            if($q_e){
                $old_value  = $q_e->value;
                $q_e->value = $q_e->value - $value;
                $new_value  = $q_e->value;
                $this->Radchecks->save($q_e);
            }
            
            $d_t = [
                'user_id'           => $entity->user_id,
                'permanent_user_id' => $entity->permanent_user_id,
                'permanent_user'    => $username,
                'top_up_id'         => $entity->id,
                'type'              => $entity->type,
                'action'            => 'delete',
                'radius_attribute'  => $attribute,
                'old_value'         => $old_value,
                'new_value'         => $new_value
            ];
            $e_t  = $this->TopUpTransactions->newEntity($d_t);
            $this->TopUpTransactions->save($e_t);            
        }
    }
      
    private function _doAfterSave($entity){
    
        if($entity->isNew()){
            //Data Type of Entries
            $old_value = null;
            $new_value = null;
            
            if($entity->type == 'data'){
                $attribute  = 'Rd-Total-Data';
                $value      = $entity->data;
            }
            
            if($entity->type == 'time'){
                $attribute  = 'Rd-Total-Time';
                $value      = $entity->time;
            }
            
            if($entity->type == 'days_to_use'){
                $attribute  = 'Expiration';
                $value      = $entity->days_to_use;
            } 
            //See it there is a radcheck item for this permanent_user
            $q_e = $this->Radchecks->find()->where(['username' => $entity->permanent_user, 'attribute' => $attribute])->first();
            if($q_e){
                $old_value  = $q_e->value;
                $q_e->value = $q_e->value + $value;
                $new_value  = $q_e->value;
                $this->Radchecks->save($q_e);
                $top_up_id  = $q_e->id;  
            }else{
                $d = [];
                $d['username']  = $entity->permanent_user;
                $d['attribute'] = $attribute;
                $d['op']        = ':=';
                $d['value']     = $value;
                $new_value      = $d['value'];
                $n_e            = $this->Radchecks->newEntity($d);
                $this->Radchecks->save($n_e);
                $top_up_id      = $n_e->id;
            }
            
            $d_t = [
                'user_id'           => $entity->user_id,
                'permanent_user_id' => $entity->permanent_user_id,
                'permanent_user'    => $entity->permanent_user,
                'top_up_id'         => $entity->id,
                'type'              => $entity->type,
                'action'            => 'create',
                'radius_attribute'  => $attribute,
                'old_value'         => $old_value,
                'new_value'         => $new_value
            ];
            $e_t  = $this->TopUpTransactions->newEntity($d_t);
            $this->TopUpTransactions->save($e_t);
        }else{
         /*   if($entity->type == 'data'){
                if($entity->dirty('data')){
                    //Get the old value
                    $original   = $entity->getOriginal('data');
                    $new        = $entity->data;
                    if($new > $original){
                    
                    }
                
                }
           */ 
            }
            //Here we'll have to edit the entries
            
        
        }
    }
          
}
