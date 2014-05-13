Ext.define('Rd.controller.cTopUps', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('topUpsWin');
        if(!win){
            win = desktop.createWindow({
                id          : 'topUpsWin',
                btnText     : 'TopUp manager',
                width       :800,
                height      :400,
                glyph       : Rd.config.icnTopUp,
                animCollapse:false,
                border      :false,
                constrainHeader:true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'topUpsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: 'TopUp manager',
                        image:  'resources/images/48x48/topup.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false,
                        xtype   : 'gridTopUps'
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',             'topUps.gridTopUps',    'topUps.winTopUpAddWizard',
        'components.cmbPermanentUser'
  
    ],
    stores: ['sTopUps', 'sAccessProvidersTree', 'sPermanentUsers'],
    models: ['mTopUp',  'mAccessProviderTree',  'mPermanentUser' ],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/top_ups/export_csv',
        urlAdd          : '/cake2/rd_cake/top_ups/add.json'
    },
    refs: [
        {  ref: 'grid',  selector: 'gridTopUps'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sTopUps').addListener('load',me.onStoreTopUpsLoaded, me);
        me.control({
            '#topUpsWin'    : {
                beforeshow  : me.winClose,
                destroy     : me.winClose
            },
            'gridTopUps #reload': {
                click:      me.reload
            },
            'gridTopUps #reload menuitem[group=refresh]' : {
                click:      me.reloadOptionClick
            }, 
            'gridTopUps #add': {
                click:      me.add
            }, 
            'gridTopUps #csv'  : {
                click:      me.csvExport
            },
            'gridTopUps'   : {
                select:      me.select
            },
            'winTopUpAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winTopUpAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winTopUpAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
            'winTopUpAddWizard #cmbType' : {
                change:  me.cmbTopUpTypeChanged
            },
        });
    },
    winClose:   function(){
        var me = this;
        if(me.autoReload != undefined){
            clearInterval(me.autoReload);   //Always clear
        }
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
            b.setIconCls('b-reload');
            b.setGlyph(Rd.config.icnReload);
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
    reload: function(){
        var me =this;
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
    },
    select: function(grid,record){
        var me = this;
        //Adjust the Edit and Delete buttons accordingly...
       
    },
    onStoreTopUpsLoaded: function() {
        var me      = this;
        var count   = me.getStore('sTopUps').getTotalCount();
        me.getGrid().down('#count').update({count: count});
    },
    add: function(button){   
        var me = this;
        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                        
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winTopUpAddWizardId')){
                            var w = Ext.widget('winTopUpAddWizard',{id:'winTopUpAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winTopUpAddWizardId')){
                            var w = Ext.widget('winTopUpAddWizard',
                                {id:'winTopUpAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
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
            var win = button.up('winTopUpAddWizard');
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
        var win     = button.up('winTopUpAddWizard');
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
                me.getStore('sTopUps').load();
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
    cmbTopUpTypeChanged: function(cmb,new_value){
        var me          = this;
        var form        = cmb.up('form');
        var cmbDataUnit = form.down('#cmbDataUnit');
        var cmbTimeUnit = form.down('#cmbTimeUnit');
        var txtAmount   = form.down('#txtAmount');

        if(new_value == 'data'){
            cmbDataUnit.setVisible(true);
            cmbDataUnit.setDisabled(false);
            cmbTimeUnit.setVisible(false);
            cmbTimeUnit.setDisabled(true);
            txtAmount.setFieldLabel('Amount');
        }

        if(new_value == 'time'){
            cmbDataUnit.setVisible(false);
            cmbDataUnit.setDisabled(true);
            cmbTimeUnit.setVisible(true);
            cmbTimeUnit.setDisabled(false);
            txtAmount.setFieldLabel('Amount');
        }

        if(new_value == 'days_to_use'){
            cmbDataUnit.setVisible(false);
            cmbDataUnit.setDisabled(true);
            cmbTimeUnit.setVisible(false);
            cmbTimeUnit.setDisabled(true);
            txtAmount.setFieldLabel('Days');
        }
    }
});
