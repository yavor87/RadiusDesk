<?php
class AutoAddDevicesShell extends AppShell {

    public $uses    = array('User','AutoDevice','Device','Profile');
    public $tasks   = array('FindMac');

    public function main() {
        $this->out("<comment>Auto Add Devices start ".APP."</comment>");
        $qr = $this->AutoDevice->find('all');
        foreach($qr as $i){
            $this->process_auto_device($i['AutoDevice']['mac'],$i['AutoDevice']['username']);
        }

        //Clear the table for the next lot
        $this->AutoDevice->query('TRUNCATE table auto_devices;');
    }

    private function process_auto_device($mac,$username){
        $this->out("<comment>Checking the following device $mac</comment>");
        $this->Device->contain();
        $count = $this->Device->find('count',array('conditions' => array('Device.name' =>$mac)));
        if($count == 0){
            $this->out("<info>Device $mac not found - Add it</info>");
            $vendor = $this->FindMac->return_vendor_for_mac($mac);
            //Find the Permanent user that this device belongs to:
            $this->User->contain('Radcheck','Group');
            $p_user_name = Configure::read('group.user');
            $q_r = $this->User->find('first',array('conditions' => array('User.username' => $username,'Group.name' => $p_user_name)));
            if($q_r){
               // print_r($q_r);
                //Gather the relevant info (We only need the user_id and profile_id
                $profile_id    = false;
                foreach($q_r['Radcheck'] as $rc){
                    if($rc['attribute'] == 'User-Profile'){
                        $profile    = $rc['value'];
                        $this->Profile->contain();
                        $q        = $this->Profile->findByName($profile);
                        if($q){
                            $profile_id = $q['Profile']['id'];
                        }
                    }
                }
                if($profile_id){
                    $d = array();
                    $d['Device']['profile_id']  = $profile_id;
                    $d['Device']['user_id']     = $q_r['User']['id'];
                    $d['Device']['name']        = $mac;
                    $d['Device']['description'] = "Auto add ( $vendor )";
                    $d['Device']['active']      = 1;
                    $d['Device']['track_auth']  = false;
                    $d['Device']['track_acct']  = true;
                    $this->Device->create();
                    $this->Device->save($d);
                    $this->out("<info>Added device $mac as Auto add ( $vendor )</info>");
                }

            }else{
                $this->out("<warning>User $username not found in Permanent Users</warning>");
            }
        }
    }
}

?>
