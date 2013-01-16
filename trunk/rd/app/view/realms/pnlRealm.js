Ext.define('Rd.view.desktop.pnlRealm', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlRealm',
    border: false,
    realm_id: null,
    requires: [
        'Rd.view.realms.frmDetail'
    ],
    initComponent: function(){

        var me = this;
        me.items = [
            {   
                title:  'Detail',
                layout: 'hbox',
                bodyStyle: {backgroundColor : '#e5e6ef'},
                border: false,
                items:  { 
                    xtype:  'frmRealmDetail',
                    height: '100%', 
                    width:  400,
                    border: true
                    } 
            },
            { 
                title   : 'Logo'
            },
            { 
                title   : 'Notes'
            }
        ]; 
        me.callParent(arguments);
    }
});
