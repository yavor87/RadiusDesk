<?php
//The groups that is defined 
$config['group']['admin']   = 'Administrators';     //Has all the rights
$config['group']['ap']      = 'Access Providers';   //Has selected right
$config['group']['user']    = 'Users';              //Has very limited rights

$config['language']['default']    = '4_4';     //This is the id 4 of Languages and id 4 of countries (GB_en)

$config['commands']['msgcat'] = '/usr/bin/msgcat';

//Define the connection types and if they are active or not
$config['conn_type'][0]     = array('name' => __('Direct (Fixed IP)'),  'id' => 'direct',   'active' => true);
$config['conn_type'][1]     = array('name' => __('OpenVPN'),            'id' => 'openvpn',  'active' => true);
$config['conn_type'][2]     = array('name' => __('PPTP'),               'id' => 'pptp',     'active' => false);
$config['conn_type'][3]     = array('name' => __('Dynamic Client'),     'id' => 'dynamic',  'active' => true);

//Define the location of ccd (client config directory)
//FIXME This value does not get read by the OpenvpnClients Model - investigate
$config['openvpn']['ccd_dir_location']  = '/etc/openvpn/ccd/';
$config['openvpn']['ip_half']           = '10.8.';

//Dictionary files to include for profiles...
$config['freeradius']['path_to_dictionary_files']   = '/usr/local/share/freeradius/';
$config['freeradius']['main_dictionary_file']       = '/usr/local/etc/raddb/dictionary';


//Define the configured dynamic attributes
$config['dynamic_attributes'][0]     = array('name' => 'Called-Station-Id',  'id' => 'Called-Station-Id',   'active' => true);
$config['dynamic_attributes'][1]     = array('name' => 'Mikrotik-Realm',     'id' => 'Mikrotik-Realm',      'active' => true);


?>
