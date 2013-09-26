Ext.define('MikrotikLogin.controller.cConnect', {
    extend  : 'Ext.app.Controller',
    requires: ['Ext.data.JsonP','Ext.util.Cookies'],
    views   : [
        
    ],
    refs    : [

    ],
    counter         : undefined, //refresh counter's id
    timeUntilStatus :20, //interval to refresh
    refreshInterval :20, //ditto
    firstTime       : true,
    noPopUp         : true,
    sessionData     : undefined,
    retryCount      : 20, //Make it high to start with --- sometimes it really takes long!
    currentRetry    : 0,

    userName        : undefined,
    password        : undefined,
    remember        : false,

    init: function() {

        var me = this;
        //Connect some events
        me.control({
           
        });

    },
    index: function(){
        var me = this;
        
    }
  
});
