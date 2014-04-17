Ext.define('CoovaChilli.controller.cMain', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.data.JsonP','Ext.util.Cookies','Ext.dataview.DataView'],
    config: {
        refs: {
            cntStatus       : '#cntStatus',
            cntNotHotspot   : '#cntNotHotspot',
            frmConnect      : '#frmConnect', 
            cntSession      : '#cntSession',
            lblStatusTimer  : '#lblStatusTimer',
            cntPhotos       : '#cntPhotos'
        },
        control: {
        
            'cntStatus #btnDisconnect': {
                tap: 'onBtnDisconnectTap'
            },
            'cntStatus #btnGoInternet': {
                tap: 'onBtnGoInternetTap'
            },
            'frmConnect #btnConnect': {
                tap: 'onBtnConnectTap'
            },
            'cntPhotos #datThumb': {
                itemtap: 'onThumbTap'
            },
            'cntPhotos #crslPhoto': {
                activeitemchange: 'onPhotoShow'
            }
        },
        views: [
            'cntNotPresent',
            'tabMain',
            'frmConnect'
        ] 
    },
    uamIp       : undefined,   //ip of coova hotspot
    uamPort     : undefined, //port of coova hotspot

    counter     : undefined, //refresh counter's id
    timeUntilStatus:20, //interval to refresh
    refreshInterval:20, //ditto

    firstTime   : true,
    noPopUp     : true,

    sessionData : undefined,

    retryCount  : 20, //Make it high to start with --- sometimes it really takes long!
    currentRetry: 0,

    userName    : undefined,
    password    : undefined,
    remember    : false,

    thumbPhoto  : undefined,
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        var me = this;
        Ext.Ajax.request({
            url     : CoovaChilli.config.Config.getUrlRealmInfo()+document.location.search,
            method  : 'GET',
            success : function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                   // console.log(jsonData.data.detail.icon_file_name)
                    me.showMain(jsonData.data);
                }else{
                    me.showNotPresent();    
                }      
            },
            scope: me
        }); 
    },
    showNotPresent: function(){
        var me = this;
        Ext.Viewport.add(Ext.create('CoovaChilli.view.cntNotPresent'));
    },
    showMain: function(jsonData){
        var me = this;
       // console.log(jsonData);
        //Load the main view
        Ext.Viewport.add(Ext.create('CoovaChilli.view.tabMain',{'jsonData':jsonData}));

        if(me.uamIp == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...   
                me.coovaRefresh();
            }else{
                me.showNotHotspot()
            }  
        }else{
            me.coovaRefresh();  //Already established we are a hotspot, simply refresh
        }
    },
    testForHotspot: function(){
        var me          = this;
        var queryObj    = new Object(); 
        //How the page was called - Should be called with the following search sting:
        //?res=notyet&uamip=10.1.0.1&uamport=3660&challenge=ca91105b39c91d49cbfa61ef085a2488&mac=00-0C-F1-5F-58-0B&
        //ip=10.1.0.8&called=00-1D-7E-BC-02-AD&nasid=10.20.30.2&userurl=http%3a%2f%2f1.1.1.1%2f&md=50834AD406B33D3A2D771FF2B4C80499
        window.location.search.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"), function($0,$1,$2,$3) { queryObj[$1] = $3; });

        if(queryObj.uamport != undefined){  //Override defaults
            me.uamPort = queryObj.uamport;
        }else{

            //It may have been called to be previewed
            if(queryObj.dynamic_id != undefined){
                document.title = "Mobile preview";
                
            }
            return false;   //Not a hotspot
        }
        if(queryObj.uamip != undefined){    //Override defaults
            me.uamIp = queryObj.uamip;
        }
        return true;        //Is a hotspot
    },
    onThumbTap: function(datV, index, target, record, e, eOpts){
        var me          = this;
        var id          = record.getId();
        me.thumbPhoto   = id;
        var aa          = me.getCntPhotos().down('#'+id); 
        me.getCntPhotos().down('#crslPhoto').setActiveItem(aa);
        
    },

    onPhotoShow: function(carousel, value, oldValue, eOpts){
        var me          = this;
        var activePhoto = value.getItemId();
        var indexId     = value.indexId;
        if(me.thumbPhoto != activePhoto){
            me.getCntPhotos().down('#datThumb').select(indexId,false);
        }
    },
    //---------------------------------------
    onBtnConnectTap: function(b){  //Get the latest challenge and continue from there onwards....
        var me = this;
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Connecting....'
        });

        me.userName = me.getFrmConnect().down('#inpUsername').getValue();
        me.password = me.getFrmConnect().down('#inpPassword').getValue();
        me.remember = me.getFrmConnect().down('#inpRememberMe').isChecked();

        if((me.userName.length < 1 )||(me.password.length < 1)){
            me.showLoginError('Some required values missing');
            return;
        }

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
                    if(CoovaChilli.config.Config.getNoStatus() == true){
                        window.location=CoovaChilli.config.Config.getRedirectTo();
                    }else{              
                        me.coovaRefresh(); //Refresh 
                    }
                }           
            },
            failure: function(){
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                    me.onBtnConnectTap();
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
            url: CoovaChilli.config.Config.getUrlUam(), //This needs to be https!
            callbackKey: 'callback',
            params: {
                challenge: challenge,
                password: me.password
            },
            success: function(j){
                me.login(j.response);
            },
            failure: function(){
                me.showLoginError("UAM service is down"); 
            },
            scope: me //VERY VERY VERY important
        });
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
            if(me.remember == true){
                if (window.console) {
                   /// window.console.log("Store credentails");
                }
                Ext.util.Cookies.set('coovaUn',me.userName);
                Ext.util.Cookies.set('coovaPw',me.password);
            }
            //If we want to simply redirect; we do it here:
            if(CoovaChilli.config.Config.getNoStatus() == true){
                window.location=CoovaChilli.config.Config.getRedirectTo();
            }else{              
                me.coovaRefresh(); //Refresh 
            }
        }
    },

    showLoginError: function(msg){
        var me = this;
        ///Ext.getBody().unmask();
        Ext.Viewport.setMasked(false);
        var error = me.getFrmConnect().down('#lblInpErrorDisplay');
        error.show();     //Display
        error.setData({msg:msg});
    },
    //-----------------------------------------



    showNotHotspot: function(){
        var me = this;
        me.getFrmConnect().hide();
        me.getCntNotHotspot().show();
        me.getCntStatus().hide();
    },
    showConnect:  function(){
        var me = this;
        me.getFrmConnect().show();
        me.getCntNotHotspot().hide();
        me.getCntStatus().hide();
    },
    showStatus: function(){
        var me = this;
        me.getFrmConnect().hide();
        me.getCntNotHotspot().hide();
        me.getCntStatus().show();
    },
    coovaRefresh: function(){
        var me          = this; 
        var urlStatus   = 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url             : urlStatus,
            timeout         : 3000,
            callbackKey     : 'callback',
            success         : function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value
                if(j.clientState == 0){ 
                    //Try cookies if available                 
                    if( (Ext.util.Cookies.get('coovaUn') != null )&&
                        (Ext.util.Cookies.get('coovaPw') != null )){

                            //Ext.getBody().mask('Connecting.....');
                            me.userName     = Ext.util.Cookies.get('coovaUn');
                            me.password     = Ext.util.Cookies.get('coovaPw');
                            me.encPwd(j.challenge);
                    } 
                    me.showConnect();
                }

                if(j.clientState == 1){
                    if(CoovaChilli.config.Config.getNoStatus() == true){
                        window.location=CoovaChilli.config.Config.getRedirectTo();
                    }else{
                        me.showStatus();
                        //Refresh status window
                        me.refreshStatus(j);
                        if(me.counter == undefined){    //If it is the first time so initialise the loop counter
                            me.sessionData = j;
                            me.refreshCounter();
                        }
                    }
                }
                Ext.Viewport.setMasked(false);            
            },
            failure: function(){
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                    me.coovaRefresh();
                }else{
                    me.showLoginError("Failed to get status from CoovaChilli");
                    me.showConnect();  
                }
            },
            scope: me //VERY VERY VERY important
        });
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
        me.getCntSession().setData({idletime : time_i, sessiontime : time_s, data_in: dat_i, data_out: dat_o, data_total: dat_t});
    },
    refreshCounter: function(){
        var me      = this; 
        me.counter  = setInterval (function(){
            me.timeUntilStatus = me.timeUntilStatus-1;
            if(me.getCntStatus().isHidden()){    //We remove ourself gracefully
                clearInterval(me.counter);
                me.counter   = undefined;
                me.timeUntilStatus = me.refreshInterval;
            }else{
                me.getLblStatusTimer().setData({'sec' : me.timeUntilStatus});
                if(me.timeUntilStatus == 0){      //Each time we reach null we refresh the screens
                    me.timeUntilStatus = me.refreshInterval; //Start anew
                    me.coovaRefresh();
                }
            }
        }, 1000 );
    },
    onBtnDisconnectTap: function(button){
        var me = this;
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Disconnecting....'
        });
        var urlLogoff = 'http://'+me.uamIp+':'+me.uamPort+'/json/logoff';
        Ext.data.JsonP.request({
            url: urlLogoff,
            timeout: 3000,
            callbackKey: 'callback',
            success: function (){
                me.currentRetry = 0;
                me.coovaRefresh();
            },           
            failure: function(){
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                    me.onBtnDisconnectTap();
                }else{
                    me.showLoginError("Failed to disconnect");
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    onBtnGoInternetTap: function(button){
        var me = this;
        window.open(CoovaChilli.config.Config.getRedirectTo(), '_blank');
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
