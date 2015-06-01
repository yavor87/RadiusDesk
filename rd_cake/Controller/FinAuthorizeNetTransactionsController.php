<?php
App::uses('AppController', 'Controller');

class FinAuthorizeNetTransactionsController extends AppController {

    public $name       = 'FinAuthorizeNetTransactions';
    public $components = array('Aa','VoucherGenerator');
    public $uses       = array('FinAuthorizeNetTransaction','User');

	var $scaffold;

    protected $base    = "Access Providers/Controllers/FinAuthorizeNetTransactions/";

    protected $fields  = array(
	  	'id', 			'user_id',			'voucher_id',			'voucher_name',				'top_up_id',
		'description',	'x_response_code',	'x_response_subcode',	'x_response_reason_code',	'x_response_reason_text',
		'x_auth_code',	'x_avs_code',		'x_trans_id',			'x_method',					'x_card_type',
		'x_account_number',	'x_first_name',	'x_last_name',			'x_company',				'x_addres',
		'x_city',		'x_state',			'x_zip',				'x_country',				'x_phone',
		'x_fax',		'x_email',			'x_amount',				'x_catalog_link_id',		'created',
		'modified',     'tag'
    );

	private $singleField	= true;

	public function receipt(){
		$this->layout = false;
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

		//Some defaults which will get changed if all tests pass
		$voucher_id 	= null;
		$voucher_name	= '';
		$description	= '';
		$success 		= false;

		Configure::load('AuthorizeDotNet');
        $receipt_url = Configure::read('authorize_dot_net.receipt_url');
		$this->set('url', $receipt_url);
		$this->set('x_trans_id','');//Dummy blank

		//Check if we have not recoreded this transaction before...
		if (array_key_exists('x_trans_id', $this->request->data)) {

			$x_trans_id = $this->request->data['x_trans_id'];
			$this->set('x_trans_id',$x_trans_id);
			$q_r = $this->{$this->modelClass}->find('first', 
				array('conditions' => array('FinAuthorizeNetTransaction.x_trans_id' => $x_trans_id))
			);

			if($q_r){
				return;
			}	
		}

		//We need at least a value for: x_catalog_link_id
		if (array_key_exists('x_catalog_link_id', $this->request->data)) {
			$item_id 	= $this->request->data['x_catalog_link_id'];
            $data 		= Configure::read('authorize_dot_net.'.$item_id);

			if($data){
				$description = $data['description'];
				if($this->request->data['x_response_code'] == 1){ //Only if the transaction was OK
					//First we generate a voucher with the info we got from the config file:
					$v  = ClassRegistry::init('Voucher');
					$t_v_names = $v->find('all',array('fields' => array('Voucher.name')));
					foreach($t_v_names as $n){
						$v_name = $n['Voucher']['name'];
						array_push($this->VoucherGenerator->voucherNames,$v_name);
					}

					if($this->singleField){
						$pwd = $this->VoucherGenerator->generateVoucher();
						$data['name']      = $pwd; 
						$data['password']  = $pwd;
					}

				    if($v->save($data)) {
				        $success_flag = true;
				        $voucher_id   = $v->id;
						if (array_key_exists('x_email', $this->request->data)) {
							$payer_email = $this->request->data['x_email'];
							$x_trans_id  = $this->request->data['x_trans_id'];
							if(empty($payer_email)){
								$this->log("Authorize.net -> No valid email address in transaction please do manual intervention");
							}else{
								$this->_email_voucher_detail($payer_email,$voucher_id,$x_trans_id);
							}
						}  
				    }else{
						$this->log("Authorize.net -> Could not create a Voucher for x_catalog_link_id: $item_id please do manual intervention");
            			$this->log($v->validationErrors);
					}
				}

			}else{
				$this->log("Authorize.net -> Failed to find info in AuthorizeDotNet config file for x_catalog_link_id: $item_id please do manual intervention");
			}
		}else{
			$this->log("Authorize.net -> POST from Authorise.Net did not include compulsory **x_catalog_link_id**");
		}

		//We save each POST regardless
		$this->request->data['voucher_id'] 		= $voucher_id;
		$this->request->data['voucher_name'] 	= $voucher_name;
		$this->request->data['description'] 	= $description;

		if($this->{$this->modelClass}->save($this->request->data)){
			$success = true;
		}else{
			$this->log("Authorize.net -> Failed to add Authorize.Net transaction");
            $this->log($this->{$this->modelClass}->validationErrors);
		}
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


        //Here we need to determine the successfull transactions as well as the failed transactions
        //Get some totals to display

        $c_failed               = $c;
        $c_failed['fields']     = array(
                                'sum(FinAuthorizeNetTransaction.x_amount)  as amount',
                            );
        array_push($c_failed['conditions'],array("not" => array ("FinAuthorizeNetTransaction.x_response_reason_code" => '1')));
        $this->{$this->modelClass}->contain();
        $t_failed  = $this->{$this->modelClass}->find('first'  , $c_failed);
        $failed    = $t_failed[0]['amount'];

        $c_passed               = $c;
        $c_passed['fields']     = array(
                                'sum(FinAuthorizeNetTransaction.x_amount)  as amount',
                            );
        array_push($c_passed['conditions'],array ("FinAuthorizeNetTransaction.x_response_reason_code" => '1'));
        $this->{$this->modelClass}->contain();
        $t_passed  = $this->{$this->modelClass}->find('first'  , $c_passed);
        $passed    = $t_passed[0]['amount'];

        $c_total               = $c;
        $c_total['fields']     = array(
                                'sum(FinAuthorizeNetTransaction.x_amount)  as amount',
                            );
        $this->{$this->modelClass}->contain();
        $t_total  = $this->{$this->modelClass}->find('first'  , $c_total);
        $r_total  = $t_total[0]['amount'];


     
        $q_r    = $this->{$this->modelClass}->find('all',$c_page);

        //print_r($q_r);

        $items      = array();

         foreach($q_r as $i){

           // print_r($i);
            $row = array();
            foreach($this->fields as $field){
                if(array_key_exists($field,$i['FinAuthorizeNetTransaction'])){

                    $row["$field"]= $i['FinAuthorizeNetTransaction']["$field"];
                }
            }

            //Create notes flag
            $notes_flag  = false;
            foreach($i['FinAuthorizeNetTransactionNote'] as $nn){
                if(!$this->_test_for_private_parent($nn['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

            //Voucher id and name
            if($i['FinAuthorizeNetTransaction']['voucher_id'] != ''){
                $row['voucher_name'] = "Orphaned!"; //Default
            }

            if($i['Voucher']['id'] != null){
                $row['voucher_id']      = $i['Voucher']['id'];
                $row['voucher_name']    = $i['Voucher']['name'];
            }

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
            'failed'    => $failed,
            'passed'    => $passed,
            'total'     => $r_total,
            '_serialize' => array('items','success','totalCount','failed','passed','total')
        ));
    }

    public function voucher_info_for(){

        if(!(isset($this->request->query['x_trans_id']))){
            $this->set(array(
                'message'   => "Missing x_trans_id in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;
        }

        $x_trans_id = $this->request->query['x_trans_id'];

        $data = array();
        $q_r = $this->{$this->modelClass}->find('first', 
				array('conditions' => array('FinAuthorizeNetTransaction.x_trans_id' => $x_trans_id))
		);

        if($q_r){
            $voucher_id = $q_r['FinAuthorizeNetTransaction']['voucher_id'];
            if($voucher_id != ''){
                $v  = ClassRegistry::init('Voucher');
                $voucher_id = $q_r['FinAuthorizeNetTransaction']['voucher_id'];
                $q  = $v->findById($voucher_id);
                if($q){
                    $username       = $q['Voucher']['name'];
                    $password       = $q['Voucher']['password'];
                    $valid_for      = $q['Voucher']['time_valid'];
                    $profile        = $q['Voucher']['profile'];
                    $extra_name     = $q['Voucher']['extra_name'];
                    $extra_value     = $q['Voucher']['extra_value'];
                    $this->set(array(
                        'data'   => array('username' => $username,'password' => $password,'profile' => $profile,'valid_for' => $valid_for),
                        'success' => true,
                        '_serialize' => array('success','data')
                    ));
                    return;

                }
            }else{
               $this->set(array(
                    'message'   => "Authorize.Net Reference: $x_trans_id has no voucher associated to it - please contact helpdesk",
                    'success' => false,
                    '_serialize' => array('success','message')
                ));
                return;
            }

        }else{
			
            $this->set(array(
                'message'   => "No data available for Authorize.net transaction: $x_trans_id",
                'success' => false,
                '_serialize' => array('success','message')
            ));
			/*
			$this->set(array(
                'data'   => array('username'=> "dvdwalt"),
                'success' => true,
                '_serialize' => array('success','data')
            ));*/
            return;
        }
      
        $this->set(array(
            'data' => $data,
            'success' => true,
            '_serialize' => array('data','success')
        ));
    }

    public function voucher_attach(){   //Creates and attaches a voucher based on the transaction details

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        if(!(isset($this->request->query['id']))){
            $this->set(array(
                'message'   => "Missing id in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;  
        }
        $success_flag = false;

        $id  = $this->request->query['id'];
        $q_r = $this->{$this->modelClass}->findById($id);

        if($q_r){	//We have found the item, now we need to look it up to see what is in it for us....
		
			Configure::load('AuthorizeDotNet');
        
			$item_id 	= $q_r['FinAuthorizeNetTransaction']['x_catalog_link_id'];
            $data 		= Configure::read('authorize_dot_net.'.$item_id);

            if($data != null){
				$v  = ClassRegistry::init('Voucher');
				$t_v_names = $v->find('all',array('fields' => array('Voucher.name')));
				foreach($t_v_names as $n){
					$v_name = $n['Voucher']['name'];
					array_push($this->VoucherGenerator->voucherNames,$v_name);
				}

				if($this->singleField){
					$pwd = $this->VoucherGenerator->generateVoucher();
					$data['name']      = $pwd; 
		        	$data['password']  = $pwd;
				}

                if($v->save($data)) {
                    $success_flag = true;
                    $voucher_id   = $v->id;
                    $this->{$this->modelClass}->save(
							array(
									'id' 			=> $id,
									'voucher_id'    => $voucher_id,
									'voucher_name' 	=> $pwd,
									'description'	=> $data['description'] //We also update the description again from the config file's data
							));
                }else{

                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $v->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not create item')),
                        '_serialize' => array('errors','success','message')
                    ));
                    return; //Get out of here!
                }
            }else{
                $this->set(array(
                    'success'   => false,
                    'message'   => 'Detail not configured for item (item_name/item_number/option_selection1)',
                    '_serialize' => array('success','message')
                ));
                return;
            }
        }else{
            $this->set(array(
                'success'   => false,
                'message'   => 'Item not found to attach Voucher to it',
                '_serialize' => array('success','message')
            ));
            return;
        }

        $this->set(array(
            'success' => $success_flag,
            '_serialize' => array('success')
        ));
    }

    public function voucher_detach(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        if(!(isset($this->request->query['id']))){
            $this->set(array(
                'message'   => "Missing id in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;  
        }
        $success_flag = false;

        $id  = $this->request->query['id'];
        $q_r = $this->{$this->modelClass}->findById($id);

        if($q_r){

            if($this->{$this->modelClass}->save(array('id' => $id,'voucher_id'    => null, 'description' => '', 'voucher_name' => ''))){
                $success_flag = true;
            }else{
                $message = 'Error';
                $this->set(array(
                    'errors'    => $this->{$this->modelClass}->validationErrors,
                    'success'   => false,
                    'message'   => array('message' => __('Could not detach voucher')),
                    '_serialize' => array('errors','success','message')
                ));
                return; //Get out of here!
            }
        }else{
            $this->set(array(
                'success'   => false,
                'message'   => 'Item not found to detach Voucher from',
                '_serialize' => array('success','message')
            ));
            return;
        }

        $this->set(array(
            'success' => $success_flag,
            '_serialize' => array('success')
        ));
    }

    public function email_voucher_details(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id= $user['id'];

        $id     = $this->request->data['id'];
        $q_r    = $this->{$this->modelClass}->findById($id);
        $to     = $this->request->data['email'];
        $message= $this->request->data['message'];

        if($q_r){
            $v  = ClassRegistry::init('Voucher');
            $voucher_id = $q_r['FinAuthorizeNetTransaction']['voucher_id'];
            $q  = $v->findById($voucher_id);
            if($q){
                $username       = $q['Voucher']['name'];
                $password       = $q['Voucher']['password'];
                $valid_for      = $q['Voucher']['time_valid'];
                $profile        = $q['Voucher']['profile'];
                $extra_name     = $q['Voucher']['extra_name'];
                $extra_value     = $q['Voucher']['extra_value'];
              //  print_r("The username is $username and password is $password");
				$email_server = Configure::read('EmailServer');
                App::uses('CakeEmail', 'Network/Email');
                $Email = new CakeEmail();
                $Email->config($email_server);
                $Email->subject('Your voucher detail');
                $Email->to($to);
                $Email->viewVars(compact( 'username', 'password','valid_for','profile','extra_name','extra_value','message'));
                $Email->template('voucher_detail', 'voucher_notify');
                $Email->emailFormat('html');
                $Email->send();

            }
        }
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
    }

	public function silent_post(){

		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

		//Some defaults which will get changed if all tests pass
		$voucher_id 	= null;
		$voucher_name	= '';
		$description	= '';
		$success 		= false;

		//Check if we have not recoreded this transaction before...
		if (array_key_exists('x_trans_id', $this->request->data)) {

			$x_trans_id = $this->request->data['x_trans_id'];
			$this->set('x_trans_id',$x_trans_id);
			$q_r = $this->{$this->modelClass}->find('first', 
				array('conditions' => array('FinAuthorizeNetTransaction.x_trans_id' => $x_trans_id))
			);

			if($q_r){
				$this->set(array(
				    'success' => true,
				    '_serialize' => array('success')
				));
				return;
			}	
		}

		//We need at least a value for: x_catalog_link_id
		if (array_key_exists('x_catalog_link_id', $this->request->data)) {
			Configure::load('AuthorizeDotNet');
			$item_id 	= $this->request->data['x_catalog_link_id'];
            $data 		= Configure::read('authorize_dot_net.'.$item_id);

			if($data){
				$description = $data['description'];
				if($this->request->data['x_response_code'] == 1){ //Only if the transaction was OK
					//First we generate a voucher with the info we got from the config file:
					$v  = ClassRegistry::init('Voucher');
					$t_v_names = $v->find('all',array('fields' => array('Voucher.name')));
					foreach($t_v_names as $n){
						$v_name = $n['Voucher']['name'];
						array_push($this->VoucherGenerator->voucherNames,$v_name);
					}

					if($this->singleField){
						$pwd = $this->VoucherGenerator->generateVoucher();
						$data['name']      = $pwd; 
						$data['password']  = $pwd;
					}

				    if($v->save($data)) {
				        $success_flag = true;
				        $voucher_id   = $v->id;
						if (array_key_exists('x_email', $this->request->data)) {
							$payer_email = $this->request->data['x_email'];
							$x_trans_id  = $this->request->data['x_trans_id'];
							if(empty($payer_email)){
								$this->log("Authorize.net -> No valid email address in transaction please do manual intervention");
							}else{
								$this->_email_voucher_detail($payer_email,$voucher_id,$x_trans_id);
							}
						}  
				    }else{
						$this->log("Authorize.net -> Could not create a Voucher for x_catalog_link_id: $item_id please do manual intervention");
            			$this->log($v->validationErrors);
					}
				}

			}else{
				$this->log("Authorize.net -> Failed to find info in AuthorizeDotNet config file for x_catalog_link_id: $item_id please do manual intervention");
			}
		}else{
			$this->log("Authorize.net -> POST from Authorise.Net did not include compulsory **x_catalog_link_id**");
		}

		//We save each POST regardless
		$this->request->data['voucher_id'] 		= $voucher_id;
		$this->request->data['voucher_name'] 	= $voucher_name;
		$this->request->data['description'] 	= $description;

		if($this->{$this->modelClass}->save($this->request->data)){
			$success = true;
		}else{
			$this->log("Authorize.net -> Failed to add Authorize.Net transaction");
            $this->log($this->{$this->modelClass}->validationErrors);
		}

		$this->set(array(
            'success' => $success,
            '_serialize' => array('success')
        ));
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
            $q_r    = $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('FinAuthorizeNetTransactionNote.fin_authorize_net_transaction_id' => $tag_id)
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
        $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->create(); 
        //print_r($this->request->data);
        if ($this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->save($this->request->data)) {
            $d                      = array();
            $d['FinAuthorizeNetTransactionNote']['fin_authorize_net_transaction_id']   = $this->request->data['for_id'];
            $d['FinAuthorizeNetTransactionNote']['note_id'] = $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->id;
            $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->create();
            if ($this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->save($d)) {
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
            $item       = $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->id = $this->data['id'];
                    $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->id = $this->data['id'];
                $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->id = $d['id'];
                        $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->id = $d['id'];
                    $this->FinAuthorizeNetTransaction->FinAuthorizeNetTransactionNote->Note->delete($d['id'],true);
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
                        'xtype'     =>  'splitbutton',  
                        'iconCls'   => 'b-reload',
                        'glyph'     => Configure::read('icnReload'),   
                        'scale'     => 'large', 
                        'itemId'    => 'reload',   
                        'tooltip'   => __('Reload'),
                            'menu'  => array( 
                                'items' => array( 
                                    '<b class="menu-title">'.__('Reload every').':</b>',
                                    array( 'text'  => __('30 seconds'),      'itemId'    => 'mnuRefresh30s', 'group' => 'refresh','checked' => false ),
                                    array( 'text'  => __('1 minute'),        'itemId'    => 'mnuRefresh1m', 'group' => 'refresh' ,'checked' => false),
                                    array( 'text'  => __('5 minutes'),       'itemId'    => 'mnuRefresh5m', 'group' => 'refresh', 'checked' => false ),
                                    array( 'text'  => __('Stop auto reload'),'itemId'    => 'mnuRefreshCancel', 'group' => 'refresh', 'checked' => true )
                                   
                                )
                            )
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnCut'),
                        'scale'     => 'large', 
                        'itemId'    => 'detach', 
                        'tooltip'   => __('Detach voucher'),
                        'disabled'  => true
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnAttach'),
                        'scale'     => 'large', 
                        'itemId'    => 'attach', 
                        'tooltip'   => __('Attach voucher'),
                        'disabled'  => true
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnEmail'),
                        'scale'     => 'large', 
                        'itemId'    => 'email', 
                        'tooltip'   => __('e-Mail voucher'),
                        'disabled'  => true
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnMobile'),
                        'scale'     => 'large', 
                        'itemId'    => 'sms', 
                        'tooltip'   => __('SMS voucher'),
                        'disabled'  => true
                    ),
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
                            'FinAuthorizeNetTransactionNote'    => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'User',
                            'Voucher'
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'FinAuthorizeNetTransaction.created';
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

                    if($f->type == 'date'){
                        //date we want it in "2013-03-12"
                        $col = $this->modelClass.'.'.$f->field;
                        if($f->comparison == 'eq'){
                            array_push($c['conditions'],array("DATE($col)" => $f->value));
                        }

                        if($f->comparison == 'lt'){
                            array_push($c['conditions'],array("DATE($col) <" => $f->value));
                        }
                        if($f->comparison == 'gt'){
                            array_push($c['conditions'],array("DATE($col) >" => $f->value));
                        }
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
                    array_push($tree_array,array('FinAuthorizeNetTransaction.user_id' => $i_id));
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
   
    private function _email_voucher_detail($email,$voucher_id,$x_trans_id){

        $v          = ClassRegistry::init('Voucher');
        $voucher_id = $voucher_id;
        $q          = $v->findById($voucher_id);
        if($q){
            $username       = $q['Voucher']['name'];
            $password       = $q['Voucher']['password'];
            $valid_for      = $q['Voucher']['time_valid'];
            $profile        = $q['Voucher']['profile'];
            $extra_name     = $q['Voucher']['extra_name'];
            $extra_value    = $q['Voucher']['extra_value'];
            $message        = '';
			$email_server = Configure::read('EmailServer');
            App::uses('CakeEmail', 'Network/Email');
            $Email = new CakeEmail();
            $Email->config($email_server);
            $Email->subject('AuthorizeNet #'.$x_trans_id);
            $Email->to($email);
            $Email->viewVars(compact( 'username', 'password','valid_for','profile','extra_name','extra_value','message'));
            $Email->template('voucher_detail', 'voucher_notify');
            $Email->emailFormat('html');
            $Email->send();

        }
    }

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
}
