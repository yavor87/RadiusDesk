Ext.define('Rd.store.sTags', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mTag',
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/tags/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message'
            },
            api: {
                destroy  : '/cake2/rd_cake/tags/delete.json'
            }
    },
    autoLoad: true
});
