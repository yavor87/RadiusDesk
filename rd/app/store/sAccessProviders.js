Ext.define('Rd.store.sAccessProviders', {
    extend: 'Ext.data.TreeStore',
    model: 'Rd.model.mAccessProvider',
    autoLoad: true,
    proxy: {
            type: 'ajax',
            format  : 'json',
            batchActions: true, 
            'url'   : '/cake2/rd_cake/access_providers/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message'
            },
            api: {
                destroy : '/cake2/rd_cake/access_providers/delete.json'
            }
    },
    root: {username: 'Created by me',leaf: false, id:'0', iconCls: 'admin', expanded: false},
    folderSort: true,
    clearOnLoad: true,
    listeners: {
        load: function( store, records, a,successful,b) {
            if(!successful){
                Ext.ux.Toaster.msg(
                        'Error encountered',
                        store.getProxy().getReader().rawData.message.message,
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }  
        },
        scope: this
    }
});
