Ext.define('Rd.controller.cDynamicClients', {
    extend: 'Ext.app.Controller',
    owner   : undefined,
    user_id : undefined,
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('dcWin');
        if(!win){
            win = desktop.createWindow({
                id          : 'dcWin',
                btnText     : 'Dynamic RADIUS Clients',
                width       : Rd.config.winWidth,
                height      : Rd.config.winHeight,
                glyph       : Rd.config.icnDynamicNas,
                animCollapse: false,
                border      : false,
                constrainHeader: true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'dcWin',
                items: [
                    {
                        region  : 'north',
                        xtype   : 'pnlBanner',
                        heading : 'Dynamic RADIUS Clients',
                        image   : 'resources/images/48x48/dynamic_clients.png'
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
                            plain   : false,
                            itemId  : 'tabDynamicClients',
                            items   : { 'title' : i18n('sHome'), xtype : 'gridDynamicClients','glyph': Rd.config.icnHome}}
            
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner', 'dynamicClients.gridDynamicClients'
    ],
    stores: ['sAccessProvidersTree','sDynamicClients'],
    models: ['mAccessProviderTree', 'mDynamicClient' ],
    selectedRecord: null,
    config: {
        urlAdd:             '/cake2/rd_cake/nas/add.json'
    },
    refs: [
      
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
           
        });
    }
});
