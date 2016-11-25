Ext.define('Rd.view.dashboard.pnlDashboard', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDashboard',
    layout  : 'fit',
    dockedItems : [
        {
            xtype   : 'toolbar',
            dock    : 'bottom',
            ui      : 'footer', 
            items   : [
                '->', 
                '<b>RADIUSdesk</b> 2012-2016 GPL license'
            ]
        },
        {
            xtype   : 'toolbar',
            dock    : 'top',
            ui      : 'default', 
            items   : [              
                '<h1>RADIUSdesk</h1>',
                '->',
                {
                xtype   : 'button',
                glyph   : Rd.config.icnMenu,
                scale   : 'medium',
                menu    : [
                        {   text:i18n('sLogout'),      glyph : Rd.config.icnPower,  itemId: 'mnuLogout'},'-',
                        //{   text:i18n('sSettings'),    glyph : Rd.config.icnSpanner },
                        {   text:i18n('sPassword'),    glyph : Rd.config.icnLock,   itemId: 'mnuPassword'    }
                    ]  
                } 
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        this.callParent();
    }
});


