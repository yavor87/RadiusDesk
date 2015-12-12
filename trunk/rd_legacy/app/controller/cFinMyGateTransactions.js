Ext.define('Rd.controller.cFinMyGateTransactions', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('finMyGateTransactionsWin');
        if(!win){
            win = desktop.createWindow({
                id			: 'finMyGateTransactionsWin',
                btnText		: 'MyGate',
                width		: 800,
                height		: 500,
                glyph		: Rd.config.icnOnlineShop,
                animCollapse:false,
                border		:false,
                constrainHeader:true,
                layout		: 'border',
                stateful	: true,
                stateId		: 'finMyGateTransactionsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: 'MyGate',
                        image:  'resources/images/48x48/paypal.png'
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
                            plain   : true,
                            items   : [
                                { 'title' : 'Tokens',       	xtype: 'gridFinMyGateTokens'		},
								{ 'title' : 'Failed tokens',    xtype: 'gridFinMyGateTokenFailures'	},
                                { 'title' : 'Transactions',   	xtype: 'gridFinMyGateTransactions'	}
                            ]}
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',    			'components.winNoteAdd',         
        'components.winCsvColumnSelect',    'components.winNote', 
		'components.cmbPermanentUser',		'components.cmbFinPaymentPlans',
		'finMyGateTransactions.gridFinMyGateTokens',
		'finMyGateTransactions.winFinMyGateTokenAddWizard',
		'finMyGateTransactions.winFinMyGateTokenEdit',
		'finMyGateTransactions.winFinMyGateTokenizeWizard',
		'finMyGateTransactions.gridFinMyGateTokenFailures',
		'finMyGateTransactions.gridFinMyGateTransactions'
    ],
    stores: ['sFinMyGateTokens', 'sFinMyGateTransactions',	'sAccessProvidersTree',	'sPermanentUsers',
		'sFinPaymentPlans'
	],
    models: ['mFinMyGateToken', 'mFinMyGateTransaction',  	'mAccessProviderTree',	'mPermanentUser', 
		'mFinPaymentPlan'
	],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
		urlAddToken 	: '/cake2/rd_cake/fin_my_gate_tokens/add.json', 
		urlDeleteToken	: '/cake2/rd_cake/fin_my_gate_tokens/delete.json',
		urlEditToken	: '/cake2/rd_cake/fin_my_gate_tokens/edit.json',
		urlViewToken	: '/cake2/rd_cake/fin_my_gate_tokens/view.json',
		urlTokenize		: '/cake2/rd_cake/fin_my_gate_tokens/tokenize.json',
		urlDelFailure	: '/cake2/rd_cake/fin_my_gate_tokens/delete_failure.json'
    },
    refs: [
        {  ref: 'gridTransaction',  selector: 'gridFinMyGateTransactions'},
		{  ref: 'gridToken',  		selector: 'gridFinMyGateTokens'},
		{  ref: 'gridTokenFailure', selector: 'gridFinMyGateTokenFailures'},
		{  ref: 'editWin', 			selector: 'winFinMyGateTokenEdit'}         
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }

		//Apply some Vtypes:
		Ext.apply(Ext.form.field.VTypes, {
			creditcard: function(value,field){
				return value.replace(/[ \-]/g,'').length == 16;
			},
			creditcardText: 'Wrong credit card number',
			creditcardMask: /[ \d\-]/
		});


        me.inited = true;
        me.control({
			'gridFinMyGateTokens': {
                activate:      me.gridActivate
            },
			'gridFinMyGateTokenFailures': {
                activate:      me.gridActivate
            },
			'gridFinMyGateTransactions': {
                activate:      me.gridActivate
            },
            'gridFinMyGateTokens #reload': {
                click:      me.reload
            },
			'gridFinMyGateTokenFailures #reload': {
                click:      me.reload
            },
			'gridFinMyGateTransactions #reload': {
                click:      me.reload
            },
			'gridFinMyGateTokens #add'   : {
                click:      me.addToken
            },
		    'winFinMyGateTokenAddWizard #btnTreeNext' : {
                click:  me.btnTreeNextToken
            },
            'winFinMyGateTokenAddWizard #btnDataPrev' : {
                click:  me.btnDataPrevToken
            },
            'winFinMyGateTokenAddWizard #btnDataNext' : {
                click:  me.btnDataNextToken
            },
			'gridFinMyGateTokens #delete'   : {
                click:      me.delToken
            },
			'gridFinMyGateTokens #edit'   : {
                click:      me.editToken
            },
			'winFinMyGateTokenEdit': {
                beforeshow:      me.loadToken
            },
			'winFinMyGateTokenEdit #permanent_user_id' : {
                render:  me.renderEventPermanentUser
            },
			'winFinMyGateTokenEdit #fin_payment_plan_id' : {
                render:  me.renderEventFinPaymentPlan
            },
			'winFinMyGateTokenEdit #save': {
                click: me.btnEditSaveToken
            },
			'gridFinMyGateTokens #tokenize'   : {
                click:      me.tokenize
            },
			'winFinMyGateTokenizeWizard #btnTreeNext' : {
                click:  me.btnTreeNextTokenize
            },
            'winFinMyGateTokenizeWizard #btnDataPrev' : {
                click:  me.btnDataPrevTokenize
            },
            'winFinMyGateTokenizeWizard #btnDataNext' : {
                click:  me.btnDataNextTokenize
            },
			'gridFinMyGateTokenFailures #delete'   : {
                click:      me.delTokenFailure
            },
/*
            
            'gridPremiumSmsTransactions #note'   : {
                click:      me.note
            },
            'gridPremiumSmsTransactions #csv'  : {
                click:      me.csvExport
            },
            'gridPremiumSmsTransactions'   : {
                select:      me.select
            },
            'winPremiumSmsEmailVoucherDetail #send'   : {
                click:      me.emailSend
            },
            'gridNote[noteForGrid=fin_premium_sms_transactions] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=fin_premium_sms_transactions] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=fin_premium_sms_transactions] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=fin_premium_sms_transactions]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=fin_premium_sms_transactions] #btnTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=fin_premium_sms_transactions] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=fin_premium_sms_transactions] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            }
*/
        });
    },
	reload: function(b){
        var me = this;
		var grid = b.up('grid')
        grid.getSelectionModel().deselectAll(true);
        grid.getStore().load();
    },
	reloadToken: function(){
		var me = this;
		me.getGridToken().getSelectionModel().deselectAll(true);
		me.getGridToken().getStore().load();
	},
	reloadTokenFailure: function(){
		var me = this;
		me.getGridTokenFailure().getSelectionModel().deselectAll(true);
		me.getGridTokenFailure().getStore().load();
	},
	gridActivate: function(g){
        var me = this;
        g.getStore().load();
    },
	addToken: function(button){   
        var me = this;
        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                        
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winFinMyGateTokenAddWizardId')){
                            var w = Ext.widget('winFinMyGateTokenAddWizard',{id:'winFinMyGateTokenAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winFinMyGateTokenAddWizardId')){
                            var w = Ext.widget('winFinMyGateTokenAddWizard',
                                {id:'winFinMyGateTokenAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
                            );
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }
                }   
            },
            scope: me
        });
    },
    btnTreeNextToken: function(button){
        var me = this;
        var tree = button.up('treepanel');
        //Get selection:
        var sr = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winFinMyGateTokenAddWizard');
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
    btnDataPrevToken:  function(button){
        var me      = this;
        var win     = button.up('winFinMyGateTokenAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnDataNextToken:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAddToken,
            success: function(form, action) {
                win.close();
                me.getStore('sFinMyGateTokens').load();
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
	delToken:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridToken().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){

                    var selected    = me.getGridToken().getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });

                    Ext.Ajax.request({
                        url: me.urlDeleteToken,
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.reloadToken(); //Reload from server
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.reloadToken(); //Reload from server
                        }
                    });
                }
            });
        }
    },
	editToken: function(button){
        var me      = this;
        var store   = me.getGridToken().getStore();

        if( me.getGridToken().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            var sr      =  me.getGridToken().getSelectionModel().getLastSelected();
            var id      = sr.getId();
			var apId	= sr.get('user_id');
            if(!me.application.runAction('cDesktop','AlreadyExist','winFinMyGateTokenEditId')){
                var w = Ext.widget('winFinMyGateTokenEdit',
                {
                    id          :'winFinMyGateTokenEditId',
                    store       : store,
                    tokenId     : id,
					apId		: apId,
					record		: sr
                });
                me.application.runAction('cDesktop','Add',w);         
            }else{
                var w       = me.getEditWin();
                w.tokenId   = id;
				w.apId		= apId;
				w.record	= sr;
                me.load(w)
            } 

        }     
    },
	renderEventPermanentUser: function(cmb){
        var me          = this;
        var w           = cmb.up('winFinMyGateTokenEdit');
        if(w.record != undefined){
            var pu      = w.record.get('permanent_user');
            var pu_id   = w.record.get('permanent_user_id');
            var rec     = Ext.create('Rd.model.mPermanentUser', {username: pu, id: pu_id});
            cmb.getStore().loadData([rec],false);
			cmb.setValue(pu_id);
        }
    },
	renderEventFinPaymentPlan: function(cmb){
        var me          = this;
        var w           = cmb.up('winFinMyGateTokenEdit');
        if(w.record != undefined){
            var pp      = w.record.get('fin_payment_plan');
            var pp_id   = w.record.get('fin_payment_plan_id');
            var rec     = Ext.create('Rd.model.mFinPaymentPlan', {name: pp, id: pp_id});
            cmb.getStore().loadData([rec],false);
			cmb.setValue(pp_id);
        }
    },
	loadToken: function(win){
        var me      = this; 
        var form    = win.down('form');
        var tokenId 	= win.tokenId;
		form.load({url:me.urlViewToken, method:'GET',params:{token_id:tokenId}});
    },
    btnEditSaveToken:  function(button){
        var me      = this;
        var win     = button.up("winFinMyGateTokenEdit");
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlEditToken,
            success: function(form, action) {
                win.close();
                win.store.load();
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
	tokenize: function(button){
        var me = this;
        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){                       
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winFinMyGateTokenizeWizardId')){
                            var w = Ext.widget('winFinMyGateTokenizeWizard',{id:'winFinMyGateTokenizeWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winFinMyGateTokenizeWizardId')){
                            var w = Ext.widget('winFinMyGateTokenizeWizard',
                                {id:'winFinMyGateTokenizeWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
                            );
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }
                }   
            },
            scope: me
        });
    },
	btnTreeNextTokenize: function(button){
        var me = this;
        var tree = button.up('treepanel');
        //Get selection:
        var sr = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winFinMyGateTokenizeWizard');
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
    btnDataPrevTokenize:  function(button){
        var me      = this;
        var win     = button.up('winFinMyGateTokenizeWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnDataNextTokenize:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlTokenize,
            success: function(form, action) {
                win.close();
                me.getStore('sFinMyGateTokens').load();
                Ext.ux.Toaster.msg(
                    'User credit card detail tokenized',
                    'User credit card detail tokenized fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
	delTokenFailure:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridTokenFailure().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){

                    var selected    = me.getGridTokenFailure().getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });

                    Ext.Ajax.request({
                        url: me.urlDelFailure,
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.reloadTokenFailure(); //Reload from server
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.reloadTokenFailure(); //Reload from server
                        }
                    });
                }
            });
        }
    }

/*
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

                if(!me.application.runAction('cDesktop','AlreadyExist','winEmailPremiumSmsVoucherDetailId'+sr.getId())){
                    var w = Ext.widget('winPremiumSmsEmailVoucherDetail',
                        {
                            id          : 'winPremiumSmsEmailVoucherDetailId'+sr.getId(),
                            premiumsmsId: sr.getId(),
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
*//*
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
*//*
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
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPremiumSmsTransactions'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteFinPremiumSmsTransactions'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'fin_premium_sms_transactions',
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPremiumSmsTransactionsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteFinPremiumSmsTransactionsAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPremiumSmsTransactionsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteFinPremiumSmsTransactionsAdd'+grid.noteForId,
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
*/
});
