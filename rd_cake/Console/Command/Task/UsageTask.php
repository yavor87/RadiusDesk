<?php

class UsageTask extends Shell {
    public $uses = array('Radusergroup','Radgroupcheck','Radacct','Radcheck');

    public function find_no_reset_time_usage($username) {
        //We only find the totals reset = never
        $usage = false;
        $this->_show_header('no reset time',$username); 
        $q_r = $this->Radacct->query("SELECT IFNULL(SUM(AcctSessionTime),0) as used FROM radacct WHERE username='$username'");
        $accounting_used = $q_r[0][0]['used'];
        return $accounting_used;
    }

    public function find_no_reset_data_usage($username) {
    //We only find the totals reset = never  
        $usage = false;
        $this->_show_header('no reset data',$username);
        $q_r = $this->Radacct->query("SELECT IFNULL(SUM(acctinputoctets)+SUM(acctoutputoctets),0) as used FROM radacct WHERE username='$username'");
        $accounting_used = $q_r[0][0]['used'];
        return $accounting_used;
    }

    public function time_left_from_login($username){
        $time_left =false;
         //See if it has an exprire from first login value
        $q_r = $this->Radcheck->find('first',array('conditions' => array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Voucher')));
        if($q_r){
            $expire     = $q_r['Radcheck']['value'];
            $pieces     = explode("-", $expire);
            $time_avail = ($pieces[0] * 86400)+($pieces[1] * 3600)+($pieces[2] * 60)+($pieces[3]);
            $time_since_logon = $this->Radacct->query("SELECT (UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(acctstarttime)) as time_since_login from radacct where username='$username' order by acctstarttime ASC LIMIT 1");
            if(!$time_since_logon){
                $time_since_logon = 0;
            }

            $time_left  = $time_avail - $time_since_logon[0][0]['time_since_login'];

            if($time_left <= 0){
                $time_left = 'depleted';  
            }
        }
        return $time_left;
    }

    public function perc_used_from_login($username){
        $perc_used_from_login =false;
         //See if it has an exprire from first login value
        $q_r = $this->Radcheck->find('first',array('conditions' => array('Radcheck.username' => $username,'Radcheck.attribute' => 'Rd-Voucher')));
        if($q_r){
            $expire     = $q_r['Radcheck']['value'];
            $pieces     = explode("-", $expire);
            $time_avail = ($pieces[0] * 86400)+($pieces[1] * 3600)+($pieces[2] * 60)+($pieces[3]);
            $time_since_logon = $this->Radacct->query("SELECT (UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(acctstarttime)) as time_since_login from radacct where username='$username' order by acctstarttime ASC LIMIT 1");

            $perc_used_from_login  = intval(($time_since_logon[0][0]['time_since_login'] / $time_avail)* 100);

            if($perc_used_from_login >= 100){
                $perc_used_from_login = 'depleted';  
            }
        }
        return $perc_used_from_login;
    }


    public function time_left_from_expire($username){
        $time_left =false;
        //See if there is an expiry date check attribute for this voucher
        $q_r = $this->Radcheck->find('first',array('conditions' => array('Radcheck.username' => $username,'Radcheck.attribute' => 'Expiration')));
        if($q_r){
            $exp            = $q_r['Radcheck']['value'];
            //The format should be 6 Mar 2013 - Get the unix timestamp of that
            $exp_in_unix    = $this->_find_unix_timestamp_for_exp($exp);
            $time_left      = $exp_in_unix - time();
            if($time_left <= 0){
                $time_left = 'expired';
            }
        }
        return $time_left;
    }

    private function _show_header($type,$username){
        $this->out('<comment>=============================-=</comment>');
        $this->out("<comment>--Find $type usage for--</comment>");
        $this->out("<comment>-------$username---------</comment>");
        $this->out('<comment>______________________________</comment>');
    }

    private function _find_unix_timestamp_for_exp($exp){

        $pieces     = explode(" ",$exp);
        $day        = $pieces[0];
        $m_string   = $pieces[1];
        $year       = $pieces[2];

        $m_arr      = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        $month      = 1;

        foreach($m_arr as $m){
            if($m_string == $m){
                break;
            }
            $month++;
        }
        $exp_in_unix = mktime(0,0, 0, $day, $month, $year);
        return $exp_in_unix;
    } 
}

?>
