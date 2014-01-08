Ext.define('Rd.store.sProfileComponents', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mProfileComponent',
    //To make it load AJAXly from the server specify the follown 3 attributes
    buffered: false, //Do this as a temporary fix for 4.2.1
    leadingBufferZone: 150, 
    pageSize: 50,
    //To force server side sorting:
    remoteSort: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/profile_components/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message',
                totalProperty: 'totalCount' //Required for dynamic paging
            },
            api: {
                destroy  : '/cake2/rd_cake/profile_components/delete.json'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad: true
});
