Ext.define('Rd.controller.cUtilities', {
    extend: 'Ext.app.Controller',
    actionIndex: function(pnl){

        var me = this;   
        if (me.populated) {
            return; 
        }     
        pnl.add({
            xtype   : 'pnlUtilities',
            border  : true,
            itemId  : 'tabUtilities',
            plain   : true
        });
        me.populated = true;
    },

    views:  [
        'utilities.pnlUtilities'
    ],
    stores: [],
    models: [],
    config: {
       
    },
    refs: [
         {  ref: 'pnlUtilities',     selector:   'pnlUtilities'}
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            '#tabUtilities' : {
                destroy   :      me.appClose   
            },
            'pnlUtilities #cRadiusClient' : {
                click   : function(btn){
                    me.application.runAction('cRadiusClient','Index')
                } 
            },
            'pnlUtilities #cPassword' : {
                click   : function(btn){
                    me.application.runAction('cPassword','Index')
                } 
            },
            'pnlUtilities #cSetupWizard' : {
                click   : function(btn){
                    me.application.runAction('cSetupWizard','Index')
                } 
            }
        });
    },
    appClose:   function(){
        var me          = this;
        me.populated    = false;
    },
    openActivityViewer: function(btn){
        var me  = this;
        var pnl = me.getPnlUtilities();
        me.application.runAction('cActivityMonitor','Index',pnl); 
    }
});
