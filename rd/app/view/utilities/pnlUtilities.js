Ext.define('Rd.view.utilities.pnlUtilities', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlUtilities',
    scrollable  : true,
    initComponent: function() {
        var me      = this; 
        me.dockedItems= [
            {
                dock: 'left',
                xtype: 'toolbar',
                items: [
                    {
                        xtype   : 'button',
                        text    : 'RADIUS Client',
                        glyph   : Rd.config.icnRadius,
                        scale   : 'large',
                        itemId  : 'cRadiusClient'
                    },
                    {
                        xtype   : 'button',
                        text    : 'Password Manager',
                        glyph   : Rd.config.icnKey,
                        scale   : 'large',
                        itemId  : 'cPassword'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }   
});
