<?php

//----------------------------------------------------------
//---- Author: Dirk van der Walt
//---- License: GPL v3
//---- Description: 
//---- Date: 31-12-2016
//------------------------------------------------------------

namespace App\Controller\Component;
use Cake\Controller\Component;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\ORM\TableRegistry;


class CommonQueryComponent extends Component { 

    public $components = array('GridFilter'); 

    public function build_common_query($query,$user,$contain_array = ['Users']){

        //Model Name
        $model = $this->config('model');

        //Contain
        $query->contain($contain_array);
       
        
        //===== SORT =====
        //Default values for sort and dir
        $sort   = $model.'.name';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            if($this->request->query['sort'] == 'owner'){
                $sort = 'Users.username';
            }else{
                $sort = $model.'.'.$this->request->query['sort'];
            }
            $dir  = $this->request->query['dir'];
        } 
        $query->order([$sort => $dir]);
        
        //==== END SORT ===

        $where_clause = [];

        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){
            
                 $f = $this->GridFilter->xformFilter($f);
                //Strings
                if($f->type == 'string'){
                    if($f->field == 'owner'){
                        array_push($where_clause,array("Users.username LIKE" => '%'.$f->value.'%'));   
                    }elseif($f->field == 'permanent_user')
                        array_push($where_clause,array("PermanentUsers.username LIKE" => '%'.$f->value.'%'));
                    else{
                        $col = $model.'.'.$f->field;
                        array_push($where_clause,array("$col LIKE" => '%'.$f->value.'%'));
                    }
                }
                //Bools
                if($f->type == 'boolean'){
                     $col = $model.'.'.$f->field;
                     array_push($where_clause,array("$col" => $f->value));
                }
            }
        }  
        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show the Ssids which he is allowed to see.
        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $tree_array = array();
            $user_id    = $user['id'];

            //**AP and upward in the tree**
            $users         = TableRegistry::get('Users');
            $this->parents = $users->find('path',['for' => $user_id]);

            
            //So we loop this results asking for the parent nodes who have available_to_siblings = true
            foreach($this->parents as $i){
                $i_id = $i->id;
                if($i_id != $user_id){ //upstream
                    array_push($tree_array,array($model.'.'.'user_id' => $i_id,$model.'.'.'available_to_siblings' => true));
                }else{
                    array_push($tree_array,array($model.'.'.'user_id' => $i_id)); //That is the access provider self
                }
            }
            
            
            //** ALL the AP's children
            $children = $users->find('children', ['for' => $user_id]);
            if($children){   //Only if the AP has any children...
                foreach($children as $i){
                    $id = $i->id;
                    array_push($tree_array,array($model.'.'.'user_id' => $id));
                }       
            }      
            //Add it as an OR clause
            if(count($tree_array) > 0){
                array_push($where_clause,array('OR' => $tree_array));
            }  
        }       
        //====== END AP FILTER ===== 
        
        //print_r($where_clause);
             
        $query->where($where_clause);
        return;    
    }
    
    public function build_ap_query($query,$user){
  
        $contain_array   = array(
            'UserNotes' => ['Notes'],
            'Owners',
            'Groups'        
        );
    
        //Model Name
        $model = $this->config('model');
        //Contain
        $query->contain($contain_array);
              
        //===== SORT =====
        //Default values for sort and dir
        $sort   = $model.'.username';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            if($this->request->query['sort'] == 'owner'){
                $sort = 'Users.username';
            }else{
                $sort = $model.'.'.$this->request->query['sort'];
            }
            $dir  = $this->request->query['dir'];
        } 
        $query->order([$sort => $dir]); 
        //==== END SORT ===
    
        $where_clause = [];
        
        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){

                $f = $this->GridFilter->xformFilter($f);

                //Strings
                if($f->type == 'string'){
                    if($f->field == 'owner'){
                        array_push($where_clause,array("Owners.username LIKE" => '%'.$f->value.'%'));   
                    }else{
                        $col = $model.'.'.$f->field;
                        array_push($where_clause,array("$col LIKE" => '%'.$f->value.'%'));
                    }
                }
                //Bools
                if($f->type == 'boolean'){
                     $col = $model.'.'.$f->field;
                     array_push($where_clause,array("$col" => $f->value));
                }
            }
        }
        
        //== ONLY Access Providers ==
        $ap_name = Configure::read('group.ap');
        array_push($where_clause,array('Groups.name' => $ap_name ));
        
        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show all the AP's downward from its position in the tree
        if($user['group_name'] == Configure::read('group.ap')){  //AP 
        
            $user_id    = $user['id'];
            $users      = TableRegistry::get('Users')->find();  
            $children   = $users->find('children', ['for' => $user_id]);
            
            $ap_clause      = array();
            foreach($children as $i){
                array_push($ap_clause,array($model.'.parent_id' => $i->parent_id));
            }
               
            if(count($ap_clause) > 0){      
                array_push($where_clause,array('OR' => $ap_clause));  
            }
        }      
        //====== END AP FILTER =====
               
        $query->where($where_clause);
        return;
    }
}

