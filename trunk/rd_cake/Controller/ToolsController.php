<?php
App::uses('AppController', 'Controller');

class ToolsController extends AppController {

    public $name        = 'Tools';
    public $uses        = array('Radacct','User','Voucher');

	protected $coova_ip = '127.0.0.1';
	protected $secret   = 'testing123';

    public function active_connections_for(){

		$username 	= $this->request->query['username'];
        $q_r  		= $this->Radacct->find('all',
						array('conditions' => 
							array(
								'Radacct.username' 		=> $username,
								'Radacct.acctstoptime' 	=> null
							)
						)
					   );

        $items      = array();

        foreach($q_r as $i){
			array_push($items,
                array(
					'callingstationid'  => $i['Radacct']['callingstationid'],
					'username'          => $i['Radacct']['username'],
					'framedipaddress'   => $i['Radacct']['framedipaddress'],
					'acctsessionid'		=> $i['Radacct']['acctsessionid']
				)
			);
        }
       
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items','success')
        ));
    }

	public function kick_active_connection(){

		$acctsessionid 	= $this->request->query['acctsessionid'];

		$q_r  			= $this->Radacct->find('first',
							array('conditions' => 
								array(
									'Radacct.acctsessionid' 		=> $acctsessionid
								)
							)
						   );

		$data = array();
		

		if($q_r){
			$username 			= $q_r['Radacct']['username'];

			$device_mac			= $q_r['Radacct']['callingstationid'];
			$device_mac 		= strtoupper($device_mac);
			//If this was a device and not a voucher
			$coova_ip			= $this->coova_ip;
			$secret				= $this->secret;

			exec("echo \"User-Name = $device_mac,Acct-Session-ID = $acctsessionid\"  | radclient -r 2 -t 2 $coova_ip:3799 40 $secret",$output);
			
			$data['username'] 	= $username;
			exec("echo \"User-Name = $username,Acct-Session-ID = $acctsessionid\"  | radclient -r 2 -t 2 $coova_ip:3799 40 $secret",$output);
		}

		//___ FINAL PART ___
        $this->set(array(
            'success' => true,
			'data'		=> $data,
            '_serialize' => array('success','data')
        ));
	}
 
   
}
