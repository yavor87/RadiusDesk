Ext.define('Rd.controller.cActivityMonitor', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){
        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('activityMonitorWin');
        if(!win){
            win = desktop.createWindow({
                id: 'activityMonitorWin',
                title: i18n('sActivity_monitor'),
                width:800,
                height:400,
                iconCls: 'activity',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'activityMonitorWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: i18n('sActivity_monitor'),
                        image:  'resources/images/48x48/activity.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : true,
                        items   : [
                            { 'title' : i18n('sAccounting_data'),       xtype: 'gridRadaccts'},
                            { 'title' : i18n('sAuthentication_data'),   xtype: 'gridRadpostauths'},
                            { 'title' : i18n('sFreeRADIUS_info'),         xtype: 'pnlRadius'}
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
       'components.pnlBanner',  'activityMonitor.gridRadaccts', 'activityMonitor.gridRadpostauths', 'components.cmbNas',
        'activityMonitor.pnlRadius',    'components.winCsvColumnSelect'
    ],
    stores: [ 'sRadaccts',  'sRadpostauths'  ],
    models: [ 'mRadacct',   'mRadpostauth', 'mNas' ],
    selectedRecord: null,
    specific_nas : undefined,
    config: {
      //  urlEdit:            '/cake2/rd_cake/profiles/edit.json',
        urlExportCsvAcct:     '/cake2/rd_cake/radaccts/export_csv',
        urlExportCsvAuth:     '/cake2/rd_cake/radpostauths/export_csv',
        urlKickActive:        '/cake2/rd_cake/radaccts/kick_active.json',
        urlCloseOpen:         '/cake2/rd_cake/radaccts/close_open.json'
        
    },
    refs: [
        {  ref: 'grid',                 selector:   'gridRadaccts'} ,
        {  ref: 'gridRadpostauths',     selector:   'gridRadpostauths'}      
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sRadaccts').addListener('load',        me.onStoreRadacctsLoaded,       me);
        me.getStore('sRadpostauths').addListener('load',    me.onStoreRadpostauthsLoaded,   me);
        me.control({
            '#activityMonitorWin'    : {
                destroy:      me.winClose
            },
            'gridRadaccts #reload': {
                click:      me.reload
            },
            'gridRadaccts #reload menuitem[group=refresh]'   : {
                click:      me.acctReloadOptionClick
            }, 
            'gridRadaccts #connected': {
                click:      me.reload
            },
            'gridRadaccts #csv'  : {
                click:      me.csvExportAcct
            },
            'gridRadaccts #kick'  : {
                click:      me.kickActive
            },
            'gridRadaccts #close'  : {
                click:      me.closeOpen
            },
            'gridRadaccts'   : {
              //  select:      me.select
            },
            'gridRadaccts'   : {
                activate:      me.reload
            },
            'gridRadpostauths #reload': {
                click:      me.reloadPostAuths
            },
            'gridRadpostauths'   : {
                activate:      me.gridActivate
            },
            'gridRadpostauths #reload menuitem[group=refresh]'   : {
                click:      me.authReloadOptionClick
            },
            'gridRadpostauths #csv'  : {
                click:      me.csvExportAuth
            },
            'pnlRadius #reload': {
                click:      me.radiusReload
            },
            'pnlRadius #reload menuitem[group=refresh]'   : {
                click:      me.radiusReloadOptionClick
            }, 
            'pnlRadius': {
                activate:       me.radiusActivate
            },
            'pnlRadius  cmbNas': {
                change:         me.cmbNasChange
            },
            '#winCsvColumnSelectAcct #save': {
                click:  me.csvExportSubmitAcct
            },
            '#winCsvColumnSelectAuth #save': {
                click:  me.csvExportSubmitAuth
            }   
        });

    },
    reload: function(){
        var me =this;
        //Determine what we need to show....
        var only_connected = me.getGrid().down('#connected');
        if(only_connected == null){
            only_connected = true; //Default only active
        }else{
            only_connected = only_connected.pressed; //Default only active
        }
        me.getStore('sRadaccts').getProxy().extraParams = {only_connected: only_connected};
        me.getStore('sRadaccts').load();
    },
    onStoreRadacctsLoaded: function() {
        var me          = this;
        var count       = me.getStore('sRadaccts').getTotalCount();
        var totalIn     = Ext.ux.bytesToHuman(me.getStore('sRadaccts').getProxy().getReader().rawData.totalIn);
        var totalOut    = Ext.ux.bytesToHuman(me.getStore('sRadaccts').getProxy().getReader().rawData.totalOut);
        var totalInOut  = Ext.ux.bytesToHuman(me.getStore('sRadaccts').getProxy().getReader().rawData.totalInOut);
        me.getGrid().down('#count').update({count: count});
        me.getGrid().down('#totals').update({'in': totalIn, 'out': totalOut, 'total': totalInOut });
    },
    gridActivate: function(g){
        var me = this;
        g.getStore().load();
    },
    //Post auths related
    reloadPostAuths: function(){
        var me =this;
        me.getStore('sRadpostauths').load();
    },
    onStoreRadpostauthsLoaded: function() {
        var me          = this;
        var count       = me.getStore('sRadpostauths').getTotalCount();
        me.getGridRadpostauths().down('#count').update({count: count});
    },
    winClose:   function(){
        var me = this;

        if(me.autoReloadAcct != undefined){
            clearInterval(me.autoReloadAcct);   //Always clear
        }
        if(me.autoReloadAuth != undefined){
            clearInterval(me.autoReloadAuth);   //Always clear
        }
        if(me.autoReloadRadius != undefined){
            clearInterval(me.autoReloadRadius);   //Always clear
        }
    },
    acctReloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReloadAcct);   //Always clear
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
        me.autoReloadAcct = setInterval(function(){        
            me.reload();
        },  interval);  
    },
    authReloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReloadAuth);   //Always clear
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
        me.autoReloadAuth = setInterval(function(){        
            me.reloadPostAuths();
        },  interval);  
    },
    radiusReload: function(button){
        var me = this;
        var panel = button.up('pnlRadius');

        var params = {};
        panel.down('#status').update({mesg: 'fetching the latest info'});
        if(me.specific_nas != undefined){
            console.log(me.specific_nas);
            params.nas_id = me.specific_nas;
        }

        //Get the latest
        Ext.Ajax.request({
            url: '/cake2/rd_cake/free_radius/index.json',
            method: 'GET',
            params: params,
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    panel.authBasicStore.loadData(jsonData.items.auth_basic);
                    panel.authDetailStore.loadData(jsonData.items.auth_detail);
                    panel.acctDetailStore.loadData(jsonData.items.acct_detail);
                    panel.down('#status').update({mesg: 'idle'}); //Clear the info
                }
            },
            scope: me
        });
    },
    radiusActivate: function(pnl){
        var me = this;
        var button = pnl.down("#reload");
        me.radiusReload(button);
    },
    radiusReloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReloadRadius);   //Always clear
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
        me.autoReloadRadius = setInterval(function(){        
            me.radiusReload(b);
        },  interval);  
    },
    cmbNasChange:   function(cmb){
        var me      = this;
        var value   = cmb.getValue();
        var s       = cmb.getStore();
        //Test to see if there is a record in the store with this ID
        var r       = s.getById(value);
        if(r != null){
           me.specific_nas = value;
        }
    },
    csvExportAcct: function(button,format) {
        var me          = this;
        var columns     = me.getGrid().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectAcct')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectAcct',columns: col_list});
            me.application.runAction('cDesktop','Add',w);         
        }
    },
    csvExportSubmitAcct: function(button){

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
            window.open(me.urlExportCsvAcct+append_url);
            win.close();
        }
    },

    csvExportAuth: function(button,format) {
        var me          = this;
        var columns     = me.getGridRadpostauths().columns;
        var col_list    = [];
        Ext.Array.each(columns, function(item,index){
            if(item.dataIndex != ''){
                var chk = {boxLabel: item.text, name: item.dataIndex, checked: true};
                col_list[index] = chk;
            }
        }); 

        if(!me.application.runAction('cDesktop','AlreadyExist','winCsvColumnSelectAuth')){
            var w = Ext.widget('winCsvColumnSelect',{id:'winCsvColumnSelectAuth',columns: col_list});
            me.application.runAction('cDesktop','Add',w);         
        }
    },
    csvExportSubmitAuth: function(button){

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
            window.open(me.urlExportCsvAuth+append_url);
            win.close();
        }
    },
   
    closeOpen : function(button){

        var me      = this;
        var grid    = button.up('grid');
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){ 
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{

            //________________
            var extra_params    = {};
            var s               = grid.getSelectionModel().getSelection();
            Ext.Array.each(s,function(record){
                var r_id = record.getId();
                extra_params[r_id] = r_id;
            });
     
            Ext.Ajax.request({
                url: me.urlCloseOpen,
                method: 'GET',
                params: extra_params,
                success: function(response){
                    var jsonData    = Ext.JSON.decode(response.responseText);
                    if(jsonData.success){
                        Ext.ux.Toaster.msg(
                                    i18n('sItem_updated'),
                                    i18n('sItem_updated_fine'),
                                    Ext.ux.Constants.clsInfo,
                                    Ext.ux.Constants.msgInfo
                        );
                        me.reload();    
                    }   
                },
                scope: me
            });
            //_____________________ 

  
        }


    },

    kickActive: function(button){

        var me      = this;
        var grid    = button.up('grid');
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){ 
             Ext.ux.Toaster.msg(
                i18n('sSelect_an_item'),
                i18n('sFirst_select_an_item'),
                Ext.ux.Constants.clsWarn,
                Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.ux.Toaster.msg(
                'Sending request',
                'Please be patient',
                Ext.ux.Constants.clsInfo,
                Ext.ux.Constants.msgInfo
            );
            button.setDisabled(true);
            //________________
            var extra_params    = {};
            var s               = grid.getSelectionModel().getSelection();
            Ext.Array.each(s,function(record){
                var r_id = record.getId();
                extra_params[r_id] = r_id;
            });
    
            Ext.Ajax.request({
                url: me.urlKickActive,
                method: 'GET',
                params: extra_params,
                success: function(response){
                    button.setDisabled(false);
                    var jsonData    = Ext.JSON.decode(response.responseText);
                    if(jsonData.success){
                        Ext.ux.Toaster.msg(
                            i18n('sItem_updated'),
                            i18n('sItem_updated_fine'),
                            Ext.ux.Constants.clsInfo,
                            Ext.ux.Constants.msgInfo
                        );
                        me.reload();    
                    }   
                },
                scope: me
            });
            //_____________________  

        }

    }


});
