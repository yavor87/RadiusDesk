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
        print_r($this->data);
       // $this->_do_payu_transaction();
        return;
    }

    private function _do_payu_transaction(){

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
            
            // 1. Building the Soap array  of data to send    
            $setTransactionArray = array();    
            $setTransactionArray['Api'] = $apiVersion;
            $setTransactionArray['Safekey'] = $safeKey;
            $setTransactionArray['TransactionType'] = 'PAYMENT';		    

            $setTransactionArray['AdditionalInformation']['merchantReference'] = 10330456340;    
            $setTransactionArray['AdditionalInformation']['cancelUrl'] = 'http://127.0.0.1/rd';
            $setTransactionArray['AdditionalInformation']['returnUrl'] = 'http://127.0.0.1/rd2';
	        $setTransactionArray['AdditionalInformation']['supportedPaymentMethods'] = 'CREDITCARD';
            
            $setTransactionArray['Basket']['description'] = "Internet voucher";
            $setTransactionArray['Basket']['amountInCents'] = "10000";
            $setTransactionArray['Basket']['currencyCode'] = 'ZAR';

            $setTransactionArray['Customer']['merchantUserId'] = "7";
            $setTransactionArray['Customer']['email'] = "john@doe.com";
            $setTransactionArray['Customer']['firstName'] = 'John';
            $setTransactionArray['Customer']['lastName'] = 'Doe';
            $setTransactionArray['Customer']['mobile'] = '0211234567';
            $setTransactionArray['Customer']['regionalId'] = '1234512345122';
            $setTransactionArray['Customer']['countryCode'] = '27';
            
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
            
	        print "<br />-----------------------------------------------<br />\r\n";
            print "Return data decoded:<br />\r\n";
            print "-----------------------------------------------<br />\r\n";  
            print "<pre>";
            var_dump($returnData);
            print "</pre>";  
	
	        if(isset($doAutoRedirectToPaymentPage) && ($doAutoRedirectToPaymentPage == 1) ) {
		        if( (isset($returnData['return']['successful']) && ($returnData['return']['successful'] === true) && isset($returnData['return']['payUReference']) ) ) {			
			        //Redirecting to payment page
			        header('Location: '.$payuRppUrl.$returnData['return']['payUReference']);
			        die();
		        }
	        }
        }
        catch(Exception $e) {
            var_dump($e);
        }

        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------
        //-------      Checking response
        //-------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        if(is_object($soap_client)) {    
            
	        print "<br />-----------------------------------------------<br />\r\n";
            print "Request in XML:<br />\r\n";
            print "-----------------------------------------------<br />\r\n";                
            echo str_replace( '&gt;&lt;' , '&gt;<br />&lt;', htmlspecialchars( $soap_client->__getLastRequest(), ENT_QUOTES));     
            print "\r\n<br />";
            print "-----------------------------------------------<br />\r\n";
            print "Response in XML:<br />\r\n";
            print "-----------------------------------------------<br />\r\n";
	        echo str_replace( '&gt;&lt;' , '&gt;<br />&lt;', htmlspecialchars( $soap_client->__getLastResponse(), ENT_QUOTES));         
        } 
        die();

    }

}
?>
