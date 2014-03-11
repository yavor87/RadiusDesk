<?php
class FinancialsController extends AppController {


    public $name       = 'Financials';
    //public $components = array('Aa');
    protected $base    = "Access Providers/Controllers/Financials/"; //Required for AP Rights

    public function price_list_for(){

    //http://127.0.0.1/cake2/rd_cake/financials/price_list_for.json?plan=a

        $items = array();

        if(isset($this->request->query['plan'])){
            $plan = $this->request->query['plan'];
            $items = Configure::read('financials.vouchers.'.$plan);  
        }

        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('success', 'items')
        )); 
    }

    public function submit_transaction(){
        //http://127.0.0.1/cake2/rd_cake/financials/submit_transaction
        if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
        if((isset($this->data['nasid']))&&(isset($this->data['voucher']))){
            //Try to find the amount that this voucher is now charged for
            $plan = 'a';
            $items = Configure::read('financials.vouchers.'.$plan);
            foreach($items as $i){
                if($i['id'] == $this->data['voucher']){
                    $product_id     = $i['id'];
                    $price          = $i['price'];
                    $price_in_cent  = $price * 100;
                    $voucher_value  = $i['name'];
                    $this->_do_payu_transaction($voucher_value,$price,$price_in_cent,$product_id);
                }
            }
            
        }else{
            $this->set('error', 'Missing information required for transaction');
        }
    }

    public function completed_transaction(){
        Configure::write('debug', 0);
        if(isset($this->request->query['PayUReference'])){
            $return_data = $this->_get_payu_transaction($this->request->query['PayUReference']);
            $this->set('return_data', $return_data);
        }
    }

    private function _get_payu_transaction($reference){

        $return_data = array();

        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------
        //-------      Configs comes here
        //-------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        $baseUrl = 'https://staging.payu.co.za';
        $soapWdslUrl = $baseUrl.'/service/PayUAPI?wsdl';
        $payuRppUrl = $baseUrl.'/rpp.do?PayUReference=';
        $apiVersion = 'ONE_ZERO';

        /*
        Using staging integartion store 1 details
        Store ID: 100284
        Webservice username : Staging Integration Store 1
        Webservice password : 78cXrW1W
        Safekey: {45D5C765-16D2-45A4-8C41-8D6F84042F8C} 
        */
        $safeKey        = '{45D5C765-16D2-45A4-8C41-8D6F84042F8C}';
        $soapUsername   = 'Staging Integration Store 1';
        $soapPassword   = '78cXrW1W';
        $payUReference  = $reference;


        try {

            // 1. Building the Soap array  of data to send
            $soapDataArray = array();
            $soapDataArray['Api'] = $apiVersion;
            $soapDataArray['Safekey'] = $safeKey;
            $soapDataArray['AdditionalInformation']['payUReference'] = $payUReference;

            // 2. Creating a XML header for sending in the soap heaeder (creating it raw a.k.a xml mode)
            $headerXml = '<wsse:Security SOAP-ENV:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">';
            $headerXml .= '<wsse:UsernameToken wsu:Id="UsernameToken-9" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
            $headerXml .= '<wsse:Username>'.$soapUsername.'</wsse:Username>';
            $headerXml .= '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">'.$soapPassword.'</wsse:Password>';
            $headerXml .= '</wsse:UsernameToken>';
            $headerXml .= '</wsse:Security>';
            $headerbody = new SoapVar($headerXml, XSD_ANYXML, null, null, null);

            // 3. Create Soap Header.        
            $ns = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'; //Namespace of the WS. 
            $header = new SOAPHeader($ns, 'Security', $headerbody, true);        

            // 4. Make new instance of the PHP Soap client
            $soap_client = new SoapClient($soapWdslUrl, array("trace" => 1, "exception" => 0)); 

            // 5. Set the Headers of soap client. 
            $soap_client->__setSoapHeaders($header); 

            // 6. Do the setTransaction soap call to PayU
            $soapCallResult = $soap_client->getTransaction($soapDataArray); 

            // 7. Decode the Soap Call Result
            $returnData = json_decode(json_encode($soapCallResult),true);

            //Get the PayUReference ->
            $payu_reference = $returnData['return']['payUReference'];
            $transaction    = ClassRegistry::init('FinPayuTransaction');
            $q_r            = $transaction->find('first',array('conditions' => array('FinPayuTransaction.payu_reference' => $payu_reference)));
            if($q_r){
                $transaction_state  = $returnData['return']['transactionState'];
                $transaction_type   = $returnData['return']['transactionType'];
                $result_code        = $returnData['return']['resultCode'];
                $result_message     = $returnData['return']['resultMessage'];
                $display_message    = $returnData['return']['displayMessage'];

                $q_r['FinPayuTransaction']['transaction_state'] = $transaction_state;
                $q_r['FinPayuTransaction']['transaction_type']  = $transaction_type;
                $q_r['FinPayuTransaction']['result_code']       = $result_code;
                $q_r['FinPayuTransaction']['result_message']    = $result_message;
                $q_r['FinPayuTransaction']['display_message']   = $display_message;

                unset($q_r['FinPayuTransaction']['created']);
                unset($q_r['FinPayuTransaction']['modified']);

                //Update the record
                $transaction->save($q_r);
                $return_data['record'] = $q_r;
            }else{
                $return_data['error'] = "payUReference $payu_reference not recorded in local database";
            }
            return $return_data;         
        }
        catch(Exception $e) {
            var_dump($e);
        }


    }


    private function _do_payu_transaction($voucher_value,$voucher_price,$price_in_cent,$product_id){

        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        ob_start();

        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------
        //-------      Configs comes here
        //-------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------

        $baseUrl = 'https://staging.payu.co.za'; //staging environment URL
        //$baseUrl = 'https://secure.payu.co.za'; //production environment URL

        $soapWdslUrl = $baseUrl.'/service/PayUAPI?wsdl';
        $payuRppUrl = $baseUrl.'/rpp.do?PayUReference=';
        $apiVersion = 'ONE_ZERO';

        //set value != 1 if you dont want to auto redirect topayment page
        $doAutoRedirectToPaymentPage = 1;

        /*
        Store config details
        */
        $safeKey = '{45D5C765-16D2-45A4-8C41-8D6F84042F8C}';
        $soapUsername = 'Staging Integration Store 1';
        $soapPassword = '78cXrW1W';


        try {

            $merchantReference  = time();
            $description        = "$voucher_value Internet voucher";
            
            // 1. Building the Soap array  of data to send    
            $setTransactionArray                    = array();    
            $setTransactionArray['Api']             = $apiVersion;
            $setTransactionArray['Safekey']         = $safeKey;
            $setTransactionArray['TransactionType'] = 'PAYMENT';		    

            $setTransactionArray['AdditionalInformation']['merchantReference']      = $merchantReference;   
            $setTransactionArray['AdditionalInformation']['cancelUrl']              = 'http://127.0.0.1/cake2/rd_cake/financials/completed_transaction';
            $setTransactionArray['AdditionalInformation']['returnUrl']              = 'http://127.0.0.1/cake2/rd_cake/financials/completed_transaction';
	        $setTransactionArray['AdditionalInformation']['supportedPaymentMethods']= 'CREDITCARD';
            
            $setTransactionArray['Basket']['description']       = $description;
            $setTransactionArray['Basket']['amountInCents']     = "$price_in_cent";
            $setTransactionArray['Basket']['currencyCode']      = 'ZAR';

            $setTransactionArray['Customer']['merchantUserId']  = "500";
            $setTransactionArray['Customer']['email']           = "rviljoen@pcmaniacs.co.za";
            $setTransactionArray['Customer']['firstName']       = 'Renier';
            $setTransactionArray['Customer']['lastName']        = 'Viljoen';
            $setTransactionArray['Customer']['mobile']          = '0725995050';
            $setTransactionArray['Customer']['regionalId']      = '7701015055012';
            $setTransactionArray['Customer']['countryCode']     = '27';

            $setTransactionArray['Customfield']['key']         = "ProductID";
            $setTransactionArray['Customfield']['value']       = "$product_id";
            
            // 2. Creating a XML header for sending in the soap heaeder (creating it raw a.k.a xml mode)
            $headerXml = '<wsse:Security SOAP-ENV:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">';
            $headerXml .= '<wsse:UsernameToken wsu:Id="UsernameToken-9" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
            $headerXml .= '<wsse:Username>'.$soapUsername.'</wsse:Username>';
            $headerXml .= '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">'.$soapPassword.'</wsse:Password>';
            $headerXml .= '</wsse:UsernameToken>';
            $headerXml .= '</wsse:Security>';
            $headerbody = new SoapVar($headerXml, XSD_ANYXML, null, null, null);

            // 3. Create Soap Header.        
            $ns = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'; //Namespace of the WS. 
            $header = new SOAPHeader($ns, 'Security', $headerbody, true);        

            // 4. Make new instance of the PHP Soap client
            $soap_client = new SoapClient($soapWdslUrl, array("trace" => 1, "exception" => 0)); 

            // 5. Set the Headers of soap client. 
            $soap_client->__setSoapHeaders($header); 

            // 6. Do the setTransaction soap call to PayU
            $soapCallResult = $soap_client->setTransaction($setTransactionArray); 

            // 7. Decode the Soap Call Result
            $returnData = json_decode(json_encode($soapCallResult),true);

	        if(isset($doAutoRedirectToPaymentPage) && ($doAutoRedirectToPaymentPage == 1) ) {
		        if( (isset($returnData['return']['successful']) && ($returnData['return']['successful'] === true) && isset($returnData['return']['payUReference']) ) ) {

                    //Add an entry since we could get a payUReference
                    $data = array();
                    $data['merchant_reference'] = $merchantReference;
                    $data['payu_reference']     = $returnData['return']['payUReference'];
                    $data['amount_in_cents']    = $price_in_cent;
                    $data['description']        = $description;
                    $data['product_code']       = $product_id;

                    $transaction = ClassRegistry::init('FinPayuTransaction');
                    $transaction->create();
                    $transaction->save($data);
			
			        //Redirecting to payment page
			        header('Location: '.$payuRppUrl.$returnData['return']['payUReference']);
			        die();
		        }else{
                    //TODO Here we need to tell them what whent wrong!

                }
	        }
        }
        catch(Exception $e) {
            var_dump($e);
        }
    }

}
?>
