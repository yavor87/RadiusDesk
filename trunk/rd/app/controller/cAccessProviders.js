Ext.define('Rd.controller.cAccessProviders', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('accessProvidersWin');
        if(!win){
            win = desktop.createWindow({
                id: 'accessProvidersWin',
                title: i18n('sAccess_Providers'),
                width:800,
                height:200,
                iconCls: 'key',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'accessProvidersWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: i18n('sAccess_Providers'),
                        image:  'resources/images/48x48/key.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : false,
                        items   : { 'title' : i18n('sAccess_Providers'),'xtype':'gridAccessProviders'}   
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },
    views:  [
        'accessProviders.treeAccessProviders',  'accessProviders.pnlAccessProvider',    'accessProviders.frmDetail',
        'accessProviders.winDetail',            'accessProviders.treeApUserRights',     'accessProviders.gridRealms',   
        'components.pnlBanner',                 'accessProviders.gridAccessProviders',  'accessProviders.winApAddWizard',
        'components.winCsvColumnSelect',        'components.winNote',                   'components.winNoteAdd'
    ],
    stores: ['sLanguages',  'sApRights',    'sAccessProvidersGrid',     'sAccessProvidersTree'],
    models: ['mApUserRight','mApRealms',    'mAccessProviderGrid',      'mAccessProviderTree'],
    selectedRecord: undefined,
    config: {
        urlAdd          : '/cake2/rd_cake/access_providers/add.json',
        urlEdit         : '/cake2/rd_cake/access_providers/edit.json',
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/access_providers/export_csv',
        urlNoteAdd      : '/cake2/rd_cake/access_providers/note_add.json'
    },
    refs: [
        { ref:  'treeAccessProviders',  selector:   'treeAccessProviders',  xtype:  '', autoCreate: true    },
        { ref:  'winAccessProviders',   selector:   '#accessProvidersWin'},
        { ref:  'grid',                 selector:   'gridAccessProviders'}
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sAccessProvidersGrid').addListener('load',me.onStoreApLoaded, me);

        me.control({
            'gridAccessProviders #reload': {
                click:      me.reload
            },
            'gridAccessProviders #add': {
                click:      me.add
            },
            'gridAccessProviders #edit': {
                click:      me.edit
            },
            'gridAccessProviders #delete': {
                click:      me.del
            },
            'gridAccessProviders #note'   : {
                click:      me.note
            },
            'gridAccessProviders #csv'  : {
                click:      me.csvExport
            },
            'gridAccessProviders #password': {
                click:      me.password
            },
            'winApAddWizard':{
                toFront:       me.maskHide
            },
            'winApAddWizard #btnTreeNext': {
                click:      me.btnTreeNext
            },
            'winApAddWizard #btnDetailPrev': {
                click:      me.btnDetailPrev
            },
            'winApAddWizard #save': {
                click:      me.addSubmit
            },
            'winAccessProviderDetail #save': {
                click:      me.addSubmit
            },
            'pnlAccessProvider frmAccessProviderDetail #save': {
                click:      me.editSubmit
            },
            'pnlAccessProvider treeApUserRights #reload': {
                click:      me.apRightReload
            },
            'pnlAccessProvider treeApUserRights #expand': {
                click:      me.apRightExpand
            },
            'pnlAccessProvider treeApUserRights advCheckColumn': {
                checkchange: me.apRightChange
            },
            'pnlAccessProvider gridApRealms #reload': {
                click:      me.apRealmsReload
            },
            '#winCsvColumnSelectAp #save': {
                click:  me.csvExportSubmit
            },
            '#winCsvColumnSelectAp':{
                toFront:       me.maskHide
            },
            'gridNote[noteForGrid=access_providers] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=access_providers] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=access_providers] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=access_providers]' : {
                itemclick: me.gridNoteClick
            },
            'winNote[noteForGrid=access_providers]':{
                toFront:       me.maskHide
            },
            'winNoteAdd[noteForGrid=access_providers] #btnNoteTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=access_providers] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=access_providers] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            }

        });;
    },
    reload: function(){
        var me =this;
        me.getGrid().getStore().load();
    },
    maskHide:   function(){
        var me =this;
        me.getGrid().mask.hide();
    },
    add:    function(){
        var me = this;
        me.getGrid().mask.show(); 

        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winApAddWizardId')){
                            var w = Ext.widget('winApAddWizard',
                            {
                                id          :'winApAddWizardId',
                                no_tree     : false

                            });
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winApAddWizardId')){
                            var w = Ext.widget('winApAddWizard',
                            {
                                id          :'winApAddWizardId',
                                noTree      : true, 
                                startScreen : 'scrnDetail',
                                user_id     : '0',
                                owner       : i18n('sLogged_in_user'),
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
        var me      = this;
        var tree    = button.up('treepanel');
        //Get selection:
        var sr      = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winApAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#parent_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnDetail');
        }else{
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_owner'),
                        i18n('sFirst_select_an_Access_Provider_who_will_be_the_owner'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnDetailPrev: function(button){
        var me = this;
        var win = button.up('winApAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    addSubmit: function(button){
        var me       = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            success: function(form, action) {
                win.close();
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
    edit:   function(){
        console.log("Edit node");  
        var me = this;
        me.getGrid().mask.show();
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
            me.maskHide(); 
        }else{

            var selected    =  me.getGrid().getSelectionModel().getSelection();
            var count       = selected.length;         
            Ext.each(me.getGrid().getSelectionModel().getSelection(), function(sr,index){

                //Check if the node is not already open; else open the node:
                var tp          = me.getGrid().up('tabpanel');
                var ap_id       = sr.getId();
                var ap_tab_id   = 'apTab_'+ap_id;
                var nt          = tp.down('#'+ap_tab_id);
                if(nt){
                    tp.setActiveTab(ap_tab_id); //Set focus on  Tab
                    return;
                }

                var ap_tab_name = sr.get('username');
                //Tab not there - add one
                tp.add({ 
                    title :     ap_tab_name,
                    itemId:     ap_tab_id,
                    closable:   true,
                    iconCls:    'edit', 
                    layout:     'fit', 
                    items:      {'xtype' : 'pnlAccessProvider',ap_id: ap_id}
                });
                tp.setActiveTab(ap_tab_id); //Set focus on Add Tab
                //Load the record:
                var nt  = tp.down('#'+ap_tab_id);
                var f   = nt.down('form');
                f.loadRecord(sr);    //Load the record
                //Get the parent node
                f.down("#owner").setValue(sr.get('owner'));

                //Take mask down on last one
                if(index == (count-1)){
                    me.getGrid().mask.hide(); 
                }
            });
        }
    },
    editSubmit: function(button){
        console.log("Edit submit");
        var me      = this;
        var form    = button.up('form');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
            success: function(form, action) {
                me.reload();
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
    del:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGrid().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
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
                            me.onStoreApLoaded();   //Update the count   
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
    password: function(){
        console.log("Change password");
    },
    apRightReload: function(button){
        var me = this;
        var tree = button.up('treeApUserRights');
        tree.getStore().load();
    },
    apRightExpand: function(button){
        var me = this;
        var tree = button.up('treeApUserRights');
        var sel_count = tree.getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_a_node'),
                        i18n('sFirst_select_a_node_to_expand'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            var sr = tree.getSelectionModel().getLastSelected();
            tree.expandNode(sr,true); 
        }
    },
    apRightChange: function(i){
        var me      = this;
        var tree    = i.up('treeApUserRights');
        tree.getStore().sync({
            success: function(batch,options){
                Ext.ux.Toaster.msg(
                    i18n('sRight_Changed'),
                    i18n('sRight_changed_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                ); 
            },
            failure: function(batch,options){
                Ext.ux.Toaster.msg(
                    i18n('sProblems_changing_right'),
                    i18n('sThere_were_some_problems_experienced_during_changing_of_the_right'),
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
            }
        });
    },
    apRealmsReload: function(button){
        var me = this;
        var grid = button.up('gridApRealms');
        grid.getStore().load();
    },
    onStoreApLoaded: function() {
        var me      = this;
        var count   = me.getStore('sAccessProvidersGrid').getTotalCount();
        me.getGrid().down('#count').update({count: count});
    },
    csvExport: function(button,format) {
        var me          = this;
        me.getGrid().mask.show();
        var columns     = me.getGrid().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectAp')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectAp',columns: col_list});
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

    note: function(button,format) {
        var me      = this;
        me.getGrid().mask.show();     
        //Find out if there was something selected
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
             me.maskHide();
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                me.maskHide();
                Ext.ux.Toaster.msg(
                        i18n('sLimit_the_selection'),
                        i18n('sSelection_limited_to_one'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                //Determine the selected record:
                var sr = me.getGrid().getSelectionModel().getLastSelected();
                
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteAp'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteAp'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'access_providers',
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteApAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteApAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteApAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteApAdd'+grid.noteForId,
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
