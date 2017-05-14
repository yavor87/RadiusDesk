<?php
namespace App\Shell\Task;

use Cake\Console\Shell;

class MigrateTask extends Shell{


    private $acos_entries_rename  = [
        'Ssids' => [
            ['old' => 'index_ap', 'new' => 'indexAp']
        ],
        'AccessProviders' => [
            ['old' => 'change_password',    'new' => 'changePassword'],
            ['old' => 'export_csv',         'new' => 'exportCsv'],
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel'],
            ['old' => 'enable_disable',     'new' => 'enableDisable']
        ],
        'Tags' => [
            ['old' => 'index_for_filter',   'new' => 'indexForFilter'],
            ['old' => 'export_csv',         'new' => 'exportCsv'],
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel']
        ],
        'Realms' => [
            ['old' => 'index_for_filter',   'new' => 'indexForFilter'],
            ['old' => 'export_csv',         'new' => 'exportCsv'],
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel'],
            ['old' => 'index_ap',           'new' => 'indexAp'],
            ['old' => 'update_na_realm',    'new' => 'updateNaRealm'],
            //Not listed here is uploadLogo
        ],
        'DynamicDetails' => [
            ['old' => 'upload_logo',        'new' => 'uploadLogo'],
            ['old' => 'index_photo ',       'new' => 'indexPhoto '],
            ['old' => 'upload_photo ',      'new' => 'uploadPhoto '],
            ['old' => 'delete_photo ',      'new' => 'deletePhoto'],
            ['old' => 'edit_photo',         'new' => 'editPhoto'],       
            ['old' => 'index_page',         'new' => 'indexPage'],
            ['old' => 'add_page',           'new' => 'addPage'],
            ['old' => 'edit_page',          'new' => 'editPage'],
            ['old' => 'delete_page',        'new' => 'deletePage'],         
            ['old' => 'index_pair',         'new' => 'indexPair'],
            ['old' => 'add_pair',           'new' => 'addPair'],
            ['old' => 'edit_pair',          'new' => 'editPair'],
            ['old' => 'delete_pair',        'new' => 'deletePair'],
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel'],   
            ['old' => 'edit_settings',      'new' => 'editSettings'],
            ['old' => 'view_social_login',  'new' => 'viewSocialLogin'],
            ['old' => 'edit_social_login',  'new' => 'editSocialLogin'],    
        ],
        'Profiles' => [
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel'],
            ['old' => 'index_ap',           'new' => 'indexAp'],
            ['old' => 'manage_components',  'new' => 'manageComponents'],
        ],
        'PermanentUsers' => [
            ['old' => 'view_basic_info',    'new' => 'viewBasicInfo'],
            ['old' => 'edit_basic_info',    'new' => 'editBasicInfo'],
            ['old' => 'view_personal_info', 'new' => 'viewPersonalInfo'],
            ['old' => 'edit_personal_info', 'new' => 'editPersonalInfo'],
            ['old' => 'private_attr_index', 'new' => 'privateAttrIndex'],
            ['old' => 'private_attr_add',   'new' => 'privateAttrAdd'],
            ['old' => 'private_attr_edit',  'new' => 'privateAttrEdit'],
            ['old' => 'private_attr_delete','new' => 'privateAttrDelete'],
            ['old' => 'change_password',    'new' => 'changePassword'],
            ['old' => 'enable_disable',     'new' => 'enableDisable'],
            ['old' => 'export_csv',         'new' => 'exportCsv'],
            ['old' => 'restrict_list_of_devices','new' => 'restrictListOfDevices'],
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel'],
            ['old' => 'auto_mac_on_off',    'new' => 'autoMacOnOff'],
            ['old' => 'view_password',      'new' => 'viewPassword']
        ],
        'Vouchers'      => [
            ['old' => 'view_basic_info',    'new' => 'viewBasicInfo'],
            ['old' => 'edit_basic_info',    'new' => 'editBasicInfo'],
            ['old' => 'private_attr_index', 'new' => 'privateAttrIndex'],
            ['old' => 'private_attr_add',   'new' => 'privateAttrAdd'],
            ['old' => 'private_attr_edit',  'new' => 'privateAttrEdit'],
            ['old' => 'private_attr_delete','new' => 'privateAttrDelete'],
            ['old' => 'change_password',    'new' => 'changePassword'],
            ['old' => 'export_csv',         'new' => 'exportCsv'],
            ['old' => 'export_pdf',         'new' => 'exportPdf'],
            ['old' => 'email_voucher_details', 'new' => 'emailVoucherDetails'],  
        ],
        'Devices'       => [
            ['old' => 'view_basic_info',    'new' => 'viewBasicInfo'],
            ['old' => 'edit_basic_info',    'new' => 'editBasicInfo'],
            ['old' => 'private_attr_index', 'new' => 'privateAttrIndex'],
            ['old' => 'private_attr_add',   'new' => 'privateAttrAdd'],
            ['old' => 'private_attr_edit',  'new' => 'privateAttrEdit'],
            ['old' => 'private_attr_delete','new' => 'privateAttrDelete'],
            ['old' => 'enable_disable',     'new' => 'enableDisable'],
            ['old' => 'export_csv',         'new' => 'exportCsv'],
            ['old' => 'note_index',         'new' => 'noteIndex'],
            ['old' => 'note_add',           'new' => 'noteAdd'],
            ['old' => 'note_del',           'new' => 'noteDel']   
        ]     
    ];

    public function initialize(){
        parent::initialize();
        $this->loadModel('Acos');
    }
    
    public function main(){
    
        $this->_rename_acos_entries();
        
    }
    
    private function _rename_acos_entries(){
        $this->hr();
        $this->out("Renaming ACOS entries");
        //Find the id of 'Access Providers'
        $q_ap   = $this->Acos->find()->where(['alias' => 'Access Providers'])->first();
        $ap_id  = $q_ap->id;
        $this->out("AccessProviders id is ".$ap_id);
        $q_ap_c = $this->Acos->find()->where(['alias' => 'Controllers','parent_id' => $ap_id])->first();
        $c_id   = $q_ap_c->id;
        $this->out("Controllers ID is ".$c_id);
             
        foreach(array_keys($this->acos_entries_rename) as $a){
        
            $this->hr();
            $this->out("Finding the ID of ".$a);
            $this->hr();
            //We put parent id  of 
            $q_a = $this->Acos->find()->where(['alias' => $a,'parent_id' => $c_id])->first();
            if($q_a){
                $parent_id = $q_a->id;
                $this->out($a." was found to have an id of ".$parent_id);
                foreach($this->acos_entries_rename[$a] as $b){
                    $old = $b['old'];
                    $new = $b['new'];
                    $q_b = $this->Acos->find()->where(['alias' => $old,'parent_id' => $parent_id])->first();
                    if($q_b){
                        $this->out("Updating $old on $a to $new");
                        $q_b->alias = $new;
                        $this->Acos->save($q_b);
                    }else{
                        $this->out("Could not find $old on $a assume it is already updated");
                    } 
                }
            }
        }   
        $this->hr();
    
    
    }
}
