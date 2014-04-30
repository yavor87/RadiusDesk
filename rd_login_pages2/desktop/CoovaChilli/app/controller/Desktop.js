Ext.define('CoovaChilli.controller.Desktop', {
    extend      : 'Ext.app.Controller',
    requires    : ['Ext.data.JsonP','Ext.util.Cookies'],
    views       : [
        'Land',
        'frmPayU',
        'cmbVouchers'
    ],
    stores  : ['sPrices'],
    models  : ['mPrice' ],
    refs: [
        { ref: 'vp',        selector: '',               xtype: 'vp',        autoCreate: true},
        { ref: 'land',      selector: 'land',           xtype: ''},        
        { ref: 'connect',   selector: 'pnlConnect',     xtype: '' },     //Connect panel
        { ref: 'status',    selector: 'pnlStatus',      xtype: '' },     //Status panel (mutually exclusive with connect panel)
        { ref: 'notHotspot',selector: 'pnlNotHotspot',  xtype: '' },      //Not a hotspot panel
        { ref: 'frmPayU',   selector: 'frmPayU',        xtype: '' }      //Not a hotspot panel
    ],
   

    //---
    uamIp           : undefined,   //ip of coova hotspot
    uamPort         : undefined, //port of coova hotspot

    counter         : undefined, //refresh counter's id
    timeUntilStatus : 20, //interval to refresh
    refreshInterval : 20, //ditto

    sessionData     : undefined,

    retryCount      : 10, //Make it high to start with --- sometimes it really takes long!
    currentRetry    : 0,

    userName        : undefined,
    password        : undefined,
    remember        : false,

    queryObj        : undefined,

    //--- 

    //Payment gateway
    paymentGw       : true,
    patmenyGwType   : 'pnlPayPal',
   // patmenyGwType   : 'pnlPayAd',
   // patmenyGwType   : 'pnlPayU',

    init: function() {
        var me = this;
        //Connect some events
        me.control({
            'pnlConnect #btnConnect' : {
                click: me.onBtnConnectClick
            },
            'pnlConnect #btnPwdForget': {
                click: me.onBtnPwdForgetClick
            },
            'pnlStatus #btnDisconnect' : {
                click: me.onBtnDisconnectClick
            },
            'pnlStatus #btnGoInternet' : {
                click: me.onBtnGoInternetClick
            },
            '#btnBuy' : {
                click   : me.buyVoucher
            },
            'pnlPhotos #datThumb' : {
                itemclick  : me.thumbSelected
            }
        });    
    },
    onBtnDisconnectClick: function(b){
        var me = this;
        b.up('pnlStatus').setLoading('Disconnecting ...');
        var urlLogoff = 'http://'+me.uamIp+':'+me.uamPort+'/json/logoff';
        Ext.data.JsonP.request({
            url: urlLogoff,
            timeout: me.application.config.jsonTimeout,
            callbackKey: 'callback',
            success: function (){
                me.currentRetry = 0;
                me.coovaRefresh();
            },           
            failure: function(){
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                    me.onBtnDisconnectClick();
                }else{
                    me.showLoginError("Failed to disconnect");
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    onBtnGoInternetClick: function(button){
        var me = this;
        window.open(me.application.config.redirectTo, '_blank');
    },
    thumbSelected:  function(dataview,record){
        var me          = this;
        var pnlPhoto    = dataview.up('pnlPhotos');
        var img         = pnlPhoto.down('#imgPhoto');
        var ph          = pnlPhoto.down('#pnlPhotoHeading');

        var file_name   = record.get('file_name');
        var title       = record.get('title');
        var description = record.get('description');
        img.setSrc(file_name);
        ph.update({title: title, description: description});
    },
    buyVoucher:     function(button){
        var me = this;
       // console.log("Payment!!");
        if(me.queryObj.nasid != undefined){  //Override defaults
            me.getFrmPayU().submit({
                target:'_blank',
                params:{
                    nasid: me.queryObj.nasid
                }
            });
      
        }else{
            //me.getFrmPayU().submit({target:'_blank'});  
        }
    },
    //startUp: function(){
    onLaunch: function(){
        var me = this;  
   
        Ext.Ajax.request({
            url     : me.application.config.urlRealmInfo+document.location.search,
            method  : 'GET',
            success : function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    me.realmFetched(jsonData.data);
                }else{
                    me.realmNotFound(); //Tell then to add an identifier
                }       
            },
            scope: me
        });
    },

    //____________________________ REALM DETAIL _______________________________
    realmFetched: function(data){   //Handler for Realm Info
        var me  = this;
        var l   = me.getView('Land').create({'jsonData':data});
        var vp  = me.getVp();
        vp.add([l]);
        //Change the page's title
        document.title = data.detail.name;

        if(me.uamIp == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...
                me.getConnect().setLoading('Fetching connection status...');
                me.showConnect();   
                me.coovaRefresh();
            }else{
                me.showNotHotspot();
            }  
        }else{
            me.coovaRefresh();  //Already established we are a hotspot, simply refresh
        }

        //Check if this was perhaps the return of a payment gateway
        me.checkPaymentGwReturn();

    },
    realmNotFound:  function(){
        var me = this;
        me.getVp().add(Ext.create('Ext.panel.Panel',{
            'title'     : 'No Dynamic Login Page detail found',
            'html'      : [ 
                "<div class='rdCenter'>",
                "<h2>Huston we have a problem....</h2>",
                "<div class='rdDescription'>",
                "Go to RADIUSdesk, open the <b>Dynamic Login Pages</b> applet. Select an entry and <b>edit</b> it<br>",
                "Make sure you added an identifier from this URL's query string under <b>Dynamic Keys</b>",
                " to ensure proper working of this login page<br>",
                "</div></div>"
            ]
        }));

    },

    checkPaymentGwReturn: function(){
        var me = this;

        //Return as we don't do anything
        if(me.paymentGw == false){
            return;
        }

        if(me.paymentGwType == 'pnlPayPal'){
            if(me.queryObj.tx != undefined){ //Paypal will add a tx=<transaction ID to the query string>
                //Dummy thing:
              //  console.log("Finding transaction details for "+ me.queryObj.tx);
                Ext.Ajax.request({
                    url     : me.application.config.urlPayPalVoucher,
                    method  : 'GET',
                    params: {
                        txn_id: me.queryObj.tx
                    },
                    success : function(response){
                        var jsonData    = Ext.JSON.decode(response.responseText);
                     //   console.log(jsonData);
                        if(jsonData.success){
                            me.getLand().down('#tpnlOptions').down('#pnlPayPalFeedback').update(jsonData.data);
                            me.getLand().down('#tpnlOptions').setActiveTab('pnlShop');
                            me.getLand().down('#tpnlOptions').down('#pnlPayPalFeedback').setVisible(true);
                            me.getLand().down('#tpnlOptions').down('#pnlPayPalError').setVisible(false);
                            
                            me.getConnect().down('#inpUsername').setValue(jsonData.data.username);
                            me.getConnect().down('#inpPassword').setValue(jsonData.data.password);
                        }else{
                            //console.log("big problems");
                            me.getLand().down('#tpnlOptions').setActiveTab('pnlShop');
                            me.getLand().down('#tpnlOptions').down('#pnlPayPalFeedback').setVisible(false);
                            me.getLand().down('#tpnlOptions').down('#pnlPayPalError').setVisible(true);
                        }       
                    },
                    scope: me
                });
            }
        }
    },
    onBtnPwdForgetClick: function(){
        var me = this;
        me.application.getController('Password').index();
    },

    //____________________________ Coova Login _______________________________

    testForHotspot: function(){
        var me          = this;
        me.queryObj    = new Object(); 
        //How the page was called - Should be called with the following search sting:
        //?res=notyet&uamip=10.1.0.1&uamport=3660&challenge=ca91105b39c91d49cbfa61ef085a2488&mac=00-0C-F1-5F-58-0B&
        //ip=10.1.0.8&called=00-1D-7E-BC-02-AD&nasid=10.20.30.2&userurl=http%3a%2f%2f1.1.1.1%2f&md=50834AD406B33D3A2D771FF2B4C80499
        window.location.search.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"), function($0,$1,$2,$3) { me.queryObj[$1] = $3; });

        if(me.queryObj.uamport != undefined){  //Override defaults
            me.uamPort = me.queryObj.uamport;
        }else{

            //It may have been called to be previewed
            if(me.queryObj.dynamic_id != undefined){
                document.title = "Desktop preview";
                me.showNotHotspot();
            }
            return false;   //Not a hotspot
        }
        if(me.queryObj.uamip != undefined){    //Override defaults
            me.uamIp = me.queryObj.uamip;
        }
        return true;        //Is a hotspot
    },
    coovaRefresh: function(){
        var me = this;   
        var urlStatus = 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url: urlStatus,
            timeout: me.application.config.jsonTimeout,
            callbackKey: 'callback',
            success: function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value

                if(j.clientState == 0){ 
                    //Try cookies if available                 
                    if( (Ext.util.Cookies.get('coovaUn') != null )&&
                        (Ext.util.Cookies.get('coovaPw') != null )){
                          //  console.log("Trying cookies");
                            //Set a body mask telling the people we are connecting 
                            me.getConnect().setLoading('Connecting.....');
                            me.getStatus().setLoading('Connecting.....');
                            me.userName     = Ext.util.Cookies.get('coovaUn');
                            me.password     = Ext.util.Cookies.get('coovaPw');
                            me.encPwd(j.challenge);
                    } 
                    me.clearLoginError();
                    me.showConnect();
                }

                if(j.clientState == 1){
                    if(me.application.config.noStatus == true){
                        window.location=me.application.config.redirectTo;
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
                me.getConnect().setLoading(false);
                me.getStatus().setLoading(false);           
            },
            failure: function(){
               // console.log("Could not fetch the coova status");
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                 //   console.log("Retry to fetch Coova status "+me.currentRetry);
                    me.coovaRefresh();
                }else{
                    me.showLoginError("Failed to get status from CoovaChilli");
                    me.showConnect();  
                }
            },
            scope: me
        });
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
                }
            }
        }, 1000 );
    },
    refreshStatus: function(j){
        var me      = this;
        var gw      = 4294967296;

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
    onBtnConnectClick: function(b){  //Get the latest challenge and continue from there onwards....
        var me = this;

        //Check if they need to accept T&C
        if(b.up('pnlConnect').down('#chkTcCheck').isHidden() == false){
            if(b.up('pnlConnect').down('#chkTcCheck').getValue() == false){
                me.showLoginError('First accept T&C');
                return;
            }
        }

        //Set a body mask telling the people we are connecting 
        b.up('pnlConnect').setLoading('Connecting....');

        //Set the username and password properties of this object to the values supplied
        me.userName = me.getConnect().down('#inpUsername').getValue();
        me.password = me.getConnect().down('#inpPassword').getValue();
        me.remember = me.getConnect().down('#inpRememberMe').getValue();

        var urlStatus = 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url: urlStatus,
            timeout: me.application.config.jsonTimeout,
            callbackKey: 'callback',
            success: function(j){
                me.currentRetry = 0;
                if(j.clientState == 0){
                    me.encPwd(j.challenge);
                }
                if(j.clientState == 1){
                    if(me.application.config.noStatus == true){
                        window.location=me.application.config.redirectTo;
                    }else{              
                        me.coovaRefresh(); //Refresh 
                    }
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
            scope: me 
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
            scope: me 
        });
    },
    login:  function(encPwd){
        var me = this;
        var urlLogin = 'http://'+me.uamIp+':'+me.uamPort+'/json/logon';
        Ext.data.JsonP.request({
            url: urlLogin,
            timeout: me.application.config.jsonTimeout,
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
            scope: me 
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
                    window.console.log("Store credentails");
                }
                Ext.util.Cookies.set('coovaUn',me.userName);
                Ext.util.Cookies.set('coovaPw',me.password);
            }
            //If we want to simply redirect; we do it here:
            if(me.application.config.noStatus == true){
                window.location=me.application.config.redirectTo;
            }else{              
                me.coovaRefresh(); //Refresh 
            }
        }
    },

    showLoginError: function(msg){
        var me = this;
        me.getConnect().setLoading(false);
        me.getStatus().setLoading(false);
        var error = me.getConnect().down('#inpErrorDisplay');
        error.setVisible(true);     //Display
        error.setValue(msg);
    },

    clearLoginError: function(){
        var me = this;
        me.getConnect().setLoading(false);
        me.getStatus().setLoading(false);
        var error = me.getConnect().down('#inpErrorDisplay');
        error.setVisible(false);     //Display
        error.setValue('');
    },

    //============ SHORTcuts =====

    showConnect : function(){
        var me = this;
        me.getConnect().show();
        me.getStatus().hide();
        me.getNotHotspot().hide();
    },
    showStatus : function(){
        var me = this;
        me.getConnect().hide();
        me.getStatus().show();
        me.getNotHotspot().hide();
    },
    showNotHotspot : function(){
        var me = this;
        me.getConnect().hide();
        me.getStatus().hide();
        me.getNotHotspot().show();
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
