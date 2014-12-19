<?php
class RegisterUsersController extends AppController {

    public $name       = 'RegisterUsers';
    public $uses       = array('User');

	public function new_permanent_user(){

		$data = array('username' => 'dvdwalt', 'password' => 'dvdwalt');
		$this->set(array(
            'success'   => true,
			'errors'	=> array(
        		'name' 	=> "Client not found",
				'email' => "Already registered - use lost password utility"
    		),
            'data'      => $data,
            '_serialize' => array('success','data','errors')
        ));	
	}
}
?>
