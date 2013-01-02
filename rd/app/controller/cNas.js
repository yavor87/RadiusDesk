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
                        heading:'NAS Devices',
                        image:  'resources/images/48x48/nas.png'
                    },
                    {
                        region:'west',
                        xtype: 'panel',
                        margins: '0 0 0 0',
                        width: 150,
                        split: true, 
                        layout: 'fit',
                        border: true,
                       // items: [tree]
                    },{
                        region: 'center',     // center region is required, no width/height specified
                        xtype: 'panel',
                        layout: 'fit',
                        margins: '0 0 0 0',
                        border: true
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },
    views:  ['components.pnlBanner'],
    stores: [],
    models: [],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/realms/add.json',
        urlEdit:            '/cake2/rd_cake/realms/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json'
    },
    refs: [
        
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        //me.getStore('sRealms').addListener('load',me.onStoreRealmsLoaded, me);
        me.control({
           // 'gridRealms #reload': {
           //     click:      me.reload
          //  },
            
            
        });
    }
});
