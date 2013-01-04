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
    models: ['mNas','mAccessProvider','mRealmForNasOwner'],
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
          //  win.down('#creator').setValue(sr.get('username'));
          //  win.down('#user_id').setValue(sr.getId());
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
        win.getLayout().setActiveItem('scrnRealmsForNasOwner');
    },

    onStoreNasLoaded: function() {
        var me      = this;
        var count   = me.getStore('sNas').getTotalCount();
        me.getGridNas().down('#count').update({count: count});
    }
});
