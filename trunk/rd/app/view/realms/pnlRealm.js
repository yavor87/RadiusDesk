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
                title:  i18n('sDetail'),
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
                title   : i18n('sLogo')
            },
            { 
                title   : i18n('sNotes')
            }
        ]; 
        me.callParent(arguments);
    }
});
