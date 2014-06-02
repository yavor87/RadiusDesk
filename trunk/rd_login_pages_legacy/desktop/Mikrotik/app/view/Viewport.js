Ext.define('MikrotikLogin.view.Viewport', {
    extend  : 'Ext.container.Viewport',
    alias   : 'widget.vp',
    requires:[
        'Ext.layout.container.Fit',
        'MikrotikLogin.view.pnlMain'
    ],
    layout  : {
        type    :'fit'
    },
    items: [{
        xtype: 'pnlMain'
    }]
});
