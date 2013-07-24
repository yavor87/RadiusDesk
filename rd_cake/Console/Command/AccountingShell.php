<?
class AccountingShell extends AppShell {

    public $uses    = array('NewAccounting','Radcheck','Radacct','Voucher','User','Device','Radusergroup','Radgroupcheck');
    public $tasks   = array('Counters','Usage');

    public function main() {
        $qr = $this->NewAccounting->find('all');
        foreach($qr as $i){
            $this->process_username($i['NewAccounting']['username']);
        }

        //Clear the table for the next lot
        $this->NewAccounting->query('TRUNCATE table new_accountings;');

    }

    private function process_username($username){

        //find type
        $this->out("<info>Test the usertype of $username</info>");
        $type = $this->find_type($username);

        //____ Vouchers _____
        if($type == 'voucher'){
            $this->out("<info>$username is a Voucher</info>");
            //Find the profile
            $profile = $this->_find_user_profile($username);
            if($profile){
                $counters = $this->Counters->return_counter_data($profile,$type);
                if(array_key_exists('time', $counters)){
                    if($counters['time']['reset'] == 'never'){ //Voucher counters are **Always** suppose to never reset

                        $counters['time']['usage'] = $this->Usage->find_no_reset_time_usage($username);

                        //Calculate the time left
                        $not_depleted = true;
                        $not_expired  = true;
                        $time_left = $counters['time']['value'] - $counters['time']['usage'];

                        //Compare with days_from start time left
                        $time_left_from_login = $this->Usage->time_left_from_login($username);
                        if($time_left_from_login){
                            if($time_left_from_login == 'depleted'){
                                //Mark time usage as 100% and voucher as depleted
                                $q_r = $this->Voucher->findByName($username);
                                if($q_r){
                                    $this->Voucher->id              = $q_r['Voucher']['id'];
                                    $d['Voucher']['id']             = $q_r['Voucher']['id'];
                                    $d['Voucher']['precede']        = '';
                                    $d['Voucher']['perc_time_used'] = 100;
                                    $d['Voucher']['status']         = 'depleted';
                                    $this->Voucher->save($d);
                                }
                                $not_depleted = false;

                            }else{
                                if($time_left_from_login < $time_left){
                                    $time_left = $time_left_from_login;
                                }
                            }
                        }

                        //Compare with time left till expire date
                        $time_left_from_expire = $this->Usage->time_left_from_expire($username);
                        if($time_left_from_expire){
                            if($time_left_from_expire == 'expired'){
                                //Mark time usage as 100% and voucher as expired
                                $q_r = $this->Voucher->findByName($username);
                                if($q_r){
                                    $this->Voucher->id              = $q_r['Voucher']['id'];
                                    $d['Voucher']['id']             = $q_r['Voucher']['id'];
                                    $d['Voucher']['precede']        = '';
                                    $d['Voucher']['perc_time_used'] = 100;
                                    $d['Voucher']['status']         = 'expired';
                                    $this->Voucher->save($d);
                                }
                                $not_expired = false;
                            }else{
                                if($time_left_from_expire < $time_left){
                                    $time_left = $time_left_from_expire;
                                }
                            }
                        }
                        
                        //Calculate the usage and update
                        if(($not_depleted)&&($not_expired)){
                            $perc_time_used = intval((($counters['time']['value']-$time_left) / $counters['time']['value'])* 100);
                            $q_r = $this->Voucher->findByName($username);
                            if($q_r){
                                $this->Voucher->id              = $q_r['Voucher']['id'];
                                $d['Voucher']['id']             = $q_r['Voucher']['id'];
                                $d['Voucher']['precede']        = '';
                                $d['Voucher']['perc_time_used'] = $perc_time_used;
                                $d['Voucher']['status']         = 'used';
                                $this->Voucher->save($d);
                            }
                        }
                    }
                }else{

                    //If there are not a time based counter we at least want to see if there's a countdown from login attribute..
                    $perc_used_from_login = $this->Usage->perc_used_from_login($username);
                    print_r($perc_used_from_login);
                    if($perc_used_from_login){
                        if($perc_used_from_login == 'depleted'){
                            //Mark time usage as 100% and voucher as depleted
                            $q_r = $this->Voucher->findByName($username);
                            if($q_r){
                                $this->Voucher->id              = $q_r['Voucher']['id'];
                                $d['Voucher']['id']             = $q_r['Voucher']['id'];
                                $d['Voucher']['precede']        = '';
                                $d['Voucher']['perc_time_used'] = 100;
                                $d['Voucher']['status']         = 'depleted';
                                $this->Voucher->save($d);
                            }

                        }else{
                            $q_r = $this->Voucher->findByName($username);
                            if($q_r){
                                $this->Voucher->id              = $q_r['Voucher']['id'];
                                $d['Voucher']['id']             = $q_r['Voucher']['id'];
                                $d['Voucher']['precede']        = '';
                                $d['Voucher']['perc_time_used'] = $perc_used_from_login;
                                $d['Voucher']['status']         = 'used';
                                $this->Voucher->save($d);
                            }
                        }
                    }
                }

                if(array_key_exists('data', $counters)){
                    if($counters['data']['reset'] == 'never'){ //Voucher counters are **Always** suppose to never reset
                        $counters['data']['usage'] =$this->Usage->find_no_reset_data_usage($username);
                        $perc_data_used = intval(($counters['data']['usage'] / $counters['data']['value'])* 100);
                        $q_r = $this->Voucher->findByName($username);
                            if($q_r){
                                $this->Voucher->id              = $q_r['Voucher']['id'];
                                $d['Voucher']['id']             = $q_r['Voucher']['id'];
                                $d['Voucher']['precede']        = '';
                                $d['Voucher']['perc_data_used'] = $perc_data_used;
                                $d['Voucher']['status']         = 'used';
                                $this->Voucher->save($d);
                            }
                    }
                }
            }
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

    private function _find_user_profile($username){
        $profile = false;
        $q_r = $this->Radcheck->find('first',array('conditions' => array('Radcheck.username' => $username,'Radcheck.attribute' => 'User-Profile')));
        if($q_r){
            $profile = $q_r['Radcheck']['value'];
        }
        return $profile;
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
            //Rd-Used-Time := "%{sql:SELECT IFNULL(SUM(AcctSessionTime),0) FROM radacct WHERE username='%{request:User-Name}'}"


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
