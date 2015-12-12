Ext.define('Rd.store.sFinAuthorizeNetTransactions', {
    extend		: 'Ext.data.Store',
    model		: 'Rd.model.mFinAuthorizeNetTransaction',
    pageSize    : 100,
    //To force server side sorting:
    remoteSort	: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/fin_authorize_net_transactions/index.json',
            reader: {
                type			: 'json',
                root			: 'items',
                messageProperty	: 'message',
                totalProperty	: 'totalCount' //Required for dynamic paging
            },
            simpleSortMode		: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad	: true
});
