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
                    xtype   : 'button', // default for Toolbars
                    text    : 'Button'
                }    
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        this.callParent();
    }
});


