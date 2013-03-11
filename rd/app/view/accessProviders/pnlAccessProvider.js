Ext.define('Rd.view.desktop.pnlAccessProvider', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlAccessProvider',
    border: false,
    ap_id: null,
    initComponent: function(){

        var me = this;
        me.items = [
        {   
            title:  i18n('sDetail'),
            layout: 'hbox',
            items:  { 
                xtype:  'frmAccessProviderDetail',
                height: '100%', 
                width:  400,
                frame   : true
                } 
        },
        { 
            title   : i18n('sRealms'),
            xtype   : 'gridApRealms', 
            ap_id   : me.ap_id
        },
        {
            title   : i18n('sRights'),
            xtype   : 'treeApUserRights', 
            ap_id   : me.ap_id
        },
        { 
            title   : i18n('sActivity')
        },
        { 
            title   : i18n('sNotes')
        }
    ]; 


        me.callParent(arguments);
    }
});
