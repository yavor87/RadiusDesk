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
                            items   : [
                                { 'title' : i18n('sHome'),      xtype : 'gridDynamicClients',       'glyph': Rd.config.icnHome},
                                { 'title' : 'Unknown clients',  xtype:'gridUnknownDynamicClients',	'glyph': Rd.config.icnQuestion}
                            ]
                        }]
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
        'nas.gridRealmsForNasOwner',
        'dynamicClients.gridUnknownDynamicClients',
        'dynamicClients.winAttachUnknownDynamicClient',
        'components.cmbTimezones',
        'components.winNote', 
        'components.winNoteAdd'
    ],
    stores: ['sAccessProvidersTree','sDynamicClients', 'sUnknownDynamicClients'],
    models: ['mAccessProviderTree', 'mDynamicClient', 'mRealmForNasOwner', 'mUnknownDynamicClient' ],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/dynamic_clients/export_csv',
        urlAdd          : '/cake2/rd_cake/dynamic_clients/add.json',
        urlDelete       : '/cake2/rd_cake/dynamic_clients/delete.json',
		urlEdit         : '/cake2/rd_cake/dynamic_clients/edit.json',
		urlNoteAdd      : '/cake2/rd_cake/dynamic_clients/note_add.json',
    },
    refs: [
        {  ref: 'grid',  selector: 'gridDynamicClients'}       
    ],
    autoReloadUnknownDynamicClients: undefined,
    autoReload: undefined,
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
             '#dcWin'    : {
                beforeshow:      me.winClose,
                destroy   :      me.winClose
            },
            '#dcWin gridDynamicClients' : {
				activate	: me.gridActivate
			},
			'#dcWin gridUnknownDynamicClients' : {
				activate	: me.gridActivate
			},
            'gridDynamicClients #reload': {
                click:      me.reload
            },
            'gridDynamicClients #reload menuitem[group=refresh]'   : {
                click:      me.reloadOptionClick
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
            'gridDynamicClients #note' : {
                click:      me.note
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
            'winDynamicClientAddWizard gridRealmsForNasOwner #reload': {
                click:      me.gridRealmsForNasOwnerReload
            },
            'winDynamicClientAddWizard #tabRealms': {
                activate:      me.gridRealmsForNasOwnerActivate
            }, 
            'winDynamicClientAddWizard #tabRealms #chkAvailForAll': {
                change:     me.chkAvailForAllChange
            },
            'winDynamicClientAddWizard gridRealmsForNasOwner #chkAvailSub':     {
                change:     me.gridRealmsForNasOwnerChkAvailSub
            },
			'winDynamicClientEdit #save': {
                click: me.btnEditSave
            },
            
            'gridUnknownDynamicClients #reload': {
                click:      me.gridUnknownDynamicClientsReload
            },
            'gridUnknownDynamicClients #reload menuitem[group=refresh]'   : {
                click:      me.reloadUnknownDynamicClientsOptionClick
            },
			'gridUnknownDynamicClients #attach': {
                click:  me.attachAttachUnknownDynamicClient
            },
            'winAttachUnknownDynamicClient #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winAttachUnknownDynamicClient #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winAttachUnknownDynamicClient #btnDataNext' : {
                click:  me.btnDataNext
            },
            'winAttachUnknownDynamicClient gridRealmsForNasOwner #reload': {
                click:      me.gridRealmsForNasOwnerReload
            },
            'winAttachUnknownDynamicClient #tabRealms': {
                activate:      me.gridRealmsForNasOwnerActivate
            }, 
            'winAttachUnknownDynamicClient #tabRealms #chkAvailForAll': {
                change:     me.chkAvailForAllChange
            },
            'winAttachUnknownDynamicClient gridRealmsForNasOwner #chkAvailSub':     {
                change:     me.gridRealmsForNasOwnerChkAvailSub
            },
			'gridUnknownDynamicClients #delete': {
                click: me.delUnknownDynamicClient
            } ,
            'gridNote[noteForGrid=dynamic_clients] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=dynamic_clients] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=dynamic_clients] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=dynamic_clients]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=dynamic_clients] #btnTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=dynamic_clients] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=dynamic_clients] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            },
            
        });
    },
    winClose:   function(){
        var me = this;
        if(me.autoReload != undefined){
            clearInterval(me.autoReload);   //Always clear
        }
       
        if(me.autoReloadUnknownDynamicClients != undefined){
            clearInterval(me.autoReloadUnknownDynamicClients);
        }
    },
    gridActivate: function(g){
        var me = this;
        g.getStore().load();
    },
    reload: function(){
        var me =this;
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
    },
    reloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReload);   //Always clear
        b.setIconCls('b-reload_time');
        b.setGlyph(Rd.config.icnTime);

        if(n == 'mnuRefreshCancel'){
            b.setGlyph(Rd.config.icnReload);
            b.setIconCls('b-reload');
            return;
        }
        
        if(n == 'mnuRefresh1m'){
           interval = 60000
        }

        if(n == 'mnuRefresh5m'){
           interval = 360000
        }
        me.autoReload = setInterval(function(){     
            me.reload();
        },  interval);  
    },
    add: function(button){    
        var me      = this;
        var win     = button.up("#dcWin");
        var store   = win.down("gridDynamicClients").getStore();
        Ext.Ajax.request({
            url: me.getUrlApChildCheck(),
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                        
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicClientAddWizardId')){
                            var w = Ext.widget('winDynamicClientAddWizard',{id:'winDynamicClientAddWizardId',store: store});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicClientAddWizardId')){
                            var w = Ext.widget('winDynamicClientAddWizard',
                                {
                                    id          :'winDynamicClientAddWizardId',
                                    startScreen : 'scrnData',
                                    user_id     :'0',
                                    owner       : i18n('sLogged_in_user'), 
                                    no_tree     : true,
                                    store       : store
                                }
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
            var win = button.up('window');
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
        var win     = button.up('window');
        win.getLayout().setActiveItem('scrnApTree');
    },  
    btnDataNext: function(button){
        var me = this;
        var win     = button.up('window');
        var form    = button.up('form');
        var tp      = form.down('tabpanel');
        var grid    = form.down('gridRealmsForNasOwner');
        var extra_params ={};   //Get the extra params to submit with form
        var select_flag  = false;

        var chk = form.down('#chkAvailForAll');
        if(chk.getValue() == true){
            extra_params.avail_for_all = true;
        }else{
            grid.getStore().each(function(record){
                if(record.get('selected') == true){
                    select_flag = true;
                    extra_params[record.getId()] = record.get('selected');
                }
            }, me);
        }

        //If they did not select avail_for_all and NOT selected ANY realm, refuse to continue
        if(extra_params.avail_for_all == undefined){
            if(select_flag != true){
                var tp = form.down('tabpanel');
                tp.setActiveTab('tabRealms');
                Ext.ux.Toaster.msg(
                        i18n('sSelect_at_least_one_realm'),
                        i18n('sSelect_one_or_more_realms'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );  
                return;
            }
        }

        //Checks passed fine...      
        form.submit({
            clientValidation: true,
            url: me.getUrlAdd(),
            params: extra_params,
            success: function(form, action) {
                win.store.load();
                win.close();
               // me.getGrid().getStore().load();
                Ext.ux.Toaster.msg(
                    i18n('sNew_item_created'),
                    i18n('sItem_created_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            //Focus on the first tab as this is the most likely cause of error 
            failure: function(form,action,b,c){
                if(action.result.errors.username != undefined){ //This will be for OpenVPN and pptp
                    tp.setActiveTab(0);
                }else{
                    tp.setActiveTab('tabNas');
                }
                Ext.ux.formFail(form,action)
            }
        });
    },
    chkAvailForAllChange: function(chk){
        var me      = this;
        var pnl     = chk.up('panel');
        var grid    = pnl.down("gridRealmsForNasOwner");
        if(chk.getValue() == true){
            grid.hide();
        }else{
            grid.show();
        }
    },
    chkAvailForAllChangeTab: function(chk){
        var me      = this;
        var pnl     = chk.up('panel');
        var grid    = pnl.down("gridRealmsForNasOwner");
        if(chk.getValue() == true){
            grid.hide();
            
        }else{
            grid.show();
        }
        //Clear the grid:
        grid.getStore().getProxy().setExtraParam('clear_flag',true);
        grid.getStore().load();
        grid.getStore().getProxy().setExtraParam('clear_flag',false);
    },
    gridRealmsForNasOwnerReload: function(button){
        var me      = this;
        var grid    = button.up('gridRealmsForNasOwner');
        grid.getStore().load();
    },
    gridRealmsForNasOwnerActivate: function(tab){
        var me      = this;
        var a_to_s  = tab.down('#chkAvailSub').getValue();
        var grid    = tab.down('gridRealmsForNasOwner');
        grid.getStore().getProxy().setExtraParam('owner_id',me.owner_id);
        grid.getStore().getProxy().setExtraParam('available_to_siblings',a_to_s);
        grid.getStore().load();
    },
    gridRealmsForNasOwnerChkAvailSub: function(chk){
        var me      = this;
        var a_to_s  = chk.getValue();
        var grid    = chk.up('gridRealmsForNasOwner');
        grid.getStore().getProxy().setExtraParam('owner_id',me.owner_id);
        grid.getStore().getProxy().setExtraParam('available_to_siblings',a_to_s);
        grid.getStore().load();
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
    },
    
    //____ Unknown Dynamic Clients ____
    gridUnknownDynamicClientsReload: function(button){
        var me  = this;
        var g = button.up('gridUnknownDynamicClients');
        g.getStore().load();
    },
    reloadUnknownDynamicClientsOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReloadUnknownDynamicClients);   //Always clear
        b.setGlyph(Rd.config.icnTime);
        if(n == 'mnuRefreshCancel'){
            b.setGlyph(Rd.config.icnReload);
            b.setIconCls('b-reload');
            return;
        }
        
        if(n == 'mnuRefresh1m'){
           interval = 60000
        }

        if(n == 'mnuRefresh5m'){
           interval = 360000
        }
        me.autoReloadUnknownDynamicClients = setInterval(function(){       
            me.gridUnknownDynamicClientsReload(b);
        }, interval);  
    },
    attachAttachUnknownDynamicClient: function(button){
        var me      = this;
        var win     = button.up("#dcWin");
        var store   = win.down("gridUnknownDynamicClients").getStore();
        if(win.down("gridUnknownDynamicClients").getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            var sr              = win.down("gridUnknownDynamicClients").getSelectionModel().getLastSelected();
            var id              = sr.getId();
			var nasidentifier   = sr.get('nasidentifier');
            var calledstationid = sr.get('calledstationid');
  
			//Determine if we can show a power bar or not.
			var hide_power = true; //FIXME To be fiexed with real value from mesh
            if(!me.application.runAction('cDesktop','AlreadyExist','winAttachUnknownDynamicClientId')){
                var w = Ext.widget('winAttachUnknownDynamicClient',
                {
                    id              :'winAttachUnknownDynamicClientId',
                    store           : store,
					nasidentifier   : nasidentifier,
					calledstationid : calledstationid,
					unknown_dynamic_client_id : id	
                });
                me.application.runAction('cDesktop','Add',w);         
            }
        }
    },
	delUnknownDynamicClient:   function(btn){
        var me      = this;
        var win     = btn.up("window");
        var grid    = win.down("gridUnknownDynamicClients");
    
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    grid.getStore().remove(grid.getSelectionModel().getSelection());
                    grid.getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );  
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            grid.getStore().load(); //Reload from server since the sync was not good
                        }
                    });
                }
            });
        }
    },
    
    //____ NOTES ____
    
    note: function(button,format) {
        var me      = this;     
        //Find out if there was something selected
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                //Determine the selected record:
                var sr = me.getGrid().getSelectionModel().getLastSelected();
                
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteDynamicClient'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteDynamicClient'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'dynamic_clients',
                            noteForName : sr.get('name')
                        });
                    me.application.runAction('cDesktop','Add',w);       
                }
            }    
        }
    },
    noteReload: function(button){
        var me      = this;
        var grid    = button.up('gridNote');
        grid.getStore().load();
    },
    noteAdd: function(button){
        var me      = this;
        var grid    = button.up('gridNote');
        //See how the wizard should be displayed:
        Ext.Ajax.request({
            url: me.getUrlApChildCheck(),
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){                      
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteDynamicClientAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteDynamicClientAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteDynamicClientAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteDynamicClientAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid,
                                startScreen : 'scrnNote',
                                user_id     : '0',
                                owner       : i18n('sLogged_in_user'),
                                no_tree     : true
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }
                }   
            },
            scope: me
        });
    },
    gridNoteClick: function(item,record){
        var me = this;
        //Dynamically update the top toolbar
        grid    = item.up('gridNote');
        tb      = grid.down('toolbar[dock=top]');
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
    btnNoteTreeNext: function(button){
        var me = this;
        var tree = button.up('treepanel');
        //Get selection:
        var sr = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winNoteAdd');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnNote');
        }else{
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_owner'),
                        i18n('sFirst_select_an_Access_Provider_who_will_be_the_owner'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnNoteAddPrev: function(button){
        var me = this;
        var win = button.up('winNoteAdd');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnNoteAddNext: function(button){
        var me      = this;
        var win     = button.up('winNoteAdd');
        win.refreshGrid.getStore().load();
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.getUrlNoteAdd(),
            params: {for_id : win.noteForId},
            success: function(form, action) {
                win.close();
                win.refreshGrid.getStore().load();
                me.reload();
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
    noteDelete: function(button){
        var me      = this;
        var grid    = button.up('gridNote');
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    grid.getStore().remove(grid.getSelectionModel().getSelection());
                    grid.getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            grid.getStore().load();   //Update the count
                            me.reload();   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            grid.getStore().load(); //Reload from server since the sync was not good
                        }
                    });
                }
            });
        }
    }
});
