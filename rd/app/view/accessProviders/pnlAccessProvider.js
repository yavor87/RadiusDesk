Ext.define('Rd.view.desktop.pnlAccessProvider', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlAccessProvider',
    border: false,
    ap_id: null,
    initComponent: function(){

        var me = this;
        me.items = [
        {   
            title:  'Detail',
            layout: 'hbox',
            items:  { 
                xtype:  'frmAccessProviderDetail',
                height: '100%', 
                width:  400
                } 
        },
        { 
            title   : 'Realms',
            xtype   : 'gridApRealms', 
            ap_id   : me.ap_id
        },
        {
            title   : 'Rights',
            xtype   : 'treeApUserRights', 
            ap_id   : me.ap_id
        },
        { 
            title   : 'Activity'
        },
        { 
            title   : 'Notes'
        }
    ]; 


        me.callParent(arguments);
    }
});
