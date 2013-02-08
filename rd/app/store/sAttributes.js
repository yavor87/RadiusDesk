Ext.define('Rd.store.sAttributes', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mAttribute',
    proxy: {
            'type'  :'ajax',
            'url'   : '/cake2/rd_cake/templates/attributes.json',
            format  : 'json',
            reader: {
                type: 'json',
                root: 'items'
            }
    },
    autoLoad: true
});
