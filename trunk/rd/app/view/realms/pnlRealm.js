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
            }
        ]; 
        me.callParent(arguments);
    }
});
