Ext.define('Rd.controller.cTemplates', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('templatesWin');
        if(!win){
            win = desktop.createWindow({
                id: 'templatesWin',
                title: i18n('sProfile_template_manager'),
                width:800,
                height:400,
                iconCls: 'copy',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'templatesWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: i18n('sProfile_template_manager'),
                        image:  'resources/images/48x48/templates.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : true,
                        items   : { 'title' : i18n('sTemplates'), xtype: 'gridTemplates'}
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',             'templates.gridTemplates',  'templates.winTemplateAddWizard',
        'components.winCsvColumnSelect',    'components.winNote',       'components.winNoteAdd',
        'templates.gridTemplate',           'components.cmbVendor',     'components.cmbAttribute'
    ],
    stores: ['sTemplates', 'sAccessProvidersTree', 'sAttributes', 'sVendors'],
    models: ['mTemplate',  'mAccessProviderTree', 'mAttribute', 'mVendor',  'mTemplateEdit' ],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/templates/add.json',
        urlEdit:            '/cake2/rd_cake/templates/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/templates/export_csv',
        urlNoteAdd:         '/cake2/rd_cake/templates/note_add.json'
    },
    refs: [
        {  ref: 'grid',  selector:   'gridTemplates'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sTemplates').addListener('load',me.onStoreTemplatesLoaded, me);
        me.control({
            'gridTemplates #reload': {
                click:      me.reload
            }, 
            'gridTemplates #add'   : {
                click:      me.add
            },
            'gridTemplates #delete'   : {
                click:      me.del
            },
            'gridTemplates #edit'   : {
                click:      me.edit
            },
            'gridTemplates #note'   : {
                click:      me.note
            },
            'gridTemplates #csv'  : {
                click:      me.csvExport
            },
            'gridTemplates'   : {
                select:      me.select
            },
            'winTemplateAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winTemplateAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winTemplateAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
            '#winCsvColumnSelectTemplates #save': {
                click:  me.csvExportSubmit
            },
            'gridNote[noteForGrid=templates] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=templates] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=templates] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=templates]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=templates] #btnNoteTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=templates] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=templates] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            },
            'gridTemplate  #cmbVendor': {
                change:      me.cmbVendorChange
            },
            'gridTemplate  #add': {
                click:      me.attrAdd
            },
            'gridTemplate  #reload': {
                click:      me.attrReload
            },
            'gridTemplate  #delete': {
                click:      me.attrDelete
            },
        });
    },
    reload: function(){
        var me =this;
        me.getStore('sTemplates').load();
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winTemplateAddWizardId')){
                            var w = Ext.widget('winTemplateAddWizard',{id:'winTemplateAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winTemplateAddWizardId')){
                            var w = Ext.widget('winTemplateAddWizard',
                                {id:'winTemplateAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
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
            var win = button.up('winTemplateAddWizard');
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
        var win     = button.up('winTemplateAddWizard');
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
                me.getStore('sTemplates').load();
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
                            me.onStoreTemplatesLoaded();   //Update the count   
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

    edit:   function(){
        console.log("Edit node");  
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
                var tmpl_id     = sr.getId();
                var tmpl_tab_id = 'tmplTab_'+tmpl_id;
                var nt          = tp.down('#'+tmpl_tab_id);
                if(nt){
                    tp.setActiveTab(tmpl_tab_id); //Set focus on  Tab
                    return;
                }

                var tmpl_tab_name = sr.get('name');
                //Tab not there - add one
                tp.add({ 
                    title :     tmpl_tab_name,
                    itemId:     tmpl_tab_id,
                    closable:   true,
                    iconCls:    'edit', 
                    layout:     'fit', 
                    items:      {'xtype' : 'gridTemplate',tmpl_id: tmpl_id}
                });
                tp.setActiveTab(tmpl_tab_id); //Set focus on Add Tab
                //Load the record:
               // var nt  = tp.down('#'+tmpl_tab_id);
               // var f   = nt.down('form');
              //  f.loadRecord(sr);    //Load the record
                //Get the parent node
               // f.down("#owner").setValue(sr.get('owner'));
            });
        }
    },
    onStoreTemplatesLoaded: function() {
        var me      = this;
        var count   = me.getStore('sTemplates').getTotalCount();
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

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectTemplates')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectTemplates',columns: col_list});
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
                
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteTemplates'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteTemplates'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'templates',
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteTemplatesAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteTemplatesAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteTemplatesAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteTemplatesAdd'+grid.noteForId,
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
    cmbVendorChange: function(cmb){
        var me = this;
        console.log("Combo thing changed");
        var value   = cmb.getValue();
        var grid    = cmb.up('gridTemplate');
        var attr    = grid.down('cmbAttribute');
        //Cause this to result in a reload of the Attribute combo
        attr.getStore().getProxy().setExtraParam('vendor',value);
        attr.getStore().load();   
    },
    attrAdd: function(b){
        var me = this;
        console.log("Add to specific template");
        var grid    = b.up('gridTemplate');
        var attr    = grid.down('cmbAttribute');
        var a_val   = attr.getValue();
        if(a_val == null){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            //We do not do double's
            var f = grid.getStore().find('attribute',a_val);
            if(f == -1){
                grid.getStore().add(Ext.create('Rd.model.mTemplateEdit',
                    {
                        attribute       : a_val,
                        tooltip         : '=='+i18n("sTooltip_text_goes_here")+"==",
                        type            : 'check',
                        unit            : 'text_string'
                    }
                ));
                grid.getStore().sync();
            }
        }
    },

    attrReload: function(b){
        var me = this;
        var grid = b.up('gridTemplate');
        grid.getStore().load();
    },
    attrDelete: function(button){

        var me      = this;
        var grid    = button.up('gridTemplate');
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
                           // grid.getStore().load();   //Update the count
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
