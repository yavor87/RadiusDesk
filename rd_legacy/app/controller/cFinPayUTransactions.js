Ext.define('Rd.controller.cFinPayUTransactions', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('finPayUTransactionsWin');
        if(!win){
            win = desktop.createWindow({
                id: 'finPayUTransactionsWin',
                //title: i18n('sProfile_component_manager'),
                btnText: 'PayU transactions',
                width:800,
                height:400,
                glyph: Rd.config.icnOnlineShop,
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'finPayUTransactionsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        //heading: i18n('sProfile_component_manager'),
                        heading: 'PayU transaction manager',
                        image:  'resources/images/48x48/paypal.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false,
                        xtype   : 'gridPayUTransactions'
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',             'finPayUTransactions.gridPayUTransactions',
        'components.winCsvColumnSelect',    'components.winNote', 'components.winNoteAdd',
        'finPayUTransactions.winPayUEmailVoucherDetail'
    ],
    stores: ['sFinPayUTransactions', 'sAccessProvidersTree'],
    models: ['mFinPayUTransaction',  'mAccessProviderTree' ],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/fin_pay_u_transactions/export_csv',
        urlNoteAdd      : '/cake2/rd_cake/fin_pay_u_transactions/note_add.json',
        urlEmailSend    : '/cake2/rd_cake/fin_pay_u_transactions/email_voucher_details.json',
        urlVoucherAttach: '/cake2/rd_cake/fin_pay_u_transactions/voucher_attach.json',
        urlVoucherDetach: '/cake2/rd_cake/fin_pay_u_transactions/voucher_detach.json',
    },
    refs: [
        {  ref: 'grid',  selector: 'gridPayUTransactions'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sFinPayUTransactions').addListener('load',me.onStoreFinPayUTransactionsLoaded, me);
        me.control({
            '#finPayUTransactionsWin'    : {
                beforeshow  : me.winClose,
                destroy     : me.winClose
            },
            'gridPayUTransactions #reload': {
                click:      me.reload
            },
            'gridPayUTransactions #reload menuitem[group=refresh]' : {
                click:      me.reloadOptionClick
            }, 
            'gridPayUTransactions #attach': {
                click:      function(){
                    me.attach_detach('attach');
                }
            },
            'gridPayUTransactions #detach': {
                click:       function(){
                    me.attach_detach('detach');
                }
            },
            'gridPayUTransactions #email': {
                click:    me.email
            },
            'gridPayUTransactions #note'   : {
                click:      me.note
            },
            'gridPayUTransactions #csv'  : {
                click:      me.csvExport
            },
            'gridPayUTransactions'   : {
                select:      me.select
            },
            'winPayUEmailVoucherDetail #send'   : {
                click:      me.emailSend
            },
            'gridNote[noteForGrid=fin_pay_u_transactions] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=fin_pay_u_transactions] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=fin_pay_u_transactions] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=fin_pay_u_transactions]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=fin_pay_u_transactions] #btnTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=fin_pay_i_transactions] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=fin_pay_u_transactions] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            }
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

        //Dynamically update the top toolbar
        tb = me.getGrid().down('toolbar[dock=top]');
        var voucher_id = record.get('voucher_id');
        if(voucher_id == 0){
            if(tb.down('#attach') != null){
                tb.down('#attach').setDisabled(false);
            }
            if(tb.down('#detach') != null){
                tb.down('#detach').setDisabled(true);
            }
            if(tb.down('#email') != null){
                tb.down('#email').setDisabled(true);
            }
        }else{
            if(tb.down('#attach') != null){
                tb.down('#attach').setDisabled(true);
            }
            if(tb.down('#detach') != null){
                tb.down('#detach').setDisabled(false);
            }
            if(tb.down('#email') != null){
                tb.down('#email').setDisabled(false);
            }
        }
    },

    onStoreFinPayUTransactionsLoaded: function() {
        var me      = this;
        var count   = me.getStore('sFinPayUTransactions').getTotalCount();
        me.getGrid().down('#count').update({count: count});
    },
    attach_detach: function(type){
        var me = this;

        if(type == undefined){
            type = 'detach';
        }
        //-----------------

        if(type == 'attach'){
            var url = me.urlVoucherAttach;
            var s_head  = 'Voucher created and attached';
            var s_msg   = 'Voucher created and attached fine';
            var f_head  = 'Problems attaching a voucher';  
        }

        if(type == 'detach'){
            var url = me.urlVoucherDetach;
            var s_head  = 'Voucher detached';
            var s_msg   = 'Voucher detached fine';
            var f_head  = 'Problems detaching attaching a voucher';  
        }
        


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
                var sr              = me.getGrid().getSelectionModel().getLastSelected();
                Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    params: {
                        id: sr.getId()
                    },
                    success: function(response){
                        var jsonData    = Ext.JSON.decode(response.responseText);
                        if(jsonData.success){
                            Ext.ux.Toaster.msg(
                                s_head,
                                s_msg,
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );                     
                            me.reload(); 
                        }else{
                            Ext.ux.Toaster.msg(
                                f_head,
                                jsonData.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );  
                        }  
                    },
                    scope: me
                });
            }    
        }
    },
    email: function(button){
        var me = this;

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
                var sr              = me.getGrid().getSelectionModel().getLastSelected();
                var email           = sr.get('payer_email');
                var voucher_name    = sr.get('voucher_name');
                var voucher_id      = sr.get('voucher_id');
                var txn_id          = sr.get('txn_id');

                //We can't mail if there is now voucher associated with transaction
                if(voucher_id == 0){
                        Ext.ux.Toaster.msg(
                            'No voucher associated',
                            'No voucher associaded with transaction',
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                    );
                    return;
                }

                if(!me.application.runAction('cDesktop','AlreadyExist','winEmailPayUVoucherDetailId'+sr.getId())){
                    var w = Ext.widget('winPayUEmailVoucherDetail',
                        {
                            id          : 'winPayUEmailVoucherDetailId'+sr.getId(),
                            payuId    : sr.getId(),
                            email       : email,
                            voucher_name: voucher_name,
                            txn_id      : txn_id
                        });
                    me.application.runAction('cDesktop','Add',w);       
                }
            }    
        }
    },
    emailSend: function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.setLoading(true); //Mask it
        form.submit({
            clientValidation: true,
            url: me.urlEmailSend,
            success: function(form, action) {
                win.close();
                Ext.ux.Toaster.msg(
                    'Voucher details sent',
                    'Voucher details sent fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    csvExport: function(button,format) {
/*        var me          = this;
        var columns     = me.getGrid().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectProfileComponents')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectProfileComponents',columns: col_list});
            me.application.runAction('cDesktop','Add',w);         
        }
*/
    },
    csvExportSubmit: function(button){
/*
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
*/
    },

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
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPayUTransactions'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteFinPayUTransactions'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'fin_payu_transactions',
                            noteForName : sr.get('txn_id') //PAYPAL ID = txn_id
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
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){                      
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPayUTransactionsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteFinPayUTransactionsAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPayUTransactionsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteFinPayUTransactionsAdd'+grid.noteForId,
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
        console.log(win.noteForId);
        console.log(win.noteForGrid);
        win.refreshGrid.getStore().load();
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlNoteAdd,
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
