Ext.define('Rd.controller.cVouchers', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('vouchersWin');
        if(!win){
            win = desktop.createWindow({
                id              : 'vouchersWin',
                title           : i18n('sVouchers'),
                width           : 800,
                height          : 400,
                iconCls         : 'vouchers',
                animCollapse    : false,
                border          : false,
                constrainHeader : true,
                layout          : 'border',
                stateful        : true,
                stateId         : 'vouchersWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: i18n('sVouchers'),
                        image:  'resources/images/48x48/vouchers.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : true,
                        items   : { 'title' : i18n('sVouchers'), xtype: 'gridVouchers'}
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',     'vouchers.gridVouchers',    'vouchers.winVoucherAddWizard',
        'components.cmbRealm',      'components.cmbProfile'      
    ],
    stores: ['sVouchers',   'sAccessProvidersTree', 'sRealms', 'sProfiles', 'sAttributes', 'sVendors'],
    models: ['mAccessProviderTree', 'mVoucher', 'mRealm',       'mProfile' ],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/vouchers/add.json',
        urlEdit:            '/cake2/rd_cake/vouchers/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/vouchers/export_csv'
    },
    refs: [
        {  ref: 'grid',  selector:   'gridVouchers'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sVouchers').addListener('load',me.onStoreVouchersLoaded, me);
        me.control({
            '#vouchersWin'    : {
                beforeshow:      me.winClose
            },
            '#vouchersWin'    : {
                destroy:      me.winClose
            },
            'gridVouchers #reload': {
                click:      me.reload
            },
            'gridVouchers #reload menuitem[group=refresh]'   : {
                click:      me.reloadOptionClick
            },  
            'gridVouchers #add'   : {
                click:      me.add
            },
            'gridVouchers #delete'   : {
                click:      me.del
            },
            'gridVouchers #edit'   : {
                click:      me.edit
            },
            'gridVouchers #csv'  : {
                click:      me.csvExport
            },
            'gridVouchers'   : {
                select:      me.select
            },
            'gridVouchers'    : {
                activate:      me.gridActivate
            },
            'winVoucherAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winVoucherAddWizard #quantity' : {
                change:  me.quantityChange
            },
            'winVoucherAddWizard #activate_on_login' : {
                change:  me.chkActivateOnLoginChange
            },
            'winVoucherAddWizard #never_expire' : {
                change:  me.chkNeverExpireChange
            },
            'winVoucherAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winVoucherAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
            '#winCsvColumnSelectVouchers #save': {
                click:  me.csvExportSubmit
            }
        });
    },
    winClose:   function(){
        var me = this;
        if(me.autoReload != undefined){
            clearInterval(me.autoReload);   //Always clear
        }
    },
    reload: function(){
        var me =this;
        me.getStore('sVouchers').load();
    },
    reloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReload);   //Always clear
        b.setIconCls('b-reload_time');
        
        if(n == 'mnuRefreshCancel'){
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
    gridActivate: function(g){
        var me = this;
        g.getStore().load();
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winVoucherAddWizardId')){
                            var w = Ext.widget('winVoucherAddWizard',{id:'winVoucherAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winVoucherAddWizardId')){
                            var w = Ext.widget('winVoucherAddWizard',
                                {id:'winVoucherAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
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
            var win = button.up('winVoucherAddWizard');
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
        var win     = button.up('winVoucherAddWizard');
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
                me.getStore('sVouchers').load();
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
                    me.getGrid().getStore().remove(me.getGrid().getSelectionModel().getSelection());
                    me.getGrid().getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.onStoreVouchersLoaded();   //Update the count   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.getGrid().getStore().load(); //Reload from server since the sync was not good
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
            if(!me.application.runAction('cDesktop','AlreadyExist','winComponentManageId')){
                var w = Ext.widget('winComponentManage',{id:'winComponentManageId'});
                me.application.runAction('cDesktop','Add',w);       
            }    
        }
    },
    onStoreVouchersLoaded: function() {
        var me      = this;
        var count   = me.getStore('sVouchers').getTotalCount();
        me.getGrid().down('#count').update({count: count});
    },
    csvExport: function(button,format) {
        var me          = this;
        var columns     = me.getGrid().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectVouchers')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectVouchers',columns: col_list});
            me.application.runAction('cDesktop','Add',w);         
        }
    },
    csvExportSubmit: function(button){

        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');

        var chkList = form.query('checkbox');
        var c_found = false;
        var columns = [];
        var c_count = 0;
        Ext.Array.each(chkList,function(item){
            if(item.getValue()){ //Only selected items
                c_found = true;
                columns[c_count] = {'name': item.getName()};
                c_count = c_count +1; //For next one
            }
        },me);

        if(!c_found){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_one_or_more'),
                        i18n('sSelect_one_or_more_columns_please'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{     
            //next we need to find the filter values:
            var filters     = [];
            var f_count     = 0;
            var f_found     = false;
            var filter_json ='';
            me.getGrid().filters.filters.each(function(item) {
                if (item.active) {
                    f_found         = true;
                    var ser_item    = item.serialize();
                    ser_item.field  = item.dataIndex;
                    filters[f_count]= ser_item;
                    f_count         = f_count + 1;
                }
            });   
            var col_json        = "columns="+Ext.JSON.encode(columns);
            var extra_params    = Ext.Object.toQueryString(Ext.Ajax.extraParams);
            var append_url      = "?"+extra_params+'&'+col_json;
            if(f_found){
                filter_json = "filter="+Ext.JSON.encode(filters);
                append_url  = append_url+'&'+filter_json;
            }
            window.open(me.urlExportCsv+append_url);
            win.close();
        }
    },
    quantityChange: function(number){
        var me      = this;
        var form    = number.up('form');
        var batch   = form.down('#batch');
        var value   = number.getValue();
        if(value>1){
            batch.setVisible(true);
            batch.setDisabled(false);   
        }else{
            batch.setVisible(false);
            batch.setDisabled(true);
        }
    },
    chkActivateOnLoginChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        var dv      = form.down('#days_valid');
        var value   = chk.getValue();
        if(value){
            dv.setVisible(true);
            dv.setDisabled(false);      
        }else{
            dv.setVisible(false);
            dv.setDisabled(true); 
        }
    },
    chkNeverExpireChange: function(chk){
        var me      = this;
        var form    = chk.up('form');
        var e       = form.down('#expire');
        var value   = chk.getValue();
        if(value){
            e.setDisabled(true);                
        }else{
            e.setDisabled(false);
        }
    }

});
