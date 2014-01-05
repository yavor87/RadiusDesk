Ext.define('Rd.store.sAccessProvidersTree', {
    extend: 'Ext.data.TreeStore',
    model: 'Rd.model.mAccessProviderTree',
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/access_providers/index_tree.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message'
            }
    },
    root: {username: i18n('sLogged_in_user'),leaf: false, id:'0', iconCls: 'admin', expanded: false,monitor: 'na', active: 'na'},
    listeners: {
        load: function( store, records, a,successful,b) {
            if(!successful){
                Ext.ux.Toaster.msg(
                        i18n('sError_encountered'),
                        store.getProxy().getReader().rawData.message.message,
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }  
        },
        scope: this
    },
    autoLoad: false
});
