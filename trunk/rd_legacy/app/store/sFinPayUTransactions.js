Ext.define('Rd.store.sFinPayUTransactions', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mFinPayUTransaction',
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
            url     : '/cake2/rd_cake/fin_pay_u_transactions/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message',
                totalProperty: 'totalCount' //Required for dynamic paging
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad: true
});
