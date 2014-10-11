<?php
App::uses('AppController', 'Controller');

class FinPayUTransactionsController extends AppController {

    public $name       = 'FinPayUTransactions';
    public $components = array('Aa','Payu');
    public $uses       = array('FinPayUTransaction','User');

    protected $base    = "Access Providers/Controllers/FinPayUTransactions/";
    protected $payu_user_id = 44;

    protected $fields  = array(
        'merchantReference',    'payUReference',    'TransactionType',  'TransactionState',
        'ResultCode',           'ResultMessage',    'DisplayMessage',   'merchUserId',
        'firstName',            'lastName',         'email',            'mobile',
        'regionalId',           'amountInCents',    'currencyCode',     'description',
        'created',              'modified',         'id'
    );

    /* Set to suit your deployment */
    protected $voucher_data = array(
        'activate_on_login' => '1',
        'days_valid'        => 2,
        'expire'            => '05/31/2015',
        'precede'           => '',
        'profile_id'        => 7,
        'pwd_length'        => 3,
        'realm_id'          => 34,
        'sel_language'      => '4_4',
        'user_id'           => '44'
    );

    public function price_list_for(){

    //http://127.0.0.1/cake2/rd_cake/financials/price_list_for.json?plan=a

        $items = array();

        if(isset($this->request->query['plan'])){
            $plan = $this->request->query['plan'];
            $v    = Configure::read('payu.vouchers.'.$plan);
            foreach(array_keys($v) as $k){
                $data = $v[$k];
                array_push($items,
                array(
                    'id'    => $k, 
                    'name'  => $data['name'],
                    'price' => $data['price'], 
                    'currency' => $data['currency'], 
                    'position' => $data['position']
                ));           

            }
        }

        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('success', 'items')
        )); 
    } 

    public function submit_transaction(){

        //Create a merchant reference that will be added to the url to track the transaction
        $merchantReference  = time();

        //The mobile (sench touch) we have to do with a trick
        $query_items = array('protocol','hostname','pathname','uamip','uamport','ssid','nasid');
        foreach($query_items as $q_i){
            if(isset($this->request->query[$q_i])){
                $this->request->data[$q_i] = $this->request->query[$q_i];
            }
        }

        //Build the return URL
        $url_base = $this->data['protocol']."//".$this->request->data['hostname'].$this->request->data['pathname'];
        $url_full = $url_base.
                        '?uanip='.$this->request->data['uamip'].
                        '&uamport='.$this->request->data['uamport'].
                        '&ssid='.$this->request->data['ssid'].
                        '&nasid='.$this->request->data['nasid'].
                        '&merchant_reference='.$merchantReference;

        //Create a merchant reference that will be added to the url to track the transaction
        $merchantReference  = time();

        //We need the description and the amount based on the selected value of 'voucher'
        $description    = '0MB';
        $amount         = '0';
        $v              = Configure::read('payu.vouchers.a.'.$this->data['voucher']);
        if($v){
            $description    = $v['name'];
            $amount         = $v['price'] * 100;
        }
        
        $data  = array();
        $data['merchantReference']  = $merchantReference;
        $data['cancelUrl']          = "$url_full"."&payu_cancel=1";
        $data['returnUrl']          = "$url_full";
        $data['description']        = $description;
        $data['amountInCents']      = $amount;
        $data['email']              = $this->data['email'];
        $data['firstName']          = $this->data['firstName'];
        $data['lastName']           = $this->data['lastName'];
        $data['mobile']             = $this->data['mobile'];

        $ret_val = $this->Payu->setTransaction($data);
        //print_r($ret_val);
        //die();
        if(!$ret_val['success']){
            //Return to the page but add the error message
            $msg = urlencode($ret_val['Error']);
            $this->response->header('Location', $url_full.'&payu_error='.$msg);
        }else{
            //We can add this transaction and redirect the user to PayU
            $data['payUReference']  = $ret_val['payUReference'];
            $data['user_id']        = $this->payu_user_id;

            $this->{$this->modelClass}->save($data);
            $rpp = Configure::read('payu.payuRppUrl');
            $rpp = $rpp.$ret_val['payUReference'];
            $this->response->header('Location', $rpp);
        }
    }

    public function payu_ipn(){
        $xml_string     = $this->request->input();
        $ret_array      = $this->Payu->ipn_xml_to_data($xml_string);
        $PayUReference  = $ret_array['PayUReference'];
        $this->{$this->modelClass}->contain();
        $q_r            = $this->{$this->modelClass}->find('first',array('conditions'=> array('FinPayUTransaction.payUReference' => $PayUReference)));

        if($q_r){

            $id             = $q_r['FinPayUTransaction']['id'];
            $description    = $q_r['FinPayUTransaction']['description'];
            $PayUReference  = $q_r['FinPayUTransaction']['payUReference'];

            if($q_r['FinPayUTransaction']['TransactionState'] != 'SUCCESSFUL'){ //SUCCESSFULL is the last state

                $ret_array['id'] = $id;
                $this->{$this->modelClass}->save($ret_array);
                $this->log("PAYU: Save state ".$q_r['FinPayUTransaction']['TransactionState'],'debug');
            }
            if(
                ($ret_array['TransactionState'] == 'SUCCESSFUL')&&  //No voucher yet; create one!
                ($q_r['FinPayUTransaction']['voucher_id'] == '')
            ){ 
                $this->log("PAYU: Create a voucher for ".$description,'debug');

                //-----------------------------------
                $data = null;
                $v_list  = Configure::read('payu.vouchers.a');
                foreach(array_keys($v_list) as $v_id){
                    $current_name = $v_list["$v_id"]['name'];
                    if($current_name == $description){
                        $data = $v_list["$v_id"]['voucher'];
                        break;
                    }    
                }
                if($data != null){
                    $v  = ClassRegistry::init('Voucher');
                    $v->contain(); //Make it lean

                    $email      = $q_r['FinPayUTransaction']['email'];
                    if($v->save($data)) {
                        $voucher_id     = $v->id;
                        //Update the transaction entry....
                        $this->{$this->modelClass}->save(array('id' => $id,'voucher_id'    => $voucher_id));
                        $this->_email_voucher_detail($email,$voucher_id,$PayUReference);
                    }else{
                        //Add log entry do record the failure
                        $this->log("Failed to create a voucher for PayU entry $PayUReference please do manual intervention");
                        $this->log($v->validationErrors);                
                    }
                }else{
                    $this->log("Failed to locate PayU config item for $description please do manual intervention");
                }
                //------------------------------------
            }
        }
    }

    public function fetch_transaction($payUReference){

        $ret_val = $this->Payu->getTransaction($payUReference);
        print_r($ret_val);
    }
   
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
                if(array_key_exists($field,$i['FinPayUTransaction'])){

                    $row["$field"]= $i['FinPayUTransaction']["$field"];
                }
            }

            //Create notes flag
            $notes_flag  = false;
            foreach($i['FinPayUTransactionNote'] as $nn){
                if(!$this->_test_for_private_parent($nn['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

            //Voucher id and name
            if($i['FinPayUTransaction']['voucher_id'] != ''){
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

    public function voucher_info_for(){

        if(!(isset($this->request->query['PayUReference']))){
            $this->set(array(
                'message'   => "Missing PayUReference in query string",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;
        }

        $PayUReference = $this->request->query['PayUReference'];

        $data = array();
        $q_r = $this->{$this->modelClass}->find('first', array('conditions' => array('FinPayUTransaction.payUReference' => $PayUReference)));

        if($q_r){
            $voucher_id = $q_r['FinPayUTransaction']['voucher_id'];
            if($voucher_id != ''){
                $v  = ClassRegistry::init('Voucher');
                $voucher_id = $q_r['FinPayUTransaction']['voucher_id'];
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
            }else{
               $this->set(array(
                    'message'   => "PayU Reference: $PayUReference has no voucher associated to it - please contact helpdesk",
                    'success' => false,
                    '_serialize' => array('success','message')
                ));
                return;
            }

        }else{
            $this->set(array(
                'message'   => "No data available for $PayUReference",
                'success' => false,
                '_serialize' => array('success','message')
            ));
            return;
        }
      
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
        
            $item_name          = $q_r['FinPayUTransaction']['item_name']; //RDVoucher
            $item_number        = $q_r['FinPayUTransaction']['item_number']; //rd_v1
            $option_selection1  = $q_r['FinPayUTransaction']['option_selection1']; //2Hours

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
            $voucher_id = $q_r['FinPayUTransaction']['voucher_id'];
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
            $q_r    = $this->FinPayUTransaction->FinPayUTransactionNote->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('FinPayUTransactionNote.fin_paypal_transaction_id' => $tag_id)
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
        $this->FinPayUTransaction->FinPayUTransactionNote->Note->create(); 
        //print_r($this->request->data);
        if ($this->FinPayUTransaction->FinPayUTransactionNote->Note->save($this->request->data)) {
            $d                      = array();
            $d['FinPayUTransactionNote']['fin_paypal_transaction_id']   = $this->request->data['for_id'];
            $d['FinPayUTransactionNote']['note_id'] = $this->FinPayUTransaction->FinPayUTransactionNote->Note->id;
            $this->FinPayUTransaction->FinPayUTransactionNote->create();
            if ($this->FinPayUTransaction->FinPayUTransactionNote->save($d)) {
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
            $item       = $this->FinPayUTransaction->FinPayUTransactionNote->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->FinPayUTransaction->FinPayUTransactionNote->Note->id = $this->data['id'];
                    $this->FinPayUTransaction->FinPayUTransactionMacNote->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->FinPayUTransaction->FinPayUTransactionNote->Note->id = $this->data['id'];
                $this->FinPayUTransaction->FinPayUTransactionNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->FinPayUTransaction->FinPayUTransactionNote->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->FinPayUTransaction->FinPayUTransactionNote->Note->id = $d['id'];
                        $this->FinPayUTransaction->FinPayUTransactionNote->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->FinPayUTransaction->FinPayUTransactionNote->Note->id = $d['id'];
                    $this->FinPayUTransaction->FinPayUTransactionNote->Note->delete($d['id'],true);
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
                            'FinPayUTransactionNote'    => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'User',
                            'Voucher'
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'FinPayUTransaction.created';
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
   
    private function _email_voucher_detail($email,$voucher_id,$PayUReference){

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
            $message            = '';
          //  print_r("The username is $username and password is $password");
			$email_server = Configure::read('EmailServer');
            App::uses('CakeEmail', 'Network/Email');
            $Email = new CakeEmail();
            $Email->config($email_server);
            $Email->subject('PayU #'.$PayUReference);
            $Email->to($email);
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

//-----------------------------------------------
}
