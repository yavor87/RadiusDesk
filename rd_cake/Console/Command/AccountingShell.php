<?
class AccountingShell extends AppShell {

    public $uses = array('NewAccounting','Radcheck','Radacct','Voucher','User','Device','Radusergroup','Radgroupcheck');

    public function main() {
        $qr = $this->NewAccounting->find('all');
        foreach($qr as $i){
            $this->process_username($i['NewAccounting']['username']);
        }

    }

    private function process_username($username){

        //find type
        $this->out("<info>Test the usertype of $username</info>");
        $type = $this->find_type($username);
        if($type == 'voucher'){
            $this->out("<info>$username is a Voucher</info>");
            $this->do_voucher($username);
        }
    }

    private function find_type($username){
        $type = 'unknown';
        $q_r = $this->Radcheck->find('first',array('conditions' => array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-User-Type')));
        if($q_r){
            $type = $q_r['Radcheck']['value'];
        }
        return $type;
    }

    private function do_voucher($username){

        //Test to see if the voucher has a time based or data based counter
        $counters = $this->find_counters($username);
        print_r($counters);
    }

    private function find_counters($username){

        $counters           = array();
        $counters['time']   = array();
        $counters['data']   = array();

        $profile            = false;
        $q_r = $this->Radcheck->find('first',array('conditions' => array('Radcheck.username' => $username,'Radcheck.attribute' => 'User-Profile')));
        if($q_r){
            $profile = $q_r['Radcheck']['value'];
        }

        if($profile){
            $this->Radusergroup->contain();
            $q_r = $this->Radusergroup->find('all', array('conditions' => array('Radusergroup.username' => $profile)));
            if($q_r){
                foreach($q_r as $i){
                    $groupname  = $i['Radusergroup']['groupname'];

                    //See if there is a time counter defined
                    $tc         = $this->find_time_counter($groupname);
                    if($tc){
                        $counters['time'] = $tc;
                    }

                    //See if there is a data counter defined
                    $dc         =  $this->find_data_counter($groupname);
                    if($dc){
                        $counters['data'] = $dc;
                    }
                }
            } 
        }
        return $counters;
    }

    private function find_time_counter($groupname){
        $counter = false;
        $cap     = $this->query_radgroupcheck($groupname,'Rd-Cap-Type-Time');
        if($cap){
            $counter            = array();
            $counter['cap']     = $cap;
            $counter['reset']   = $this->query_radgroupcheck($groupname,'Rd-Reset-Type-Time');
            $counter['value']   = $this->query_radgroupcheck($groupname,'Rd-Total-Time');
        }
        return $counter;
    }

    private function find_data_counter($groupname){
        $counter = false;
        $cap     = $this->query_radgroupcheck($groupname,'Rd-Cap-Type-Data');
        if($cap){
            $counter = array();
            $counter['cap']     = $cap;
            $counter['reset']   = $this->query_radgroupcheck($groupname,'Rd-Reset-Type-Data');
            $counter['value']   = $this->query_radgroupcheck($groupname,'Rd-Total-Data');
        }
        return $counter;
    }

    private function query_radgroupcheck($groupname,$attribute){
        $retval = false;
        $this->Radgroupcheck->contain();
        $q_r = $this->Radgroupcheck->find('first',
            array('conditions' => array('Radgroupcheck.groupname' => $groupname, 'Radgroupcheck.attribute' => $attribute)
        ));
        if($q_r){
            $retval = $q_r['Radgroupcheck']['value'];
        }
        return $retval;
    }
}

?>
