<?php

class AutocloseTask extends Shell {
    public $uses = array('Radacct','Na');

    public function check() {
        $this->_show_header();
        $this->_check();     
    }

    private function _show_header(){
        $this->out('<comment>==============================</comment>');
        $this->out('<comment>---Stale Session Checking-----</comment>');
        $this->out('<comment>-------RADIUSdesk 2013--------</comment>');
        $this->out('<comment>______________________________</comment>');
    }

    

    private function _check(){

        $this->out("<info>AutoClose::Find NAS with Auto close enabled</info>");

        $this->Na->contain(); 
        $q_r = $this->Na->find('all', array('conditions' => array('Na.session_auto_close' => '1')));

        if($q_r){
            foreach($q_r as $item){
                $nasname        = $item['Na']['nasname'];
                $close_after    = $item['Na']['session_dead_time'];
                $this->out("<info>AutoClose::Auto closing potential stale sessions on $nasname after $close_after dead time</info>");
                $this->Radacct->query("UPDATE radacct set acctstoptime=ADDDATE(acctstarttime, INTERVAL acctsessiontime SECOND), acctterminatecause='Clear-Stale-Session' where nasipaddress='$nasname' AND acctstoptime is NULL AND ((UNIX_TIMESTAMP(now()) - (UNIX_TIMESTAMP(acctstarttime)+acctsessiontime))> $close_after)");

                //It may be that the nasidentifier is actually the unique attribute 
                //and not the nasipaddress (espacially when doing Miktoritk!!!)
                $nasidentifier  = $item['Na']['nasidentifier'];
                $this->Radacct->query("UPDATE radacct set acctstoptime=ADDDATE(acctstarttime, INTERVAL acctsessiontime SECOND), acctterminatecause='Clear-Stale-Session' where nasidentifier='$nasidentifier' AND acctstoptime is NULL AND ((UNIX_TIMESTAMP(now()) - (UNIX_TIMESTAMP(acctstarttime)+acctsessiontime))> $close_after)");


            }
        }else{
           $this->out("<info>AutoClose::No NAS devices configured for auto session closing</info>");
        }
    }
}

?>
