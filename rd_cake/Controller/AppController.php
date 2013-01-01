<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2012, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

App::uses('Controller', 'Controller');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package       app.Controller
 * @link http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {

    public $components = array(
        'RequestHandler',    //Needed for to serve JSON
        'Acl'
    );

    public function beforeFilter() {

        //If it was requested as a POST or PUT it will be in the $this->data array
        
        //____POTENTIAL PUT BUG____
        //WARNING It looks like PUT request is not converted correct but rather kept in JSON 
        if ($this->request->is('put')) {
            if(!is_array($this->request->data)){
                $converted = json_decode($this->request->data,true);
                if(is_array($converted)){
                    $this->request->data = $converted;
                }
            }
        }
        //--- END POTENTIAL PUT BUG ----

        if(array_key_exists('sel_language',$this->request->data)){
            $language = $this->request->data['sel_language'];
            $this->_set_language($language);
            return; //This gets preference over query string
        }

        //Check the query string:
        if(array_key_exists('sel_language',$this->request->query)){
            $language = $this->request->query['sel_language'];
            $this->_set_language($language);
        }   
 
    }

    private function _set_language($language){

        $country_language   = explode( '_', $language );

        $country            = $country_language[0];
        $language           = $country_language[1];
        $this->Language     = ClassRegistry::init('Language');
        $this->Country      = ClassRegistry::init('Country');

        $this->Country->contain();
        $qr         = $this->Country->findById($country);
        $c_iso      = $qr['Country']['iso_code'];

        $this->Language->contain();
        $qr         = $this->Language->findById($language);
        $l_iso      = $qr['Language']['iso_code'];
        $locale     = "$l_iso".'_'."$c_iso";
        Configure::write('Config.language', "$locale");
    }
}
