Ext.define('Rd.store.sRadaccts', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mRadacct',
    pageSize: 150,
    remoteSort: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/radaccts/index.json',
            reader: {
                keepRawData     : true,
                type: 'json',
                rootProperty: 'items',
                messageProperty: 'message',
                totalProperty: 'totalCount' //Required for dynamic paging
            },
            api: {
               // destroy  : '/cake2/rd_cake/devices/delete.json'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    }
});
