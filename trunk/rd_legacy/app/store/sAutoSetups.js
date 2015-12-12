Ext.define('Rd.store.sAutoSetups', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mAutoSetup',
    //To make it load AJAXly from the server specify the follown 3 attributes
    buffered: true,
    leadingBufferZone: 150, 
    pageSize: 50,
    //To force server side sorting:
    remoteSort: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/auto_macs/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message',
                totalProperty: 'totalCount' //Required for dynamic paging
            },
            api: {
                destroy  : '/cake2/rd_cake/auto_macs/delete.json'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad: true
});
