Ext.define('MikrotikLogin.controller.cConnect', {
    extend  : 'Ext.app.Controller',
    requires: ['Ext.data.JsonP','Ext.util.Cookies'],
    views: [
        'winConnect',
        'winStatus',
        'winNotHotspot'
    ],
    refs    : [
        { ref: 'connect',       selector: '',       xtype: 'winConnect',    autoCreate: true },     
        { ref: 'status',        selector: '',       xtype: 'winStatus',     autoCreate: true },     
        { ref: 'notHotspot',    selector: '',   xtype: 'winNotHotspot',     autoCreate: true}     
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
            'winConnect #btnConnect' : {
                click: me.onBtnConnectClick
            },
            'winStatus #btnDisconnect' : {
                click: me.onBtnDisconnectClick
            }
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
            me.mtRefresh();  //Already established we are a hotspot, simply refresh
        }      
    },
    testForHotspot: function(){
        var me          = this;
       //// console.log("Test for hotspot");
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
              ////  console.log(j);

                if(j.logged_in == 'no'){ 
                    //Try cookies if available                 
                    if( (Ext.util.Cookies.get('mtUn') != null )&&
                        (Ext.util.Cookies.get('mtPw') != null )){
                            //  console.log("Trying cookies");
                            me.userName     = Ext.util.Cookies.get('mtUn');
                            me.password     = Ext.util.Cookies.get('mtPw');
                            me.doLogin();
                    } 
                    me.application.activeWindow = me.getConnect();
                }

                if(j.logged_in == 'yes'){
                    if(me.application.config.noStatus == true){
                        window.location=me.application.config.redirectTo;
                    }else{
                         me.application.activeWindow = me.getStatus();
                        //Refresh status window
                        me.refreshStatus(j);
                        if(me.counter == undefined){    //If it is the first time so initialise the loop counter
                            me.sessionData = j;
                            me.refreshCounter();
                        }
                    }
                }
                me.application.activeWindow.show();           
            },
            failure: function(){
               // console.log("Could not fetch the MT status");
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                   //// console.log("Retry to fetch MT status "+me.currentRetry);
                    me.mtRefresh();
                }else{
                   //// console.log("Could not fetch MT status giving up!")
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    onBtnConnectClick: function(b){  
        var me      = this;
        var window  = b.up('window');
        window.setLoading(true);
        me.userName = me.getConnect().down('#inpUsername').getValue();
        me.password = me.getConnect().down('#inpPassword').getValue();
        me.remember = me.getConnect().down('#inpRememberMe').getValue();
        me.doLogin(window);
    },
    onBtnDisconnectClick: function(b){
        var me      = this;
        var window  = b.up('window');
        window.setLoading(true);
        Ext.data.JsonP.request({
            url         : me.queryObj.link_logout,
            timeout     : 3000,
            callbackKey : 'var',
            success: function(j){
                   window.setLoading(false);    
                   me.mtRefresh(); //Refresh        
            },
            failure: function(){
                window.setLoading(false); 
               //// console.log("Could not disconnect");  
            },
            scope: me
        });
    },
    doLogin: function(win){
        var me      = this;
        var form    = me.getConnect().down('form');

        var xtraParams = { 
            'username': me.userName,
            'password': me.password
        }

        Ext.data.JsonP.request({
            url         : me.queryObj.link_login_only,
            timeout     : 3000,
            callbackKey : 'var',
            params      : xtraParams,
            success: function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value
               //// console.log(j);

                if(win != undefined){
                    win.setLoading(false); 
                }
                //If ok (alogon.html)
                if(j.logged_in == 'yes'){
                    // start with the usage...
                    if(me.remember == true){
                     ////   console.log("Store credentails");
                        Ext.util.Cookies.set('mtUn',me.userName);
                        Ext.util.Cookies.set('mtPw',me.password);
                    }

                    //Hide error message if there was a previous one
                    var error = me.getConnect().down('#inpErrorDisplay');
                    error.setVisible(false);     //Hide
                    error.setValue('');           
                    me.mtRefresh(); //Refresh 
                }

                //If failed (login.html -> if caluse)
                if(j.logged_in == 'no'){
                    //Clear the cookies
                    Ext.util.Cookies.clear('mtUn');
                    Ext.util.Cookies.clear('mtPw');    
                    var msg = 'Authentication failure please try again'
                    if(j.error_orig != undefined){
                        msg =j.error_orig;
                    }
                    me.showLoginError(msg);
                }      
            },
            failure: function(){
              ////  console.log("Could not log in");
                if(win != undefined){
                    win.setLoading(false); 
                }   
            },
            scope: me //VERY VERY VERY important
        });
    },
    showLoginError: function(msg){
        me          = this;
        var error   = me.getConnect().down('#inpErrorDisplay');
        error.setVisible(true);     //Display
        error.setValue(msg);
    },
    refreshStatus: function(j){
        var me = this;
        var statusTab = me.getStatus().down('#sessionTab');
        statusTab.update({username : j.username, uptime : j.uptime, bytes_in_nice: j.bytes_in_nice, bytes_out_nice: j.bytes_out_nice});
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
                    me.mtRefresh();
                   //// me.yfiUsageRefresh();
                }
            }
        }, 1000 );
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
