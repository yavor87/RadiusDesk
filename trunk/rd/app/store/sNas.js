Ext.define('Rd.store.sNas', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mNas',
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/nas/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message'
            },
            api: {
                destroy  : '/cake2/rd_cake/nas/delete.json'
            }
    },
    autoLoad: true
});
