Ext.define('Rd.controller.cDynamicDetails', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('dynamicDetailsWin');
        if(!win){
            win = desktop.createWindow({
                id: 'dynamicDetailsWin',
                title:i18n('sDynamic_login_pages'),
                width:800,
                height:400,
                iconCls: 'dynamic_pages',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'dynamicDetailsWinA',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:i18n('sDynamic_login_pages'),
                        image:  'resources/images/48x48/dynamic_pages.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        items: [
                            { 'title' : i18n('sDynamic_login_pages'), 'xtype':'gridDynamicDetails'},
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
    views:  [
        'dynamicDetails.gridDynamicDetails',                'dynamicDetails.winDynamicDetailAddWizard', 'dynamicDetails.pnlDynamicDetail',  'components.pnlBanner',
        'components.winCsvColumnSelect',    'components.winNote',       'components.winNoteAdd','dynamicDetails.pnlDynamicDetailDetail',
        'dynamicDetails.pnlDynamicDetailLogo'
    ],
    stores: ['sDynamicDetails','sAccessProvidersTree'],
    models: ['mDynamicDetail','mAccessProviderTree'],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/dynamic_details/add.json',
        urlEdit:            '/cake2/rd_cake/dynamic_details/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/dynamic_details/export_csv',
        urlNoteAdd:         '/cake2/rd_cake/dynamic_details/note_add.json',
        urlViewDynamicDetail: '/cake2/rd_cake/dynamic_details/view.json',
        urlLogoBase:        '/cake2/rd_cake/img/dynamic_details/',
        urlUploadLogo:      '/cake2/rd_cake/dynamic_details/upload_logo/',
    },
    refs: [
         {  ref:    'gridDynamicDetails',           selector:   'gridDynamicDetails'} 
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sDynamicDetails').addListener('load',me.onStoreDynamicDetailsLoaded, me);
        me.control({
            'gridDynamicDetails #reload': {
                click:      me.reload
            },
            'gridDynamicDetails #add': {
                click:      me.add
            },
            'gridDynamicDetails #delete': {
                click:      me.del
            },
            'gridDynamicDetails #edit': {
                click:      me.edit
            },
            'gridDynamicDetails #note'   : {
                click:      me.note
            },
            'gridDynamicDetails #csv'  : {
                click:      me.csvExport
            },
            'gridDynamicDetails'   : {
                itemclick:  me.gridClick
            },
            'winDynamicDetailAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winDynamicDetailAddWizard #btnDynamicDetailDetailPrev' : {
                click:  me.btnDynamicDetailDetailPrev
            },
            'winDynamicDetailAddWizard #save' : {
                click:  me.addSubmit
            },
            'pnlDynamicDetail pnlDynamicDetailDetail #save' : {
                click:  me.editSubmit
            },
            '#dynamicDetailsWin':   {
                afterrender: me.onStoreDynamicDetailsLoaded //Prime it initially
            },
            '#winCsvColumnSelectDynamicDetails #save': {
                click:  me.csvExportSubmit
            },
            'gridNote[noteForGrid=dynamicDetails] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=dynamicDetails] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=dynamicDetails] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=dynamicDetails]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=dynamicDetails] #btnNoteTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=dynamicDetails] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=dynamicDetails] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            },
            'pnlDynamicDetail #tabDetail': {
                beforerender:   me.tabDetailActivate,
                activate:       me.tabDetailActivate
            },
            'pnlDynamicDetail #tabLogo': {
                activate:       me.tabLogoActivate
            },
            'pnlDynamicDetail #tabLogo #save': {
                click:       me.logoSave
            },
            'pnlDynamicDetail #tabLogo #cancel': {
                click:       me.logoCancel
            },
            
        });;
    },
    reload: function(){
        var me =this;
        me.getStore('sDynamicDetails').load();
    },
    gridClick:  function(grid, record, item, index, event){
        var me                  = this;
        me.selectedRecord = record;
        //Dynamically update the top toolbar
        tb = me.getGridDynamicDetails().down('toolbar[dock=top]');

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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicDetailAddWizardId')){
                            var w = Ext.widget('winDynamicDetailAddWizard',
                            {
                                id          :'winDynamicDetailAddWizardId'
                            });
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winDynamicDetailAddWizardId')){
                            var w   = Ext.widget('winDynamicDetailAddWizard',
                            {
                                id          : 'winDynamicDetailAddWizardId',
                                startScreen : 'scrnData',
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
    btnTreeNext: function(button){
        var me = this;
        var tree = button.up('treepanel');
        //Get selection:
        var sr = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winDynamicDetailAddWizard');
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
    btnDynamicDetailDetailPrev: function(button){
        var me = this;
        var win = button.up('winDynamicDetailAddWizard');
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
                me.getStore('sDynamicDetails').load();
                Ext.ux.Toaster.msg(
                    i18n('sNew_item_created'),
                    i18n('sItem_created_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            //Focus on the first tab as this is the most likely cause of error 
            failure: function(form,action){
                var tp = win.down('tabpanel');
                tp.setActiveTab(0);
                Ext.ux.formFail(form,action)
            }
        });
    },
    del:   function(button){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridDynamicDetails().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    me.getGridDynamicDetails().getStore().remove(me.getGridDynamicDetails().getSelectionModel().getSelection());
                    me.getGridDynamicDetails().getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.onStoreDynamicDetailsLoaded();   //Update the count   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.getGridDynamicDetails().getStore().load(); //Reload from server since the sync was not good
                        }
                    });

                }
            });
        }
    },
    edit: function(button){
        var me = this;  
        //Find out if there was something selected
        if(me.getGridDynamicDetails().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            //Check if the node is not already open; else open the node:
            var tp      = me.getGridDynamicDetails().up('tabpanel');
            var sr      = me.getGridDynamicDetails().getSelectionModel().getLastSelected();
            var id      = sr.getId();
            var tab_id  = 'dynamicDetailTab_'+id;
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
                items:      {'xtype' : 'pnlDynamicDetail',dynamicDetail_id: id}
            });
            tp.setActiveTab(tab_id); //Set focus on Add Tab
        }
    },
    editSubmit: function(button){
        var me      = this;
        var form    = button.up('form');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
            success: function(form, action) {
                me.getStore('sDynamicDetails').load();
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
    onStoreDynamicDetailsLoaded: function() {
        var me = this;
        var count = me.getStore('sDynamicDetails').getTotalCount();
        me.getGridDynamicDetails().down('#count').update({count: count});
    },

     csvExport: function(button,format) {
        var me          = this;
        var columns     = me.getGridDynamicDetails().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectDynamicDetails')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectDynamicDetails',columns: col_list});
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
            me.getGridDynamicDetails().filters.filters.each(function(item) {
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

    note: function(button,format) {
        var me      = this;    
        //Find out if there was something selected
        var sel_count = me.getGridDynamicDetails().getSelectionModel().getCount();
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
                var sr = me.getGridDynamicDetails().getSelectionModel().getLastSelected();
                
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteDynamicDetails'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteDynamicDetails'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'dynamicDetails',
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteDynamicDetailsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteDynamicDetailsAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteDynamicDetailsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteDynamicDetailsAdd'+grid.noteForId,
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
    },
    tabDetailActivate : function(tab){
        var me      = this;
        var form    = tab.down('form');
        var dynamic_detail_id= tab.up('pnlDynamicDetail').dynamic_detail_id;
        form.load({url:me.urlViewDynamicDetailDetail, method:'GET',params:{dynamic_detail_id:dynamic_detail_id}});
    },
    tabLogoActivate: function(tab){
        var me      = this;
        var pnl_n   = tab.up('pnlNas');
        var dynamic_detail_id= tab.up('pnlDynamicDetail').dynamic_detail_id;
        var p_img   = tab.down('#pnlImg');
        Ext.Ajax.request({
            url: me.urlViewDynamicDetailDetail,
            method: 'GET',
            params: {dynamic_detail_id : dynamic_detail_id },
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    var img_url = me.urlLogoBase+jsonData.data.icon_file_name;
                    p_img.update({image:img_url});
                }   
            },
            scope: me
        });
    },
    logoSave: function(button){
        console.log("goooo");
        var me      = this;
        var form    = button.up('form');
        var pnl_r   = form.up('pnlDynamicDetail');
        var p_form  = form.up('panel');
        var p_img   = p_form.down('#pnlImg');
        form.submit({
            clientValidation: true,
            waitMsg: 'Uploading your photo...',
            url: me.urlUploadLogo,
            params: {'id' : pnl_r.dynamic_detail_id },
            success: function(form, action) {              
                if(action.result.success){ 
                    var new_img = action.result.icon_file_name;    
                    var img_url = me.urlLogoBase+new_img;
                    p_img.update({image:img_url});
                } 
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
    logoCancel: function(button){
        var me      = this;
        var form    = button.up('form');
        form.getForm().reset();
    }
});
