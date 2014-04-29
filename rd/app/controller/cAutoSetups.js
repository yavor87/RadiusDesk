Ext.define('Rd.controller.cAutoSetups', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('autoSetupsWin');
        if(!win){
            win = desktop.createWindow({
                id: 'autoSetupsWin',
                title: 'Auto Setups',
                btnText: 'Auto Setups',
                width:800,
                height:400,
                iconCls: 'setup',
                glyph: Rd.config.icnSpanner,
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'autoSetupsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: 'Access Point auto setup',
                        image:  'resources/images/48x48/setup.png'
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
                            items   : { 'title' : i18n('sHome'), xtype: 'gridAutoSetups','glyph': Rd.config.icnHome}}
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',             'autoSetups.gridAutoSetups',    'autoSetups.winAutoSetupAddWizard',
        'components.winCsvColumnSelect',    'components.winNote',           'components.winNoteAdd',
        'autoSetups.pnlAutoSetup',          'autoSetups.pnlAutoSetupSettings'
    ],
    stores: ['sAutoSetups',   'sAccessProvidersTree'],
    models: ['mAutoSetup',    'mAccessProviderTree'],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/auto_macs/add.json',
        urlEdit:            '/cake2/rd_cake/auto_macs/edit.json',
        urlDelete:          '/cake2/rd_cake/auto_macs/delete.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/auto_macs/export_csv',
        urlNoteAdd:         '/cake2/rd_cake/auto_macs/note_add.json',
        urlASDefaults:      '/cake2/rd_cake/auto_macs/default_values.json',
        urlViewASDetail:    '/cake2/rd_cake/auto_macs/view.json'
    },
    refs: [
        {  ref: 'grid',  selector:   'gridAutoSetups'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sAutoSetups').addListener('load',me.onStoreAutoSetupsLoaded, me);
        me.control({
            '#autoSetupsWin'    : {
                beforeshow:      me.winClose,
                destroy   :      me.winClose
            },
            'gridAutoSetups #reload': {
                click:      me.reload
            }, 
            'gridAutoSetups #add'   : {
                click:      me.add
            },
            'gridAutoSetups #delete'   : {
                click:      me.del
            },
            'gridAutoSetups #edit'   : {
                click:      me.edit
            },
            'gridAutoSetups #note'   : {
                click:      me.note
            },
            'gridAutoSetups #csv'  : {
                click:      me.csvExport
            },
            'gridAutoSetups'       : {
                activate:      me.gridActivate
            },
            'gridAutoSetups #reload menuitem[group=refresh]'   : {
                click:      me.reloadOptionClick
            },
            'winAutoSetupAddWizard form' : {
                show:  me.btnAddFormRender
            },

            'winAutoSetupAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winAutoSetupAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winAutoSetupAddWizard #save' : {
                click:  me.btnDataNext
            },
            '#winCsvColumnSelectAutoSetups #save': {
                click:  me.csvExportSubmit
            },
            'gridNote[noteForGrid=auto_macs] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=auto_macs] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=auto_macs] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=auto_macs]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=auto_macs] #btnTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=auto_macs] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=auto_macs] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            },
            'pnlAutoSetup #tabSettings': {
                beforerender:   me.tabAutoSetupSettingsActivate,
                activate:       me.tabAutoSetupSettingsActivate
            },
            'pnlAutoSetup pnlAutoSetupSettings #save': {
                click:      me.editSubmit
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
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winAutoSetupAddWizardId')){
                            var w = Ext.widget('winAutoSetupAddWizard',{id:'winAutoSetupAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winAutoSetupAddWizardId')){
                            var w = Ext.widget('winAutoSetupAddWizard',
                                {id:'winAutoSetupAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
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
            var win = button.up('winAutoSetupAddWizard');
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
        var win     = button.up('winAutoSetupAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnDataNext:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        var tp      = form.down('tabpanel');
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            success: function(form, action) {
                win.close();
                me.getStore('sAutoSetups').load();
                Ext.ux.Toaster.msg(
                    i18n('sNew_item_created'),
                    i18n('sItem_created_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            //Focus on the  tab with error  
            failure: function(form,action,b,c){
                if(action.result.tab != undefined){ //This will be for OpenVPN and pptp
                    tp.setActiveTab(action.result.tab);
                }else{
                    tp.setActiveTab('tabRequired');
                }
                Ext.ux.formFail(form,action)
            }
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

    edit:   function(){ 
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getGrid().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            var selected    =  me.getGrid().getSelectionModel().getSelection();
            var count       = selected.length;         
            Ext.each(me.getGrid().getSelectionModel().getSelection(), function(sr,index){

                //Check if the node is not already open; else open the node:
                var tp          = me.getGrid().up('tabpanel');
                var am_id       = sr.getId();
                var as_tab_id   = 'asTab_'+am_id;
                var nt          = tp.down('#'+as_tab_id);
                if(nt){
                    tp.setActiveTab(as_tab_id); //Set focus on  Tab
                    return;
                }

                var as_tab_name = sr.get('name');
                //Tab not there - add one
                tp.add({ 
                    title :     as_tab_name,
                    itemId:     as_tab_id,
                    closable:   true,
                    iconCls:    'edit',
                    glyph: Rd.config.icnEdit,
                    layout:     'fit', 
                    items:      {'xtype' : 'pnlAutoSetup',am_id: am_id}
                });
                tp.setActiveTab(as_tab_id); //Set focus on Add Tab
            });
        }
    },

    editSubmit: function(button){
        var me      = this;
        var form    = button.up('form');
        var tp      = form.down('tabpanel');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
            success: function(form, action) {
                me.getStore('sAutoSetups').load();
                Ext.ux.Toaster.msg(
                    i18n('sItem_updated'),
                    i18n('sItem_updated_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            //Focus on the  tab with error  
            failure: function(form,action,b,c){
                if(action.result.tab != undefined){ //This will be for OpenVPN and pptp
                    tp.setActiveTab(action.result.tab);
                }else{
                    tp.setActiveTab('tabNetwork');
                }
                Ext.ux.formFail(form,action)
            }
        });
    },
    onStoreAutoSetupsLoaded: function() {
        var me      = this;
        var count   = me.getStore('sAutoSetups').getTotalCount();
        me.getGrid().down('#count').update({count: count});
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

    //--- Applet Specifics ---
    btnAddFormRender: function(form){
        var me  = this;
        //Only fetch the default data the first time; then set a flag
        if(form.supplied == undefined){
            console.log(form);
            form.load({url:me.urlASDefaults, method:'GET'});
            form.supplied = true;
        }  
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

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectAutoSetups')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectAutoSetups',columns: col_list});
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
                //auto_macs
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteAutoSetups'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteAutoSetups'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'auto_macs',
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteAutoSetupAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteAutoSetupsAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteAutoSetupAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteAutoSetupAdd'+grid.noteForId,
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
    },
    tabAutoSetupSettingsActivate : function(tab){
        var me      = this;
        var form    = tab.down('form');
        var am_id  = tab.up('pnlAutoSetup').am_id;
        form.load({url:me.urlViewASDetail, method:'GET',params:{am_id:am_id}});
    }
});
