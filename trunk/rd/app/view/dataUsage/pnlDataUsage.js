Ext.define('Rd.view.dataUsage.pnlDataUsage', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlDataUsage',
    scrollable  : true,
    layout      : {
      type  : 'vbox',
      align : 'stretch'  
    },
    initComponent: function() {
        var me      = this;
        
        me.dockedItems= [{
            xtype   : 'toolbar',
            dock    : 'top',
            cls     : 'subTab', //Make darker -> Maybe grey
            frame   : true,
            border  : true,
            items   : [
                { 
                    xtype   : 'button',  
                    glyph   : Rd.config.icnReload,    
                    scale   : 'small', 
                    itemId  : 'reload',   
                    tooltip: i18n('sReload')
                },
                {
                    xtype   : 'cmbRealm'
                },
                { 
                    xtype   : 'button',    
                    scale   : 'small',
                    itemId  : 'btnShowRealm',  
                    text    : 'Show Realm Data',
                    hidden  : true
                }
            ]
        }]; 
          
        me.items = [
            {
                xtype   : 'pnlDataUsageDay'
            },
            {
                xtype   : 'pnlDataUsageWeek'
            },
            {
                xtype   : 'pnlDataUsageMonth'
            }
        ];
        
        me.callParent(arguments);
    }
});
