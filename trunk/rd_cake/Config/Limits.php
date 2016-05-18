<?php

//Turn Limits on or off site wide
$config['Limits']['Global']['Active']           = false;

//APdesk
$config['Limits']['ApProfile']['Active']        = true;
$config['Limits']['ApProfile']['Count']         = 2;
$config['Limits']['ApProfile']['Description']   = 'Limits the amount of Access Point Profiles someone can create with APdesk';

//APs per ApProfile
$config['Limits']['Ap']['Active']               = true;
$config['Limits']['Ap']['Count']                = 1;
$config['Limits']['Ap']['Description']          = 'Limits the number of devices someone can acctach to an Access Point Profile';

//MESHdesk
$config['Limits']['Mesh']['Active']             = true;
$config['Limits']['Mesh']['Count']              = 2;
$config['Limits']['Mesh']['Description']        = 'Limits the number of Mesh networks someone can create with MESHdesk';

//Nodes per Mesh
$config['Limits']['Node']['Active']             = true;
$config['Limits']['Node']['Count']              = 3;
$config['Limits']['Node']['Description']        = 'Limits the number of nodes a mesh network can contain';


?>
