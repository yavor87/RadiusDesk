Ext.define('Rd.view.dynamicDetails.pnlDynamicDetail', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlDynamicDetail',
    border: false,
    dynamic_detail_id: null,
    initComponent: function(){
        var me = this;
        me.items = [
            {   
                title:  i18n('sDetail'),
                xtype:  'pnlDynamicDetailDetail',
                itemId: 'tabDetail'
                   
            },
            { 
                title   : i18n('sLogo'),
                itemId  : 'tabLogo',
                xtype   : 'pnlDynamicDetailLogo'
            }
        ]; 
        me.callParent(arguments);
    }
});
