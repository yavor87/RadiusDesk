<?php
App::uses('AppModel', 'Model');

class SocialLoginUser extends AppModel {

    public $name        = 'SocialLoginUser';
    public $actsAs      = array('Containable');

}
?>
