Ext.define('Rd.controller.cRealms', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('realmsWin');
        if(!win){
            win = desktop.createWindow({
                id: 'realmsWin',
                title:'Realms manager',
                width:800,
                height:400,
                iconCls: 'realms',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'realmsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:'Realms',
                        image:  'resources/images/48x48/realm.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        items: [
                            { 'title' : 'Realms', 'xtype':'gridRealms'},
                            // { 'title' : 'Advanced realms'}
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
        'realms.gridRealms',                'realms.winRealmAddWizard', 'realms.winRealmAdd',   'realms.pnlRealm',  'components.pnlBanner',
        'components.winCsvColumnSelect',    'components.winNote',       'components.winNoteAdd'
    ],
    stores: ['sRealms','sAccessProvidersTree'],
    models: ['mRealm','mAccessProviderTree'],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/realms/add.json',
        urlEdit:            '/cake2/rd_cake/realms/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/realms/export_csv',
        urlNoteAdd:         '/cake2/rd_cake/realms/note_add.json'
    },
    refs: [
         {  ref:    'gridRealms',           selector:   'gridRealms'},
         {  ref:    'gridAdvancedRealms',   selector:   'gridAdvancedRealms'} 
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sRealms').addListener('load',me.onStoreRealmsLoaded, me);
        me.control({
            'gridRealms #reload': {
                click:      me.reload
            },
            'gridRealms #add': {
                click:      me.add
            },
            'gridRealms #delete': {
                click:      me.del
            },
            'gridRealms #edit': {
                click:      me.edit
            },
            'gridRealms #note'   : {
                click:      me.note
            },
            'gridRealms #csv'  : {
                click:      me.csvExport
            },
            'gridRealms'   : {
                itemclick:  me.gridClick
            },
            'winRealmAddWizard' :{
                toFront: me.maskHide
            },
            'winRealmAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winRealmAddWizard #btnRealmDetailPrev' : {
                click:  me.btnRealmDetailPrev
            },
            'winRealmAddWizard #save' : {
                click:  me.addSubmit
            },
            'pnlRealm frmRealmDetail #save' : {
                click:  me.editSubmit
            },
            '#realmsWin':   {
                afterrender: me.onStoreRealmsLoaded //Prime it initially
            },
            '#winCsvColumnSelectRealms #save': {
                click:  me.csvExportSubmit
            },
            '#winCsvColumnSelectRealms':{
                toFront:       me.maskHide
            },
            'gridNote[noteForGrid=realms] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=realms] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=realms] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=realms]' : {
                itemclick: me.gridNoteClick
            },
            'winNote[noteForGrid=realms]':{
                toFront:       me.maskHide
            },
            'winNoteAdd[noteForGrid=realms] #btnNoteTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=realms] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=realms] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            }
            
        });;
    },
    reload: function(){
        var me =this;
        me.getStore('sRealms').load();
    },
    maskHide:   function(){
        var me =this;
        me.getGridRealms().mask.hide();
    },
    gridClick:  function(grid, record, item, index, event){
        var me                  = this;
        me.selectedRecord = record;
        //Dynamically update the top toolbar
        tb = me.getGridRealms().down('toolbar[dock=top]');

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
         me.getGridRealms().mask.show();
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winRealmAddWizardId')){
                            var w = Ext.widget('winRealmAddWizard',
                            {
                                id          :'winRealmAddWizardId'
                            });
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winRealmAddWizardId')){
                            var w   = Ext.widget('winRealmAddWizard',
                            {
                                id          : 'winRealmAddWizardId',
                                startScreen : 'scrnRealmDetail',
                                user_id     : '0',
                                owner       : 'Logged in user',
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
            var win = button.up('winRealmAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnRealmDetail');
        }else{
            Ext.ux.Toaster.msg(
                        'Select a owner',
                        'First select an Access Provider who will be the owner',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnRealmDetailPrev: function(button){
        var me = this;
        var win = button.up('winRealmAddWizard');
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
                me.getStore('sRealms').load();
                Ext.ux.Toaster.msg(
                    'New Realm Created',
                    'Realm created fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    del:   function(button){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridRealms().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item to delete',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(val){
                if(val== 'yes'){
                    me.getGridRealms().getStore().remove(me.getGridRealms().getSelectionModel().getSelection());
                    me.getGridRealms().getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                'Item Deleted',
                                'Item deleted fine',
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.onStoreRealmsLoaded();   //Update the count   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                'Problems deleting item',
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.getGridRealms().getStore().load(); //Reload from server since the sync was not good
                        }
                    });

                }
            });
        }
    },
    edit: function(button){
        var me = this;
         me.getGridRealms().mask.show();   
        //Find out if there was something selected
        if(me.getGridRealms().getSelectionModel().getCount() == 0){
             me.maskHide();
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item to edit',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            me.maskHide();
            //Check if the node is not already open; else open the node:
            var tp      = me.getGridRealms().up('tabpanel');
            var sr      = me.getGridRealms().getSelectionModel().getLastSelected();
            var id      = sr.getId();
            var tab_id  = 'realmTab_'+id;
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
                items:      {'xtype' : 'pnlRealm',realm_id: id}
            });
            tp.setActiveTab(tab_id); //Set focus on Add Tab
            //Load the record:
            nt  = tp.down('#'+tab_id);
            var f   = nt.down('frmRealmDetail');
            f.loadRecord(sr);    //Load the record
            f.down('#owner').setValue(sr.get('owner'));   
        }
    },
    editSubmit: function(button){
        var me      = this;
        var form    = button.up('form');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
            success: function(form, action) {
                me.getStore('sRealms').load();
                Ext.ux.Toaster.msg(
                    'Item updated',
                    'Item updated fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    onStoreRealmsLoaded: function() {
        var me = this;
        var count = me.getStore('sRealms').getTotalCount();
        me.getGridRealms().down('#count').update({count: count});
    },

     csvExport: function(button,format) {
        var me          = this;
        me.getGridRealms().mask.show();
        var columns     = me.getGridRealms().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectRealms')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectRealms',columns: col_list});
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
                        'Select one or more',
                        'Select one or more columns please',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{     
            //next we need to find the filter values:
            var filters     = [];
            var f_count     = 0;
            var f_found     = false;
            var filter_json ='';
            me.getGridRealms().filters.filters.each(function(item) {
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
        me.getGridRealms().mask.show();     
        //Find out if there was something selected
        var sel_count = me.getGridRealms().getSelectionModel().getCount();
        if(sel_count == 0){
            me.maskHide();
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                me.maskHide();
                Ext.ux.Toaster.msg(
                        'Limit the selection',
                        'Selection limited to one',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                //Determine the selected record:
                var sr = me.getGridRealms().getSelectionModel().getLastSelected();
                
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteRealms'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteRealms'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'realms',
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteRealmsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteRealmsAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid
                            });
                            me.application.runAction('cDesktop','Add',w);       
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteRealmsAdd'+grid.noteForId)){
                            var w   = Ext.widget('winNoteAdd',
                            {
                                id          : 'winNoteRealmsAdd'+grid.noteForId,
                                noteForId   : grid.noteForId,
                                noteForGrid : grid.noteForGrid,
                                refreshGrid : grid,
                                startScreen : 'scrnNote',
                                user_id     : '0',
                                owner       : 'Logged in user',
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
                        'Select a owner',
                        'First select an Access Provider who will be the owner',
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
                    'New Note Created',
                    'Note created fine',
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
                        'Select an item',
                        'First select an item to delete',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(val){
                if(val== 'yes'){
                    grid.getStore().remove(grid.getSelectionModel().getSelection());
                    grid.getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                'Item Deleted',
                                'Item deleted fine',
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            grid.getStore().load();   //Update the count
                            me.reload();   
                        },
                        failure: function(batch,options,c,d){
                            Ext.ux.Toaster.msg(
                                'Problems deleting item',
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
