<?
class VoucherShell extends AppShell {

    public $uses    = array('Radcheck','Radacct','Voucher','Radusergroup','Radgroupcheck');
    public $tasks   = array('Counters','Usage');

    public function main() {
        $qr = $this->Voucher->find('all',
            array('conditions' => 
                array('OR'=> 
                    array(array('Voucher.status' => 'new'),array('Voucher.status' => 'used'))
                )
            ));

        foreach($qr as $i){
            $this->process_voucher($i['Voucher']['name']);
        }
    }

    private function process_voucher($name){

        $this->out("<info>Voucher => $name</info>");

        //Test for depleted
        $time_left_from_login = $this->Usage->time_left_from_login($name);
        if($time_left_from_login){
            if($time_left_from_login == 'depleted'){
                //Mark time usage as 100% and voucher as depleted
                $q_r = $this->Voucher->findByName($name);
                if($q_r){
                    $this->Voucher->id              = $q_r['Voucher']['id'];
                    $d['Voucher']['id']             = $q_r['Voucher']['id'];
                    $d['Voucher']['precede']        = '';
                    $d['Voucher']['perc_time_used'] = 100;
                    $d['Voucher']['status']         = 'depleted';
                    $this->Voucher->save($d);
                }
            }
        }

        //Test for expired
         $time_left_from_expire = $this->Usage->time_left_from_expire($name);
        if($time_left_from_expire){
            if($time_left_from_expire == 'expired'){
                //Mark time usage as 100% and voucher as expired
                $q_r = $this->Voucher->findByName($name);
                if($q_r){
                    $this->Voucher->id              = $q_r['Voucher']['id'];
                    $d['Voucher']['id']             = $q_r['Voucher']['id'];
                    $d['Voucher']['precede']        = '';
                    $d['Voucher']['perc_time_used'] = 100;
                    $d['Voucher']['status']         = 'expired';
                    $this->Voucher->save($d);
                }
            }
        }
    }
}

?>
