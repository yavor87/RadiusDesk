Ext.define('Rd.store.sIpPools', {
    extend      : 'Ext.data.Store',
    model       : 'Rd.model.mIpPool',
    buffered    : false,
    leadingBufferZone: 150, 
    pageSize    : 50,
    remoteSort  : true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/ip_pools/index.json',
            reader: {
                type			: 'json',
                root			: 'items',
                messageProperty	: 'message',
                totalProperty	: 'totalCount' 
            },
            simpleSortMode: true 
    },
    autoLoad: true
});
