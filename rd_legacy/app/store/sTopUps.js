Ext.define('Rd.store.sTopUps', {
    extend      : 'Ext.data.Store',
    model       : 'Rd.model.mTopUp',
    buffered    : false,
    leadingBufferZone: 150, 
    pageSize    : 50,
    remoteSort  : true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/top_ups/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message',
                totalProperty: 'totalCount' 
            },
            simpleSortMode: true 
    },
    autoLoad: true
});
