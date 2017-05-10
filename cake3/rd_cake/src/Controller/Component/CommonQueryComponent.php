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
        $query->contain($contain_array);
        $this->_common_sort($query,'name');
        $where_clause = $this->_common_filter();
        $this->_ap_filter_for_available_to_siblings($query,$user,$where_clause);
    }
    
    public function build_ap_query($query,$user){
        $contain_array   = array(
            'UserNotes' => ['Notes'],
            'Owners',
            'Groups'        
        );
        $query->contain($contain_array);
        $this->_common_sort($query,'username');
        $where_clause = $this->_common_filter();
        $this->_ap_filter_for_aps($query,$user,$where_clause);
    }

    public function build_with_realm_query($query,$user,$contain_array = ['Users'],$order_column='username'){
        $query->contain($contain_array);
        $this->_common_sort($query,$order_column);
        $where_clause = $this->_common_filter();
        //FIXME We have to cleverly apply the AP filter to only show realms an AP has rights to
        $query->where($where_clause);
    }


    private function _common_sort($query, $default_column = 'name'){

        //Defaults
        $model  = $this->config('model');
        $sort   = $model.'.'.$default_column;
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
    }

    private function _common_filter(){

        $where_clause   = [];
        $model          = $this->config('model');

        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){        
                 $f = $this->GridFilter->xformFilter($f);
                //Strings
                if($f->type == 'string'){
                    if($f->field == 'owner'){
                        if($this->config('model') == 'Users'){ //For Access Providers
                            array_push($where_clause,array("Owners.username LIKE" => '%'.$f->value.'%'));  
                        }else{
                            array_push($where_clause,array("Users.username LIKE" => '%'.$f->value.'%'));
                        }   
                    }elseif($f->field == 'permanent_user') //For Devices
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
        return $where_clause;
    }

    private function _ap_filter_for_aps($query,$user,$where_clause){

        $model   = $this->config('model');
        //== ONLY Access Providers ==
        $ap_name = Configure::read('group.ap');
        array_push($where_clause,array('Groups.name' => $ap_name ));
        
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

        $query->where($where_clause);
    }

    private function _ap_filter_for_available_to_siblings($query,$user,$where_clause){
         $model   = $this->config('model');
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
        $query->where($where_clause);
    }

}

