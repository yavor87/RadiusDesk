<?php
class EmailVouchersShell extends AppShell {

    public $uses    = array('Voucher','EmailMessage');
    private $title  = "Internet Voucher";
    private $message= "Here is your Internet Voucher";

    public function main() {
        $this->out("<comment>Send out the vouchers that were created with the CSV import ".APP." </comment>");
        $this->out("<comment>These vouchers should have (if email included) in the extra_name field mail_not_sent</comment>");
        $this->out("<comment>If there are an option message to include the mail_not_sent_<id> will have the email_)messages id</comment>");
        $this->out("<comment>The email addy will be in the extra_value field</comment>");
        
        $this->Voucher->contain();
        $q_r = $this->Voucher->find('all',array('conditions' => array('Voucher.extra_name LIKE' => 'mail_not_sent_%')));
        foreach($q_r as $v){
            print_r($v);
            $email = $v['Voucher']['extra_value'];
            $email = filter_var($email, FILTER_SANITIZE_EMAIL);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL) === true) {
                $this->out("<info>Email $email did not pass the sanioty checks</info>");
            }else{
                $voucher_id = $v['Voucher']['id'];
                $extra_name = $v['Voucher']['extra_name'];
                
                $message_id = false;
                if(preg_match("/^mail_not_sent_/",$extra_name)){
                    $pieces = explode("_not_sent_", $extra_name);
                    $message_id = $pieces[1];
                }
                if($message_id){
                    $message = $this->EmailMessage->findById($message_id);
                    print_r($message);
                    $this->Title    = $message['EmailMessage']['title'];
                    $this->Message  = $message['EmailMessage']['message'];
                }
                
                //DUMMY NOW we need to send out the email.....
                
                
                //Then we mark it as sent
                $this->Voucher->id = $voucher_id;
                $new_exta_name = 'mail_sent';
                if($message_id){
                    $new_exta_name = 'mail_sent_'.$message_id;
                }
                $this->Voucher->saveField('extra_name', $new_exta_name);   
            } 
        }
    }
}

?>
