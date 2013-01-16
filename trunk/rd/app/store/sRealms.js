Ext.define('Rd.store.sRealms', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mRealm',
    proxy: {
            'type'  :'ajax',
            'url'   : '/cake2/rd_cake/realms/index.json',
            format  : 'json', 
            reader: {
                type: 'json',
                root: 'items'
            }  
    },
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/realms/index.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message'
            },
            api: {
                destroy  : '/cake2/rd_cake/realms/delete.json'
            }
    },


    autoLoad: true
});
