Ext.define('Rd.controller.cDynamicClients', {
    extend: 'Ext.app.Controller',
    owner   : undefined,
    user_id : undefined,
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('dcWin');
        if(!win){
            win = desktop.createWindow({
                id          : 'dcWin',
                btnText     : 'Dynamic RADIUS Clients',
                width       : Rd.config.winWidth,
                height      : Rd.config.winHeight,
                glyph       : Rd.config.icnDynamicNas,
                animCollapse: false,
                border      : false,
                constrainHeader: true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'dcWin',
                items: [
                    {
                        region  : 'north',
                        xtype   : 'pnlBanner',
                        heading : 'Dynamic RADIUS Clients',
                        image   : 'resources/images/48x48/dynamic_clients.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false,
                        items   : [{
                            xtype   : 'tabpanel',
                            layout  : 'fit',
                            margins : '0 0 0 0',
                            border  : true,
                            plain   : false,
                            itemId  : 'tabDynamicClients',
                            items   : { 'title' : i18n('sHome'), xtype : 'gridDynamicClients','glyph': Rd.config.icnHome}}
            
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner', 
        'dynamicClients.gridDynamicClients',
        'dynamicClients.winDynamicClientAddWizard',
        'nas.gridRealmsForNasOwner'
    ],
    stores: ['sAccessProvidersTree','sDynamicClients'],
    models: ['mAccessProviderTree', 'mDynamicClient', 'mRealmForNasOwner' ],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/dynamic_clients/export_csv',
        urlAdd          : '/cake2/rd_cake/dynamic_clients/add.json',
        urlDelete       : '/cake2/rd_cake/dynamic_clients/delete.json',
		urlEdit         : '/cake2/rd_cake/dynamic_clients/edit.json'
    },
    refs: [
        {  ref: 'grid',  selector: 'gridDynamicClients'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            'gridDynamicClients #reload': {
                click:      me.reload
            }, 
            'gridDynamicClients #add'   : {
                click:      me.add
            },
            'gridDynamicClients #delete'	: {
                click:      me.del
            },
            'gridDynamicClients #edit'   : {
                click:      me.edit
            },
            'gridDynamicClients'   		: {
                select:      me.select
            },
			'winDynamicClientAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winDynamicClientAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winDynamicClientAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
			'winDynamicClientEdit #save': {
                click: me.btnEditSave
            }
        });
    },
    reload: function(){
        var me =this;
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
    },
    add: function(button){    
        var me = this;
        Ext.Ajax.request({
            url: me.getUrlApChildCheck(),
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                        
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicClientAddWizardId')){
                            var w = Ext.widget('winDynamicClientAddWizard',{id:'winDynamicClientAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicClientAddWizardId')){
                            var w = Ext.widget('winDynamicClientAddWizard',
                                {id:'winDynamicClientAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
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
            var win = button.up('winDynamicClientAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
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
        var win     = button.up('winDynamicClientAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnDataNext:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.getUrlAdd(),
            success: function(form, action) {
                win.close();
                me.getStore('sDynamicClients').load();
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
    select: function(grid,record){
        var me = this;
        //Adjust the Edit and Delete buttons accordingly...

        //Dynamically update the top toolbar
        tb = me.getGrid().down('toolbar[dock=top]');

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
    del:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGrid().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = me.getGrid().getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });
                    Ext.Ajax.request({
                        url: me.getUrlDelete(),
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.reload(); //Reload from server
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.reload(); //Reload from server
                        }
                    });

                }
            });
        }
    },
    edit: function(button){
        var me      = this;
        var grid    = button.up('grid');
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_edit'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
			var sr      =  me.getGrid().getSelectionModel().getLastSelected();
            if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicClientEditId')){
                var w = Ext.widget('winDynamicClientEdit',{id:'winDynamicClientEditId',record: sr});
                me.application.runAction('cDesktop','Add',w);       
            }    
        }
    },
	btnEditSave:  function(button){
        var me      = this;
        var win     = button.up("winDynamicClientEdit");
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.getUrlEdit(),
            success: function(form, action) {
                win.close();
                me.reload(); //Reload from server
                Ext.ux.Toaster.msg(
                    i18n('sItem_updated'),
                    i18n('sItem_updated_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    }
});
