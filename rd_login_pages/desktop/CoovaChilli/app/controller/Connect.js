Ext.define('CoovaLogin.controller.Connect', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.data.JsonP','Ext.util.Cookies'],
    views: [
        'Connect',
        'Status',
        'NotHotspot'
    ],
    refs: [
        { ref: 'vp',        selector: '',       xtype: 'vp',        autoCreate: true},
        { ref: 'connect',   selector: '',       xtype: 'connectW',  autoCreate: true },     //Connect Window
        { ref: 'status',    selector: '',       xtype: 'statusW',   autoCreate: true },     //Status window (mutually exclusive with connect window)
        { ref: 'notHotspot',selector: '',       xtype: 'notHotspotW',autoCreate: true}      //Not a hotspot window
    ],

    uamIp: undefined,   //ip of coova hotspot
    uamPort: undefined, //port of coova hotspot

    counter: undefined, //refresh counter's id
    timeUntilStatus:20, //interval to refresh
    refreshInterval:20, //ditto

    firstTime   : true,
    noPopUp     : true,

    sessionData: undefined,

    retryCount: 20, //Make it high to start with --- sometimes it really takes long!
    currentRetry: 0,

    userName: undefined,
    password: undefined,
    remember: false,

    init: function() {

        var me = this;
        //Connect some events
        me.control({
            'connectW #btnConnect' : {
                click: me.onBtnConnectClick
            },
            'connectW #btnPwdForget': {
                click: me.onBtnPwdForgetClick
            },
            'connectW': {
                beforeshow: me.connectBeforeShow
            },
            'statusW #btnDisconnect' : {
                click: function(){
                    Ext.getBody().mask('Disconnecting ...');
                }
            }
        });

    },
    index: function(){
        var me = this;
        //See how we were called...  
        if(me.uamIp == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...
                me.coovaRefresh();
            }else{
                me.application.activeWindow = me.getNotHotspot();           
                me.application.activeWindow.show();
            }  
        }else{
            me.coovaRefresh();  //Already established we are a hotspot, simply refresh
        }
    },

    onBtnPwdForgetClick: function(){
        var me = this;
        me.application.getController('Password').index();
    },

    //____________________________ Coova Login _______________________________

    testForHotspot: function(){
        var me = this;
        var queryObj    = new Object(); //How the page was called - Should be called with the following search sting:
                                    //?res=notyet&uamip=10.1.0.1&uamport=3660&challenge=ca91105b39c91d49cbfa61ef085a2488&mac=00-0C-F1-5F-58-0B&
                                    //ip=10.1.0.8&called=00-1D-7E-BC-02-AD&nasid=10.20.30.2&userurl=http%3a%2f%2f1.1.1.1%2f&md=50834AD406B33D3A2D771FF2B4C80499
        window.location.search.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"), function($0,$1,$2,$3) { queryObj[$1] = $3; });

        if(queryObj.uamport != undefined){  //Override defaults
            me.uamPort = queryObj.uamport;
        }else{

            //It may have been called to be previewed
            if(queryObj.dynamic_id != undefined){
                document.title = "Desktop preview";
                me.application.showHelp =true;
            }
            return false;   //Not a hotspot
        }
        if(queryObj.uamip != undefined){    //Override defaults
            me.uamIp = queryObj.uamip;
        }
        return true;        //Is a hotspot

    },
    coovaRefresh: function(){
        var me = this;   
        var urlStatus = 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url: urlStatus,
            timeout: 3000,
            callbackKey: 'callback',
            success: function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value

                if(me.application.activeWindow != undefined){   //Hide any active windows first
                    me.application.activeWindow.hide();
                }

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
            },
            failure: function(){
               // console.log("Could not fetch the coova status");
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                 //   console.log("Retry to fetch Coova status "+me.currentRetry);
                    me.coovaRefresh();
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    connectBeforeShow: function(w){
        me = this;
        if((me.firstTime == true)&&(me.noPopUp == true)){
            if (window.console) {
                window.console.log("Initial... hide pop-up");
            }
            me.firstTime = false;
            return false; //Stop the show
        } 
    },
    refreshCounter: function(){
        var me = this; 

        me.counter = setInterval (function(){
            me.timeUntilStatus = me.timeUntilStatus-1;
            if(me.getStatus().isHidden()){    //We remove ourself gracefully
                clearInterval(me.counter);
                me.counter   = undefined;
                me.timeUntilStatus = me.refreshInterval;
            }else{
               // console.log('Refresh in '+ me.timeUntilStatus + ' seconds');
                var m = me.getStatus().down('#refreshMessage');
                m.setText('Refresh in <span style="color:blue;">'+ me.timeUntilStatus + '</span> seconds');
                if(me.timeUntilStatus == 0){      //Each time we reach null we refresh the screens
                    me.timeUntilStatus = me.refreshInterval; //Start anew
                    me.coovaRefresh();
                   //// me.yfiUsageRefresh();
                }
            }
        }, 1000 );
    },

    yfiUsageRefresh: function(){
        var me = this;

        var un =me.sessionData.session.userName;
        Ext.data.JsonP.request({
            url: me.application.config.urlUsage,
            callbackKey: 'callback',
            params: {
                username: un,
                key: '12345'
            },
            success: me.paintUsage,
            failure: function(){
             //   console.log("Coova login service is down");
                me.showLoginError("Usage service on YFi is down"); 
            },
            scope: me //VERY VERY VERY important
        });
    },
    paintUsage: function(j){

        var me = this;
        var du = j.json.summary.data_used;
        var da = j.json.summary.data_avail;
        var tu = j.json.summary.time_used;
        var ta = j.json.summary.time_avail;              
                
        me.getStatus().down('#pTime').update({'tUsed':me.time(tu),'tAvail': me.time(ta)});
        if(ta == 'NA'){
            me.getStatus().down('#pbTime').setVisible(false);
        }else{
            var time_used = (ta / (tu+ta));
            me.getStatus().down('#pbTime').updateProgress(time_used);
            me.getStatus().down('#pbTime').updateText(parseInt(time_used*100)+'%');
        }

        me.getStatus().down('#pData').update({'dUsed':me.bytes(du),'dAvail': me.bytes(da)});
        if(da == 'NA'){
            me.getStatus().down('#pbData').setVisible(false);
        }else{
            var data_used = (du / (du+da));
            me.getStatus().down('#pbData').updateProgress(data_used);
            me.getStatus().down('#pbData').updateText(parseInt(data_used*100)+'%');
        }
    },

    refreshStatus: function(j){

        var me = this;
        var gw = 4294967296;

        var time_i  = me.time(j.accounting.idleTime);
        var time_s  = me.time(j.accounting.sessionTime);
        var d_in    = (j.accounting.inputOctets+(j.accounting.inputGigawords*gw));
        var d_out   = (j.accounting.outputOctets+(j.accounting.outputGigawords*gw));

        var dat_i   = me.bytes(d_in);
        var dat_o   = me.bytes(d_out);
        var t       = d_in + d_out;
        var dat_t   = me.bytes(t);

        var statusTab = me.getStatus().down('#sessionTab');
        statusTab.update({idletime : time_i, sessiontime : time_s, data_in: dat_i, data_out: dat_o, data_total: dat_t});
    },
    onBtnConnectClick: function(){  //Get the latest challenge and continue from there onwards....
        var me = this;
        //Set a body mask telling the people we are connecting 
        Ext.getBody().mask('Connecting.....');

        //Set the username and password properties of this object to the values supplied
        if(me.application.realm.auto_append){
            me.userName = me.getConnect().down('#inpUsername').getValue()+me.application.realm.append;
        }else{
            me.userName = me.getConnect().down('#inpUsername').getValue();
        }
        me.password = me.getConnect().down('#inpPassword').getValue();
        me.remember = me.getConnect().down('#inpRememberMe').getValue();

        var urlStatus = 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url: urlStatus,
            timeout: 3000,
            callbackKey: 'callback',
            success: function(j){
                me.currentRetry = 0;
                if(j.clientState == 0){
                    me.encPwd(j.challenge);
                }
                if(j.clientState == 1){
                    //Show status screen since we don't need the challenge
                }           
            },
            failure: function(){
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                  //  console.log("Before login - Retry to fetch Coova status "+me.currentRetry);
                    me.onBtnConnectClick();
                }else{
                    me.showLoginError('Could not fetch coova status');
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    encPwd: function(challenge){

        var me = this;
        //In order to prevent the cleartext password to traverse the line; we to a JSONP https call
        var me = this;
        Ext.data.JsonP.request({
            url: me.application.config.urlUam, //This needs to be https!
            callbackKey: 'callback',
            params: {
                challenge: challenge,
                password: me.password
            },
            success: function(j){
                me.login(j.response);
            },
            failure: function(){
               // console.log("UAM service is down");
                me.showLoginError("UAM service is down"); 
            },
            scope: me //VERY VERY VERY important
        });


/*
        Ext.Ajax.request({
            url: me.application.config.urlUam,
            method: 'GET',
            params: {
                challenge: challenge,
                password: me.password,
            },
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                
                console.log(jsonData);
            },
            failure: function(){
               // console.log("UAM service is down");
                me.showLoginError("UAM service is down"); 
            },
            scope: me
        });
*/
    },
    login:  function(encPwd){
        var me = this;
        var urlLogin = 'http://'+me.uamIp+':'+me.uamPort+'/json/logon';
        Ext.data.JsonP.request({
            url: urlLogin,
            timeout: 3000,
            callbackKey: 'callback',
            params: {
                username: me.userName,
                password: encPwd
            },
            success: me.loginResults,           
            failure: function(){
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                  //  console.log("Retry to log in "+me.currentRetry);
                    me.login(encPwd);
                }else{
                    me.showLoginError("Coova login service is down");
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    loginResults : function(j){
        var me = this;
        me.currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){
            //Clear the cookies
            Ext.util.Cookies.clear('coovaUn');
            Ext.util.Cookies.clear('coovaPw');    
            var msg = 'Authentication failure please try again'
            if(j.message != undefined){
                msg =j.message;
            }
            me.showLoginError(msg);
        }else{
           // console.log("Check if we need to store the credentials")
            if(me.remember == true){
                if (window.console) {
                    window.console.log("Store credentails");
                }
                Ext.util.Cookies.set('coovaUn',me.userName);
                Ext.util.Cookies.set('coovaPw',me.password);
            }
         //   console.log("Connected fine, refreshing now....")
            //If we want to simply redirect; we do it here:
            if(me.application.config.noStatus == true){
                window.location=me.application.config.redirectTo;
            }else{              
                me.coovaRefresh(); //Refresh 
            }
        }
    },

    showLoginError: function(msg){
        me = this;
        Ext.getBody().unmask();
        var error = me.getConnect().down('#inpErrorDisplay');
        error.setVisible(true);     //Display
        error.setValue(msg);
    },
    time:   function ( t , zeroReturn ) {

        if(t == 'NA'){
		    return t;
	    }

        if ( typeof(t) == 'undefined' ) {
            return 'Not available';
        }

        t = parseInt ( t , 10 ) ;
        if ( (typeof (zeroReturn) !='undefined') && ( t === 0 ) ) {
            return zeroReturn;
        }

        var d = Math.floor( t/86400);
        //var h = Math.floor( (t/3600 ) ;
        var h = Math.floor( (t -86400*d)/3600 ) ;
        var m = Math.floor( (t -(86400*d)-(3600*h))/60 ) ;
        var s = t % 60  ;

        var s_str = s.toString();
        if (s < 10 ) { s_str = '0' + s_str;   }

        var m_str = m.toString();
        if (m < 10 ) { m_str= '0' + m_str;    }

        var h_str = h.toString();
        if (h < 10 ) { h_str= '0' + h_str;    }

        var d_str = d.toString();
        if (d < 10 ) { d_str= '0' + d_str;    } 

        if      ( t < 60 )   { return s_str + 's' ; }
        else if ( t < 3600 ) { return m_str + 'm' + s_str + 's' ; }
        else if ( t < 86400 ){ return h_str + 'h' + m_str + 'm' + s_str + 's'; }
        else                 { return d_str + 'd' + h_str + 'h' + m_str + 'm' + s_str + 's'; }
    },
    bytes: function ( b , zeroReturn ) {

	    if(b == 'NA'){
		    return b;
	    }

        if ( typeof(b) == 'undefined' ) {
            b = 0;
        } else {
            b = parseInt ( b , 10 ) ;
        }

        if ( (typeof (zeroReturn) !='undefined') && ( b === 0 ) ) {
            return zeroReturn;
        }
        var kb = Math.round(b/1024);
        if (kb < 1) return b  + ' '+'Bytes';

        var mb = Math.round(kb/1024);
        if (mb < 1)  return kb + ' '+'Kilobytes';

        var gb = Math.round(mb/1024);
        if (gb < 1)  return mb + ' '+'Megabytes';

        return gb + ' '+'Gigabytes';
    }
});
