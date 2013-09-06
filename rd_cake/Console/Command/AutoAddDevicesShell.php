<?
class AutoAddDevicesShell extends AppShell {

    public $uses    = array('Users','AutoDevice','Device');
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
            
        }
    }
}

?>
