<?php
App::uses('AppController', 'Controller');

class FinPaypalTransactionsController extends AppController {

    public $name       = 'FinPaypalTransactions';
    public $components = array('Aa','VoucherGenerator');
    public $uses       = array('FinPaypalTransaction','User');
    protected $base    = "Access Providers/Controllers/FinPaypalTransactions/";

    //Some paypal specifics - change to suit your app
    protected   $paypal_server = "https://www.sandbox.paypal.com/cgi-bin/webscr"; //Sandbox
    //protected   $paypal_server = "https://www.paypal.com/cgi-bin/webscr"; //Production
    protected   $paypal_user_id = 44;

    protected   $fields = array(
        'txn_id',       'payer_email',  'mc_fee',       'business',
        'first_name',   'item_number',  'item_name',    'option_selection1',
        'last_name',    'payer_id',     'payer_status', 'payment_gross','mc_gross',
        'payment_date', 'payment_status','mc_currency', 'option_name1', 'id',
        'voucher_id'
    );

	private $singleField	= true;
	

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

         foreach($q_r as $i){

           // print_r($i);
            $row = array();
            foreach($this->fields as $field){
                if(array_key_exists($field,$i['FinPaypalTransaction'])){

                    $row["$field"]= $i['FinPaypalTransaction']["$field"];
                }
            }

            //Create notes flag
            $notes_flag  = false;
            foreach($i['FinPaypalTransactionNote'] as $nn){
                if(!$this->_test_for_private_parent($nn['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

            //Voucher id and name
            if($i['FinPaypalTransaction']['voucher_id'] != ''){
                $row['voucher_name'] = "Orphaned!"; //Default
            }

            if($i['Voucher']['id'] != null){
                $row['voucher_id']      = $i['Voucher']['id'];
                $row['voucher_name']    = $i['Voucher']['name'];
            }

            $row['notes']       = $notes_flag;
            $row['user_id']     = $i['User']['id'];
            $row['user']        = $i['User']['username'];

            array_push($items,$row);

        }

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

    public function voucher_info_for(){

        if(!(isset($this->request->query['txn_id']))){
            $this->set(array(
                'message'   => "Missing txn_id in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;
        }

        $txn_id = $this->request->query['txn_id'];

        $q_r = $this->{$this->modelClass}->find('first', array('conditions' => array('FinPaypalTransaction.txn_id' => $txn_id)));

        if($q_r){
            $voucher_id = $q_r['FinPaypalTransaction']['voucher_id'];
            if($voucher_id != ''){
                $v  = ClassRegistry::init('Voucher');
                $voucher_id = $q_r['FinPaypalTransaction']['voucher_id'];
                $q  = $v->findById($voucher_id);
                if($q){
                    $username       = $q['Voucher']['name'];
                    $password       = $q['Voucher']['password'];
                    $valid_for      = $q['Voucher']['time_valid'];
                    $profile        = $q['Voucher']['profile'];
                    $extra_name     = $q['Voucher']['extra_name'];
                    $extra_value     = $q['Voucher']['extra_value'];
                    $this->set(array(
                        'data'   => array('username' => $username,'password' => $password,'profile' => $profile,'valid_for' => $valid_for),
                        'success' => true,
                        '_serialize' => array('success','data')
                    ));
                    return;
                }
            }

        }else{
            $this->set(array(
                'message'   => "Do data available for $txn_id",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;
        }
        
        $data = array('username' => 'dirk', 'password' => 'greatsecret');
        $this->set(array(
            'data' => $data,
            'success' => true,
            '_serialize' => array('data','success')
        ));
    }

    public function voucher_attach(){   //Creates and attaches a voucher based on the transaction details

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        if(!(isset($this->request->query['id']))){
            $this->set(array(
                'message'   => "Missing id in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;  
        }
        $success_flag = false;

        $id  = $this->request->query['id'];
        $q_r = $this->{$this->modelClass}->findById($id);

        if($q_r){
        
            $item_name          = $q_r['FinPaypalTransaction']['item_name']; //RDVoucher
            $item_number        = $q_r['FinPaypalTransaction']['item_number']; //rd_v1
            $option_selection1  = $q_r['FinPaypalTransaction']['option_selection1']; //2Hours

            $data               = Configure::read('paypal.'.$item_name.'.'.$item_number.'.'.$option_selection1);

            if($data != null){
                $v  = ClassRegistry::init('Voucher');
                if($v->save($data)) {
                    $success_flag = true;
                    $voucher_id   = $v->id;
                    $this->{$this->modelClass}->save(array('id' => $id,'voucher_id'    => $voucher_id));
                }else{

                    $message = 'Error';
                    $this->set(array(
                        'errors'    => $v->validationErrors,
                        'success'   => false,
                        'message'   => array('message' => __('Could not create item')),
                        '_serialize' => array('errors','success','message')
                    ));
                    return; //Get out of here!
                }
            }else{
                $this->set(array(
                    'success'   => false,
                    'message'   => 'Detail not configured for item (item_name/item_number/option_selection1)',
                    '_serialize' => array('success','message')
                ));
                return;
            }
        }else{
            $this->set(array(
                'success'   => false,
                'message'   => 'Item not found to attach Voucher to it',
                '_serialize' => array('success','message')
            ));
            return;
        }

        $this->set(array(
            'success' => $success_flag,
            '_serialize' => array('success')
        ));
    }

    public function voucher_detach(){

        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];

        if(!(isset($this->request->query['id']))){
            $this->set(array(
                'message'   => "Missing id in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;  
        }
        $success_flag = false;

        $id  = $this->request->query['id'];
        $q_r = $this->{$this->modelClass}->findById($id);

        if($q_r){

            if($this->{$this->modelClass}->save(array('id' => $id,'voucher_id'    => null))){
                $success_flag = true;
            }else{
                $message = 'Error';
                $this->set(array(
                    'errors'    => $this->{$this->modelClass}->validationErrors,
                    'success'   => false,
                    'message'   => array('message' => __('Could not detach voucher')),
                    '_serialize' => array('errors','success','message')
                ));
                return; //Get out of here!
            }
        }else{
            $this->set(array(
                'success'   => false,
                'message'   => 'Item not found to detach Voucher from',
                '_serialize' => array('success','message')
            ));
            return;
        }

        $this->set(array(
            'success' => $success_flag,
            '_serialize' => array('success')
        ));
    }

    public function email_voucher_details(){
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id= $user['id'];

        $id     = $this->request->data['id'];
        $q_r    = $this->{$this->modelClass}->findById($id);
        $to     = $this->request->data['email'];
        $message= $this->request->data['message'];

        if($q_r){
            $v  = ClassRegistry::init('Voucher');
            $voucher_id = $q_r['FinPaypalTransaction']['voucher_id'];
            $q  = $v->findById($voucher_id);
            if($q){
                $username       = $q['Voucher']['name'];
                $password       = $q['Voucher']['password'];
                $valid_for      = $q['Voucher']['time_valid'];
                $profile        = $q['Voucher']['profile'];
                $extra_name     = $q['Voucher']['extra_name'];
                $extra_value     = $q['Voucher']['extra_value'];
                //  print_r("The username is $username and password is $password");
				$email_server = Configure::read('EmailServer');
                App::uses('CakeEmail', 'Network/Email');
                $Email = new CakeEmail();
                $Email->config($email_server);
                $Email->subject('Your voucher detail');
                $Email->to($to);
                $Email->viewVars(compact( 'username', 'password','valid_for','profile','extra_name','extra_value','message'));
                $Email->template('voucher_detail', 'voucher_notify');
                $Email->emailFormat('html');
                $Email->send();
            }
        }
        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));
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
            $d['FinPaypalTransactionNote']['fin_paypal_transaction_id']   = $this->request->data['for_id'];
            $d['FinPaypalTransactionNote']['note_id'] = $this->FinPaypalTransaction->FinPaypalTransactionNote->Note->id;
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

    //----- Menus ------------------------
    public function menu_for_grid(){

        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }

        //Empty by default
        $menu = array();

        //Admin => all power
        if($user['group_name'] == Configure::read('group.admin')){  //Admin

            $menu = array(
                array('xtype' => 'buttongroup','title' => __('Action'), 'items' => array(
                     array( 
                        'xtype'     =>  'splitbutton',  
                        'iconCls'   => 'b-reload',
                        'glyph'     => Configure::read('icnReload'),   
                        'scale'     => 'large', 
                        'itemId'    => 'reload',   
                        'tooltip'   => __('Reload'),
                            'menu'  => array( 
                                'items' => array( 
                                    '<b class="menu-title">'.__('Reload every').':</b>',
                                    array( 'text'  => __('30 seconds'),      'itemId'    => 'mnuRefresh30s', 'group' => 'refresh','checked' => false ),
                                    array( 'text'  => __('1 minute'),        'itemId'    => 'mnuRefresh1m', 'group' => 'refresh' ,'checked' => false),
                                    array( 'text'  => __('5 minutes'),       'itemId'    => 'mnuRefresh5m', 'group' => 'refresh', 'checked' => false ),
                                    array( 'text'  => __('Stop auto reload'),'itemId'    => 'mnuRefreshCancel', 'group' => 'refresh', 'checked' => true )
                                   
                                )
                            )
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnCut'),
                        'scale'     => 'large', 
                        'itemId'    => 'detach', 
                        'tooltip'   => __('Detach voucher'),
                        'disabled'  => true
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnAttach'),
                        'scale'     => 'large', 
                        'itemId'    => 'attach', 
                        'tooltip'   => __('Attach voucher'),
                        'disabled'  => true
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnEmail'),
                        'scale'     => 'large', 
                        'itemId'    => 'email', 
                        'tooltip'   => __('e-Mail voucher'),
                        'disabled'  => true
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnMobile'),
                        'scale'     => 'large', 
                        'itemId'    => 'sms', 
                        'tooltip'   => __('SMS voucher'),
                        'disabled'  => true
                    ),
                )),
                array('xtype' => 'buttongroup','title' => __('Document'), 'width' => 100, 'items' => array(
                    array(
                        'xtype'     => 'button',
                        'glyph'     => Configure::read('icnNote'), 
                        'scale'     => 'large',
                        'itemId'    => 'note',
                        'tooltip'   => __('Add Notes')
                    ),
                    array(
                        'xtype'     => 'button', 
                        'glyph'     => Configure::read('icnCsv'),   
                        'scale'     => 'large',
                        'itemId'    => 'csv',      
                        'tooltip'   => __('Export CSV')
                    ),
                ))     
            );
        }

        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
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
        $sort   = 'FinPaypalTransaction.created';
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

            $trans_data             = array();
            $trans_data['user_id']  = $this->paypal_user_id;
            foreach($list_of_fields as $field){
                if (array_key_exists($field, $_POST) == true) {
                    $trans_data["$field"] = $_POST["$field"];
                }
            }
            $txn_id = $_POST['txn_id'];
            $q_r = $this->{$this->modelClass}->find('first', array('conditions' => array('FinPaypalTransaction.txn_id' => $txn_id)));

            if($q_r){
                $trans_data['id'] = $q_r['FinPaypalTransaction']['id'];
                $this->{$this->modelClass}->save($trans_data);
                $id = $q_r['FinPaypalTransaction']['id'];
            }else{   
                $this->{$this->modelClass}->save($trans_data);
                $id = $this->{$this->modelClass}->id;
            }

            //----- IF status of transaction is 'Completed'; we can go ahead ----
            $payment_status = $_POST['payment_status'];
            if($payment_status == 'Completed'){

                //Check if we perhaps have not already created a voucher for this transaction
                $q_r = $this->{$this->modelClass}->findById($id);
                if($q_r){
                    if($q_r['FinPaypalTransaction']['voucher_id'] == ''){ //Voucher ID is empty

                        //We need to create a voucher
                        $v  = ClassRegistry::init('Voucher');
                        $v->contain(); //Make it lean

                        $item_name          = $q_r['FinPaypalTransaction']['item_name']; //RDVoucher
                        $item_number        = $q_r['FinPaypalTransaction']['item_number']; //rd_v1
                        $option_selection1  = $q_r['FinPaypalTransaction']['option_selection1']; //2Hours
                        //FIXME replace with real one when going live!!!
                        //$payer_email        = $q_r['FinPaypalTransaction']['payer_email'];
                        $payer_email        =  'dirkvanderwalt@gmail.com'; 

                        $data               = Configure::read('paypal.'.$item_name.'.'.$item_number.'.'.$option_selection1);
                        if($data != null){

							//---!!We do a single field thing!!---
							$t_v_names = $v->find('all',array('fields' => array('Voucher.name')));
							foreach($t_v_names as $n){
								$v_name = $n['Voucher']['name'];
								array_push($this->VoucherGenerator->voucherNames,$v_name);
							}

							if($this->singleField){
								$pwd = $this->VoucherGenerator->generateVoucher();
								$data['name']      = $pwd; 
								$data['password']  = $pwd;
							}
							//--!!End single field thing!!---

                            if($v->save($data)) {
                                $voucher_id     = $v->id;
                                //Update the transaction entry....
                                $this->{$this->modelClass}->save(array('id' => $id,'voucher_id' => $voucher_id));
                                $this->_email_voucher_detail($payer_email,$voucher_id,$txn_id);
                            }else{
                                //Add log entry do record the failure
                                $this->log("Failed to create a voucher for PayPal entry $txn_id please do manual intervention");
                                $this->log($v->validationErrors);                
                            }
                        }else{
                            $this->log("Failed to locate PayPal config item for $item_name / $item_number / $option_selection  please do manual intervention");
                        }    
                    }
                }else{
                    //Add log entry do record the failure
                    $this->log("Failed to add a PayPal entry for $txn_id please do manual intervention");
                    $this->log($this->{$this->modelClass}->validationErrors);      
                }
            }

        } else if (strcmp ($res, "INVALID") == 0) {
            // IPN invalid, log for manual investigation
            echo "The response from IPN was: <b>" .$res ."</b>";
        }
    }


    private function _email_voucher_detail($payer_email, $voucher_id,$txn_id){

        $v          = ClassRegistry::init('Voucher');
        $voucher_id = $voucher_id;
        $q          = $v->findById($voucher_id);
        if($q){
            $username       = $q['Voucher']['name'];
            $password       = $q['Voucher']['password'];
            $valid_for      = $q['Voucher']['time_valid'];
            $profile        = $q['Voucher']['profile'];
            $extra_name     = $q['Voucher']['extra_name'];
            $extra_value     = $q['Voucher']['extra_value'];
            $message        = '';
            //  print_r("The username is $username and password is $password");
			$email_server = Configure::read('EmailServer');
            App::uses('CakeEmail', 'Network/Email');
            $Email = new CakeEmail();
            $Email->config($email_server);
            $Email->subject('PayPal #'.$txn_id);
            $Email->to($payer_email);
            $Email->viewVars(compact( 'username', 'password','valid_for','profile','extra_name','extra_value','message'));
            $Email->template('voucher_detail', 'voucher_notify');
            $Email->emailFormat('html');
            $Email->send();
        }
    }

    private function _find_parents($id){

        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($id);
        $path_string= '';
        if($q_r){

            foreach($q_r as $line_num => $i){
                $username       = $i['User']['username'];
                if($line_num == 0){
                    $path_string    = $username;
                }else{
                    $path_string    = $path_string.' -> '.$username;
                }
            }
            if($line_num > 0){
                return $username." (".$path_string.")";
            }else{
                return $username;
            }
        }else{
            return __("orphaned");
        }
    }

	 private function _is_sibling_of($parent_id,$user_id){
        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($user_id);
        if($q_r){
            foreach($q_r as $i){
                $id = $i['User']['id'];
                if($id == $parent_id){
                    return true;
                }
            }
        }
        //No match
        return false;
    }


//-----------------------------------------------
}
