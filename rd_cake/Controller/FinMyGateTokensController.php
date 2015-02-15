<?php
App::uses('AppController', 'Controller');

class FinMyGateTokensController extends AppController {

    public $name       = 'FinMyGateTokens';
    public $components = array('Aa');
    public $uses       = array('FinMyGateToken','User','PermanentUser','FinPaymentPlan','FinMyGateTokenFailure');

	//var $scaffold;
    protected $base    = "Access Providers/Controllers/FinMyGateTokens/";

	//These fields will be included in the index method's feedback
    protected $fields  = array(
	  	'client_pin',			'client_uci', 	'client_uid', 	'override', 
		'override_completed', 	'active',		'created',		'modified',
		'id'
    );


	public function index_failures(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //===== PAGING (MUST BE LAST) ======
        $limit  = 50;   //Defaults
        $page   = 1;
        $offset = 0;
        if(isset($this->request->query['limit'])){
            $limit  = $this->request->query['limit'];
            $page   = $this->request->query['page'];
            $offset = $this->request->query['start'];
        }

		$c					= array();
        $c_page             = $c;
        $c_page['page']     = $page;
        $c_page['limit']    = $limit;
        $c_page['offset']   = $offset;

        $total  = $this->FinMyGateTokenFailure->find('count',$c);       
        $q_r    = $this->FinMyGateTokenFailure->find('all',$c_page);

        //print_r($q_r);

        $items      	= array();

		$fail_fields 	= array(
			'error_code',		'created',		'modified',		'id'
		);

         foreach($q_r as $i){

            //print_r($i);
            $row = array();
            foreach($fail_fields as $field){
                if(array_key_exists($field,$i['FinMyGateTokenFailure'])){
                    $row["$field"]= $i['FinMyGateTokenFailure']["$field"];
                }
            }

			$row['permanent_user']		= $i['PermanentUser']['username'];
			$row['permanent_user_id']	= $i['PermanentUser']['id'];
			$row['fin_payment_plan']	= $i['FinPaymentPlan']['name'];
			$row['fin_payment_plan_id']	= $i['FinPaymentPlan']['id'];
            $row['user_id']     		= $i['User']['id'];
            $row['user']        		= $i['User']['username'];
            array_push($items,$row);
        }

        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }


	
    public function index(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $c = $this->_build_common_query($user); 


        //===== PAGING (MUST BE LAST) ======
        $limit  = 50;   //Defaults
        $page   = 1;
        $offset = 0;
        if(isset($this->request->query['limit'])){
            $limit  = $this->request->query['limit'];
            $page   = $this->request->query['page'];
            $offset = $this->request->query['start'];
        }

        $c_page             = $c;
        $c_page['page']     = $page;
        $c_page['limit']    = $limit;
        $c_page['offset']   = $offset;

        $total  = $this->{$this->modelClass}->find('count',$c);       
        $q_r    = $this->{$this->modelClass}->find('all',$c_page);

        //print_r($q_r);

        $items      = array();

         foreach($q_r as $i){

            //print_r($i);
            $row = array();
            foreach($this->fields as $field){
                if(array_key_exists($field,$i['FinMyGateToken'])){
                    $row["$field"]= $i['FinMyGateToken']["$field"];
                }
            }

            //Create notes flag
            $notes_flag  = false;
            foreach($i['FinMyGateTokenNote'] as $nn){
                if(!$this->_test_for_private_parent($nn['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

			$row['permanent_user']		= $i['PermanentUser']['username'];
			$row['permanent_user_id']	= $i['PermanentUser']['id'];

			$row['fin_payment_plan']	= $i['FinPaymentPlan']['name'];
			$row['fin_payment_plan_id']	= $i['FinPaymentPlan']['id'];

            $row['notes']       = $notes_flag;
            $row['user_id']     = $i['User']['id'];
            $row['user']        = $i['User']['username'];

            array_push($items,$row);

        }

        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }

	public function add() {

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //Get the creator's id
         if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }

		if(array_key_exists('override_completed',$this->request->data)){
            $this->request->data['override_completed'] = 1;
        }

		if(array_key_exists('active',$this->request->data)){
            $this->request->data['active'] = 1;
        }

        $this->{$this->modelClass}->create();
        if ($this->{$this->modelClass}->save($this->request->data)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';
            $this->set(array(
                'errors'    => $this->{$this->modelClass}->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }
	}


    public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];
            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:   
            $item           = $this->{$this->modelClass}->findById($this->data['id']);
            $owner_id       = $item['FinMyGateToken']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->{$this->modelClass}->id = $this->data['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->{$this->modelClass}->id = $this->data['id'];
                $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                $item           = $this->{$this->modelClass}->findById($d['id']);
                $owner_id       = $item['FinMyGateToken']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->{$this->modelClass}->id = $d['id'];
                        $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->{$this->modelClass}->id = $d['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                }
            }
        }

        if($fail_flag == true){
            $this->set(array(
                'success'   => false,
                'message'   => array('message' => __('Could not delete some items')),
                '_serialize' => array('success','message')
            ));
        }else{
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }
	}

	public function delete_failure($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag 	= false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];
            $this->FinMyGateTokenFailure->id = $this->data['id'];
            $this->FinMyGateTokenFailure->delete($this->FinMyGateTokenFailure->id, true);
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){   
                $this->FinMyGateTokenFailure->id = $d['id'];
                $this->FinMyGateTokenFailure->delete($this->FinMyGateTokenFailure->id, true);     
            }
        }

		$this->set(array(
		    'success' => true,
		    '_serialize' => array('success')
		));
	}


	public function view(){

		$user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $id         = $this->request->query['token_id']; 
		$q_r   		= $this->FinMyGateToken->findById($id);
		//print_r($q_r);
		$data		= array();
		if($q_r){
			$data 				= $q_r['FinMyGateToken'];
			unset($data['permanent_user_id']);	//Else it wreak havoc!
			unset($data['fin_payment_plan_id']);	//Else it wreak havoc!
		}

        $this->set(array(
            'data'      => $data,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

    public function edit(){

		$user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        if ($this->request->is('post')) {

            //Unfortunately there are many check items which means they will not be in the POST if unchecked
            //so we have to check for them
            $check_items = array(
				'active','override_completed'
			);
            foreach($check_items as $i){
                if(isset($this->request->data[$i])){
                    $this->request->data[$i] = 1;
                }else{
                    $this->request->data[$i] = 0;
                }
            }

            if ($this->FinMyGateToken->save($this->request->data)) {
                   $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }
        }
    }

	public function tokenize() {

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

		//If the username instead of the the permanent_user_id is used we first need to find that username

		//We need to check if the user is not already tokenized
		if(array_key_exists('permanent_user_id',$this->request->data)){
			$this->{$this->modelClass}->contain();
			$count  = $this->{$this->modelClass}->find('count',array('conditions' => 
						array($this->modelClass.'.permanent_user_id' => $this->request->data['permanent_user_id'])
					)); 

        	if($count > 0){
				$message = 'Error';
		        $this->set(array(
		            'errors'    => array('permanent_user_id' => "User already tokenized"),
		            'success'   => false,
		            'message'   => array('message' => __('User already tokenized')),
		            '_serialize' => array('errors','success','message')
		        ));	
			}else{

				//Get the creator's id
				if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
				    $this->request->data['user_id'] = $user_id;
				}

				$token_results = $this->_get_token();
				
				if($token_results['Result'] == 0){
					$this->request->data['client_uid'] 	= $token_results['ClientIndex'];
					$this->request->data['active'] 		= 1;
					$this->request->data['client_pin'] 	= $this->request->data['permanent_user_id'];
					$this->request->data['client_uci'] 	= $this->request->data['permanent_user_id'];

					//If we have a good uid; we need to calculate the amount the user needs to pay to complete this month
					$fin_payment_plan_id 	= $this->request->data['fin_payment_plan_id'];
					$override 				= $this->_find_outstanding_amount($fin_payment_plan_id);
					$this->request->data['override'] = $override;

					$this->{$this->modelClass}->create();
					if ($this->{$this->modelClass}->save($this->request->data)) {
						$this->set(array(
							'success' => true,
							'_serialize' => array('success')
						));
					}
					return;
				}

				if($token_results['Result'] != 0){
					if(array_key_exists('ErrorCode',$token_results)){
						$error = $token_results['ErrorCode'];
						$error = (strlen($error) > 60) ? substr($error,0,57).'...' : $error;
						$this->set(array(
							'errors'    => array("card_number" => $error),
							'success'   => false,
							'message'   => array('message' => $error),
							'_serialize' => array('errors','success','message')
						));
						//We record this failure
						$this->FinMyGateTokenFailure->create();
						$this->request->data['error_code'] = $token_results['ErrorCode'];
						$this->FinMyGateTokenFailure->save($this->request->data);
						//================================================
						//Another Alert!! There are many test / dummy cc numbers MyGate just accepts... this will cause problems
						//================================================
						return;
					}
				}

			   $this->set(array(
				    'errors'    => array("username" => "Unknown error"),
				    'success'   => false,
				    'message'   => array('message' => "Unknown error"),
				    '_serialize' => array('errors','success','message')
				));
				return;
			} 
        }
	}

	public function cc_to_token() {


		//== Here we have to do various tests:
		/*
			1.) Test if username is known to us
			2.) Test if the username is not already tokenized
			3.) Ensure the all the required fields are included
		*/

		//Change if you need to 
		$this->request->data['user_id'] = 44; //root

		//---- REQUIRED FIELD TEST ------
		$required_fields = array(
			'username',		'fin_payment_plan_id', 	'card_holder', 
			'card_number',	'expiry_month',			'expiry_year',
		);

		foreach($required_fields as $f){
			if(!array_key_exists($f,$this->request->data)){
				 $this->set(array(
		            'errors'    => array("$f" => "Required field missing"),
		            'success'   => false,
		            'message'   => array('message' => __("Required field missing: ".$f)),
		            '_serialize' => array('errors','success','message')
		        ));
				return;		
			}
		}
		//---- END REQUIRED FIELD TEST -----

		//---- TEST FOR EXISTANCE OF usename under permanent_users
		$username = $this->request->data['username'];
		$this->PermanentUser->contain();
		$q_r = $this->PermanentUser->find('first',array('conditions' => array('PermanentUser.username' => $username)));
		if(!$q_r){
			$this->set(array(
	            'errors'    => array("username" => "User ".$username." is not registered"),
	            'success'   => false,
	            'message'   => array('message' => "User ".$username." is not registered"),
	            '_serialize' => array('errors','success','message')
	        ));
			return;
		}

		$permanent_user_id = $q_r['PermanentUser']['id'];
		$this->request->data['permanent_user_id'] = $permanent_user_id;

		$q_r = $this->FinMyGateToken->find('first',
			array('conditions' => array('FinMyGateToken.permanent_user_id' => $permanent_user_id)
		));

		if($q_r){
			$this->set(array(
	            'errors'    => array("username" => "User ".$username." is already tokenized"),
	            'success'   => false,
	            'message'   => array('message' => "User ".$username." is already tokenized"),
	            '_serialize' => array('errors','success','message')
	        ));
			return;
		}

		$token_results = $this->_get_token();
				
		if($token_results['Result'] == 0){
			$this->request->data['client_uid'] 	= $token_results['ClientIndex'];
			$this->request->data['active'] 		= 1;
			$this->request->data['client_pin'] 	= $this->request->data['permanent_user_id'];
			$this->request->data['client_uci'] 	= $this->request->data['permanent_user_id'];

			//If we have a good uid; we need to calculate the amount the user needs to pay to complete this month
			$fin_payment_plan_id 	= $this->request->data['fin_payment_plan_id'];
			$override 				= $this->_find_outstanding_amount($fin_payment_plan_id);
			$this->request->data['override'] = $override;

			//Expire the user the first of next month:
			$this->_extend_expiration($username);
			
			$this->{$this->modelClass}->create();
			if ($this->{$this->modelClass}->save($this->request->data)) {
			    $this->set(array(
			        'success' => true,
			        '_serialize' => array('success')
			    ));
			}
			return;
		}

		if($token_results['Result'] != 0){
			if(array_key_exists('ErrorCode',$token_results)){
				$error = $token_results['ErrorCode'];
				$error = (strlen($error) > 60) ? substr($error,0,57).'...' : $error;
				$this->set(array(
			        'errors'    => array("card_number" => $error),
			        'success'   => false,
			        'message'   => array('message' => $error),
			        '_serialize' => array('errors','success','message')
			    ));
				//We record this failure
				$this->FinMyGateTokenFailure->create();
				$this->request->data['error_code'] = $token_results['ErrorCode'];
				$this->FinMyGateTokenFailure->save($this->request->data);
				//================================================
				//Another Alert!! There are many test / dummy cc numbers MyGate just accepts... this will cause problems
				//================================================
				return;
			}
		}

	   $this->set(array(
            'errors'    => array("username" => "Unknown error"),
            'success'   => false,
            'message'   => array('message' => "Unknown error"),
            '_serialize' => array('errors','success','message')
        ));
	}

	private function _extend_expiration($username){
		//We extend the user's expiry date on for one month
		$this->Radcheck     = ClassRegistry::init('Radcheck');
		$q_r = $this->Radcheck->find('first', 
			array('conditions' => array('Radcheck.username' => $username,'attribute' => 'Expiration'))
		);

		if($q_r){
			$id  			= $q_r['Radcheck']['id'];
			$data['id'] 	= $id;
		}

		$nextmonth  		= mktime(0, 0, 0, date("m")+1,   1,   date("Y")); 
		$to_date			=  $this->_radius_format_date(date("n/j/Y",$nextmonth));
		$data['value']		= $to_date;
		$data['attribute']  = 'Expiration';
		$data['username']   = $username;
		$data['op']   		= ':=';

		$this->Radcheck->create();
		$this->Radcheck->save($data);

	}

	private function _radius_format_date($d){
        //Format will be month/date/year eg 03/06/2013 we need it to be 6 Mar 2013
        $arr_date   = explode('/',$d);
        $month      = intval($arr_date[0]);
        $m_arr      = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        $day        = intval($arr_date[1]);
        $year       = intval($arr_date[2]);
        return "$day ".$m_arr[($month-1)]." $year";
    }

	private function _find_outstanding_amount($fin_payment_plan_id){

		$override 	= 0;
		$this->FinPaymentPlan->contain();
		$q_r 		= $this->FinPaymentPlan->findById($fin_payment_plan_id);
		$value 		= $q_r['FinPaymentPlan']['value'];

		if($value > $override){
			//Find the days until the end of the month
			//'t' Number of days in the given month (28 through 31)
			//'j' Day of the month without leading zeros (1 to 31)
			$timestamp 		= strtotime("now");
			$daysRemaining 	= (int)date('t', $timestamp) - (int)date('j', $timestamp)-1; //We minus one to not calculate today
			if($daysRemaining > 0){
				//Find the days in the month
				$days_in_month 	= date("t");
				//Amount to pay is the $value / $days_in_month * $daysRemaining;
				$override = ($value / $days_in_month) * $daysRemaining;
				$override = round($override, 2);
			}

		}
		return $override;
	}

    public function note_index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();
        if(isset($this->request->query['for_id'])){
            $tag_id = $this->request->query['for_id'];
            $q_r    = $this->FinMyGateToken->FinMyGateTokenNote->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('FinMyGateTokenNote.fin_my_gate_token_id' => $tag_id)
                )
            );
            foreach($q_r as $i){
                if(!$this->_test_for_private_parent($i['Note'],$user)){
                    $owner_id   = $i['Note']['user_id'];
                    $owner      = $this->_find_parents($owner_id);
                    $afs        = $this->_get_action_flags($owner_id,$user);
                    array_push($items,
                        array(
                            'id'        => $i['Note']['id'], 
                            'note'      => $i['Note']['note'], 
                            'available_to_siblings' => $i['Note']['available_to_siblings'],
                            'owner'     => $owner,
                            'delete'    => $afs['delete']
                        )
                    );
                }
            }
        } 
        $this->set(array(
            'items'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'items')
        ));
    }

    public function note_add(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //Get the creator's id
        if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }

        //Make available to siblings check
        if(isset($this->request->data['available_to_siblings'])){
            $this->request->data['available_to_siblings'] = 1;
        }else{
            $this->request->data['available_to_siblings'] = 0;
        }

        $success    = false;
        $msg        = array('message' => __('Could not create note'));
        $this->FinMyGateToken->FinMyGateTokenNote->Note->create(); 
        //print_r($this->request->data);
        if ($this->FinMyGateToken->FinMyGateTokenNote->Note->save($this->request->data)) {
            $d                      = array();
            $d['FinMyGateTokenNote']['fin_my_gate_token_id']   = $this->request->data['for_id'];
            $d['FinMyGateTokenNote']['note_id'] = $this->FinMyGateToken->FinMyGateTokenNote->Note->id;
            $this->FinMyGateToken->FinMyGateTokenNote->create();
            if ($this->FinMyGateToken->FinMyGateTokenNote->save($d)) {
                $success = true;
            }
        }

        if($success){
            $this->set(array(
                'success' => $success,
                '_serialize' => array('success')
            ));
        }else{
             $this->set(array(
                'success' => $success,
                'message' => $message,
                '_serialize' => array('success','message')
            ));
        }
    }

    public function note_del(){

        if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag  = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:   
            $item       = $this->FinMyGateToken->FinMyGateTokenNote->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->FinMyGateToken->FinMyGateTokenNote->Note->id = $this->data['id'];
                    $this->FinMyGateToken->FinMyGateTokenNote->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->FinMyGateToken->FinMyGateTokenNote->Note->id = $this->data['id'];
                $this->FinMyGateToken->FinMyGateTokenNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->FinMyGateToken->FinMyGateTokenNote->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->FinMyGateToken->FinMyGateTokenNote->Note->id = $d['id'];
                        $this->FinMyGateToken->FinMyGateTokenNote->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->FinMyGateToken->FinMyGateTokenNote->Note->id = $d['id'];
                    $this->FinMyGateToken->FinMyGateTokenNote->Note->delete($d['id'],true);
                }
   
            }
        }

        if($fail_flag == true){
            $this->set(array(
                'success'   => false,
                'message'   => array('message' => __('Could not delete some items')),
                '_serialize' => array('success','message')
            ));
        }else{
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }
    }

    //----- Menus ------------------------
    public function menu_for_grid(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        //Empty by default
        $menu = array();

        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin

            $menu = array(
                array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                    array(
						'xtype' 	=> 'button',
						'glyph'     => Configure::read('icnReload'),
						'scale' 	=> 'large', 
						'itemId' 	=> 'reload',   
						'tooltip'	=> __('Reload')
					),
                    array(
						'xtype' 	=> 'button',
						'iconCls' 	=> 'b-add',
						'glyph'     => Configure::read('icnAdd'),
						'scale' 	=> 'large', 
						'itemId' 	=> 'add',
						'tooltip'	=> __('Add')
					),
                    array(
						'xtype' 	=> 'button',
						'iconCls' 	=> 'b-delete',  
						'glyph'     => Configure::read('icnDelete'),
						'scale' 	=> 'large', 
						'itemId' 	=> 'delete',   
						'tooltip'	=> __('Delete')
					),
                    array(
						'xtype' 	=> 'button',
						'iconCls' 	=> 'b-edit',
						'glyph'     => Configure::read('icnEdit'),
						'scale' 	=> 'large', 
						'itemId' 	=> 'edit',    
						'tooltip'	=> __('Edit')
					)
                )),
                array('xtype' => 'buttongroup','title' => __('Document'), 'width' => 100, 'items' => array(
                    array(
                        'xtype'     => 'button',
                        'glyph'     => Configure::read('icnNote'), 
                        'scale'     => 'large',
                        'itemId'    => 'note',
                        'tooltip'   => __('Add Notes')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnCsv'),   
                        'scale'     => 'large',
                        'itemId'    => 'csv',      
                        'tooltip'   => __('Export CSV')
                    ),
                )),
				array('xtype' => 'buttongroup','title' => __('Extra actions'), 'width' => 100, 'items' => array(
                    array(
                        'xtype'     => 'button',
                        'glyph'     => Configure::read('icnStar'), 
                        'scale'     => 'large',
                        'itemId'    => 'tokenize',
                        'tooltip'   => __('Tokenize user')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnGrid'),   
                        'scale'     => 'large',
                        'itemId'    => 'batch',      
                        'tooltip'   => __('Generate new transaction batch')
                    ),
                ))        
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
    }


    function _build_common_query($user){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']   = array(
                            'FinMyGateTokenNote'    => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'User',
							'PermanentUser',
							'FinPaymentPlan'
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'FinMyGateToken.created';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            if($this->request->query['sort'] == 'owner'){
                $sort = 'User.username';
            }else{
                $sort = $this->modelClass.'.'.$this->request->query['sort'];
            }
            $dir  = $this->request->query['dir'];
        } 
        $c['order'] = array("$sort $dir");
        //==== END SORT ===


        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){
                if(isset($f->type)){
                    //Strings
                    if($f->type == 'string'){
                        if($f->field == 'owner'){
                            array_push($c['conditions'],array("User.username LIKE" => '%'.$f->value.'%'));   
                        }else{
                            $col = $this->modelClass.'.'.$f->field;
                            array_push($c['conditions'],array("$col LIKE" => '%'.$f->value.'%'));
                        }
                    }
                    //Bools
                    if($f->type == 'boolean'){
                         $col = $this->modelClass.'.'.$f->field;
                         array_push($c['conditions'],array("$col" => $f->value));
                    }
                }
            }
        }
        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show the Components which he is allowed to see.
        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $tree_array = array();
            $user_id    = $user['id'];

            //**AP and upward in the tree**
            $this->parents = $this->User->getPath($user_id,'User.id');
            //So we loop this results asking for the parent nodes who have available_to_siblings = true
            foreach($this->parents as $i){
                $i_id = $i['User']['id'];
                if($i_id != $user_id){ //upstream
                    array_push($tree_array,array($this->modelClass.'.user_id' => $i_id,$this->modelClass.'.available_to_siblings' => true));
                }else{
                    array_push($tree_array,array('FinMyGateToken.user_id' => $i_id));
                }
            }
            //** ALL the AP's children
            $ap_children    = $this->User->find_access_provider_children($user['id']);
            if($ap_children){   //Only if the AP has any children...
                foreach($ap_children as $i){
                    $id = $i['id'];
                    array_push($tree_array,array($this->modelClass.'.user_id' => $id));
                }       
            }       
            //Add it as an OR clause
            array_push($c['conditions'],array('OR' => $tree_array));  
        }       
        //====== END AP FILTER =====      
        return $c;
    }

    private function _get_action_flags($owner_id,$user){
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            return array('update' => true, 'delete' => true);
        }

        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $user_id = $user['id'];

            //test for self
            if($owner_id == $user_id){
                return array('update' => true, 'delete' => true );
            }
            //Test for Parents
            foreach($this->parents as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => false, 'delete' => false );
                }
            }

            //FIXME This will not fly when the AP creates many Permanent Users!!!!
            //Test for Children
            foreach($this->children as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => true, 'delete' => true);
                }
            }  
        }
    }

//-----------------------------------------------

    private function _find_parents($id){

        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($id);
        $path_string= '';
        if($q_r){

            foreach($q_r as $line_num => $i){
                $username       = $i['User']['username'];
                if($line_num == 0){
                    $path_string    = $username;
                }else{
                    $path_string    = $path_string.' -> '.$username;
                }
            }
            if($line_num > 0){
                return $username." (".$path_string.")";
            }else{
                return $username;
            }
        }else{
            return __("orphaned");
        }
    }

	private function _is_sibling_of($parent_id,$user_id){
        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($user_id);
        if($q_r){
            foreach($q_r as $i){
                $id = $i['User']['id'];
                if($id == $parent_id){
                    return true;
                }
            }
        }
        //No match
        return false;
    }
//-----------------------------------------------

	private function _get_token(){

		//We will use $this->request->data['permanent_user_id'] for both pin and uci
		Configure::load('MyGate');
		$url 			= Configure::read('my_gate.url_add_pin');
		$merchant_id 	= Configure::read('my_gate.merchant_id');
		$application_id = Configure::read('my_gate.application_id');
		$card_type 		= Configure::read('my_gate.card_type');

		//These should have been included already...
		$permanent_user_id	= $this->request->data['permanent_user_id'];
		$client_pin			= $permanent_user_id;
		$client_uci			= $permanent_user_id;
		$card_holder		= $this->request->data['card_holder'];
		$card_number		= $this->request->data['card_number'];
		$expiry_month		= $this->request->data['expiry_month'];
		$expiry_year		= $this->request->data['expiry_year'];

		$client 			= new SoapClient($url);
		$arrResults 		= $client->fLoadPinCC(
			$merchant_id,
			$application_id,
			$card_number,
			$card_holder,
			$expiry_month,
			$expiry_year,
			$card_type,
			$client_pin,
			$client_uci
		);

		$return_array = array();

		foreach ($arrResults as $result){
			$pieces = explode("||", $result);
			$key 	= $pieces[0];
			$value	= $pieces[1];
			if($key == 'ErrorCode'){
				array_shift($pieces);
				$value = implode(" ", $pieces);
			}
			$return_array["$key"] = $value;
		}

		return $return_array;
	}


}
