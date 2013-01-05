Ext.define('Rd.controller.cNas', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('nasWin');
        if(!win){
            win = desktop.createWindow({
                id: 'nasWin',
                title:'NAS Device manager',
                width:800,
                height:400,
                iconCls: 'nas',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'nasWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:'NAS devices',
                        image:  'resources/images/48x48/nas.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : true,
                        items   : { 'title' : 'NAS devices', xtype: 'gridNas'}
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  ['components.pnlBanner','nas.gridNas','nas.winNasAddWizard','nas.gridRealmsForNasOwner'],
    stores: ['sNas','sAccessProviders'],
    models: ['mNas','mAccessProvider','mRealmForNasOwner','mApRealms'],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/nas/add.json',
        urlEdit:            '/cake2/rd_cake/nas/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json'
    },
    refs: [
        {  ref: 'gridNas',  selector:   'gridNas'}       
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sNas').addListener('load',me.onStoreNasLoaded, me);
        me.control({
            'gridNas #reload': {
                click:      me.reload
            },
            'gridNas #add'   : {
                click:      me.add
            },
            'winNasAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winNasAddWizard #btnConTypePrev' : {
                click:  me.btnConTypePrev
            },
            'winNasAddWizard #btnConTypeNext' : {
                click:  me.btnConTypeNext
            },
            'winNasAddWizard #btnDirectPrev' : {
                click:  me.btnDirectPrev
            },
            'winNasAddWizard #btnDirectNext' : {
                click:  me.btnDirectNext
            },
            'winNasAddWizard #btnRealmsForNasOwnerPrev' : {
                click:  me.btnRealmsForNasOwnerPrev
            },
            'winNasAddWizard #btnRealmsForNasOwnerNext' : {
                click:  me.btnRealmsForNasOwnerNext
            },
            '#scrnRealmsForNasOwner gridRealmsForNasOwner #reload': {
                click:      me.gridRealmsForNasOwnerReload
            },
            '#scrnRealmsForNasOwner #chkAvailForAll': {
                change:     me.chkAvailForAllChange
            }
            
        });
    },
    reload: function(){
        var me =this;
        me.getStore('sNas').load();
    },
    add: function(button){
        var me = this;
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNasAddWizardId')){
                            var w = Ext.widget('winNasAddWizard',{id:'winNasAddWizardId',startScreen: 'selAP'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNasAddWizardId')){
                            var w = Ext.widget('winNasAddWizard',{id:'winNasAddWizardId',startScreen: 'selConnectType'});
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
            var win = button.up('winNasAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnConType');
        }else{
            Ext.ux.Toaster.msg(
                        'Select a owner',
                        'First select an Access Provider who will be the owner',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnConTypePrev: function(button){
        var me = this;
        var win = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnConTypeNext: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        //Find out the selected connection type:
        var form    = button.up('form');
        var rbg     = form.down('radiogroup');
        if(rbg.getValue().rb == 'direct'){
           win.getLayout().setActiveItem('scrnDirect'); 
        }
    },
    btnDirectPrev:  function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnConType');
    },
    btnDirectNext:  function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        //This part can be quite involved since the grid has to be fed some extraParams and reloaded 
        //since the owner and available_to_sub_providers will influence it
        var owner_id = win.down('#user_id').getValue();
        var a_to_s   = win.down('#a_to_s').getValue();

        var grid    = win.down('gridRealmsForNasOwner');
        grid.getStore().getProxy().setExtraParam('owner_id',owner_id);
        grid.getStore().getProxy().setExtraParam('available_to_siblings',a_to_s);
        grid.getStore().load();

        win.getLayout().setActiveItem('scrnRealmsForNasOwner');
    },
    btnRealmsForNasOwnerPrev:  function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnDirect');
    },
    btnRealmsForNasOwnerNext: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        var grid    = win.down('gridRealmsForNasOwner');
        var form    = win.down('#scrnDirect');
        var extra_params ={};   //Get the extra params to submit with form

        //See if 'Make available to any realm' is selected...
        var chk = win.down('#chkAvailForAll');
        if(chk.getValue() == true){
            extra_params.avail_for_all == true;
        }else{
            grid.getStore().each(function(record){

                if(record.get('selected') == true){
                    extra_params[record.getId()] = record.get('selected');
                }
            }, me);
        }
        
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            params: extra_params,
            success: function(form, action) {
                win.close();
                me.getGridNas().getStore().load();
                Ext.ux.Toaster.msg(
                    'New NAS Device Created',
                    'NAS Device created fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });

        console.log(selected_realms);
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
    gridRealmsForNasOwnerReload: function(button){
        var me      = this;
        var grid    = button.up('gridRealmsForNasOwner');
        grid.getStore().load();
    },
    onStoreNasLoaded: function() {
        var me      = this;
        var count   = me.getStore('sNas').getTotalCount();
        me.getGridNas().down('#count').update({count: count});
    }
});
