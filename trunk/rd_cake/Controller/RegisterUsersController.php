<?php
class RegisterUsersController extends AppController {

    public $name       = 'RegisterUsers';
    public $uses       = array('User','Profile','Realm');

	public function new_permanent_user(){


		//Some dummy data
		//$data 			= array('username' => 'dvdwalt1', 'password' => 'dvdwalt');

		//
		Configure::load('RegisterUsers');

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
         
        // The data to send to the API
        $postData = array(
            'active'        => $active,
            'cap_data'      => $cap_data,
            'language'      => $language,
            'user_id'     	=> $parent_id,
            'profile_id'    => $profile_id,
            'realm_id'      => $realm_id,
            'token'         => $token,
            'username'      => $this->request->data['username'],
            'password'      => $this->request->data['password'],
			'extra_name'	=> 'mac',
			'extra_value'	=> $this->request->data['mac'],
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
			$this->set(array(
            'success'   => $responseData['success'],
			'data'		=> $postData,
		        '_serialize' => array('success','data')
		    ));	
		}
	}
}
?>
