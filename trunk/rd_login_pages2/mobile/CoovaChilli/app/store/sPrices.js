Ext.define('CoovaChilli.store.sPrices', {
    extend: 'Ext.data.Store',
    config:{
        model: 'CoovaChilli.model.mPrice',
        remoteSort: false,
        storeId: 'sPrices',
        proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/fin_pay_u_transactions/price_list_for.json?plan=a',
            reader: {
                type            : 'json',
                rootProperty    : 'items',
                messageProperty : 'message'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
        },
        autoLoad: true
    }
});
