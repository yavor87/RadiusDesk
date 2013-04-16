<?php
//The groups that is defined 
$config['group']['admin']   = 'Administrators';     //Has all the rights
$config['group']['ap']      = 'Access Providers';   //Has selected right
$config['group']['user']    = 'Permanent Users';              //Has very limited rights

$config['language']['default']    = '4_4';     //This is the id 4 of Languages and id 4 of countries (GB_en)

$config['commands']['msgcat'] = '/usr/bin/msgcat';

//Define the connection types and if they are active or not
$config['conn_type'][0]     = array('name' => __('Direct (Fixed IP)'),  'id' => 'direct',   'active' => true);
$config['conn_type'][1]     = array('name' => __('OpenVPN'),            'id' => 'openvpn',  'active' => true);
$config['conn_type'][2]     = array('name' => __('PPTP'),               'id' => 'pptp',     'active' => true);
$config['conn_type'][3]     = array('name' => __('Dynamic Client'),     'id' => 'dynamic',  'active' => true);

//Define the location of ccd (client config directory)
//FIXME This value does not get read by the OpenvpnClients Model - investigate
$config['openvpn']['ccd_dir_location']  = '/etc/openvpn/ccd/';
$config['openvpn']['ip_half']           = '10.8.';

//Define pptp specific settings
$config['pptp']['start_ip']                        = '10.20.30.2';
$config['pptp']['server_ip']                       = '10.20.30.1';
$config['pptp']['chap_secrets']                    = '/etc/ppp/chap-secrets';

//Dictionary files to include for profiles...
$config['freeradius']['path_to_dictionary_files']   = '/usr/local/share/freeradius/';
$config['freeradius']['main_dictionary_file']       = '/usr/local/etc/raddb/dictionary';


//Define the configured dynamic attributes
$config['dynamic_attributes'][0]     = array('name' => 'Called-Station-Id',  'id' => 'Called-Station-Id',   'active' => true);
$config['dynamic_attributes'][1]     = array('name' => 'Mikrotik-Realm',     'id' => 'Mikrotik-Realm',      'active' => true);

//Define nas types
$config['nas_types'][0]     = array('name' => 'Other',              'id' => 'other',                'active' => true);
$config['nas_types'][1]     = array('name' => 'CoovaChilli',        'id' => 'CoovaChilli',          'active' => true);
$config['nas_types'][0]     = array('name' => 'Mikrotik',           'id' => 'Mikrotik',             'active' => true);

//FIXME To incorporate
$config['paths']['wallpaper_location'] = "/rd/resources/images/wallpapers/";

//Define default settings for the users:
$config['user_settings']['wallpaper']       = "9.jpg";
$config['user_settings']['map']['type']     = "ROADMAP";
$config['user_settings']['map']['zoom']     = 18;
$config['user_settings']['map']['lng']      = -71.0955740216735;
$config['user_settings']['map']['lat']      = 42.3379770178396;


//=== EXPERIMENTAL STUFF =====
//Show experimental menus
$config['experimental']['active']                   = true;

//IP Settings
$config['experimental']['defaults']['ip_mask']      = '255.255.255.0';
$config['experimental']['defaults']['ip_dns_1']     = '192.168.99.99';
$config['experimental']['defaults']['ip_dns_2']     = '192.168.99.100';
$config['experimental']['defaults']['ip_dns_2']     = '192.168.99.100';

//Wifi Settings
$config['experimental']['defaults']['wifi_active']  = true;
$config['experimental']['defaults']['channel']      = 1;
$config['experimental']['defaults']['power']        = 10;
$config['experimental']['defaults']['distance']     = 30;


$config['experimental']['defaults']['ssid_secure']  = 'RD Wireless';
$config['experimental']['defaults']['radius']       = '192.168.99.99';
$config['experimental']['defaults']['secret']       = 'testing123';

$config['experimental']['defaults']['ssid_open']    = 'RD Guest';

//OpenVPN Settings
$config['experimental']['defaults']['vpn_server']   = '192.168.99.99';

$config['experimental']['openvpn']['start_ip']      = '10.8.1.2';


?>
