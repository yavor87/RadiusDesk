<?php
class RegisterUsersController extends AppController {

    public $name       = 'RegisterUsers';
    public $uses       = array('User','Profile','Realm','PermanentUser');

	public function new_permanent_user(){


		//Some dummy data
		//$data 			= array('username' => 'dvdwalt', 'password' => 'dvdwalt');

		//
		Configure::load('RegisterUsers');

		//--Do the MAC test --
		$mac = '';
		if(array_key_exists('mac',$this->request->data)){
			$mac = $this->request->data['mac'];
		}

		$force_mac = Configure::read('register_users.default.force_mac');
		if($force_mac){
			if(array_key_exists('mac',$this->request->data)){
				$mac = $this->request->data['mac'];
				//Check if this MAC did not perhaps alreade registered with us.
				$this->PermanentUser->contain();
				$q_r	= $this->PermanentUser->find('first',
					array('conditions' => 
						array(
							'PermanentUser.extra_name' 	=> 'mac',
							'PermanentUser.extra_value' => $mac,
						)
					));
				if($q_r){
					$already_username = $q_r['PermanentUser']['username'];
					$this->set(array(
						'success'   => false,
						'errors'	=> array('username' => "MAC Address $mac in use by $already_username"),
							'_serialize' => array('success','errors')
					));	
					return;
				}
			}else{

				$this->set(array(
					'success'   => false,
					'errors'	=> array('username' => 'MAC Address missing'),
						'_serialize' => array('success','errors')
				));	
				return;
			}
		}


		//Get the token of the owner
        $owner 		= Configure::read('register_users.default.creator');
		$this->User->contain();
		$q_r 		= $this->User->findByUsername($owner);
		$token		= $q_r['User']['token'];

		//Get the realm id
        $realm 		= Configure::read('register_users.default.realm');
		$this->Realm->contain();
		$q_r 		= $this->Realm->findByName($realm);
		$realm_id	= $q_r['Realm']['id'];

		//Get the profile id
        $profile 	= Configure::read('register_users.default.profile');
		$this->Profile->contain();
		$q_r 		= $this->Profile->findByName($profile);
		$profile_id	= $q_r['Profile']['id'];
		
        $active   	= 'active';
        $cap_data 	= 'hard';
        $language   = '4_4';
        $parent_id  = 0;        
        $url        = 'http://127.0.0.1/cake2/rd_cake/permanent_users/add.json';

		$username	= $this->request->data['username'];
		$password	= $this->request->data['password'];

		//--- ADD ON ---- Expire them after 30 days
		$from_date	=  date("n/j/Y");
		$plus_30  	= mktime(0, 0, 0, date("m"),   date("d")+31,   date("Y")); //We actually put 31 since today is already gone
		$to_date	=  date("n/j/Y",$plus_30);
         
        // The data to send to the API
        $postData = array(
            'active'        => $active,
            'cap_data'      => $cap_data,
            'language'      => $language,
            'user_id'     	=> $parent_id,
            'profile_id'    => $profile_id,
            'realm_id'      => $realm_id,
            'token'         => $token,
            'username'      => $username,
            'password'      => $password,
			'extra_name'	=> 'mac',
			'extra_value'	=> $mac,
			'from_date'		=> $from_date,
			'to_date'		=> $to_date,
        );
     
        // Setup cURL
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
         
            CURLOPT_POST            => TRUE,
            CURLOPT_RETURNTRANSFER  => TRUE,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),
            CURLOPT_POSTFIELDS => json_encode($postData)
        ));
         
        // Send the request
        $response = curl_exec($ch);
         
        // Check for errors
        if($response === FALSE){
            die(curl_error($ch));
        }

		$responseData = json_decode($response, TRUE);
		//print_r($responseData);

        if($responseData['success'] == false){
			$this->set(array(
            'success'   => $responseData['success'],
			'errors'	=> $responseData['errors'],
			'message'	=> $responseData['message'],
		        '_serialize' => array('success','errors','message')
		    ));	
		}

		if($responseData['success'] == true){

			//Check if we need to email them
			if(Configure::read('register_users.default.send_email')){
				$this->_email_user_detail($username,$password);
			}

			$this->set(array(
            'success'   => $responseData['success'],
			'data'		=> $postData,
		        '_serialize' => array('success','data')
		    ));	
		}
	}

	public function lost_password(){

		$this->set(array(
            'success'   => true,
			'data'		=> array(),
		        '_serialize' => array('success','data')
		    ));
	}


	private function _email_user_detail($username,$password){

		$email_server = Configure::read('EmailServer');
        App::uses('CakeEmail', 'Network/Email');
        $Email = new CakeEmail();
        $Email->config($email_server);
        $Email->subject('New user registration');
        $Email->to($username);
        $Email->viewVars(compact( 'username', 'password'));
        $Email->template('user_detail', 'user_notify');
        $Email->emailFormat('html');
        $Email->send();
    }

}
?>
