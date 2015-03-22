Ext.define('CoovaChilli.controller.cMain', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.data.JsonP','Ext.util.Cookies','Ext.dataview.DataView','Ext.MessageBox'],
    config: {
        refs: {
            cntStatus       : '#cntStatus',
            cntNotHotspot   : '#cntNotHotspot',
            frmConnect      : '#frmConnect', 
            cntSession      : '#cntSession',
			cntUsage		: '#cntUsage',
            lblStatusTimer  : '#lblStatusTimer',
			lblUsageTimer	: '#lblUsageTimer',
            cntPhotos       : '#cntPhotos',
            cntShop         : '#cntShop',
            tabMain         : '#tabMain',
            datThumb        : '#datThumb',
			navNewUser		: '#navNewUser',
			navLostPassword : '#navLostPassword'
          //  frmPayU         : '#frmPayU'
        },
        control: {
        
            'cntStatus #btnDisconnect': {
                tap         : 'onBtnDisconnectTap'
            },
            'cntStatus #btnGoInternet': {
                tap         : 'onBtnGoInternetTap'
            },
            'frmConnect #btnConnect': {
                tap         : 'onBtnConnectTap'
            },
            'cntPhotos #datThumb': {
                itemtap     : 'onThumbTap'
            },
            'cntPhotos #crslPhoto': {
                activeitemchange: 'onPhotoShow'
            },
            'frmPayU': {
                initialize  : 'onFrmPayUInit'
            },
            'frmPayU #btnPayU' : {
                tap         : 'onBtnPayUTap'
            },
            'frmConnect #btnClickToConnect': {
                tap         : 'onBtnClickToConnectTap'
            },
			'frmConnect #btnViewTC': {
                tap         : 'onBtnViewTCTap'
            },
			'cntStatus #tpStatus': {
                activeitemchange    : 'onActiveItemChange'
            },
			'navNewUser #navBtnNext' : {
				tap		: 'onNavBtnNextTap'
			},
			'navLostPassword #navBtnNext' : {
				tap		: 'onLpNavBtnNextTap'
			},
			//=== Social Login ==
			'frmConnect	[type="socialButton"]' : {
				tap		: 'socialButtonClicked'
			}
        },
        views: [
            'cntNotPresent',
            'tabMain',
            'frmConnect',
			'frmNewUser',
			'frmLostPassword'
        ],
        stores: [
            'sPrices'
        ],
        models : [
            'mPrice',
			'mNewUser',
			'mLostPassword'
        ] 
    },
    uamIp       	: undefined,   //ip of coova hotspot
    uamPort     	: undefined, //port of coova hotspot

    counter     	: undefined, //refresh counter's id
    timeUntilStatus	:20, //interval to refresh
    refreshInterval	:20, //ditto

	timeUntilUsage 	: 60, //defaults
    usageInterval 	: 60, //ditto
	usageUsername 	: undefined,
	usageMac 		: undefined,

    sessionData : undefined,

    retryCount  : 10, //Make it high to start with --- sometimes it really takes long!
    currentRetry: 0,

    userName    : '',
    password    : '',
    remember    : false,

    thumbPhoto  : undefined,

    queryObj    : undefined,

    currentSlide: 0,
	notRequired	: [ 'q', 'res',	'challenge', 'called', 'mac', 'ip', 'sessionid', 'userurl', 'md'],

    frmPayUExist        : false,
    sPayUPricesLoaded   : false,
	jsonData	: undefined,
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        var me = this;

        if(CoovaChilli.config.Config.getPaymentGwType() == 'frmPayU'){
            Ext.data.StoreManager.lookup('sPrices').addListener('load',me.onPayUStoreLoaded, me);
        }

        Ext.Ajax.request({
            url     : CoovaChilli.config.Config.getUrlRealmInfo()+document.location.search,
            method  : 'GET',
            success : function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                   // console.log(jsonData.data.detail.icon_file_name)
					me.jsonData = jsonData.data;
                    me.showMain(jsonData.data);
                }else{
                    me.showNotPresent();    
                }      
            },
            scope: me
        }); 

    },
    
    onPayUStoreLoaded: function(){
        var me = this;
        //console.log("PayU store loaded");
        me.sPayUPricesLoaded = true;
        if(me.frmPayUExist){
            var fieldset    = me.getCntShop().down('fieldset');
            var store       = Ext.data.StoreManager.lookup('sPrices');
            store.each(function (item, index, length) {
                fieldset.add(Ext.create('Ext.field.Radio',{
                    name : 'Voucher',
                    value: item.get('id'),
                    label: item.get('name')
                }));
                //console.log(item.get('name'), index);
            });
        }
    },
    onFrmPayUInit : function(f){
        var me = this;
        //console.log("PayU form inited");
        me.frmPayUExist = true;
        if(me.sPayUPricesLoaded){
            var fieldset    = f.down('fieldset');
            var store       = Ext.data.StoreManager.lookup('sPrices');
            store.each(function (item, index, length) {
                var checked = false;
                if(index == 0){
                    checked = true;//Mark the first one
                }
                f.down('fieldset').add(Ext.create('Ext.field.Radio',{
                    name    : 'voucher',
                    value   : item.get('id'),
                    label   : item.get('name'),
                    checked : checked
                }));
            });
        }
    },

    showNotPresent: function(){
        var me = this;
        Ext.Viewport.add(Ext.create('CoovaChilli.view.cntNotPresent'));
    },
    showMain: function(jsonData){
        var me = this;
       // console.log(jsonData);

		//Set interval if specified
		if(me.jsonData.settings.usage_show_check != undefined){
			if(me.jsonData.settings.usage_show_check == true){
				me.timeUntilUsage 	= me.jsonData.settings.usage_refresh_interval;
    			me.usageInterval 	= me.jsonData.settings.usage_refresh_interval;
			}
		}

        //Load the main view
        var paymentScreen = CoovaChilli.config.Config.getPaymentGwType();
        Ext.Viewport.add(Ext.create('CoovaChilli.view.tabMain',{
            'jsonData'      :jsonData,
            'paymentScreen' :paymentScreen, 
            'itemId'        : 'tabMain'
        }));

        //Change the page's title
        document.title = jsonData.detail.name;

        if(me.uamIp == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Fetching connection status...'
                });
                me.showConnect();   
                me.coovaRefresh();
            }else{
                me.showNotHotspot()
            }  
        }else{
            me.coovaRefresh();  //Already established we are a hotspot, simply refresh
        }

        //Check if this was perhaps the return of a payment gateway
        me.checkPaymentGwReturn();

		//Social login
		me.checkSocialLoginReturn();

        //Check if we need to start a slideshow
        me.checkForSlideshow(jsonData);

        //Test the redirect after login thing
        if(jsonData.settings.redirect_check == true){
            CoovaChilli.config.Config.setNoStatus(true);
        }else{
            CoovaChilli.config.Config.setNoStatus(false);
        }
        CoovaChilli.config.Config.setRedirectTo(jsonData.settings.redirect_url);

    },
    testForHotspot: function(){
        var me         = this;
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
                document.title = "Mobile preview";
                
            }
            return false;   //Not a hotspot
        }
        if(me.queryObj.uamip != undefined){    //Override defaults
            me.uamIp = me.queryObj.uamip;
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
    checkPaymentGwReturn: function(){
        var me = this;
        //Return as we don't do anything
        if(CoovaChilli.config.Config.getPaymentGw() == false){
            return;
        }

        if(CoovaChilli.config.Config.getPaymentGwType() == 'cntPayPal'){
      
            if(me.queryObj.tx != undefined){ //Paypal will add a tx=<transaction ID to the query string>
                //Dummy thing:
                //console.log("Finding transaction details for "+ me.queryObj.tx);
                Ext.Ajax.request({
                    url     : CoovaChilli.config.Config.getUrlPayPalVoucher(),
                    method  : 'GET',
                    params: {
                        txn_id: me.queryObj.tx
                    },
                    success : function(response){
                        var jsonData    = Ext.JSON.decode(response.responseText);
                        //console.log(jsonData);
                        if(jsonData.success){
                            me.getCntShop().down('#pnlPayPalFeedback').setData(jsonData.data);
                           // me.getLand().down('#tpnlOptions').setActiveTab('pnlShop');
                            me.getCntShop().down('#pnlPayPalFeedback').show();
                            me.getCntShop().down('#pnlPayPalError').hide();
                            
                            me.getFrmConnect().down('#inpUsername').setValue(jsonData.data.username);
                            me.getFrmConnect().down('#inpPassword').setValue(jsonData.data.password);
                        }else{
                            //console.log("big problems");
                            //me.getLand().down('#tpnlOptions').setActiveTab('pnlShop');
                            me.getCntShop().down('#pnlPayPalFeedback').hide();
                            me.getCntShop().down('#pnlPayPalError').show();
                        }      
                    },
                    scope: me
                });
                me.getTabMain().setActiveItem('#cntShop'); //Show the shop tab
            }
        }

        // --- PayU ---
        if(CoovaChilli.config.Config.getPaymentGwType() == 'frmPayU'){
            //console.log(me.queryObj.PayUReference);
            if(me.queryObj.PayUReference != undefined){ 

                Ext.Ajax.request({
                    url     : CoovaChilli.config.Config.getUrlPayUVoucher(),
                    method  : 'GET',
                    params: {
                        PayUReference: me.queryObj.PayUReference
                    },
                    success : function(response){
                        var jsonData    = Ext.JSON.decode(response.responseText);
                     //   console.log(jsonData);
                        if(jsonData.success){
                            me.getCntShop().down('#pnlPayUFeedback').setData(jsonData.data);
                            me.getCntShop().down('#pnlPayUFeedback').show();
                            me.getCntShop().down('#pnlPayUError').hide();                       
                            me.getFrmConnect().down('#inpUsername').setValue(jsonData.data.username);
                            me.getFrmConnect().down('#inpPassword').setValue(jsonData.data.password);
                        }else{
                            me.getCntShop().down('#pnlPayUFeedback').hide();
                            me.getCntShop().down('#pnlPayUError').show();
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

            me.getTabMain().setActiveItem('#cntPhotos'); //Show the slideshow

            me.slideShow = setInterval(function(){        
                var dv          = me.getDatThumb()
                var count       = dv.getStore().getCount();
                me.currentSlide = me.currentSlide +1;
                if(me.currentSlide >= count){
                    me.currentSlide =0 //Start again
                }
                var record = dv.getStore().getAt(me.currentSlide);
                dv.select(record);

                var id          = record.getId();
                me.thumbPhoto   = id;
                var aa          = me.getCntPhotos().down('#'+id); 
                me.getCntPhotos().down('#crslPhoto').setActiveItem(aa);

            },  (data.settings.seconds_per_slide * 1000));
        }
    },
    onBtnClickToConnectTap: function(b){

        var me      = this;
        var delay   = b.up('frmConnect').config.jsonData.settings.connect_delay;
        var start   = delay;

        //Check if they need to accept T&C
        if(me.getFrmConnect().down('#chkTcCheck') != null){
            if(me.getFrmConnect().down('#chkTcCheck').isChecked() == false){
                me.showLoginError('First accept T&C');
                return;
            }
        }
        if(delay > 0){
            b.setDisabled(true);
            me.connectWait = setInterval(function(){        
                me.showLoginError('Connect in '+start+' seconds');
                start = start -1;
                if(start <= 0){
                    b.setDisabled(false);
                    me.clearLoginError();
                    clearInterval(me.connectWait);
                    me.onBtnConnectTap(b,true);
                }
            },  1000);  
        }else{
            me.onBtnConnectTap(b,true);
        }
    },
    onBtnConnectTap: function(b,c_to_c){  
        var me = this;

		//Auto suffix check
		var auto_suffix_check   = b.up('frmConnect').config.jsonData.settings.auto_suffix_check;
		var auto_suffix			= b.up('frmConnect').config.jsonData.settings.auto_suffix;

    
        if(c_to_c != true){
          
			//Check if there is a username controll and it is not empty
			if(me.getFrmConnect().down('#inpUsername') != null){
				if(me.getFrmConnect().down('#inpUsername').getValue() != ''){
				    me.userName = me.getFrmConnect().down('#inpUsername').getValue();
		        	me.password = me.getFrmConnect().down('#inpPassword').getValue();
		        	me.remember = me.getFrmConnect().down('#inpRememberMe').isChecked();

					//Auto suffix for permanent users only
					if(auto_suffix_check){
						//Check if not already in username
						var re = new RegExp(".*"+auto_suffix+"$");
						if(me.userName.match(re)==null){
							me.userName = me.userName+auto_suffix;
						}
					}
				}
			}

			//Check if there is a voucher controll and it is not empty
			if(me.getFrmConnect().down('#inpVoucher') != null){
				if(me.getFrmConnect().down('#inpVoucher').getValue() != ''){
				    me.userName = me.getFrmConnect().down('#inpVoucher').getValue();
				    me.password = me.getFrmConnect().down('#inpVoucher').getValue();
					me.remember = me.getFrmConnect().down('#inpRememberMe').isChecked();
				}
			}

        }else{
            var suffix  = b.up('frmConnect').config.jsonData.settings.connect_suffix;
            me.userName = b.up('frmConnect').config.jsonData.settings.connect_username+'@'+me.queryObj[suffix]; //Makes this unique
            me.password = b.up('frmConnect').config.jsonData.settings.connect_username;
            me.remember = false;
        }

        if((me.userName.length < 1 )||(me.password.length < 1)){
            me.showLoginError('Some required values missing');
            return;
        }

        //Check if they need to accept T&C
        if(me.getFrmConnect().down('#chkTcCheck') != null){
            if(me.getFrmConnect().down('#chkTcCheck').isChecked() == false){
                me.showLoginError('First accept T&C');
                return;
            }
        }

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Connecting....'
        });

        var urlStatus = 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url: urlStatus,
            timeout: CoovaChilli.config.Config.getJsonTimeout(),
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
            timeout: CoovaChilli.config.Config.getJsonTimeout(),
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

    clearLoginError: function(){
        var me = this;
        Ext.Viewport.setMasked(false);
        var error = me.getFrmConnect().down('#lblInpErrorDisplay');
        error.hide();     //Display
        error.setData({msg:''});
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
            timeout         : CoovaChilli.config.Config.getJsonTimeout(),
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
                    me.clearLoginError();
                    me.showConnect();
                }

                if(j.clientState == 1){
                    if(CoovaChilli.config.Config.getNoStatus() == true){
                        window.location=CoovaChilli.config.Config.getRedirectTo();
                    }else{
						me.usageUsername 	= j.session.userName;
						me.usageMac 		= j.redir.macAddress;

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

			//Check if we need to fetch usage data
			if(me.jsonData.settings.usage_show_check != undefined){
				if(me.jsonData.settings.usage_show_check == true){
					me.timeUntilUsage = me.timeUntilUsage -1;
					me.getLblUsageTimer().setData({'sec' : me.timeUntilUsage});
					if(me.timeUntilUsage == 0){      //Each time we reach null we refresh the screens
		                me.timeUntilUsage = me.usageInterval; //Start anew
		                //console.log("Fetch usage pappie");
						me.fetchUsage();
		            }
				}
			}

            if(me.getCntStatus().isHidden()){    //We remove ourself gracefully
                clearInterval(me.counter);
                me.counter   = undefined;
                me.timeUntilStatus = me.refreshInterval;
				me.timeUntilUsage  = me.usageInterval;
            }else{
                me.getLblStatusTimer().setData({'sec' : me.timeUntilStatus});
                if(me.timeUntilStatus == 0){      //Each time we reach null we refresh the screens
                    me.timeUntilStatus = me.refreshInterval; //Start anew
                    me.coovaRefresh();
                }
            }
        }, 1000 );
    },
	fetchUsage: function(){
        var me = this;  
        Ext.Ajax.request({
            url     : CoovaChilli.config.Config.getUrlUsage(),
            method  : 'GET',
			params	: {
                username: me.usageUsername,
                mac		: me.usageMac
            },
            success : function(response){
                var jsonD    = Ext.JSON.decode(response.responseText);
                if(jsonD.success){
					me.refreshUsage(jsonD.data);
                }      
            },
            scope: me
        });
    },
	refreshUsage:  function(data){
		var me 		= this;			
		//Data related
		var dUsed 	= 'N/A';
		var dAvail  = 'N/A';

		var tUsed 	= 'N/A';
		var tAvail  = 'N/A';

		if(	(data.data_used != null)&&
			(data.data_cap  != null)
		){
			var dUsed 	= me.bytes(data.data_used);
			var dAvail	= me.bytes((data.data_cap-data.data_used));
		}

		//Time related
		if(	(data.time_used != null)&&
			(data.time_cap  != null)
		){
			var tUsed 	= me.time(data.time_used);
			var tAvail	= me.time((data.time_cap-data.time_used));	
		}

		me.getCntUsage().setData(
			{
				data_used 	: dUsed,
				data_avail	: dAvail,
				time_used	: tUsed,
				time_avail	: tAvail
			}
		);
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
            timeout: CoovaChilli.config.Config.getJsonTimeout(),
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
	onBtnViewTCTap: function(button){
		var me = this;
		window.open(me.jsonData.settings.t_c_url, '_blank');	
	},
	onActiveItemChange : function(tabpanel){
		var me 		= this;
		var active	= tabpanel.getActiveItem();
		var s		= tabpanel.up('cntStatus');
		
		var lu		= s.down('#lblUsageTimer');
		var ls		= s.down('#lblStatusTimer');
		var itemId  = active.getItemId();

		if(itemId == 'sessionTab'){
			ls.setHidden(true);
			lu.setHidden(false);
		}

		if(itemId == 'usageTab'){
			ls.setHidden(false);
			lu.setHidden(true);
		}
	},
    //-------PAYU start------------
    onBtnPayUTap: function(button){
        var me      = this;
        var form    = button.up('formpanel');
        var firstName = form.down('#firstName').getValue();
        var lastName  = form.down('#lastName').getValue();
        var email     = form.down('#email').getValue();
        var mobile    = form.down('#mobile').getValue();

        if((firstName.length < 2 )||(lastName.length < 2)||(email.length < 4)||(mobile.length < 10)){
            me.showPayUError('Some required values missing or wrong');
            return;
        }

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Redirecting to payment gateway ...'
        });

        
        var nasid       = me.queryObj.nasid;
        var uamport     = me.queryObj.uamport;
        var uamip       = me.queryObj.uamip;
        var ssid        = me.queryObj.ssid;
        var pathname    = window.location.pathname;
        var hostname    = window.location.hostname;
        var protocol    = window.location.protocol;

        var url = '/cake2/rd_cake/fin_pay_u_transactions/submit_transaction?nasid='+nasid+
            "&uamport="+uamport+"&uamip="+uamip+
            "&ssid="+ssid+"&pathname="+pathname+
            "&hostname="+hostname+"&protocol="+protocol;

        form.submit({
            method  : 'POST',
            url     : url,
            target  :'_self'
        });
    },

    showPayUError: function(msg){
        var me = this;
        ///Ext.getBody().unmask();
        Ext.Viewport.setMasked(false);
        var error = me.getCntShop().down('#lblPayUErrorDisplay');
        error.show();     //Display
        error.setData({msg:msg});
    },

    clearPayUError: function(){
        var me = this;
        Ext.Viewport.setMasked(false);
        var error = me.getFrmConnect().down('#lblPayUErrorDisplay');
        error.hide();     //Display
        error.setData({msg:''});
    },



    //--------- PAYU end ----------


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
    },
	//New user registation
	onNavBtnNextTap	: function(btn){
		var me 			= this;
		var view		= btn.up('navNewUser');
		
		var activeId	= view.getActiveItem().getItemId();
		//console.log(activeId);
		if(activeId == 'pnlUsrRegIntro'){	
			var mac = me.queryObj.mac;
			view.push({
				title	: 'Supply detail',
			    xtype	: 'frmNewUser',
				itemId	: 'frmNewUser',
				mac		: mac
			});	
		}

		if(activeId == 'frmNewUser'){	
			//console.log("Now we need to do some error checking");
			var errorString 	= '';
			var form 			= view.down('formpanel');
			var fields 			= form.query("field");

			// remove the style class from all fields
		   	for (var i=0; i<fields.length; i++) {
				fields[i].removeCls('invalidField');
		   	}
		 
			// dump form fields into new model instance
			var model 			= Ext.create("CoovaChilli.model.mNewUser", form.getValues());
		 
			// validate form fields
			var errors = model.validate();
		 
			if (!errors.isValid()) {
			  	// loop through validation errors and generate a message to the user
			  	errors.each(function (errorObj){
					errorString += errorObj.getField() + ": " + errorObj.getMessage() + " <br>";
					var s = Ext.String.format('field[name={0}]',errorObj.getField());
					form.down(s).addCls('invalidField');
			  	});
			  	Ext.Msg.alert('Errors in your input',errorString);
			 } else {
		  		//Ext.Msg.alert("Data is valid","Success");
				// Validation successful - show loader
                view.down('formpanel').setMasked({
                    xtype:'loadmask',
                    message:'Registring user'
                });
                view.down('formpanel').submit({
                    url		: CoovaChilli.config.Config.getUrlAdd(),
                    method	: 'POST',
                    success	: function(f, result) {
						//console.log("Pass");
                        view.down('formpanel').setMasked(false);
						view.push({
							title	: 'Result',
							itemId	: 'pnlEnd',
							html	: "<h1>Thank you!</h1>"+
									  "Thank you for registring with us<br>"+
									  "Your username and password are already populated,"+
									  " simply click the <b>Connect</b> button to start using the Internet.",
							styleHtmlContent : true,
							styleHtmlCls: 'regHtml'
						});
						var navigationBar = view.getNavigationBar();
						navigationBar.query('button')[0].hide();
						//populate the usernam and password fields
						var frmC = me.getFrmConnect();
						frmC.down('#inpUsername').setValue(result.data.username);
						frmC.down('#inpPassword').setValue(result.data.password);
                    },
                    failure: function(f, result) {
						Ext.iterate(result.errors, function(key, value) {
							errorString += key + ": " + value + " <br>";
							var s = Ext.String.format('field[name={0}]',key);
							form.down(s).addCls('invalidField');
			  			});
						view.down('formpanel').setMasked(false);
			  			Ext.Msg.alert('Failed to register',errorString);     
                    }                       
                });
			 }
		}

		if(activeId == 'pnlEnd'){
			view.pop(2); //Remove the last two screens; ending with screen one
		}
	},
	//Lost password
	onLpNavBtnNextTap	: function(btn){
		var me 			= this;
		var view		= btn.up('navLostPassword');
		
		var activeId	= view.getActiveItem().getItemId();
		//console.log(activeId);
		if(activeId == 'pnlUsrRegIntro'){	
			view.push({
				title	: 'Supply detail',
			    xtype	: 'frmLostPassword',
				itemId	: 'frmLostPassword'
			});	
		}

		if(activeId == 'frmLostPassword'){	
			var errorString 	= '';
			var form 			= view.down('formpanel');
			var fields 			= form.query("field");

			// remove the style class from all fields
		   	for (var i=0; i<fields.length; i++) {
				fields[i].removeCls('invalidField');
		   	}
		 
			// dump form fields into new model instance
			var model 			= Ext.create("CoovaChilli.model.mLostPassword", form.getValues());
		 
			// validate form fields
			var errors = model.validate();
		 
			if (!errors.isValid()) {
			  	// loop through validation errors and generate a message to the user
			  	errors.each(function (errorObj){
					errorString += errorObj.getField() + ": " + errorObj.getMessage() + " <br>";
					var s = Ext.String.format('field[name={0}]',errorObj.getField());
					form.down(s).addCls('invalidField');
			  	});
			  	Ext.Msg.alert('Errors in your input',errorString);
			 } else {
		  		//Ext.Msg.alert("Data is valid","Success");
				// Validation successful - show loader
                view.down('formpanel').setMasked({
                    xtype:'loadmask',
                    message:'Submitting data...'
                });
                view.down('formpanel').submit({
                    url		: CoovaChilli.config.Config.getUrlLostPw(),
                    method	: 'POST',
                    success	: function(f, result) {
						//console.log("Pass");
                        view.down('formpanel').setMasked(false);
						view.push({
							title	: 'Result',
							itemId	: 'pnlEnd',
							html	: "<h1>Check your email!</h1>"+
									  "Your credentials has been emailed to you<br>",
							styleHtmlContent : true,
							styleHtmlCls: 'regHtml'
						});
						var navigationBar = view.getNavigationBar();
						navigationBar.query('button')[0].hide();
                    },
                    failure: function(f, result) {
						Ext.iterate(result.errors, function(key, value) {
							errorString += key + ": " + value + " <br>";
							var s = Ext.String.format('field[name={0}]',key);
							form.down(s).addCls('invalidField');
			  			});
						view.down('formpanel').setMasked(false);
			  			Ext.Msg.alert('Failed to send email',errorString);     
                    }                       
                });
			 }
		}

		if(activeId == 'pnlEnd'){
			view.pop(2); //Remove the last two screens; ending with screen one
		}
	},

	//========== Social Login =======
	socialButtonClicked: function(b){
		var me 				= this;
		me.SocialName 		= b.getItemId().toLowerCase();
        var urlStatus 		= 'http://'+me.uamIp+':'+me.uamPort+'/json/status';

		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Starting social login for '+me.SocialName
        });

        Ext.data.JsonP.request({
            url			: urlStatus,
            timeout		: CoovaChilli.config.Config.getJsonTimeout(),
            callbackKey	: 'callback',
            success: function(j){
                me.currentRetry = 0;
				Ext.Viewport.setMasked(false);
                if(j.clientState == 0){
					me.userName = b.up('frmConnect').config.jsonData.settings.social_login.temp_username; //Makes this unique
        			me.password = b.up('frmConnect').config.jsonData.settings.social_login.temp_password;  
                    me.socialTempEncPwd(j.challenge);
                }
                if(j.clientState == 1){
                    if(CoovaChilli.config.Config.getNoStatus() == true){
                        window.location=CoovaChilli.config.Config.getRedirectTo();
                    }else{              
                        me.coovaRefresh(); //Refresh 
                    }
                }           
            },
            failure: function(){
				Ext.Viewport.setMasked(false);
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                  //  console.log("Before login - Retry to fetch Coova status "+me.currentRetry);
                    me.socialButtonClicked();
                }else{
                    me.showLoginError('Could not fetch coova status');
                }
            },
            scope: me 
        });
    },
    socialTempEncPwd: function(challenge){
		var me = this;
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Encrypting password for temp connection'
        });
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
				Ext.Viewport.setMasked(false);
                me.socialTempLogin(j.response);
            },
            failure: function(){
               // console.log("UAM service is down");
				Ext.Viewport.setMasked(false);
                me.showLoginError("UAM service is down"); 
            },
            scope: me 
        });
    },
    socialTempLogin:  function(encPwd){
        var me = this;
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Trying temp connection'
        });
        var urlLogin = 'http://'+me.uamIp+':'+me.uamPort+'/json/logon';
        Ext.data.JsonP.request({
            url: urlLogin,
            timeout: CoovaChilli.config.Config.getJsonTimeout(),
            callbackKey: 'callback',
            params: {
                username: me.userName,
                password: encPwd
            },
            success: me.socialTempLoginResults,           
            failure: function(){
				Ext.Viewport.setMasked(false);
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                  //  console.log("Retry to log in "+me.currentRetry);
                    me.socialTempLogin(encPwd);
                }else{
                    me.showLoginError("Coova login service is down");
                }
            },
            scope: me 
        });
    },
    socialTempLoginResults : function(j){
        var me = this;
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Checking feedback results'
        });

        me.currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){    
            var msg = 'Temp Social Login user failed authentication'
            if(j.message != undefined){
                msg =j.message;
            }
			Ext.Viewport.setMasked(false);
            me.showLoginError(msg);
        }else{
            //console.log("Temp social login user logged in fine.... time to check if we are authenticated");
			//We need to add a query string but do not need to add ALL the items
			var keys 		= Ext.Object.getKeys(me.queryObj);
			var required 	= {}; //Empty object
			Ext.Array.forEach(keys,function(item,count,items){
				if(Ext.Array.contains(me.notRequired, item) == false){
					required[item] = me.queryObj[item];
				} 
			});
			required.pathname   	= window.location.pathname;
            required.hostname   	= window.location.hostname;
            required.protocol   	= window.location.protocol;
			required.social_login 	= 1;
			var q_s 				= Ext.Object.toQueryString(required);
			//console.log(q_s);
			//Dynamically build the redirect URL to which Social Login we will use...
			window.location=CoovaChilli.config.Config.getUrlSocialBase()+me.SocialName+"?"+q_s;
			//window.location="http://rd01.wificity.asia/cake2/rd_cake/auth/facebook?"+q_s;
        }
    },
	checkSocialLoginReturn: function(){
		var me = this;
       	if(	(me.queryObj.sl_type 	!= undefined)&& //e.g. user or voucher
			(me.queryObj.sl_name 	!= undefined)&& //e.g. Facebook
			(me.queryObj.sl_value 	!= undefined)   //e.g. 3_34564654645694 (Dynamic Pages ID + provider unique ID)
		){ 
			//console.log("Finding transaction details for "+ me.queryObj.tx);
			Ext.Ajax.request({
				url     : CoovaChilli.config.Config.getUrlSocialInfoFor(),
				method  : 'GET',
				params: {
					sl_type		: me.queryObj.sl_type,
					sl_name		: me.queryObj.sl_name,
					sl_value	: me.queryObj.sl_value
				},
				success : function(response){
					var jsonData    = Ext.JSON.decode(response.responseText);

					if(jsonData.success){   
						me.userName = jsonData.data.username; //Makes this unique
						me.password = jsonData.data.password;   
						//console.log(jsonData.data.username);
						//console.log(jsonData.data.password);
						me.socialTempDisconnect();
					}else{
						//console.log("big problems");
					}       
				},
				scope: me
			});
        }
	},
	socialTempDisconnect: function(){
        var me = this;
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Disconnecting temp user'
        });

        var urlLogoff = 'http://'+me.uamIp+':'+me.uamPort+'/json/logoff';
        Ext.data.JsonP.request({
            url: urlLogoff,
            timeout: CoovaChilli.config.Config.getJsonTimeout(),
            callbackKey: 'callback',
            success: function (){
                me.currentRetry = 0;
				//console.log("Disconnected well - now connect with the final userzzz");
				Ext.Viewport.setMasked(false);
				me.socialFinalSatus();
            },           
            failure: function(){
				Ext.Viewport.setMasked(false);
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                    me.socialTempDisconnect();
                }else{
                    me.showLoginError("Failed to disconnect");
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
	socialFinalSatus: function(){
		var me 				= this;
        var urlStatus 		= 'http://'+me.uamIp+':'+me.uamPort+'/json/status';
        Ext.data.JsonP.request({
            url			: urlStatus,
            timeout		: CoovaChilli.config.Config.getJsonTimeout(),
            callbackKey	: 'callback',
            success: function(j){
                me.currentRetry = 0;
				Ext.Viewport.setMasked(false);
                if(j.clientState == 0){
                    me.socialFinalEncPwd(j.challenge);
                }
                if(j.clientState == 1){
                    if(CoovaChilli.config.Config.getNoStatus() == true){
                        window.location=CoovaChilli.config.Config.getRedirectTo();
                    }else{              
                        me.coovaRefresh(); //Refresh 
                    }
                }           
            },
            failure: function(){
				Ext.Viewport.setMasked(false);
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                  //  console.log("Before login - Retry to fetch Coova status "+me.currentRetry);
                    me.socialFinalSatus();
                }else{
                    me.showLoginError('Could not fetch coova status');
                }
            },
            scope: me 
        });
    },
	socialFinalEncPwd: function(challenge){

        var me = this;
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Encrypting final password'
        });
        //In order to prevent the cleartext password to traverse the line; we to a JSONP https call

        Ext.data.JsonP.request({
            url: CoovaChilli.config.Config.getUrlUam(), //This needs to be https!
            callbackKey: 'callback',
            params: {
                challenge: challenge,
                password: me.password
            },
            success: function(j){
				Ext.Viewport.setMasked(false);
                me.socialFinalLogin(j.response);
            },
            failure: function(){
               // console.log("UAM service is down");
				Ext.Viewport.setMasked(false);
                me.showLoginError("UAM service is down"); 
            },
            scope: me 
        });
    },
    socialFinalLogin:  function(encPwd){
        var me = this;
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Doing final login'
        });
        var urlLogin = 'http://'+me.uamIp+':'+me.uamPort+'/json/logon';
        Ext.data.JsonP.request({
            url: urlLogin,
            timeout: CoovaChilli.config.Config.getJsonTimeout(),
            callbackKey: 'callback',
            params: {
                username: me.userName,
                password: encPwd
            },
            success: me.socialFinalLoginResults,           
            failure: function(){
				Ext.Viewport.setMasked(false);
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                  //  console.log("Retry to log in "+me.currentRetry);
                    me.socialFinalLogin(encPwd);
                }else{
                    me.showLoginError("Coova login service is down");
                }
            },
            scope: me 
        });
    },
    socialFinalLoginResults : function(j){
        var me = this;
		Ext.Viewport.setMasked(false);
        me.currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){    
            var msg = 'Temp Social Login user failed authentication'
            if(j.message != undefined){
                msg =j.message;
            }
			me.showConnect();
            me.showLoginError(msg);
        }else{
			if(CoovaChilli.config.Config.getNoStatus() == true){
                window.location=CoovaChilli.config.Config.getRedirectTo();
            }else{              
                me.coovaRefresh(); //Refresh 
            }
        }
    }
});
