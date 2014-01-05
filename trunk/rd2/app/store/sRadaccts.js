Ext.define('Rd.store.sRadaccts', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mRadacct',
    //To make it load AJAXly from the server specify the follown 3 attributes
    buffered: true,
    leadingBufferZone: 450, 
    pageSize: 150,
    //To force server side sorting:
    remoteSort: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/radaccts/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message',
                totalProperty: 'totalCount' //Required for dynamic paging
            },
            api: {
               // destroy  : '/cake2/rd_cake/devices/delete.json'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    }
});
