Ext.define('Rd.controller.cDebug', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('debugWin');
        if(!win){
            win = desktop.createWindow({
                id: 'debugWin',
                title:i18n('sDebug_output'),
                width:800,
                height:400,
                iconCls: 'debug',
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
                        heading:i18n('sDebug_output'),
                        image:  'resources/images/48x48/bug.png'
                    },
                    {
                        region  : 'center',
                        layout  : 'fit',
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
        'components.pnlBanner'
    ],
    stores: [],
    models: [],
    selectedRecord: null,
    config: {
      //  urlAdd:             '/cake2/rd_cake/realms/add.json'
    },
    refs: [
      //   {  ref:    'grid', selector:   'gridRealms'},
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

      //  me.getStore('sRealms').addListener('load',me.onStoreRealmsLoaded, me);
        me.control({
          //  'gridRealms #reload': {
          //      click:      me.reload
          //  }    
        });
    },
    reload: function(){
        var me =this;
        me.getStore('sRealms').load();
    }
});
