Ext.define('Rd.store.sJustLanguages', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mI18nLanguage',
    proxy: {
            'type'  :'rest',
            'url'   : '/cake2/rd_cake/languages',
            format  : 'json',
            reader: {
                type: 'json',
                root: 'items'
            }
    },
    listeners: {
        update: function(store, records, success, options) {
            store.sync({
                success: function(batch,options){
                    Ext.ux.Toaster.msg(
                        'Updated database',
                        'Database has been updated',
                        Ext.ux.Constants.clsInfo,
                        Ext.ux.Constants.msgInfo
                    );   
                },
                failure: function(batch,options){
                    Ext.ux.Toaster.msg(
                        'Problems updating the database',
                        'Database could not be updated',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                    );
                }
            });
        },
        scope: this
    },
    autoLoad: true
});
