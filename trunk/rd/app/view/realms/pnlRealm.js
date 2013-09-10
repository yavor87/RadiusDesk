Ext.define('Rd.view.realms.pnlRealm', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlRealm',
    border: false,
    realm_id: null,
    initComponent: function(){
        var me = this;
        me.items = [
            {   
                title:  i18n('sDetail'),
                xtype:  'pnlRealmDetail',
                itemId: 'tabDetail'
                   
            },
            { 
                title   : i18n('sLogo'),
                itemId  : 'tabLogo',
                xtype   : 'pnlRealmLogo'
            },
            { 
                title   : 'Usage graphs', 
                layout  : 'fit',
                xtype   : 'tabpanel',
                itemId  : 'pnlUsageGraphs',
                margins : '0 0 0 0',
                plain   : true,
                border  : true,
                tabPosition: 'bottom',
                items   :   [
                    {
                        title   : "Daily",
                        itemId  : "daily",
                        xtype   : 'pnlUsageGraph',
                        span    : 'daily',
                        layout  : 'fit',
                        username: me.realm_id,
                        type    : 'realm'
                    },
                    {
                        title   : "Weekly",
                        itemId  : "weekly",
                        xtype   : 'pnlUsageGraph',
                        span    : 'weekly',
                        layout  : 'fit',
                        username: me.realm_id,
                        type    : 'realm'
                    },
                    {
                        title   : "Monthly",
                        itemId  : "monthly",
                        layout  : 'fit',
                        xtype   : 'pnlUsageGraph',
                        span    : 'monthly',
                        username: me.realm_id,
                        type    : 'realm'
                    }
                ]
            }      
        ]; 
        me.callParent(arguments);
    }
});
