<?php
App::uses('AppController', 'Controller');

class AutoMacsController extends AppController {

    public $name       = 'AutoMacs';
    public $components = array('Aa');
    public $uses       = array('AutoMac','User');
    protected $base    = "Access Providers/Controllers/AutoMacs/";

    protected $setup_items  = array(
        'ip_address',   'ip_mask',  'ip_gateway',   'ip_dns_1', 'ip_dns_2',
        'wifi_active',  'channel',  'power',        'distance', 'ssid_secure',  'radius',   'secret',   'ssid_open', 'eduroam',
        'vpn_server',   'tunnel_ip'
    );

    //var $scaffold;


//------------------------------------------------------------------------

    public function export_csv(){

        $this->autoRender   = false;

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        //Build query
        $user_id    = $user['id'];
        $c          = $this->_build_common_query($user);
        $q_r        = $this->{$this->modelClass}->find('all',$c);

        //Create file
        $this->ensureTmp();     
        $tmpFilename    = TMP . $this->tmpDir . DS .  strtolower( Inflector::pluralize($this->modelClass) ) . '-' . date('Ymd-Hms') . '.csv';
        $fp             = fopen($tmpFilename, 'w');

        //Headings
        $heading_line   = array();
        if(isset($this->request->query['columns'])){
            $columns = json_decode($this->request->query['columns']);
            foreach($columns as $c){
                array_push($heading_line,$c->name);
            }
        }
        fputcsv($fp, $heading_line,';','"');

        //Results
        foreach($q_r as $i){

            $columns    = array();
            $csv_line   = array();

            $as_items   = array();

            //We will create an array with all the items regardless:
            foreach($i['AutoSetup'] as $as_item){
                $item   = $as_item['description'];
                $value  = $as_item['value'];
                $as_items[$item] = $value;
            }



            if(isset($this->request->query['columns'])){
                $columns = json_decode($this->request->query['columns']);
                foreach($columns as $c){
                    $column_name = $c->name;
                    if($column_name == 'notes'){
                        $notes   = '';
                        foreach($i['AutoMacNote'] as $n){
                            if(!$this->_test_for_private_parent($n['Note'],$user)){
                                $notes = $notes.'['.$n['Note']['note'].']';    
                            }
                        }
                        array_push($csv_line,$notes);
                    }elseif($column_name =='owner'){
                        $owner_id       = $i['AutoMac']['user_id'];
                        $owner_tree     = $this->_find_parents($owner_id);
                        array_push($csv_line,$owner_tree); 
                    }else{

                        //Here we need to do some serious processing!
                        //================= ******* =================
                        if(in_array($column_name,array_keys($as_items))){
                            array_push($csv_line,$as_items[$column_name]);  
                        }else{
                            array_push($csv_line,$i['AutoMac']["$column_name"]); 
                        }

                        //===========================================

                        //array_push($csv_line,$i['AutoMac']["$column_name"]);  
                    }
                }
                fputcsv($fp, $csv_line,';','"');
            }
        }
        //Return results
        fclose($fp);
        $data = file_get_contents( $tmpFilename );
        $this->cleanupTmp( $tmpFilename );
        $this->RequestHandler->respondAs('csv');
        $this->response->download( strtolower( Inflector::pluralize( $this->modelClass ) ) . '.csv' );
        $this->response->body($data);
    }


    //____ BASIC CRUD AutoMacs Manager ________
    public function index(){

        //Display a list of AutoMac items with their owners
        //This will be dispalyed to the Administrator as well as Access Providers who has righs

        //__ Authentication + Authorization __
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
            //Create notes flag
            $notes_flag  = false;
            foreach($i['AutoMacNote'] as $nn){
                if(!$this->_test_for_private_parent($nn['Note'],$user)){
                    $notes_flag = true;
                    break;
                }
            }

            //IP DNS2 optional
            $ip_dns_2 = '';

            //EDUROAM = FALSE BY DEFAULT
            $eduroam = false;

            foreach($i['AutoSetup'] as $as_item){
                $item   = $as_item['description'];
                $value  = $as_item['value'];
               

                switch ($item) {
                    case 'ip_gateway':
                        $ip_gateway = $value;
                        break;
                    case 'ip_address':
                        $ip_address = $value;
                        break;
                    case 'ip_mask':
                        $ip_mask = $value;
                        break;
                    case 'ip_dns_1':
                        $ip_dns_1 = $value;
                        break;
                    case 'ip_dns_2':
                        $ip_dns_2 = $value;
                        break;
                    case 'wifi_active':
                        if($value == 1){
                            $wifi_active = true;
                        }else{
                            $wifi_active = false;
                        }
                        break;
                    case 'channel':
                        $channel = $value;
                        break;
                    case 'power':
                        $power = $value;
                        break;
                    case 'distance':
                        $distance = $value;
                        break;
                    case 'ssid_secure':
                        $ssid_secure = $value;
                        break;
                    case 'radius':
                        $radius = $value;
                        break;
                    case 'secret':
                        $secret = $value;
                        break;
                    case 'ssid_open':
                        $ssid_open = $value;
                        break;
                    case 'eduroam':
                        if($value == 1){
                            $eduroam = true;
                        }else{
                            $eduroam = false;
                        }
                        break;
                    case 'vpn_server':
                        $vpn_server = $value;
                        break;
                    case 'tunnel_ip':
                        $tunnel_ip = $value;
                        break;
                }
            }


            $owner_id       = $i['AutoMac']['user_id'];
            $owner_tree     = $this->_find_parents($owner_id);
            $action_flags   = $this->_get_action_flags($owner_id,$user);

            array_push($items,array(
                'id'                    => $i['AutoMac']['id'], 
                'name'                  => $i['AutoMac']['name'],
                'dns_name'              => $i['AutoMac']['dns_name'],
                'owner'                 => $owner_tree,
                'ip_address'            => $ip_address,
                'ip_mask'               => $ip_mask,
                'ip_gateway'            => $ip_gateway,
                'ip_dns_1'              => $ip_dns_1,
                'ip_dns_2'              => $ip_dns_2,
                'wifi_active'           => $wifi_active,
                'channel'               => intval($channel),
                'power'                 => intval($power),
                'distance'              => intval($distance),
                'ssid_secure'           => $ssid_secure,
                'radius'                => $radius,
                'secret'                => $secret,
                'ssid_open'             => $ssid_open,
                'eduroam'               => $eduroam,
                'vpn_server'            => $vpn_server,
                'tunnel_ip'             => $tunnel_ip,
                'last_contact'          => $i['AutoMac']['last_contact'],
                'contact_ip'            => $i['AutoMac']['contact_ip'],
                'notes'                 => $notes_flag
            ));
        }
       
        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items','success','totalCount')
        ));
    }

   
    public function add() {

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

        //Ensure the MAC is UC
        $this->request->data['name'] = strtoupper($this->request->data['name']);

        $this->{$this->modelClass}->create();
        if ($this->{$this->modelClass}->save($this->request->data)) {

            $add_return = $this->_add_settings($this->{$this->modelClass}->id);

            if($add_return ==false){
                $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }else{
                    //Since it failed; we need to remove the newly created MAC as well
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id);
                    $this->set(array(
                    'tab'       => 1,
                    'errors'    => array($add_return => 'IP Address already used'),
                    'success'   => false,
                    'message'   => array('message' => __('Could not create item')),
                    '_serialize' => array('errors','success','message','tab')
                )); 
            }
        } else {
            $message = 'Error';
            $this->set(array(
                'errors'    => $this->{$this->modelClass}->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not create item')),
                '_serialize' => array('errors','success','message')
            ));
        }
	}


    public function edit() {

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        if(isset($this->request->data['wifi_active'])){
            $this->request->data['wifi_active'] = 1;
        }else{
            $this->request->data['wifi_active'] = 0;
        }

        if(isset($this->request->data['eduroam'])){
            $this->request->data['eduroam'] = 1;
        }else{
            $this->request->data['eduroam'] = 0;
        }

        //Ensure the MAC is UC
        $this->request->data['name'] = strtoupper($this->request->data['name']);

        //Get the original MAC if there was a failure:
        $this->{$this->modelClass}->contain();
        $q_r        = $this->{$this->modelClass}->findById($this->request->data['id']);
        $old_mac    = $q_r['AutoMac']['name'];

        if($old_mac != $this->request->data['name']){ //MAC changed make clean the last_contact
            $this->request->data['last_contact'] = null;
        }

		if($this->{$this->modelClass}->save($this->request->data)) { //Update any way for fetch script to get latest after changes
       
            $edit_return = $this->_edit_settings();

            if($edit_return ==false){
                $this->set(array(
                    'success' => true,
                    '_serialize' => array('success')
                ));
            }else{
                    //Since it failed; we need to revert back to the old MAC if it is different
                    if($old_mac != $this->request->data['name']){
                        $this->{$this->modelClass}->id = $this->request->data['id'];    
                        $this->{$this->modelClass}->saveField('name', $old_mac);
                    }
                    $this->set(array(
                    'tab'       => 0,
                    'errors'    => array($edit_return => 'IP Address already used'),
                    'success'   => false,
                    'message'   => array('message' => __('Could not edit item')),
                    '_serialize' => array('errors','success','message','tab')
                )); 
            }
        }else{
             $this->set(array(
                'errors'    => $this->{$this->modelClass}->validationErrors,
                'success'   => false,
                'message'   => array('message' => __('Could not update item')),
                '_serialize' => array('errors','success','message')
            ));
        }
	}

    public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $user_id    = $user['id'];
        $fail_flag = false;

	    if(isset($this->data['id'])){   //Single item delete
            $this->{$this->modelClass}->id = $this->data['id'];
            $this->{$this->modelClass}->delete($this->data['id'],true);
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){
                $this->{$this->modelClass}->id = $d['id'];
                $this->{$this->modelClass}->delete($d['id'], true);
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


    public function view(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
    
        $items = array();

        if(isset($this->request->query['am_id'])){
            $this->{$this->modelClass}->contain('AutoSetup');
            $q_r = $this->{$this->modelClass}->findById($this->request->query['am_id']);
            if($q_r){
                $items['id']   = $q_r['AutoMac']['id']; 
                $items['name'] = $q_r['AutoMac']['name'];
                $items['dns_name'] = $q_r['AutoMac']['dns_name'];
                foreach($q_r['AutoSetup'] as $as){
                    $item   = $as['description'];
                    $value  = $as['value'];
                    if(in_array($item,$this->setup_items)){
                        if(($item == 'channel')||($item == 'power')||($item == 'distance')){
                            $value = intval($value);
                        }
                        if($item == 'wifi_active'){
                            if($value == "1"){
                                $value = true;
                            }else{
                                $value = false;
                            } 
                        }
                        if($item == 'eduroam'){
                            if($value == "1"){
                                $value = true;
                            }else{
                                $value = false;
                            } 
                        }

                        $items[$item] = $value;
                    }
                }
            }
        }
      
        $this->set(array(
            'data'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }


    public function default_values(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $user_id    = $user['id'];
 
        $items = Configure::read('experimental.defaults');
        $items['tunnel_ip'] = $this->_get_next_avail_tunnel_ip();

        //Temp add
        $items['name']          = '00:02:6F:65:5A:C9';
        $items['ip_address']    = '192.168.99.150';
        $items['ip_gateway']    = '192.168.99.1';

        $this->set(array(
            'data'     => $items,
            'success'   => true,
            '_serialize'=> array('success', 'data')
        ));
    }

     function configuration_for($mac,$timestamp=0){

       //The AP can send an optional timestamp (unix timestamp) which will be compared.
       //This will be the timestamp of the date of the last modification to the mac or auto-setup values


        $this->layout = 'ajax';

        //Mac will arrive in form XX-XX-XX-XX-XX-XX we must get it in form XX:XX:XX:XX:XX:XX
        $mac = preg_replace('/-/', ':', $mac);

        
        //Update the AutoMac table to show this request
        $qr = $this->AutoMac->find('first',array('conditions' => array('AutoMac.name' => $mac)));
        if($qr == ''){
            $this->set('config_string','');
            return;
        }

         
        if($qr != ''){
            $request_from = $_SERVER["REMOTE_ADDR"];
            $d['AutoMac']['id']         = $qr['AutoMac']['id'];
            $d['AutoMac']['contact_ip'] = $request_from;
            $d['AutoMac']['last_contact'] = date("Y-m-d H:i:s",time());
            $d['AutoMac']['modified']   = false; //We are not changing the modified time only updating the last_contact field
            $this->{$this->modelClass}->save($d);
            $modified                   = $qr['AutoMac']['modified'];
            $mac_id                     = $qr['AutoMac']['id'];
            $dns_name                   = $qr['AutoMac']['dns_name'];
        }

        //See if we need to return something:
        $last_change_stamp = strtotime($qr['AutoMac']['modified']);
        if(($timestamp != 0)&&($timestamp == $last_change_stamp)){
            $this->set('config_string','');
            return;
        }

        $fb = '';
  
        $fb =   "file_name:\n".
                "/etc/config/network.fixed_ip\n".
                "file_content:\n".
                $this->_return_network_settings($mac);

        //Get the VPN detail - if required
        $vpn_string = $this->_return_vpn($mac_id);
        $fb = $fb.$vpn_string;

        //Get the Wireless detail - if required
        $wireless_string = $this->_return_wireless($mac_id);
        $fb = $fb.$wireless_string;

        //Get the snmpd detail
        $snmpd_string = $this->_return_snmp($dns_name);
        $fb = $fb.$snmpd_string;

        //Add the timestamp
        $fb =   $fb."\nfile_name:\n".
                "/etc/autosetup/timestamp\n".
                "file_content:\n".
                "$last_change_stamp\n";

        $this->set('config_string',$fb);

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
            $q_r    = $this->AutoMac->AutoMacNote->find('all', 
                array(
                    'contain'       => array('Note'),
                    'conditions'    => array('AutoMacNote.auto_mac_id' => $tag_id)
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
        $this->AutoMac->AutoMacNote->Note->create(); 
        //print_r($this->request->data);
        if ($this->AutoMac->AutoMacNote->Note->save($this->request->data)) {
            $d                      = array();
            $d['AutoMacNote']['auto_mac_id']   = $this->request->data['for_id'];
            $d['AutoMacNote']['note_id'] = $this->AutoMac->AutoMacNote->Note->id;
            $this->AutoMac->AutoMacNote->create();
            if ($this->AutoMac->AutoMacNote->save($d)) {
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
            $item       = $this->AutoMac->AutoMacNote->Note->findById($this->data['id']);
            $owner_id   = $item['Note']['user_id'];
            if($owner_id != $user_id){
                if($this->_is_sibling_of($user_id,$owner_id)== true){
                    $this->AutoMac->AutoMacNote->Note->id = $this->data['id'];
                    $this->AutoMac->AutoMacNote->Note->delete($this->data['id'],true);
                }else{
                    $fail_flag = true;
                }
            }else{
                $this->AutoMac->AutoMacNote->Note->id = $this->data['id'];
                $this->AutoMac->AutoMacNote->Note->delete($this->data['id'],true);
            }
   
        }else{                          //Assume multiple item delete
            foreach($this->data as $d){

                $item       = $this->AutoMac->AutoMacNote->Note->findById($d['id']);
                $owner_id   = $item['Note']['user_id'];
                if($owner_id != $user_id){
                    if($this->_is_sibling_of($user_id,$owner_id) == true){
                        $this->AutoMac->AutoMacNote->Note->id = $d['id'];
                        $this->AutoMac->AutoMacNote->Note->delete($d['id'],true);
                    }else{
                        $fail_flag = true;
                    }
                }else{
                    $this->AutoMac->AutoMacNote->Note->id = $d['id'];
                    $this->AutoMac->AutoMacNote->Note->delete($d['id'],true);
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
                    array('xtype' => 'button', 'iconCls' => 'b-add',    'glyph' => Configure::read('icnAdd'),    'scale' => 'large', 'itemId' => 'add',      'tooltip'=> __('Add')),
                    array('xtype' => 'button', 'iconCls' => 'b-delete', 'glyph' => Configure::read('icnDelete'),  'scale' => 'large', 'itemId' => 'delete',   'tooltip'=> __('Delete')),
                    array('xtype' => 'button', 'iconCls' => 'b-edit',    'glyph' => Configure::read('icnEdit'), 'scale' => 'large', 'itemId' => 'edit',     'tooltip'=> __('Edit'))
                )),
                array('xtype' => 'buttongroup','title' => __('Document'), 'items' => array(
                    array('xtype' => 'button', 'iconCls' => 'b-note',     'glyph' => Configure::read('icnNote'),'scale' => 'large', 'itemId' => 'note',    'tooltip'=> __('Add notes')),
                    array('xtype' => 'button', 'iconCls' => 'b-csv',     'glyph' => Configure::read('icnCsv'),'scale' => 'large', 'itemId' => 'csv',      'tooltip'=> __('Export CSV')),
                ))
                
            );
        }

        //AP depend on rights
        if($user['group_name'] == Configure::read('group.ap')){ //AP (with overrides)
            $id             = $user['id'];
            $action_group   = array();
            $document_group = array();
            $specific_group = array();

            array_push($action_group,array(  
                'xtype'     => 'button',
                'iconCls'   => 'b-reload',
                'glyph'     => Configure::read('icnReload'),  
                'scale'     => 'large', 
                'itemId'    => 'reload',   
                'tooltip'   => __('Reload')));

            //Add
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base."add")){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-add',
                    'glyph'     => Configure::read('icnAdd'),     
                    'scale'     => 'large', 
                    'itemId'    => 'add',      
                    'tooltip'   => __('Add')));
            }
            //Delete
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'delete')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-delete', 
                    'glyph'     => Configure::read('icnDelete'), 
                    'scale'     => 'large', 
                    'itemId'    => 'delete',
                    'disabled'  => true,   
                    'tooltip'   => __('Delete')));
            }

            //Edit
            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'edit')){
                array_push($action_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-edit', 
                    'glyph'     => Configure::read('icnEdit'),   
                    'scale'     => 'large', 
                    'itemId'    => 'edit',
                    'disabled'  => true,     
                    'tooltip'   => __('Edit')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'note_index')){ 
                array_push($document_group,array(
                        'xtype'     => 'button', 
                        'iconCls'   => 'b-note',
                        'glyph'     => Configure::read('icnNote'),     
                        'scale'     => 'large', 
                        'itemId'    => 'note',      
                        'tooltip'   => __('Add Notes')));
            }

            if($this->Acl->check(array('model' => 'User', 'foreign_key' => $id), $this->base.'export_csv')){ 
                array_push($document_group,array(
                    'xtype'     => 'button', 
                    'iconCls'   => 'b-csv',
                    'glyph'     => Configure::read('icnCsv'),     
                    'scale'     => 'large', 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Export CSV')));
            }

            $menu = array(
                        array('xtype' => 'buttongroup','title' => __('Action'),        'items' => $action_group),
                        array('xtype' => 'buttongroup','title' => __('Document'),   'items' => $document_group)
                   );
        }
        $this->set(array(
            'items'         => $menu,
            'success'       => true,
            '_serialize'    => array('items','success')
        ));
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

    private function _is_sibling_of($parent_id,$user_id){
        $this->User->contain();//No dependencies
        $q_r        = $this->User->getPath($user_id);
        foreach($q_r as $i){
            $id = $i['User']['id'];
            if($id == $parent_id){
                return true;
            }
        }
        //No match
        return false;
    }

    function _build_common_query($user){

        //Empty to start with
        $c                  = array();
        $c['joins']         = array(); 
        $c['conditions']    = array();

        $already_joined     = false;

        //What should we include....
        $c['contain']   = array(
                            'AutoMacNote'    => array('Note.note','Note.id','Note.available_to_siblings','Note.user_id'),
                            'User',
                            'AutoSetup',
                            'AutoContact'
                        );

        //===== SORT =====
        //Default values for sort and dir
        $sort   = 'AutoMac.name';
        $dir    = 'DESC';

        if(isset($this->request->query['sort'])){
            $sort_item = $this->request->query['sort'];
            if($sort_item == 'owner'){
                $sort = 'User.username';
            }elseif(in_array($sort_item,$this->setup_items)){
                if($already_joined == false){
                    array_push($c['joins'],array(
                        'table'         => 'auto_setups',
                        'alias'         => 'AutoSetup',
                        'type'          => 'LEFT',
                        'conditions'    => array('AutoSetup.auto_mac_id = AutoMac.id')
                    ));
                    $already_joined = true;
                }
                
                array_push($c['conditions'],array("AutoSetup.description" => $this->request->query['sort']));
            
                $sort = "AutoSetup.value";
            }else{
                $sort = $this->modelClass.'.'.$this->request->query['sort'];
            }
            $dir  = $this->request->query['dir'];
        } 
        $c['order'] = array("$sort $dir");
        //==== END SORT ===


        //====== REQUEST FILTER =====
        if(isset($this->request->query['filter'])){
            $filter_array = array();
            $filter = json_decode($this->request->query['filter']);            
            foreach($filter as $f){
                //Strings
                if($f->type == 'string'){
                    if($f->field == 'owner'){
                        array_push($filter_array,array("User.username LIKE" => '%'.$f->value.'%'));
                    }elseif(in_array($f->field,$this->setup_items)){                       
                        //Add a search clause
                        //Join the Radcheck table - only together with clause:
                        if($already_joined == false){
                            array_push($c['joins'],array(
                                'table'         => 'auto_setups',
                                'alias'         => 'AutoSetup',
                                'type'          => 'LEFT',
                                'conditions'    => array('AutoSetup.auto_mac_id = AutoMac.id')
                            ));
                            $already_joined = true;
                        }
                        array_push($c['conditions'],array(
                            'AutoSetup.description'  => $f->field,
                            "AutoSetup.value LIKE" => '%'.$f->value.'%'
                        ));
                      ///  array_push($filter_array,array(
                      ///      'AutoSetup.description'  => $f->field,
                     ///       "AutoSetup.value LIKE" => '%'.$f->value.'%'
                     ///   ));

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

          ////  array_push($c['conditions'],array('OR' => $filter_array));

        }
        //====== END REQUEST FILTER =====

        //====== AP FILTER =====
        //If the user is an AP; we need to add an extra clause to only show the Tags which he is allowed to see.
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
                    array_push($tree_array,array('AutoMac.user_id' => $i_id));
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


    //    print_r($c);
    
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

            //Test for Children
            foreach($this->children as $i){
                if($i['User']['id'] == $owner_id){
                    return array('update' => true, 'delete' => true);
                }
            }  
        }
    }

    private function _get_next_avail_tunnel_ip(){

        $as = ClassRegistry::init('AutoSetup');
        $q_r = $as->find('first', array('order' => array('AutoSetup.value ASC'),'conditions' => array('AutoSetup.description' => 'tunnel_ip')));
        if($q_r){
            $ip         = $q_r['AutoSetup']['value'];
            $next_ip    = $this->_get_next_ip($ip);           
            $not_available = true;
            while($not_available){
                if($this->_check_if_available($next_ip)){
                    return $next_ip;
                    $not_available = false;
                    break;
                }else{
                    $next_ip = $this->_get_next_ip($next_ip);
                }
            }              
        }else{ //The very first entry
            return Configure::read('experimental.openvpn.start_ip');
        }

    }

    private function _check_if_available($ip){
        $as     = ClassRegistry::init('AutoSetup');
        $count  = $as->find('count', array('conditions' => array('AutoSetup.description' => 'tunnel_ip','AutoSetup.value' => $ip)));
        if($count == 0){
            return true;
        }else{
            return false;
        }
    }

    private function _get_next_ip($ip){

        $pieces     = explode('.',$ip);
        $octet_1    = $pieces[0];
        $octet_2    = $pieces[1];
        $octet_3    = $pieces[2];
        $octet_4    = $pieces[3];

        if($octet_4 >= 254){
            $octet_4 = 1;
            $octet_3 = $octet_3 +1;
        }else{

            $octet_4 = $octet_4 +1;
        }
        $next_ip = $octet_1.'.'.$octet_2.'.'.$octet_3.'.'.$octet_4;
        return $next_ip;
    }


    private function _edit_settings(){

        $auto_mac_id = $this->request->data['id'];
        $this->{$this->modelClass}->AutoSetup->contain();

        //Check for existing entries using this IP
        $new_ip   = $this->request->data['ip_address'];
        $ip_count = $this->{$this->modelClass}->AutoSetup->find('count',
                    array('conditions' => 
                        array(
                            'AutoSetup.value'       => $new_ip,
                            'AutoSetup.description' => 'ip_address',
                            array('NOT' =>array('AutoSetup.auto_mac_id' => $auto_mac_id )
                        ))));
        if($ip_count > 0){
            //Not allowed! we can not allow this
            return 'ip_address';
        }

        //IP passed... loop through a list and modify the entries
        foreach($this->setup_items as $item){
            if($item != 'tunnel_ip'){ //Exception list
                $val = $this->request->data[$item];
                $q_r    = $this->{$this->modelClass}->AutoSetup->find('first', 
                        array('conditions' => array('AutoSetup.auto_mac_id' => $auto_mac_id,'AutoSetup.description' => $item)));
                if($q_r){
                    $this->{$this->modelClass}->AutoSetup->id = $q_r['AutoSetup']['id'];
                    $this->{$this->modelClass}->AutoSetup->saveField('value', $val);
                }
            }
        }
        return false;
    }

    private function _add_settings($mac_id){

        //Find the Auto Group ID's
        $ag     = ClassRegistry::init('AutoGroup');
        $ag->contain();
        $ag_q   = $ag->find('all');
        $ag_hash = array();
        foreach($ag_q as $i){
            $name = $i['AutoGroup']['name'];
            $ag_hash[$name] = $i['AutoGroup']['id'];
        }

        //___ NETWORK___
        $ag_id = $ag_hash['Network'];

        //IP is unique; we need to find if there is not perhaps duplicates
        $ip = $this->request->data['ip_address'];
        $count = $this->{$this->modelClass}->AutoSetup->find('count', 
                array('conditions' => array('AutoSetup.description' => 'ip_address','AutoSetup.value' => $ip))
        );
        if($count > 0){
            //Not allowed! we can not allow this
            return 'ip_address';
        } 
        $this->_add_setting($ag_id,$mac_id,'ip_address', $ip);

        $this->_add_setting($ag_id,$mac_id,'ip_mask',       $this->request->data['ip_mask']);
        $this->_add_setting($ag_id,$mac_id,'ip_gateway',    $this->request->data['ip_gateway']);
        $this->_add_setting($ag_id,$mac_id,'ip_dns_1',      $this->request->data['ip_dns_1']);
        $this->_add_setting($ag_id,$mac_id,'ip_dns_2',      $this->request->data['ip_dns_2']);

        //__ Wireless____
        $ag_id = $ag_hash['Wireless'];

        if(isset($this->request->data['wifi_active'])){
            $this->_add_setting($ag_id,$mac_id,'wifi_active',   1);
        }else{
            $this->_add_setting($ag_id,$mac_id,'wifi_active',   0);
        }
        $this->_add_setting($ag_id,$mac_id,'channel',       $this->request->data['channel']);
        $this->_add_setting($ag_id,$mac_id,'power',         $this->request->data['power']);
        $this->_add_setting($ag_id,$mac_id,'distance',      $this->request->data['distance']);

        $this->_add_setting($ag_id,$mac_id,'ssid_secure',   $this->request->data['ssid_secure']);
        $this->_add_setting($ag_id,$mac_id,'radius',        $this->request->data['radius']);
        $this->_add_setting($ag_id,$mac_id,'secret',        $this->request->data['secret']);
        $this->_add_setting($ag_id,$mac_id,'ssid_open',     $this->request->data['ssid_open']);

        if(isset($this->request->data['eduroam'])){
            $this->_add_setting($ag_id,$mac_id,'eduroam',   1);
        }else{
            $this->_add_setting($ag_id,$mac_id,'eduroam',   0);
        }

        //___OpenVPN___
        $ag_id = $ag_hash['OpenVPN'];
        $t_ip  = $this->_get_next_avail_tunnel_ip();
        $this->_add_setting($ag_id,$mac_id,'vpn_server',    $this->request->data['vpn_server']);
        $this->_add_setting($ag_id,$mac_id,'tunnel_ip',     $t_ip);

        //If all went well we can return false
        return false;

    }

    private function _add_setting($auto_group_id,$mac_id,$desc,$val){
        $d['AutoSetup']['description']  = $desc;
        $d['AutoSetup']['value']        = $val;
        $d['AutoSetup']['auto_mac_id']  = $mac_id;
        $d['AutoSetup']['auto_group_id']= $auto_group_id;
        $this->{$this->modelClass}->AutoSetup->create();
        $this->{$this->modelClass}->AutoSetup->save($d);
        $this->{$this->modelClass}->AutoSetup->id = false;
    }

    private  function _return_network_settings($mac){

        $qr = $this->{$this->modelClass}->find('first',array('conditions' => array('AutoMac.name' => $mac)));
        
        $ip         = '';
        $gateway    = '';
        $mask       = '';
        $dns_1      = '';
        $dns_2      = '';

        foreach($qr['AutoSetup'] as $setting){
            ($setting['description'] == 'ip_address')&&($ip = $setting['value']);
            ($setting['description'] == 'ip_gateway')&&($gateway = $setting['value']);
            ($setting['description'] == 'ip_mask')&&($mask = $setting['value']);
            ($setting['description'] == 'ip_dns_1')&&($dns_1 = $setting['value']);
            ($setting['description'] == 'ip_dns_2')&&($dns_2 = $setting['value']);
        }

        $network = "\nconfig 'interface' 'loopback'\n".
                    "option 'ifname' 'lo'\n".
                    "option 'proto' 'static'\n".
                    "option 'ipaddr' '127.0.0.1'\n".
                    "option 'netmask' '255.0.0.0'\n".
                    "\n".
                    "config 'interface' 'lan'\n".
                    "option 'ifname' 'eth0'\n".
                    "option 'type' 'bridge'\n".
                    "option 'proto' 'static'\n".
                    "option 'netmask' '$mask'\n".
                    "option 'ipaddr' '$ip'\n".
                    "option 'gateway' '$gateway'\n".
                    "option 'dns' '$dns_1 $dns_2'\n\n";
        return $network;
    }

    private function _return_wireless($mac_id){

        $return_string = '';

        //_________ Start off with the /etc/config/wireless file ____________
        //__ Settings to check on this one:______________________________________
        //__ 1.) vpn_server _____________________________________________________

        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'wifi_active','AutoSetup.auto_mac_id' => $mac_id)));
        $enabled    = $q_r['AutoSetup']['value'];
        if($enabled == true){
            $enabled = '#';
        }else{
            $enabled = '';
        }

        //General settings
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'channel','AutoSetup.auto_mac_id' => $mac_id)));
        $channel    = $q_r['AutoSetup']['value'];
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'power','AutoSetup.auto_mac_id' => $mac_id)));
        $power      = $q_r['AutoSetup']['value'];
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'distance','AutoSetup.auto_mac_id' => $mac_id)));
        $distance   = $q_r['AutoSetup']['value'];

        //Secure SSID
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'ssid_secure','AutoSetup.auto_mac_id' => $mac_id)));
        $secure_ssid= $q_r['AutoSetup']['value'];
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'radius','AutoSetup.auto_mac_id' => $mac_id)));
        $radius     = $q_r['AutoSetup']['value'];
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'secret','AutoSetup.auto_mac_id' => $mac_id)));
        $secret     = $q_r['AutoSetup']['value'];

        //Open SSID
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'ssid_open','AutoSetup.auto_mac_id' => $mac_id)));
        $open_ssid  = $q_r['AutoSetup']['value'];

        //Eduroam flag
        $eduroam = false;
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', array('conditions' =>array( 'AutoSetup.description' => 'eduroam','AutoSetup.auto_mac_id' => $mac_id)));
        if($q_r['AutoSetup']['value'] == '1'){
            $eduroam = true;
        }
        

        //NB add auth options......
        $wireless =
                "file_name:\n".
                "/etc/config/wireless\n".
                "file_content:\n". 
                    "\nconfig wifi-device  radio0\n".
                    "\toption type     mac80211\n".
                    "\toption phy      phy0\n".
                    "\toption hwmode   11g\n".
                    "\toption channel  $channel\n".
                    "\toption txpower  19\n".
                    "\toption distance $distance\n\n".
                    "# REMOVE THIS LINE TO ENABLE WIFI:\n".
                    $enabled."option disabled 1\n\n".
                    "config wifi-iface\n".
                    "\toption device   radio0\n".
                    "\toption network  lan\n".
                    "\toption mode ap\n".
                    "\toption ssid '$secure_ssid'\n".
                    "\toption encryption wpa2\n".
                    "\toption auth_server $radius\n".
                    "\toption auth_secret $secret\n".
                    "\toption acct_server $radius\n".
                    "\toption acct_secret $secret\n".
                    "\toption acct_interval 600\n".
                    "\toption port 1812\n\n".
                    "config wifi-iface\n".
                    "\toption device   radio0\n".
                    "\toption mode ap\n".
                    "\toption ssid '$open_ssid'\n\n";
        $return_string = $return_string."\n".$wireless;

        //Eduroam?
        if($eduroam){

            $srv  = Configure::read('experimental.eduroam.radius_server');
            $scrt = Configure::read('experimental.eduroam.radius_secret');
            $return_string = $return_string.
                "config wifi-iface\n".
                "\toption device   radio0\n".
                "\toption network  lan\n".
                "\toption mode ap\n".
                "\toption ssid 'eduroam'\n".
                "\toption encryption wpa2\n".
                "\toption auth_server $srv\n".
                "\toption auth_secret $scrt\n".
                "\toption acct_server $srv\n".
                "\toption acct_secret $scrt\n".
                "\toption acct_interval 600\n".
                "\toption port 1812\n\n";
        }
        return $return_string;
    }

    private function _return_vpn($mac_id){

        $return_string = '';

        //_________ Start off with the /etc/openvpn/my-vpn.conf file ____________
        //__ Settings to check on this one:______________________________________
        //__ 1.) vpn_server _____________________________________________________

        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', 
                array('conditions' =>array( 'AutoSetup.description' => 'vpn_server','AutoSetup.auto_mac_id' => $mac_id)));
        $vpn_server     = $q_r['AutoSetup']['value'];

        $my_vpn =
                "file_name:\n".
                "/etc/openvpn/my-vpn.conf\n".
                "file_content:\n". 
                "client\n".
                "dev tap0\n".
                "proto udp\n".
                "remote $vpn_server 1194\n". 
                "resolv-retry infinite\n".
                "nobind\n".
                "persist-key\n". 
                "persist-tun\n".
                "tun-mtu 1500\n".
                "tun-mtu-extra 32\n". 
                "mssfix 1450\n".
                "ca /etc/openvpn/ca.crt\n".
                "auth none\n".
                "cipher none\n". 
                "comp-lzo\n".
                "auth-user-pass /etc/openvpn/up";
        $return_string = $return_string."\n".$my_vpn;

        //______ /etc/openvpn/ca.crt  _____
        
            $ca =
                "file_name:\n".
                "/etc/openvpn/ca.crt\n".
                "file_content:\n".
                Configure::read('experimental.openvpn.ca')."\n"; 
            $return_string = $return_string."\n".$ca;


       
        //______ /etc/openvpn/start.sh  _____
        $q_r = $this->{$this->modelClass}->AutoSetup->find('first', 
                array('conditions' =>array( 'AutoSetup.description' => 'tunnel_ip','AutoSetup.auto_mac_id' => $mac_id)));
        $tun_ip     = $q_r['AutoSetup']['value'];

        $tun_mask     = Configure::read('experimental.openvpn.mask');

        $tun_broadcast = Configure::read('experimental.openvpn.broadcast');

        if($q_r){

            $tun_detail =
                "file_name:\n".
                "/etc/openvpn/start.sh\n".
                "file_content:\n".
                "#! /bin/sh\n".
                "echo 'Start VPN'\n". 
                "openvpn --rmtun --dev tap0\n". 
                "openvpn --mktun --dev tap0\n". 
                "brctl addbr br-vpn\n". 
                "brctl delif br-lan wlan0-1\n". 
                "brctl addif br-vpn wlan0-1\n". 
                "brctl addif br-vpn tap0\n".
                "ifconfig br-vpn $tun_ip netmask $tun_mask broadcast $tun_broadcast\n"; 
 
            $return_string = $return_string."\n".$tun_detail;
        }
        return $return_string;
    }

    private function _return_snmp($dns_name){

        $mail   = Configure::read('experimental.snmp.contact'); 
        $ro     = Configure::read('experimental.snmp.ro'); 
        $rw     = Configure::read('experimental.snmp.rw');

        $return_string = 
            "file_name:\n".
                "/etc/config/snmpd_wip\n".
            "file_content:\n".
            "config agent\n".   //n
	        "option agentaddress UDP:161\n\n".
            "config com2sec public\n".
	        "option secname ro\n".
	        "option source default\n".
	        "option community $ro\n\n".
            "config com2sec private\n". //n
	        "option secname rw\n".
	        "option source localhost\n".
	        "option community $rw\n\n".
            "config group public_v1\n". //n
	        "option group public\n".
	        "option version v1\n".
	        "option secname ro\n\n".
            "config group public_v2c\n".    //n
	        "option group public\n".
	        "option version v2c\n".
	        "option secname ro\n\n".
            "config group public_usm\n".    //n
	        "option group public\n".
	        "option version usm\n".
	        "option secname ro\n\n".
            "config group private_v1\n".    //n
	        "option group private\n".
	        "option version v1\n".
	        "option secname rw\n\n".    //n
            "config group private_v2c\n".
	        "option group private\n".
	        "option version v2c\n".
	        "option secname rw\n\n".
            "config group private_usm\n".   //n
	        "option group private\n".
	        "option version usm\n".
	        "option secname rw\n\n".
            "config view all\n".
	        "option viewname all\n".
	        "option type included\n".
	        "option oid .1\n\n".
            "config access public_access\n".    //n
	        "option group public\n".
	        "option context none\n".
	        "option version any\n".
	        "option level noauth\n".
	        "option prefix exact\n".
	        "option read all\n".
	        "option write none\n".
	        "option notify none\n\n".
            "config access private_access\n" .   //n
	        "option group private\n".
	        "option context none\n".
	        "option version any\n".
	        "option level noauth\n".
	        "option prefix exact\n".
	        "option read all\n".
	        "option write all\n".
	        "option notify all\n\n".    
            "config system\n".  //n
	        "option sysLocation	'office'\n".
	        "option sysContact	'$mail'\n".
	        "option sysName		'$dns_name'\n".
            "#	option sysServices	72\n".
            "#	option sysDescr		'adult playground'\n".
            "#	option sysObjectID	'1.2.3.4'\n\n".
            "config exec\n".
	        "option name	filedescriptors\n".
	        "option prog	/bin/cat\n".
	        "option args	/proc/sys/fs/file-nr\n".
            "#	option miboid	1.2.3.4\n\n";

        return $return_string;
    }


}
