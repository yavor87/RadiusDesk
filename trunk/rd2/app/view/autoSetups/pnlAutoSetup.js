Ext.define('Rd.view.autoSetups.pnlAutoSetup', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlAutoSetup',
    border: false,
    am_id: null,
    plain: true,
    initComponent: function(){

        var me = this;
        me.items = [
        {   
            title   : 'Settings',
            itemId  : 'tabSettings',
            xtype   : 'pnlAutoSetupSettings',
            am_id   : me.am_id
        },
        { 
            title   : 'Access Point info',
            itemId  : 'tabDevice',
            am_id   : me.am_id
        },
        { 
            title   : 'Client info',
            itemId  : 'tabClient',
            am_id   : me.am_id
        },
        {
            title   : 'Environment info',
            itemId  : 'tabEnvironment',
            am_id   : me.am_id
        }
    ]; 


        me.callParent(arguments);
    }
});
