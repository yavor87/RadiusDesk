Ext.define('MikrotikLogin.controller.cConnect', {
    extend  : 'Ext.app.Controller',
    requires: ['Ext.data.JsonP','Ext.util.Cookies'],
    views: [
       // 'Connect',
       // 'Status',
        'winNotHotspot'
    ],
    refs    : [
        { ref: 'notHotspot',    selector: '',       xtype: 'winNotHotspot',     autoCreate: true}      //Not a hotspot window
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

    mtServer        : undefined,
    queryObj        : undefined,

    init: function() {

        var me = this;
        //Connect some events
        me.control({
           
        });

    },
    index: function(){
        var me = this;
        //In order to get the status from the Mikrotik we will need to see if the MT's addy was included in URL
        var me = this;
        //See how we were called...  
        if(me.mtServer == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...
                me.mtRefresh();
            }else{
                me.application.activeWindow = me.getNotHotspot();           
                me.application.activeWindow.show();
            }  
        }else{
            me.coovaRefresh();  //Already established we are a hotspot, simply refresh
        }      
    },
    testForHotspot: function(){
        var me          = this;
        console.log("Test for hotspot");
        me.queryObj     = new Object(); 
        window.location.search.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"), function($0,$1,$2,$3) { me.queryObj[$1] = $3; });

        if(me.queryObj.link_status != undefined){  //Override defaults
            return true;        //Is a hotspot
        }else{
            return false;   //Not a hotspot
        }
    },
    mtRefresh: function(){
        var me = this;   
        Ext.data.JsonP.request({
            url: me.queryObj.link_status,
            timeout: 3000,
            callbackKey: 'var',
            success: function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value

                if(me.application.activeWindow != undefined){   //Hide any active windows first
                    me.application.activeWindow.hide();
                }
                console.log(j);
/*
                if(j.clientState == 0){ 
                    //Try cookies if available                 
                    if( (Ext.util.Cookies.get('coovaUn') != null )&&
                        (Ext.util.Cookies.get('coovaPw') != null )){
                          //  console.log("Trying cookies");
                            //Set a body mask telling the people we are connecting 
                            Ext.getBody().mask('Connecting.....');
                            me.userName     = Ext.util.Cookies.get('coovaUn');
                            me.password     = Ext.util.Cookies.get('coovaPw');
                            me.encPwd(j.challenge);
                    } 
                    me.application.activeWindow = me.getConnect();
                }

                if(j.clientState == 1){
                    if(me.application.config.noStatus == true){
                        window.location=me.application.config.redirectTo;
                    }else{
                         me.application.activeWindow = me.getStatus();
                        //Refresh status window
                        me.refreshStatus(j);
                        if(me.counter == undefined){    //If it is the first time so initialise the loop counter
                            me.sessionData = j;
                            me.refreshCounter();
                            //Refresh the usage ....
                           //// me.yfiUsageRefresh();
                        }
                    }
                }

                Ext.getBody().unmask(); //Unmask (perhaps the mask was set)

                me.application.activeWindow.show(); 
*/             
            },
            failure: function(){
               // console.log("Could not fetch the MT status");
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                    console.log("Retry to fetch MT status "+me.currentRetry);
                    me.mtRefresh();
                }else{
                    console.log("Could not fetch MT status giving up!")
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
  
});
