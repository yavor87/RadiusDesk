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
        'activityMonitor.pnlRadius'
    ],
    stores: [ 'sRadaccts',  'sRadpostauths'  ],
    models: [ 'mRadacct',   'mRadpostauth', 'mNas' ],
    selectedRecord: null,
    specific_nas : undefined,
    config: {
      //  urlEdit:            '/cake2/rd_cake/profiles/edit.json',
        
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
    maskHide:   function(){
        var me =this;
        me.getGrid().mask.hide();
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
});
