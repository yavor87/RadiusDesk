Ext.define('Rd.store.sFinPaymentPlans', {
    extend		: 'Ext.data.Store',
    model		: 'Rd.model.mFinPaymentPlan',
    pageSize    : 100,
    //To force server side sorting:
    remoteSort	: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/fin_payment_plans/index.json',
            reader: {
                type			: 'json',
                root			: 'items',
                messageProperty	: 'message',
                totalProperty	: 'totalCount' //Required for dynamic paging
            },
            simpleSortMode		: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad	: false
});
