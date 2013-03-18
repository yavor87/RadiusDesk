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
                            { 'title' : i18n('sAccounting_data'), xtype: 'gridRadaccts'},
                            { 'title' : i18n('sAuthentication_data'), xtype: 'gridRadpostauths'},
                            { 'title' : i18n('sDetailed_info')}
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
       'components.pnlBanner',  'activityMonitor.gridRadaccts', 'activityMonitor.gridRadpostauths'
    ],
    stores: [ 'sRadaccts',  'sRadpostauths'  ],
    models: [ 'mRadacct',   'mRadpostauth'   ],
    selectedRecord: null,
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
            'gridRadaccts #reload': {
                click:      me.reload
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
    onUserRadpostauthsActivate: function(){
        var me = this;
        console.log("Post auths pappie....");
    }
});
