Ext.define('Mikrotik.controller.Desktop', {
    extend      : 'Ext.app.Controller',
    requires    : ['Ext.data.JsonP','Ext.util.Cookies'],
    views       : [
        'Land'
    ],
    refs: [
        { ref: 'vp',        selector: '',               xtype: 'vp',        autoCreate: true},
        { ref: 'land',      selector: '',               xtype: 'land'},        
        { ref: 'connect',   selector: 'pnlConnect',     xtype: '' },     //Connect panel
        { ref: 'status',    selector: 'pnlStatus',      xtype: '' },     //Status panel (mutually exclusive with connect panel)
        { ref: 'notHotspot',selector: 'pnlNotHotspot',  xtype: '' },      //Not a hotspot panel
        { ref: 'frmPayU',   selector: 'frmPayU',        xtype: '' },      //Not a hotspot panel
        { ref: 'datThumb',  selector: '#datThumb',      xtype: '' }      //Thumb view
    ],
   

    //---
    counter         : undefined, //refresh counter's id
    timeUntilStatus : 20, //interval to refresh
    refreshInterval : 20, //ditto

    sessionData     : undefined,

    retryCount      : 1, //Make it high to start with --- sometimes it really takes long!
    currentRetry    : 0,

    userName        : undefined,
    password        : undefined,
    remember        : false,

    mtServer        : undefined, 
    mac_username    : undefined,

    queryObj        : undefined,

    currentSlide    : 0,

    //Payment gateway
    //paymentGw       : true,
    paymentGw       : false,
    //paymentGwType   : 'pnlPayPal',
    paymentGwType   : 'pnlPayAd',
    //paymentGwType   : 'pnlPayU',

    //--- 

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
            'pnlPhotos #datThumb' : {
                itemclick  : me.thumbSelected
            },
            'pnlConnect #btnClickToConnect' : {
                click: me.onBtnClickToConnect
            }
        });    
    },
    onBtnDisconnectClick: function(b){
        var me = this;
        b.up('pnlStatus').setLoading('Disconnecting ...');
     
        Ext.data.JsonP.request({
            url         : me.queryObj.link_logout,
            timeout     : me.application.config.jsonTimeout,
            callbackKey : 'var',
            success: function (){
                me.currentRetry = 0;
                me.mtRefresh();
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
            scope: me 
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
        var url         = record.get('url');
        img.setSrc(file_name);
        ph.update({title: title, description: description,url: url});
    },

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

        if(me.mtServer == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...
                //Start by showing the connect...
                me.getConnect().setLoading('Fetching connection status...');
                me.showConnect();
                me.mtRefresh();
            }else{
                me.showNotHotspot()
            }  
        }else{
            me.mtRefresh();  //Already established we are a hotspot, simply refresh
        }

        //Check if this was perhaps the return of a payment gateway
        me.checkPaymentGwReturn();
        
        //Check if we need to start a slideshow
        me.checkForSlideshow(data);

        //Test the redirect after login thing
        if(data.settings.redirect_check == true){
            me.application.config.noStatus == true
        }
        me.application.config.redirectTo = data.settings.redirect_url;

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
           // console.log("not doing a payment gw");
            return;
        }
        console.log(me.paymentGwType);

        //--- PayPal ---
        if(me.paymentGwType == 'pnlPayPal'){
            //console.log(me.queryObj.tx);
            if(me.queryObj.tx != undefined){ //Paypal will add a tx=<transaction ID to the query string>
                //Dummy thing:
                console.log("Finding transaction details for "+ me.queryObj.tx);
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

        // --- PayU ---
        if(me.paymentGwType == 'pnlPayU'){
            //console.log(me.queryObj.PayUReference);
            if(me.queryObj.PayUReference != undefined){ //Paypal will add a tx=<transaction ID to the query string>
                //Dummy thing:
                //console.log("Finding transaction details for "+ me.queryObj.tx);
                Ext.Ajax.request({
                    url     : me.application.config.urlPayUVoucher,
                    method  : 'GET',
                    params: {
                        PayUReference: me.queryObj.PayUReference
                    },
                    success : function(response){
                        var jsonData    = Ext.JSON.decode(response.responseText);
                     //   console.log(jsonData);
                        if(jsonData.success){
                            me.getLand().down('#tpnlOptions').down('#pnlPayUFeedback').update(jsonData.data);
                            me.getLand().down('#tpnlOptions').setActiveTab('pnlShop');
                            me.getLand().down('#tpnlOptions').down('#pnlPayUFeedback').setVisible(true);
                            me.getLand().down('#tpnlOptions').down('#pnlPayUError').setVisible(false);
                            
                            me.getConnect().down('#inpUsername').setValue(jsonData.data.username);
                            me.getConnect().down('#inpPassword').setValue(jsonData.data.password);
                        }else{
                            //console.log("big problems");
                            me.getLand().down('#tpnlOptions').setActiveTab('pnlShop');
                            me.getLand().down('#tpnlOptions').down('#pnlPayUFeedback').setVisible(false);
                            me.getLand().down('#tpnlOptions').down('#pnlPayUError').setVisible(true);
                        }       
                    },
                    scope: me
                });
            }
        }

    },
    checkForSlideshow: function(data){
        var me = this;
        if(data.settings.slideshow_check == true){
            me.slideShow = setInterval(function(){        
                //console.log("Change Slide");
                var dv          = me.getDatThumb();
                var count       = dv.store.getCount();
                me.currentSlide = me.currentSlide +1;
                if(me.currentSlide >= count){
                    me.currentSlide =0 //Start again
                }
                var record = dv.store.getAt(me.currentSlide);
                dv.getSelectionModel().select(record);
                me.thumbSelected(dv,record)
            },  (data.settings.seconds_per_slide * 1000));
        }
    },

    onBtnPwdForgetClick: function(){
        var me = this;
        me.application.getController('Password').index();
    },

    //____________________________ Mikrotik Login _______________________________

    testForHotspot: function(){
        var me          = this;
        me.queryObj     = new Object(); 
        window.location.search.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"), function($0,$1,$2,$3) { me.queryObj[$1] = $3; });

        if(me.queryObj.link_status != undefined){  //Override defaults
            return true;        //Is a hotspot
        }else{
            //It may have been called to be previewed
            if(me.queryObj.dynamic_id != undefined){
                document.title = "Desktop preview";
                me.showNotHotspot();
            }
            return false;   //Not a hotspot
        }
   
    },
    mtRefresh: function(){
        var me = this;  
        Ext.data.JsonP.request({
            url         : me.queryObj.link_status,
            timeout     : me.application.config.jsonTimeout,
            callbackKey : 'var',
            success     : function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value
                if(j.logged_in == 'no'){ 
                    //Try cookies if available                 
                    if( (Ext.util.Cookies.get('mtUn') != null )&&
                        (Ext.util.Cookies.get('mtPw') != null )){
                            //  console.log("Trying cookies");
                            me.getConnect().setLoading('Connecting.....');
                            me.getStatus().setLoading('Connecting.....');
                            me.userName     = Ext.util.Cookies.get('mtUn');
                            me.password     = Ext.util.Cookies.get('mtPw');
                            me.doLogin();
                    } 
                    me.clearLoginError();
                    me.showConnect();
                }

                if(j.logged_in == 'yes'){

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
               // console.log("Could not fetch the MT status");
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                   //// console.log("Retry to fetch MT status "+me.currentRetry);
                    me.mtRefresh();
                }else{
                   me.showLoginError("Failed to get status from Mikrotik");
                   me.getConnect().setLoading(false);
                   me.showConnect();  
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    refreshCounter: function(){

        var me      = this; 
        me.counter  = setInterval (function(){
            me.timeUntilStatus = me.timeUntilStatus-1;
            if(me.getStatus().isHidden()){    //We remove ourself gracefully
                clearInterval(me.counter);
                me.counter   = undefined;
                me.timeUntilStatus = me.refreshInterval;
            }else{
                var m = me.getStatus().down('#refreshMessage');
                m.setText('Refresh in <span style="color:blue;">'+ me.timeUntilStatus + '</span> seconds');
                if(me.timeUntilStatus == 0){      //Each time we reach null we refresh the screens
                    me.timeUntilStatus = me.refreshInterval; //Start anew
                    me.mtRefresh();
                }
            }
        }, 1000 );

    },
    refreshStatus: function(j){
        var me      = this;
        var statusTab = me.getStatus().down('#sessionTab');
        statusTab.update({username : j.username, uptime : j.uptime, bytes_in_nice: j.bytes_in_nice, bytes_out_nice: j.bytes_out_nice});
    },
    onBtnClickToConnect: function(b){
        var me      = this;
        var delay   = b.up('pnlConnect').jsonData.settings.connect_delay;
        var start   = delay;

        //Check if they need to accept T&C
        if(b.up('pnlConnect').down('#chkTcCheck').isHidden() == false){
            if(b.up('pnlConnect').down('#chkTcCheck').getValue() == false){
                me.showLoginError('First accept T&C');
                return;
            }
        }

        if(delay > 0){
            b.setDisabled(true);
            me.connectWait = setInterval(function(){        
                me.showLoginError('Connect in '+start+' seconds','Connect wait time');
                start = start -1;
                if(start <= 0){
                    b.setDisabled(false);
                    me.clearLoginError();
                    clearInterval(me.connectWait);
                    me.onBtnConnectClick(b,true);
                }
            },  1000);  
        }else{
            me.onBtnConnectClick(b,true);
        }
    },
    onBtnConnectClick: function(b,c_to_c){  //Get the latest challenge and continue from there onwards....
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
        if(c_to_c != true){
            me.userName = me.getConnect().down('#inpUsername').getValue();
            me.password = me.getConnect().down('#inpPassword').getValue();
            me.remember = me.getConnect().down('#inpRememberMe').getValue();
        }else{
            var suffix  = b.up('pnlConnect').jsonData.settings.connect_suffix;
            me.userName = b.up('pnlConnect').jsonData.settings.connect_username+'@'+me.queryObj[suffix]; //Makes this unique
            me.password = b.up('pnlConnect').jsonData.settings.connect_username;
            me.remember = false;
        }

        me.doLogin();
    },
   
    doLogin: function(win){

        var me      = this;
        var form    = me.getConnect().down('form');
        var btnMac  = me.getConnect().down('#btnRemoveMac');

        var xtraParams = { 
            'username': me.userName,
            'password': me.password
        }

        Ext.data.JsonP.request({
            url         : me.queryObj.link_login_only,
            timeout     : me.application.config.jsonTimeout,
            callbackKey : 'var',
            params      : xtraParams,
            success: function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value
                me.getConnect().setLoading('Connecting.....');
                me.getStatus().setLoading('Connecting.....');
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

                        msg     = j.error_orig;
                        var res = msg.match(/^User ([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F]) belongs to realm/);   //Real one
                        if(res != null){
                            //Get the MAC
                            var mac = msg.match(/([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F])/);
                            me.mac_username = mac[0];            
                            btnMac.setVisible(true);
                        }else{
                            btnMac.setVisible(false);
                        }
                    }
                    me.showLoginError(msg);
                }      
            },
            failure: function(){  
                me.showLoginError("Failed to get status from Mikrotik");       
            },
            scope: me //VERY VERY VERY important
        });
    },

    showLoginError: function(msg,label){
        var me = this;
        me.getConnect().setLoading(false);
        me.getStatus().setLoading(false);
        var error = me.getConnect().down('#inpErrorDisplay');
        error.setVisible(true);     //Display
        error.setValue(msg);
        if(label != undefined){
           error.setFieldLabel(label); 
        }else{
           error.setFieldLabel("Error");
        }
    },

    clearLoginError: function(msg){
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
    }
});
