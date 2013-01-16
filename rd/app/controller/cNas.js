Ext.define('Rd.controller.cNas', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('nasWin');
        if(!win){
            win = desktop.createWindow({
                id: 'nasWin',
                title:'NAS Device manager',
                width:800,
                height:400,
                iconCls: 'nas',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'nasWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:'NAS devices',
                        image:  'resources/images/48x48/nas.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : true,
                        items   : { 'title' : 'NAS devices', xtype: 'gridNas'}
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner','nas.gridNas','nas.winNasAddWizard','nas.gridRealmsForNasOwner','nas.winTagManage', 
        'components.winCsvColumnSelect', 'components.winNote', 'components.winNoteAdd'
    ],
    stores: ['sNas','sAccessProviders','sTags','sDynamicAttributes'],
    models: ['mNas','mAccessProvider','mRealmForNasOwner','mApRealms','mTag', 'mDynamicAttribute','mGenericList'],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/nas/add.json',
        urlEdit:            '/cake2/rd_cake/nas/edit.json',
        urlManageTags:      '/cake2/rd_cake/nas/manage_tags.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv:       '/cake2/rd_cake/nas/export_csv',
        urlNoteAdd:         '/cake2/rd_cake/nas/note_add.json'
    },
    refs: [
        {  ref: 'gridNas',  selector:   'gridNas'}       
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sNas').addListener('load',me.onStoreNasLoaded, me);
        me.control({
            'gridNas #reload': {
                click:      me.reload
            },
            'gridNas #add'   : {
                click:      me.add
            },
            'gridNas #csv'  : {
                click:      me.csvExport
            },
            'gridNas #note'   : {
                click:      me.note
            },
            'gridNas #tag'   : {
                click:      me.tag
            },
            'gridNas'       : {
                select:      me.select
            },
            'winNasAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winNasAddWizard #btnConTypePrev' : {
                click:  me.btnConTypePrev
            },
            'winNasAddWizard #btnConTypeNext' : {
                click:  me.btnConTypeNext
            },
            'winNasAddWizard #btnOpenvpnPrev' : {
                click: me.btnOpenvpnPrev
            },
            'winNasAddWizard #btnOpenvpnNext' : {
                click: me.btnOpenvpnNext
            },
            'winNasAddWizard #btnDynamicPrev' : {
                click: me.btnDynamicPrev
            },
            'winNasAddWizard #btnDynamicNext' : {
                click: me.btnDynamicNext
            },
            'winNasAddWizard #btnDirectPrev' : {
                click:  me.btnDirectPrev
            },
            'winNasAddWizard #btnDirectNext' : {
                click:  me.btnDirectNext
            },
            'winNasAddWizard #btnRealmsForNasOwnerPrev' : {
                click:  me.btnRealmsForNasOwnerPrev
            },
            'winNasAddWizard #btnRealmsForNasOwnerNext' : {
                click:  me.btnRealmsForNasOwnerNext
            },
            '#scrnRealmsForNasOwner gridRealmsForNasOwner #reload': {
                click:      me.gridRealmsForNasOwnerReload
            },
            '#scrnRealmsForNasOwner #chkAvailForAll': {
                change:     me.chkAvailForAllChange
            },
            'winTagManage #save' : {
                click:  me.btnTagManageSave
            },
            '#winCsvColumnSelectNas #save': {
                click:  me.csvExportSubmit
            },
            'gridNote[noteForGrid=nas] #reload' : {
                click:  me.noteReload
            },
            'gridNote[noteForGrid=nas] #add' : {
                click:  me.noteAdd
            },
            'gridNote[noteForGrid=nas] #delete' : {
                click:  me.noteDelete
            },
            'gridNote[noteForGrid=nas]' : {
                itemclick: me.gridNoteClick
            },
            'winNoteAdd[noteForGrid=nas] #btnNoteTreeNext' : {
                click:  me.btnNoteTreeNext
            },
            'winNoteAdd[noteForGrid=nas] #btnNoteAddPrev'  : {   
                click: me.btnNoteAddPrev
            },
            'winNoteAdd[noteForGrid=nas] #btnNoteAddNext'  : {   
                click: me.btnNoteAddNext
            }
        });
    },
    reload: function(){
        var me =this;
        me.getStore('sNas').load();
        //me.getStore('sNas').filter('connection_type','openvpn');
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
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNasAddWizardId')){
                            var w = Ext.widget('winNasAddWizard',{id:'winNasAddWizardId',startScreen: 'selAP'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winNasAddWizardId')){
                            var w = Ext.widget('winNasAddWizard',{id:'winNasAddWizardId',startScreen: 'selConnectType'});
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
            var win = button.up('winNasAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnConType');
        }else{
            Ext.ux.Toaster.msg(
                        'Select a owner',
                        'First select an Access Provider who will be the owner',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnConTypePrev: function(button){
        var me = this;
        var win = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnConTypeNext: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        //Find out the selected connection type:
        var form    = button.up('form');
        var rbg     = form.down('radiogroup');

        if(rbg.getValue().rb == 'direct'){
            rb = rbg.down('radio[inputValue="direct"]')
            win.down('#connectionType').setValue(rb.boxLabel);
            win.down('#connection_type').setValue('direct');
            win.getLayout().setActiveItem('scrnDirect'); 
        }

        if(rbg.getValue().rb == 'openvpn'){
            rb = rbg.down('radio[inputValue="openvpn"]')
            win.down('#connectionType').setValue(rb.boxLabel);
            win.down('#connection_type').setValue('openvpn');
            win.down('#nasname').setValue('Assigned by server');
            win.down('#nasname').setDisabled(true);
            win.getLayout().setActiveItem('scrnOpenvpn'); 
        }

         if(rbg.getValue().rb == 'dynamic'){
            rb = rbg.down('radio[inputValue="dynamic"]')
            win.down('#connectionType').setValue(rb.boxLabel);
            win.down('#connection_type').setValue('dynamic');
            win.down('#nasname').setValue('Assigned by server');
            win.down('#nasname').setDisabled(true);
            win.getLayout().setActiveItem('scrnDynamic'); 
        }
    },
    btnOpenvpnPrev: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnConType');
    },
    btnOpenvpnNext: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnDirect');
    },
    btnDynamicPrev: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnConType');
    },
    btnDynamicNext: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnDirect');
    },
    btnDirectPrev:  function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnConType');
    },
    btnDirectNext:  function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        //This part can be quite involved since the grid has to be fed some extraParams and reloaded 
        //since the owner and available_to_sub_providers will influence it
        var owner_id = win.down('#user_id').getValue();
        var a_to_s   = win.down('#a_to_s').getValue();

        var grid    = win.down('gridRealmsForNasOwner');
        grid.getStore().getProxy().setExtraParam('owner_id',owner_id);
        grid.getStore().getProxy().setExtraParam('available_to_siblings',a_to_s);
        grid.getStore().load();

        win.getLayout().setActiveItem('scrnRealmsForNasOwner');
    },
    btnRealmsForNasOwnerPrev:  function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        win.getLayout().setActiveItem('scrnDirect');
    },
    btnRealmsForNasOwnerNext: function(button){
        var me      = this;
        var win     = button.up('winNasAddWizard');
        var grid    = win.down('gridRealmsForNasOwner');
        var form    = win.down('#scrnDirect');
        var extra_params ={};   //Get the extra params to submit with form
        var select_flag = false;

        //See if 'Make available to any realm' is selected...
        var chk = win.down('#chkAvailForAll');
        if(chk.getValue() == true){
            extra_params.avail_for_all = true;
        }else{
            grid.getStore().each(function(record){
                if(record.get('selected') == true){
                    select_flag = true;
                    extra_params[record.getId()] = record.get('selected');
                }
            }, me);
        }

        //If they did not select avail_for_all and NOT selected ANY realm, refuse to continue
        if(extra_params.avail_for_all == undefined){
            if(select_flag != true){
                Ext.ux.Toaster.msg(
                        'Select at least one realm',
                        'Select one or meore realms',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
                return;
            }
        }

        //Check if it was not a direct connection... then get other attributes
        var rbg = win.down('radiogroup');
        if(rbg.getValue().rb == 'openvpn'){
            extra_params.vpn_username = win.down('#vpn_username').getValue();
            extra_params.vpn_password = win.down('#vpn_password').getValue();
        }

        //Check if it was not a direct connection... then get other attributes
        var rbg = win.down('radiogroup');
        if(rbg.getValue().rb == 'dynamic'){
            extra_params.dynamic_attribute  = win.down('#dynamic_attribute').getValue();
            extra_params.dynamic_value      = win.down('#dynamic_value').getValue();
        }

        //Checks passed fine...      
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            params: extra_params,
            success: function(form, action) {
                win.close();
                me.getGridNas().getStore().load();
                Ext.ux.Toaster.msg(
                    'New NAS Device Created',
                    'NAS Device created fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    chkAvailForAllChange: function(chk){
        var me      = this;
        var pnl     = chk.up('panel');
        var grid    = pnl.down("gridRealmsForNasOwner");
        if(chk.getValue() == true){
            grid.hide();
        }else{
            grid.show();
        }

    },
    gridRealmsForNasOwnerReload: function(button){
        var me      = this;
        var grid    = button.up('gridRealmsForNasOwner');
        grid.getStore().load();
    },

    tag: function(button){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridNas().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item to tag',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(!me.application.runAction('cDesktop','AlreadyExist','winTagManageId')){
                var w = Ext.widget('winTagManage',{id:'winTagManageId'});
                me.application.runAction('cDesktop','Add',w);       
            }    
        }
    },

    btnTagManageSave: function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        var cmb     = form.down('combo');
        var rbg     = form.down('radiogroup');

        if(cmb.getValue() == null){
            Ext.ux.Toaster.msg(
                        'Select a tag',
                        'Select a tag please',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            var extra_params    = {};
            var s               = me.getGridNas().getSelectionModel().getSelection();
            Ext.Array.each(s,function(record){
                var r_id = record.getId();
                extra_params[r_id] = r_id;
            });

            //Checks passed fine...      
            form.submit({
                clientValidation: true,
                url: me.urlManageTags,
                params: extra_params,
                success: function(form, action) {

                win.close();
                me.getGridNas().getStore().load();
                Ext.ux.Toaster.msg(
                    'Tags modified',
                    'Tags modified fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );

                },
                failure: Ext.ux.formFail
            });
        }
    },
    select: function(grid,record){
        var me = this;
        //Adjust the Edit Delete and Tag buttons accordingly...

        //Dynamically update the top toolbar
        tb = me.getGridNas().down('toolbar[dock=top]');
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

        var m_tag = record.get('manage_tags');
        if(del == true){
            if(tb.down('#tag') != null){
                tb.down('#tag').setDisabled(false);
            }
        }else{
            if(tb.down('#tag') != null){
                tb.down('#tag').setDisabled(true);
            }
        } 
    },

    onStoreNasLoaded: function() {
        var me      = this;
        var count   = me.getStore('sNas').getTotalCount();
        me.getGridNas().down('#count').update({count: count});
    },

    csvExport: function(button,format) {
        var me          = this;
        var columns     = me.getGridNas().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectNas')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectNas',columns: col_list});
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
            me.getGridNas().filters.filters.each(function(item) {
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
        var sel_count = me.getGridNas().getSelectionModel().getCount();
        if(sel_count == 0){
             Ext.ux.Toaster.msg(
                        'Select an item',
                        'First select an item',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        'Limit the selection',
                        'Selection limited to one',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                //Determine the selected record:
                var sr = me.getGridNas().getSelectionModel().getLastSelected();
                
                if(!me.application.runAction('cDesktop','AlreadyExist','winNoteNas'+sr.getId())){
                    var w = Ext.widget('winNote',
                        {
                            id          : 'winNoteNas'+sr.getId(),
                            noteForId   : sr.getId(),
                            noteForGrid : 'nas',
                            noteForName : sr.get('nasname')
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
        if(!me.application.runAction('cDesktop','AlreadyExist','winNoteNasAdd'+grid.noteForId)){
            var w   = Ext.widget('winNoteAdd',
            {
                id          : 'winNoteNasAdd'+grid.noteForId,
                noteForId   : grid.noteForId,
                noteForGrid : grid.noteForGrid,
                refreshGrid : grid
            });
            me.application.runAction('cDesktop','Add',w);       
        }
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
