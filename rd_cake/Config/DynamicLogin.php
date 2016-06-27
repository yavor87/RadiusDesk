<?php

//The "Custom" theme will still redirect to the browser detection page but will redirect based on the page settings defined in the DB

$config['DynamicLogin']['theme']['Custom'] = array(
	
);


$config['DynamicLogin']['theme']['Default'] = array(
	'coova_desktop'		=> '/rd_login/cc/d/index.html',
	'coova_mobile'		=> '/rd_login/cc/m/index.html',
	'mikrotik_desktop'	=> '/rd_login/mt/d/index.html',
	'mikrotik_mobile'	=> '/rd_login/mt/m/index.html',
	'ruckus_desktop'    => '/rd_login/ru/d/index.html',
	'ruckus_mobile'     => '/rd_login/ru/m/index.html',
);


$config['DynamicLogin']['theme']['Green'] = array(
	'coova_desktop'		=> '/rd_login/cc/d/index_green.html',
	'coova_mobile'		=> '/rd_login/cc/m/index_green.html',
	'mikrotik_desktop'	=> '/rd_login/mt/d/index_green.html',
	'mikrotik_mobile'	=> '/rd_login/mt/m/index_green.html',
	'ruckus_desktop'    => '/rd_login/ru/d/index_green.html',
	'ruckus_mobile'     => '/rd_login/ru/m/index_green.html',
);

$config['DynamicLogin']['theme']['Black'] = array(
	'coova_desktop'		=> '/rd_login/cc/d/index_black.html',
	'coova_mobile'		=> '/rd_login/cc/m/index_black.html',
	'mikrotik_desktop'	=> '/rd_login/mt/d/index_black.html',
	'mikrotik_mobile'	=> '/rd_login/mt/m/index_black.html',
	'ruckus_desktop'    => '/rd_login/ru/d/index_black.html',
	'ruckus_mobile'     => '/rd_login/ru/m/index_black.html',
);

$config['DynamicLogin']['theme']['Grey'] = array(
	'coova_desktop'		=> '/rd_login/cc/d/index_grey.html',
	'coova_mobile'		=> '/rd_login/cc/m/index_grey.html',
	'mikrotik_desktop'	=> '/rd_login/mt/d/index_grey.html',
	'mikrotik_mobile'	=> '/rd_login/mt/m/index_grey.html',
	'ruckus_desktop'    => '/rd_login/ru/d/index_grey.html',
	'ruckus_mobile'     => '/rd_login/ru/m/index_grey.html',
);


$config['DynamicLogin']['ruckus']['northbound']['password'] = 'stayoutnow123!';

$config['DynamicLogin']['i18n'][0]     = array('name' => 'English',     'id' => 'en_GB',   'active' => true);
$config['DynamicLogin']['i18n'][1]     = array('name' => 'Spanish',     'id' => 'es_ES',   'active' => true);
$config['DynamicLogin']['i18n'][2]     = array('name' => 'Afrikaans',   'id' => 'af_ZA',   'active' => true);


?>
