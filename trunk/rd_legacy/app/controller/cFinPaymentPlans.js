Ext.define('Rd.controller.cFinPaymentPlans', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('finPaymentPlansWin');
        if(!win){
            win = desktop.createWindow({
                id		: 'finPaymentPlansWin',
                btnText	: 'Payment plans',
                width	:800,
                height	:400,
                glyph	: Rd.config.icnTags,
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'finPaymentPlansWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: 'Payment plans',
                        image:  'resources/images/48x48/tags.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false,
                        xtype   : 'gridFinPaymentPlans'
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',             			'finPaymentPlans.gridFinPaymentPlans',
        'components.winCsvColumnSelect',    			'components.winNote', 'components.winNoteAdd',
        'finPaymentPlans.winFinPaymentPlanAddWizard', 	'finPaymentPlans.winFinPaymentPlanEdit',
		'components.cmbProfile'
    ],
    stores: ['sFinPaymentPlans', 'sAccessProvidersTree', 	'sProfiles'],
    models: ['mFinPaymentPlan',  'mAccessProviderTree', 	'mProfile' ],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/fin_payment_plans/export_csv',
        urlNoteAdd      : '/cake2/rd_cake/fin_payment_plans/note_add.json',
		urlAdd			: '/cake2/rd_cake/fin_payment_plans/add.json',
        urlDelete		: '/cake2/rd_cake/fin_payment_plans/delete.json',
		urlView			: '/cake2/rd_cake/fin_payment_plans/view.json',
		urlEdit			: '/cake2/rd_cake/fin_payment_plans/edit.json',
    },
    refs: [
        {  ref: 'grid',  	selector: 'gridFinPaymentPlans'},
		{  ref: 'editWin', 	selector: 'winFinPaymentPlanEdit'}    
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            'gridFinPaymentPlans #reload': {
                click:      me.reload
            },
			'gridFinPaymentPlans #add'   : {
                click:      me.add
            },
            'gridFinPaymentPlans #delete'   : {
                click:      me.del
            },
            'gridFinPaymentPlans #edit'   : {
                click:      me.edit
            },     
            'gridFinPaymentPlans #note'   : {
                click:      me.note
            },
            'gridFinPaymentPlans #csv'  : {
                click:      me.csvExport
            },
            'gridFinPaymentPlans'   : {
                select:      me.select
            },
            'gridNote[noteForGrid=fin_payment_plans] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=fin_payment_plans] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=fin_payment_plans] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=fin_payment_plans]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=fin_payment_plans] #btnTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=fin_payment_plans] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=fin_payment_plans] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            },
			'winFinPaymentPlanAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winFinPaymentPlanAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winFinPaymentPlanAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
			'winFinPaymentPlanEdit': {
                beforeshow:      me.loadPlan
            },
			'winFinPaymentPlanEdit #profile' : {
                render:  me.renderEventProfile
            },
			'winFinPaymentPlanEdit #save': {
                click: me.btnEditSave
            }
        });
    },
    reload: function(){
        var me =this;
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
    },
	select: function(grid,record){
        var me = this;
        //Adjust the Edit and Delete buttons accordingly...
		//FIXME complete please....
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winFinPaymentPlanAddWizardId')){
                            var w = Ext.widget('winFinPaymentPlanAddWizard',{id:'winFinPaymentPlanAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winFinPaymentPlanAddWizardId')){
                            var w = Ext.widget('winFinPaymentPlanAddWizard',
                                {id:'winFinPaymentPlanAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
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
            var win = button.up('winFinPaymentPlanAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());

			win.down('#profile').getStore().getProxy().setExtraParam('ap_id',sr.getId());
            win.down('#profile').getStore().load();    

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
        var win     = button.up('winFinPaymentPlanAddWizard');
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
                me.getStore('sFinPaymentPlans').load();
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
                        url: me.urlDelete,
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){
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
        var store   = me.getGrid().getStore();

        if( me.getGrid().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            var sr      =  me.getGrid().getSelectionModel().getLastSelected();
            var id      = sr.getId();
			var apId	= sr.get('user_id');
            if(!me.application.runAction('cDesktop','AlreadyExist','winFinPaymentPlanEditId')){
                var w = Ext.widget('winFinPaymentPlanEdit',
                {
                    id          :'winFinPaymentPlanEditId',
                    store       : store,
                    planId      : id,
					apId		: apId,
					record		: sr
                });
                me.application.runAction('cDesktop','Add',w);         
            }else{
                var w       = me.getEditWin();
                w.planId    = id;
				w.apId		= apId;
				w.record	= sr;
                me.load(w)
            } 
        }     
    },
	renderEventProfile: function(cmb){
        var me          = this;
        var w           = cmb.up('winFinPaymentPlanEdit');
        w.cmbProfileRendered  = true;
        if(w.record != undefined){
            var pn      = w.record.get('profile');
            var p_id    = w.record.get('profile_id');
            var rec     = Ext.create('Rd.model.mProfile', {name: pn, id: p_id});
            cmb.getStore().loadData([rec],false);
			cmb.select(rec);
        }
    },
	loadPlan: function(win){
        var me      = this; 
        var form    = win.down('form');
        var planId 	= win.planId;
		form.load({url:me.urlView, method:'GET',params:{plan_id:planId}});
    },
    btnEditSave:  function(button){
        var me      = this;
        var win     = button.up("winFinPaymentPlanEdit");
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
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
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPaymentPlansWin'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteFinPaymentPlansWin'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'fin_payment_plans',
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
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){                      
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPaymentPlansWinAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteFinPaymentPlansWinAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteFinPaymentPlansWinAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteFinPaymentPlansWinAdd'+grid.noteForId,
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
