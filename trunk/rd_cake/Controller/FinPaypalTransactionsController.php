<?php
App::uses('AppController', 'Controller');

class FinPaypalTransactionsController extends AppController {

    public $name       = 'FinPaypalTransactions';
    public $components = array('Aa');
    public $uses       = array('FinPaypalTransaction','User');
    protected $base    = "Access Providers/Controllers/FinPaypalTransactions/";

    //Some paypal specifics - change to suit your app
    protected   $paypal_server = "https://www.sandbox.paypal.com/cgi-bin/webscr"; //Sandbox
    //protected   $paypal_server = "https://www.paypal.com/cgi-bin/webscr"; //Production
    protected   $paypal_user_id = 44;

    public function index(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $c = $this->_build_common_query($user); 


        //===== PAGING (MUST BE LAST) ======
        $limit  = 50;   //Defaults
        $page   = 1;
        $offset = 0;
        if(isset($this->request->query['limit'])){
            $limit  = $this->request->query['limit'];
            $page   = $this->request->query['page'];
            $offset = $this->request->query['start'];
        }

        $c_page             = $c;
        $c_page['page']     = $page;
        $c_page['limit']    = $limit;
        $c_page['offset']   = $offset;

        $total  = $this->{$this->modelClass}->find('count',$c);       
        $q_r    = $this->{$this->modelClass}->find('all',$c_page);

        //print_r($q_r);

        $items      = array();

        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }

    public function paypal_ipn(){
        $this->_confirm_paypal_ipn();
        exit;
    }

    public function note_index(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        $items = array();
        if(isset($this->request->query['for_id'])){
            $tag_id = $this->request->query['for_id'];
            $q_r    = $this->FinPaypalTransaction->FinPaypalTransactionNote->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('FinPaypalTransactionNote.fin_paypal_transaction_id' => $tag_id)
                )
            );
            foreach($q_r as $i){
                if(!$this->_test_for_private_parent($i['Note'],$user)){
                    $owner_id   = $i['Note']['user_id'];
                    $owner      = $this->_find_parents($owner_id);
                    $afs        = $this->_get_action_flags($owner_id,$user);
                    array_push($items,
                        array(
                            'id'        => $i['Note']['id'], 
                            'note'      => $i['Note']['note'], 
                            'available_to_siblings' => $i['Note']['available_to_siblings'],
                            'owner'     => $owner,
                            'delete'    => $afs['delete']
                        )
                    );
                }
            }
        } 
        $this->set(array(
            'items'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'items')
        ));
    }

    public function note_add(){

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        //Get the creator's id
        if($this->request->data['user_id'] == '0'){ //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }

        //Make available to siblings check
        if(isset($this->request->data['available_to_siblings'])){
            $this->request->data['available_to_siblings'] = 1;
        }else{
            $this->request->data['available_to_siblings'] = 0;
        }

        $success    = false;
        $msg        = array('message' => __('Could not create note'));
        $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->create(); 
        //print_r($this->request->data);
        if ($this->FinPaypalTransaction->FinPaypalTransactionNote->Note->save($this->request->data)) {
            $d                      = array();
            $d['FinPaypalTransaction']['fin_paypal_transaction_id']   = $this->request->data['for_id'];
            $d['FinPaypalTransaction']['note_id'] = $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->id;
            $this->FinPaypalTransaction->FinPaypalTransactionNote->create();
            if ($this->FinPaypalTransaction->FinPaypalTransactionNote->save($d)) {
                $success = true;
            }
        }

        if($success){
            $this->set(array(
                'success' => $success,
                '_serialize' => array('success')
            ));
        }else{
             $this->set(array(
                'success' => $success,
                'message' => $message,
                '_serialize' => array('success','message')
            ));
        }
    }

    public function note_del(){

        if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag  = false;

	    if(isset($this->data['id'])){   //Single item delete
            $message = "Single item ".$this->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:   
            $item       = $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->id = $this->data['id'];
                    $this->FinPaypalTransaction->FinPaypalTransactionMacNote->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->id = $this->data['id'];
                $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->id = $d['id'];
                        $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->id = $d['id'];
                    $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->delete($d['id'],true);
                }
   
            }
        }

        if($fail_flag == true){
            $this->set(array(
                'success'   => false,
                'message'   => array('message' => __('Could not delete some items')),
                '_serialize' => array('success','message')
            ));
        }else{
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }
    }

    function _build_common_query($user){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        //What should we include....
        $c['contain']   = array(
                            'FinPaypalTransactionNote'    => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'User',
                            'Voucher'
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'FinPaypalTransaction.txn_id';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            if($this->request->query['sort'] == 'owner'){
                $sort = 'User.username';
            }else{
                $sort = $this->modelClass.'.'.$this->request->query['sort'];
            }
            $dir  = $this->request->query['dir'];
        } 
        $c['order'] = array("$sort $dir");
        //==== END SORT ===


        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter = json_decode($this->request->query['filter']);
            foreach($filter as $f){
                if(isset($f->type)){
                    //Strings
                    if($f->type == 'string'){
                        if($f->field == 'owner'){
                            array_push($c['conditions'],array("User.username LIKE" => '%'.$f->value.'%'));   
                        }else{
                            $col = $this->modelClass.'.'.$f->field;
                            array_push($c['conditions'],array("$col LIKE" => '%'.$f->value.'%'));
                        }
                    }
                    //Bools
                    if($f->type == 'boolean'){
                         $col = $this->modelClass.'.'.$f->field;
                         array_push($c['conditions'],array("$col" => $f->value));
                    }
                }
            }
        }
        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show the Components which he is allowed to see.
        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $tree_array = array();
            $user_id    = $user['id'];

            //**AP and upward in the tree**
            $this->parents = $this->User->getPath($user_id,'User.id');
            //So we loop this results asking for the parent nodes who have available_to_siblings = true
            foreach($this->parents as $i){
                $i_id = $i['User']['id'];
                if($i_id != $user_id){ //upstream
                    array_push($tree_array,array($this->modelClass.'.user_id' => $i_id,$this->modelClass.'.available_to_siblings' => true));
                }else{
                    array_push($tree_array,array('FinPaypalTransactio.user_id' => $i_id));
                }
            }
            //** ALL the AP's children
            $ap_children    = $this->User->find_access_provider_children($user['id']);
            if($ap_children){   //Only if the AP has any children...
                foreach($ap_children as $i){
                    $id = $i['id'];
                    array_push($tree_array,array($this->modelClass.'.user_id' => $id));
                }       
            }       
            //Add it as an OR clause
            array_push($c['conditions'],array('OR' => $tree_array));  
        }       
        //====== END AP FILTER =====      
        return $c;
    }

    private function _get_action_flags($owner_id,$user){
        if($user['group_name'] == Configure::read('group.admin')){  //Admin
            return array('update' => true, 'delete' => true);
        }

        if($user['group_name'] == Configure::read('group.ap')){  //AP
            $user_id = $user['id'];

            //test for self
            if($owner_id == $user_id){
                return array('update' => true, 'delete' => true );
            }
            //Test for Parents
            foreach($this->parents as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => false, 'delete' => false );
                }
            }

            //FIXME This will not fly when the AP creates many Permanent Users!!!!
            //Test for Children
            foreach($this->children as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => true, 'delete' => true);
                }
            }  
        }
    }

//-----------------------------------------------
    private function _confirm_paypal_ipn(){

        // STEP 1: read POST data
        // Reading POSTed data directly from $_POST causes serialization issues with array data in the POST.
        // Instead, read raw POST data from the input stream. 
        $raw_post_data      = file_get_contents('php://input');
        $raw_post_array     = explode('&', $raw_post_data);
        $myPost             = array();
        foreach ($raw_post_array as $keyval) {
          $keyval           = explode ('=', $keyval);
          if (count($keyval) == 2)
             $myPost[$keyval[0]] = urldecode($keyval[1]);
        }
        // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
        $req = 'cmd=_notify-validate';
        if(function_exists('get_magic_quotes_gpc')) {
           $get_magic_quotes_exists = true;
        }
        foreach ($myPost as $key => $value) {
           if($get_magic_quotes_exists == true && get_magic_quotes_gpc() == 1) {
                $value = urlencode(stripslashes($value));
           } else {
                $value = urlencode($value);
           }
           $req .= "&$key=$value";
        }


        // STEP 2: POST IPN data back to PayPal to validate

        //$ch = curl_init('https://www.paypal.com/cgi-bin/webscr');
        $ch = curl_init($this->paypal_server);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));


        // In wamp-like environments that do not come bundled with root authority certificates,
        // please download 'cacert.pem' from "http://curl.haxx.se/docs/caextract.html" and set 
        // the directory path of the certificate as shown below:
        // curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__) . '/cacert.pem');
        if( !($res = curl_exec($ch)) ) {
            // error_log("Got " . curl_error($ch) . " when processing IPN data");
            curl_close($ch);
            exit;
        }
        curl_close($ch);


        // STEP 3: Inspect IPN validation result and act accordingly

        if (strcmp ($res, "VERIFIED") == 0) {
            // The IPN is verified, process it:
            // check whether the payment_status is Completed
            // check that txn_id has not been previously processed
            // check that receiver_email is your Primary PayPal email
            // check that payment_amount/payment_currency are correct
            // process the notification

            $list_of_fields     = array(
                'txn_id',       'payer_email',  'mc_fee',       'business',
                'first_name',   'item_number',  'item_name',    'option_selection1',
                'last_name',    'payer_id',     'payer_status', 'payment_gross','mc_gross',
                'payment_date', 'payment_status','mc_currency', 'option_name1'
            );

            $trans_data                                     = array();
            $trans_data['user_id']  = $this->paypal_user_id;
            foreach($list_of_fields as $field){
                if (array_key_exists($field, $_POST) == true) {
                    $trans_data["$field"] = $_POST["$field"];
                }
            }
            $txn_id = $_POST['txn_id'];
            $q_r = $this->{$this->modelClass}->find('first', array('conditions' => array('FinPaypalTransaction.txn_id' => $txn_id)));
            if($q_r){
                $trans_data['id'] = $q_r['id'];
                $this->{$this->modelClass}->save($trans_data);
            }else{   
                $this->{$this->modelClass}->save($trans_data);
            }

            if($payment_status == 'Completed'){
                //Check if we perhaps have not already created a voucher for this transaction

            }

            $file               = fopen("/tmp/paypal_feedback.txt","w");
            foreach($_POST as $key => $value) {
              echo $key." = ". $value."<br>";
              echo fwrite($file,"$key = $value\n");
            }
            fclose($file);

        } else if (strcmp ($res, "INVALID") == 0) {
            // IPN invalid, log for manual investigation
            echo "The response from IPN was: <b>" .$res ."</b>";
        }
    }

//-----------------------------------------------
}
