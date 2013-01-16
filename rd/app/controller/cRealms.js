Ext.define('Rd.controller.cRealms', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('realmsWin');
        if(!win){
            win = desktop.createWindow({
                id: 'realmsWin',
                title:'Realms manager',
                width:800,
                height:400,
                iconCls: 'realms',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'realmsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:'Realms',
                        image:  'resources/images/48x48/realm.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        items: [
                            { 'title' : 'Realms', 'xtype':'gridRealms'},
                            // { 'title' : 'Advanced realms'}
                        ],
                        margins : '0 0 0 0',
                        border  : false
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },
    views:  ['realms.gridRealms', 'realms.winRealmAddWizard', 'realms.winRealmAdd', 'realms.pnlRealm','components.pnlBanner'],
    stores: ['sRealms','sAccessProviders'],
    models: ['mRealm','mAccessProvider'],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/realms/add.json',
        urlEdit:            '/cake2/rd_cake/realms/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json'
    },
    refs: [
         {  ref:    'gridRealms',           selector:   'gridRealms'},
         {  ref:    'gridAdvancedRealms',   selector:   'gridAdvancedRealms'} 
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sRealms').addListener('load',me.onStoreRealmsLoaded, me);
        me.control({
            'gridRealms #reload': {
                click:      me.reload
            },
            'gridRealms #add': {
                click:      me.add
            },
            'gridRealms #delete': {
                click:      me.del
            },
            'gridRealms #edit': {
                click:      me.edit
            },
            'gridRealms'   : {
                itemclick:  me.gridClick
            },
            'winRealmAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winRealmAddWizard #btnRealmDetailPrev' : {
                click:  me.btnRealmDetailPrev
            },
            'winRealmAddWizard #save' : {
                click:  me.addSubmit
            },
            'pnlRealm frmRealmDetail #save' : {
                click:  me.editSubmit
            },
            '#realmsWin':   {
                afterrender: me.onStoreRealmsLoaded //Prime it initially
            }
            
        });;
    },
    reload: function(){
        var me =this;
        me.getStore('sRealms').load();
    },
    gridClick:  function(grid, record, item, index, event){
        var me                  = this;
        me.selectedRecord = record;
        //Dynamically update the top toolbar
        tb = me.getGridRealms().down('toolbar[dock=top]');

        var edit = record.get('update');
        if(edit == true){
            if(tb.down('#edit') != null){
                tb.down('#edit').setDisabled(false);
            }
        }else{
            if(tb.down('#edit') != null){
                tb.down('#edit').setDisabled(true);
            }
        }

        var del = record.get('delete');
        if(del == true){
            if(tb.down('#delete') != null){
                tb.down('#delete').setDisabled(false);
            }
        }else{
            if(tb.down('#delete') != null){
                tb.down('#delete').setDisabled(true);
            }
        }
    },
    add: function(button){
        var me = this;
        //We need to do a check to determine if this user (be it admin or acess provider has the ability to add to children)
        //admin/root will always have, an AP must be checked if it is the parent to some sub-providers. If not we will simply show the add window
        //if it does have, we will show the add wizard.

        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winRealmAddWizardId')){
                            var w = Ext.widget('winRealmAddWizard',{id:'winRealmAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        Ext.widget('winRealmAdd',{});
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
            var win = button.up('winRealmAddWizard');
            win.down('#creator').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnRealmDetail');
        }else{
            Ext.ux.Toaster.msg(
                        'Select a owner',
                        'First select an Access Provider who will be the owner',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnRealmDetailPrev: function(button){
        var me = this;
        var win = button.up('winRealmAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    addSubmit: function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            success: function(form, action) {
                win.close();
                me.getStore('sRealms').load();
                Ext.ux.Toaster.msg(
                    'New Realm Created',
                    'Realm created fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    del:   function(button){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridRealms().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item to delete',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(val){
                if(val== 'yes'){
                    me.getGridRealms().getStore().remove(me.getGridRealms().getSelectionModel().getSelection());
                    me.getGridRealms().getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                'Item Deleted',
                                'Item deleted fine',
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.onStoreRealmsLoaded();   //Update the count   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                'Problems deleting item',
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.getGridRealms().getStore().load(); //Reload from server since the sync was not good
                        }
                    });

                }
            });
        }
    },
    edit: function(button){
        var me = this;   
        //Find out if there was something selected
        if(me.getGridRealms().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item to edit',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            //Check if the node is not already open; else open the node:
            var tp      = me.getGridRealms().up('tabpanel');
            var sr      = me.getGridRealms().getSelectionModel().getLastSelected();
            var id      = sr.getId();
            var tab_id  = 'realmTab_'+id;
            var nt      = tp.down('#'+tab_id);
            if(nt){
                tp.setActiveTab(tab_id); //Set focus on  Tab
                return;
            }

            var tab_name = me.selectedRecord.get('name');
            //Tab not there - add one
            tp.add({ 
                title :     tab_name,
                itemId:     tab_id,
                closable:   true,
                iconCls:    'edit', 
                layout:     'fit', 
                items:      {'xtype' : 'pnlRealm',realm_id: id}
            });
            tp.setActiveTab(tab_id); //Set focus on Add Tab
            //Load the record:
            nt  = tp.down('#'+tab_id);
            var f   = nt.down('frmRealmDetail');
            f.loadRecord(sr);    //Load the record
            f.down('#creator').setValue(sr.get('creator'));   
        }
    },
    editSubmit: function(button){
        var me      = this;
        var form    = button.up('form');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
            success: function(form, action) {
                me.getStore('sRealms').load();
                Ext.ux.Toaster.msg(
                    'Item updated',
                    'Item updated fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    onStoreRealmsLoaded: function() {
        var me = this;
        var count = me.getStore('sRealms').getTotalCount();
        me.getGridRealms().down('#count').update({count: count});
    },
});
