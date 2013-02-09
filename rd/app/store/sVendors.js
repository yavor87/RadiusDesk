Ext.define('Rd.store.sVendors', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mVendor',
    proxy: {
            'type'  :'ajax',
            'url'   : '/cake2/rd_cake/templates/vendors.json',
            format  : 'json',
            reader: {
                type: 'json',
                root: 'items'
            }
    },
    autoLoad: true
});
