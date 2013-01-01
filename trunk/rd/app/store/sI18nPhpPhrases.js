Ext.define('Rd.store.sI18nPhpPhrases', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mI18nPhpPhrase',
    proxy: {
        'type'  :'rest',
        'url'   : '/cake2/rd_cake/php_phrases', 
        format: 'json',
        api: {
        },
        reader: {
            type : 'json',
            root: 'items'
        }
    },
    listeners: {
        load: function(store, records, successful) {
            if(!successful){
                Ext.ux.Toaster.msg(
                        'Error encountered',
                        store.getProxy().getReader().rawData.message.message,
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            //console.log(store.getProxy().getReader().rawData.message.message);
            }  
        },
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
