Ext.define('CoovaChilli.store.sPrices', {
    extend: 'Ext.data.Store',
    model: 'CoovaChilli.model.mPrice',
    remoteSort: false,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/financials/price_list_for.json?plan=a',
            reader: {
                type            : 'json',
                root            : 'items',
                messageProperty : 'message'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad: true
});
