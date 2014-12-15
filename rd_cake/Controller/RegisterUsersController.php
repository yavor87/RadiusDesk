<?php
class RegisterUsersController extends AppController {

    public $name       = 'RegisterUsers';
    public $uses       = array('User');

	public function new_permanent_user(){

		$data = array('profile' => true);
		$this->set(array(
            'success'   => true,
            'data'      => $data,
            '_serialize' => array('success','data')
        ));	
	}
}
?>
