Ext.define('Rd.controller.cPermanentUsers', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){
        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('permanentUsersWin');
        if(!win){
            win = desktop.createWindow({
                id: 'permanentUsersWin',
                title: i18n('sPermanent_Users'),
                width:800,
                height:400,
                iconCls: 'users',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'permanentUsersWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: i18n('sPermanent_Users'),
                        image:  'resources/images/48x48/users.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : true,
                        items   : { 'title' : i18n('sPermanent_Users'), xtype: 'gridPermanentUsers'}
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
       'components.pnlBanner',  'permanentUsers.gridPermanentUsers',   'permanentUsers.winPermanentUserAddWizard',
       'components.cmbRealm',   'components.cmbProfile',  'components.cmbCap'
    ],
    stores: ['sAccessProvidersTree',    'sPermanentUsers', 'sRealms',   'sProfiles' ],
    models: ['mAccessProviderTree',     'mPermanentUser',  'mRealm',    'mProfile' ],
    selectedRecord: null,
     config: {
        urlAdd:             '/cake2/rd_cake/permanent_users/add.json',
      //  urlEdit:            '/cake2/rd_cake/profiles/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/permanent_users/export_csv',
        urlNoteAdd:         '/cake2/rd_cake/permanent_users/note_add.json'
    },
    refs: [
        {  ref: 'grid',  selector:   'gridPermanentUsers'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

      //  me.getStore('sPermanentUsers').addListener('load',me.onStorePermanentUsersLoaded, me);
        me.control({
           'gridPermanentUsers #reload': {
                click:      me.reload
            }, 
            'gridPermanentUsers #add'   : {
                click:      me.add
            },
            'gridPermanentUsers #delete'   : {
              //  click:      me.del
            },
            'gridPermanentUsers #edit'   : {
              //  click:      me.edit
            },
            'gridPermanentUsers #note'   : {
              //  click:      me.note
            },
            'gridPermanentUsers #csv'  : {
             //   click:      me.csvExport
            },
            'gridPermanentUsers'   : {
              //  select:      me.select
            },
            'winPermanentUserAddWizard' :{
                toFront: me.maskHide
            },
            'winPermanentUserAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winPermanentUserAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winPermanentUserAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
            'winPermanentUserAddWizard #profile' : {
                change:  me.cmbProfileChange
            },
            'winPermanentUserAddWizard #always_active' : {
                change:  me.chkAlwaysActiveChange
            },
            '#winCsvColumnSelectPermanentUsers':{
             //   toFront:       me.maskHide
            },
            '#winCsvColumnSelectPermanentUsers #save': {
              //  click:  me.csvExportSubmit
            },
            'gridNote[noteForGrid=permanentUsers] #reload' : {
              //  click:  me.noteReload
            },
            'gridNote[noteForGrid=permanentUsers] #add' : {
               // click:  me.noteAdd
            },
            'gridNote[noteForGrid=permanentUsers] #delete' : {
               // click:  me.noteDelete
            },
            'gridNote[noteForGrid=permanentUsers]' : {
               // itemclick: me.gridNoteClick
            },
            'winNote[noteForGrid=permanentUsers]':{
              //  toFront:       me.maskHide
            },
            'winNoteAdd[noteForGrid=permanentUsers] #btnNoteTreeNext' : {
              //  click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=permanentUsers] #btnNoteAddPrev'  : {   
              //  click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=permanentUsers] #btnNoteAddNext'  : {   
               // click: me.btnNoteAddNext
            }
        });
    },
    reload: function(){
        var me =this;
        me.getStore('sPermanentUsers').load();
    },
    maskHide:   function(){
        var me =this;
        me.getGrid().mask.hide();
    },
    add: function(button){  
        var me = this;
        me.getGrid().mask.show();
        //We need to do a check to determine if this user (be it admin or acess provider has the ability to add to children)
        //admin/root will always have, an AP must be checked if it is the parent to some sub-providers. If not we will 
        //simply show the nas connection typer selection 
        //if it does have, we will show the tree to select an access provider.
        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                        
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winPermanentUserAddWizardId')){
                            var w = Ext.widget('winPermanentUserAddWizard',{id:'winPermanentUserAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winPermanentUserAddWizardId')){
                            var w = Ext.widget('winPermanentUserAddWizard',
                                {id:'winPermanentUserAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
                            );
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }
                }   
            },
            scope: me
        });
    },
    btnTreeNext: function(button){
        var me = this;
        var tree = button.up('treepanel');
        //Get selection:
        var sr = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winPermanentUserAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#parent_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnData');
        }else{
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_owner'),
                        i18n('sFirst_select_an_Access_Provider_who_will_be_the_owner'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnDataPrev:  function(button){
        var me      = this;
        var win     = button.up('winPermanentUserAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnDataNext:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            success: function(form, action) {
                win.close();
                me.getStore('sPermanentUsers').load();
                Ext.ux.Toaster.msg(
                    i18n('sNew_item_created'),
                    i18n('sItem_created_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },

    cmbProfileChange:   function(cmb){
        var me      = this;
        var form    = cmb.up('form');
        var cmbCap  = form.down('cmbCap');
        var value   = cmb.getValue();
        var s = cmb.getStore();
        var r = s.getById(value);
        if(r != null){
            var cap = r.get('cap_in_profile');
            console.log(cap);
            if(cap){
                cmbCap.setVisible(true);
            }else{
                cmbCap.setVisible(false);
            }
        }
    },

    chkAlwaysActiveChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        var from    = form.down('#from_date');
        var to      = form.down('#to_date');
        var value   = chk.getValue();
        if(value){
            to.setVisible(false);
            from.setVisible(false);
        }else{
            to.setVisible(true);
            from.setVisible(true);
        }
    }
});
