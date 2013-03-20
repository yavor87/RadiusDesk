<?php
class FreeRadiusController extends AppController {

    public $name       = 'PhpPhrases';
    public $components = array('Aa');

    public function index(){

        //First the auth
        $type = 'auth';
        exec("sudo /var/www/cake2/rd_cake/Setup/Scripts/radmin_wrapper.pl stats $type",$output_auth);

        $items = array();
        $items['auth_basic']  = array();
        $items['auth_detail'] = array(); 

        if (preg_match("/requests/i", $output_auth[0])) {
            foreach($output_auth as $i){
                $clean = trim($i);
                $clean = preg_replace("/\s+/", ";", $clean);
                $e = explode(';',$clean);
                //First the basics
                if(($e[0] == 'accepts')&&(intval($e[1]) != 0)){
                    array_push($items['auth_basic'], array('name' => __("Accepted"), 'data' => intval($e[1])));
                }
                if(($e[0] == 'rejects')&&(intval($e[1]) != 0)){
                    array_push($items['auth_basic'], array('name' => __("Rejected"), 'data' => intval($e[1])));
                }
                
                //Then the detail
                if(($e[0] == 'responses')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Responses"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'challenges')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Challenges"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'dup')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Duplicates"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'invalid')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Invalid"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'malformed')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Malformed"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'bad_signature')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Bad Signature"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'dropped')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Dropped"), 'data' => intval($e[1])));
                }

                 if(($e[0] == 'unknown_types')&&(intval($e[1]) != 0)){
                    array_push($items['auth_detail'], array('name' => __("Unknown types"), 'data' => intval($e[1])));
                }
            }
        }

        $type = 'acct';
        exec("sudo /var/www/cake2/rd_cake/Setup/Scripts/radmin_wrapper.pl stats $type",$output_acct);

        $items['acct_detail'] = array();

        if (preg_match("/requests/i", $output_acct[0])) {
            foreach($output_acct as $i){
                $clean = trim($i);
                $clean = preg_replace("/\s+/", ";", $clean);
                $e = explode(';',$clean);
              
                //Then the detail
                if(($e[0] == 'responses')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Responses"), 'data' => intval($e[1])));
                }
                if(($e[0] == 'dup')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Duplicates"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'invalid')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Invalid"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'malformed')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Malformed"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'bad_signature')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Bad Signature"), 'data' => intval($e[1])));
                }

                if(($e[0] == 'dropped')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Dropped"), 'data' => intval($e[1])));
                }

                 if(($e[0] == 'unknown_types')&&(intval($e[1]) != 0)){
                    array_push($items['acct_detail'], array('name' => __("Unknown types"), 'data' => intval($e[1])));
                }
            }
        }

        $this->set(array(
            'items'         => $items,
            'success'       => true,
            '_serialize'    => array('success', 'items')
        )); 
    }

}
?>
