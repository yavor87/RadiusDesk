Ext.define('Rd.store.sEncryptionOptions', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mEncryptionOption',
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/meshes/encryption_options.json',
            reader: {
                type: 'json',
                root: 'items',
                messageProperty: 'message'
            }
    },
    autoLoad: true
});
