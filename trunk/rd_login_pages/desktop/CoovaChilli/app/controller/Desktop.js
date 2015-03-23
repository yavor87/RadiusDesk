Ext.define('CoovaChilli.controller.Desktop', {
    extend      : 'Ext.app.Controller',
    requires    : ['Ext.data.JsonP','Ext.util.Cookies'],
    views       : [
        'Land'
    ],
    stores  : ['sPrices'],
    models  : ['mPrice' ],
    refs: [
        { ref: 'vp',        selector: '',               xtype: 'vp',        autoCreate: true},
        { ref: 'land',      selector: 'land',           xtype: ''},        
        { ref: 'connect',   selector: 'pnlConnect',     xtype: '' },     //Connect panel
        { ref: 'status',    selector: 'pnlStatus',      xtype: '' },     //Status panel (mutually exclusive with connect panel)
        { ref: 'notHotspot',selector: 'pnlNotHotspot',  xtype: '' },      //Not a hotspot panel
        { ref: 'frmPayU',   selector: '#frmPayU',       xtype: '' },      //Not a hotspot panel
        { ref: 'datThumb',  selector: '#datThumb',      xtype: '' }      //Thumb view
    ],
   

    //---
    uamIp           : undefined,   //ip of coova hotspot
    uamPort         : undefined, //port of coova hotspot

    counter         : undefined, //refresh counter's id
    timeUntilStatus : 20, //interval to refresh
    refreshInterval : 20, //ditto

	timeUntilUsage 	: 60, //defaults
    usageInterval 	: 60, //ditto
	usageUsername 	: undefined,
	usageMac 		: undefined,
	jsonData		: undefined,

    sessionData     : undefined,

    retryCount      : 10, //Make it high to start with --- sometimes it really takes long! //FIXME
    currentRetry    : 0,

    userName        : undefined,
    password        : undefined,
    remember        : false,

    queryObj        : undefined,

    currentSlide    : 0,

	notRequired		: [ 'q', 'res',	'challenge', 'called', 'mac', 'ip', 'sessionid', 'userurl', 'md'],

    //--- 

    //Payment gateway
    //paymentGw       : true,
    paymentGw       : false,
    //paymentGwType   : 'pnlPayPal',
    paymentGwType   : 'pnlPayAd',
    //paymentGwType   : 'pnlPayU',

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
            },
            'pnlConnect #btnClickToConnect' : {
                click: me.onBtnClickToConnect
            },
			'pnlConnect #tabUser' : {
                activate: me.onTabUserActivate
            },
			'pnlConnect #tabVoucher' : {
                activate: me.onTabVoucherActivate
            },

			//==== NEW USER REGISTRATION ===

			'pnlConnect #btnNewUser' : {
				click: me.onBtnNewUserClick		
			},
			'winNewUser #btnIntroNext'	: {
				click: me.onBtnIntroNextClick
			},
			'winNewUser #btnDetailBack'	: {
				click: me.onBtnDetailBackClick
			},
			'winNewUser #btnDetailNext'	: {
				click: me.onBtnDetailNextClick
			},
			'winNewUser #btnLastNext'	: {
				click:	function(b){
					b.up('window').close();
				}
			},
			
			//=== LOST Password ===

			'pnlConnect #btnLostPassword' : {
				click: me.onBtnLostPasswordClick		
			},
			'winLostPassword #btnIntroNext'	: {
				click: me.onBtnLpIntroNextClick
			},
			'winLostPassword #btnDetailBack'	: {
				click: me.onBtnLpDetailBackClick
			},
			'winLostPassword #btnDetailNext'	: {
				click: me.onBtnLpDetailNextClick
			},
			'winLostPassword #btnLastNext'	: {
				click:	function(b){
					b.up('window').close();
				}
			},

			//=== Social Login ==
			'pnlConnect	[type="socialButton"]' : {
				click:	me.socialButtonClicked
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
        var url         = record.get('url');
        img.setSrc(file_name);
        ph.update({title: title, description: description,url: url});
    },
    buyVoucher:     function(button){
        var me = this;
        var clean_location = window.location.href;
        var form = button.up('form');
        form.setLoading('Redirecting to payment gateway ...');
       // clean_location     = clean_location.replace(/&pay_u_=.*/, ""); //Remove the PayU part of the query string else it keeps on adding up!
       // console.log(clean_location);
        if(me.queryObj.nasid != undefined){  //Override defaults
           // console.log("Submit form with nasid");
            me.getFrmPayU().submit({
                target:'_self',
                params:{
                    nasid       : me.queryObj.nasid,
                    uamport     : me.queryObj.uamport,
                    uamip       : me.queryObj.uamip,
                    ssid        : me.queryObj.ssid,
                    pathname    : window.location.pathname,
                    hostname    : window.location.hostname,
                    protocol    : window.location.protocol
                }
            });
      
        }else{
           // console.log("Submit form withOUT nasid");
            me.getFrmPayU().submit(
                {
                    target      :'_self',
                     params:{
                        nasid       : me.queryObj.nasid,
                        uamport     : me.queryObj.uamport,
                        uamip       : me.queryObj.uamip,
                        ssid        : me.queryObj.ssid,
                        pathname    : window.location.pathname,
                        hostname    : window.location.hostname,
                        protocol    : window.location.protocol
                    }
                });  
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
					me.jsonData = jsonData.data;
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

		//Set interval if specified
		if(me.jsonData.settings.usage_show_check != undefined){
			if(me.jsonData.settings.usage_show_check == true){
				me.timeUntilUsage 	= me.jsonData.settings.usage_refresh_interval;
    			me.usageInterval 	= me.jsonData.settings.usage_refresh_interval;
			}
		}

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

		//Social login
		me.checkSocialLoginReturn();
        
        //Check if we need to start a slideshow
        me.checkForSlideshow(data);

        //Test the redirect after login thing
        if(data.settings.redirect_check == true){
            me.application.config.noStatus = true;
        }else{
            me.application.config.noStatus = false;
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
       // console.log(me.paymentGwType);

        //--- PayPal ---
        if(me.paymentGwType == 'pnlPayPal'){
            //console.log(me.queryObj.tx);
            if(me.queryObj.tx != undefined){ //Paypal will add a tx=<transaction ID to the query string>
                //Dummy thing:
               // console.log("Finding transaction details for "+ me.queryObj.tx);
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
            url			: urlStatus,
            timeout		: me.application.config.jsonTimeout,
            callbackKey	: 'callback',
            success		: function(j){
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
        var me 		= this; 
        me.counter  = setInterval (function(){
            me.timeUntilStatus = me.timeUntilStatus-1;
			//Check if we need to fetch usage data
			if(me.jsonData.settings.usage_show_check != undefined){
				if(me.jsonData.settings.usage_show_check == true){
					var uM = me.getStatus().down('#refreshUsageMessage');
					if(uM != undefined){
						me.timeUntilUsage = me.timeUntilUsage -1;
                		uM.setText('Refresh in <span style="color:blue;">'+ me.timeUntilUsage + '</span> seconds');
					}
					if(me.timeUntilUsage == 0){      //Each time we reach null we refresh the screens
		                me.timeUntilUsage = me.usageInterval; //Start anew
						me.fetchUsage();
		            }
				}
			}

            if(me.getStatus().isHidden()){    //We remove ourself gracefully
                clearInterval(me.counter);
                me.counter   = undefined;
                me.timeUntilStatus = me.refreshInterval;
				me.timeUntilUsage  = me.usageInterval;
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
	fetchUsage: function(){
        var me = this;  
        Ext.Ajax.request({
            url     : me.application.config.urlUsage,
            method  : 'GET',
			params: {
                username: me.usageUsername,
                mac		: me.usageMac
            },
            success : function(response){
                var jsonD    = Ext.JSON.decode(response.responseText);
                if(jsonD.success){
					//console.log(jsonD);
					me.refreshUsage(jsonD.data);
                }      
            },
            scope: me
        });
    },
	refreshUsage:  function(data){
		var me 		= this;		
		var pData	= me.getStatus().down('#pData');
		var pbData	= me.getStatus().down('#pbData');
		var pTime	= me.getStatus().down('#pTime');
		var pbTime	= me.getStatus().down('#pbTime');

		//Data related
		if(	(data.data_used != null)&&
			(data.data_cap  != null)
		){
			var dUsed 	= me.bytes(data.data_used);
			var dAvail	= me.bytes((data.data_cap-data.data_used));
			var dPerc	= data.data_used / data.data_cap;
			var dText   = (dPerc * 100).toFixed(1)+'%';
			pData.update({dUsed: dUsed, dAvail: dAvail});
			pbData.updateProgress(dPerc,dText);
		}else{
			if(pData.isVisible()){
				pData.setVisible(false);
				pbData.setVisible(false);
			}
		}

		//Time related
		if(	(data.time_used != null)&&
			(data.time_cap  != null)
		){
			var tUsed 	= me.time(data.time_used);
			var tAvail	= me.time((data.time_cap-data.time_used));
			var tPerc	= data.time_used / data.time_cap;
			var tText   = (tPerc * 100).toFixed(1)+'%';
			pTime.update({tUsed: tUsed, tAvail: tAvail});
			pbTime.updateProgress(tPerc,tText);
		}else{
			if(pTime.isVisible()){
				pTime.setVisible(false);
				pbTime.setVisible(false);
			}
		}
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
	onTabUserActivate: function(tab){
		var me = this;
		var form = tab.up('form');
		var un = form.down('#inpUsername');
		var pw = form.down('#inpPassword');
		var v  = form.down('#inpVoucher');
		un.setDisabled(false);
		pw.setDisabled(false);
		v.setValue('');
		v.setDisabled(true);
	},
	onTabVoucherActivate: function(tab){
		var me = this;
		var form = tab.up('form');
		var un = form.down('#inpUsername');
		var pw = form.down('#inpPassword');
		var v  = form.down('#inpVoucher');
		un.setValue('');
		pw.setValue('');
		un.setDisabled(true);
		pw.setDisabled(true);
		v.setDisabled(false);
	},
    onBtnConnectClick: function(b,c_to_c){  //Get the latest challenge and continue from there onwards.... c_to_c = click to connect
        var me = this;

        //Check if they need to accept T&C
        if(b.up('pnlConnect').down('#chkTcCheck').isHidden() == false){
            if(b.up('pnlConnect').down('#chkTcCheck').getValue() == false){
                me.showLoginError('First accept T&C');
                return;
            }
        }

		//Auto suffix check
		var auto_suffix_check   = b.up('pnlConnect').jsonData.settings.auto_suffix_check;
		var auto_suffix			= b.up('pnlConnect').jsonData.settings.auto_suffix;

        //Set a body mask telling the people we are connecting 
        b.up('pnlConnect').setLoading('Connecting....');

        //Set the username and password properties of this object to the values supplied
        if(c_to_c != true){
			//Check if there is a username controll and it is not empty
			if((me.getConnect().down('#inpUsername') != undefined)&&
			(me.getConnect().down('#inpUsername').getValue() != '')
			){
		        me.userName = me.getConnect().down('#inpUsername').getValue();
		        me.password = me.getConnect().down('#inpPassword').getValue();
				me.remember = me.getConnect().down('#inpRememberMe').getValue(); //This should always be there

				//Auto suffix for permanent users only
				if(auto_suffix_check){
					//Check if not already in username
					var re = new RegExp(".*"+auto_suffix+"$");
					if(me.userName.match(re)==null){
						me.userName = me.userName+auto_suffix;
					}
				}
			}

			//Check if there is a voucher controll and it is not empty
			if((me.getConnect().down('#inpVoucher') != undefined)&&
			(me.getConnect().down('#inpVoucher').getValue() != '')
			){
		        me.userName = me.getConnect().down('#inpVoucher').getValue();
		        me.password = me.getConnect().down('#inpVoucher').getValue();
				me.remember = me.getConnect().down('#inpRememberMe').getValue(); //This should always be there
			}
		   	
        }else{
            var suffix  = b.up('pnlConnect').jsonData.settings.connect_suffix;
            me.userName = b.up('pnlConnect').jsonData.settings.connect_username+'@'+me.queryObj[suffix]; //Makes this unique
            me.password = b.up('pnlConnect').jsonData.settings.connect_username;
            me.remember = false;
        }

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
    },

	//=========== NEW USER REG ============
	onBtnNewUserClick : function(){
		var me 	= this;
		//We get the MAC Addy of the device to prevent users double registring
		var mac = me.queryObj.mac;

		var c = Ext.ComponentQuery.query('#winNewUser');
		if(Ext.isEmpty(c)){
			Ext.create('CoovaChilli.view.winNewUser', { glyph: CoovaChilli.config.icnAdd,	id: 'winNewUser',mac:mac}).show();
		}
	},
	onBtnIntroNextClick	: function(b){
		var me 		= this;
		var win		= b.up('window');
		win.getLayout().setActiveItem('scrnDetail');		
	},
	onBtnDetailBackClick: function(b){
		var me 		= this;
		var win		= b.up('window');
		win.getLayout().setActiveItem('scrnIntro');		
	},
	onBtnDetailNextClick: function(b){
		var me 		= this;
		var win		= b.up('window');
		var form    = win.down('form');
		form.setLoading('Registring new user...');
        form.submit({
            clientValidation	: true,
            url					: me.application.config.urlAdd,
            success				: function(f, action) {
				var un = me.getConnect().down('#inpUsername');
				var pw = me.getConnect().down('#inpPassword');
				un.setValue(action.result.data.username);
				pw.setValue(action.result.data.password);
				f.reset();
				form.setLoading(false);
				win.getLayout().setActiveItem('scrnEnd');
            },
            failure				: function(f,action){
				form.setLoading(false);
            }
        });
	},
	//=== End New user REG======


	//=========== LOST PASSWORD ============
	onBtnLostPasswordClick : function(){
		
		var c = Ext.ComponentQuery.query('#winLostPassword');
		if(Ext.isEmpty(c)){
			Ext.create('CoovaChilli.view.winLostPassword', { glyph: CoovaChilli.config.icnLock,	id: 'winLostPassword'}).show();
		}
	},
	onBtnLpIntroNextClick	: function(b){
		var me 		= this;
		var win		= b.up('window');
		win.getLayout().setActiveItem('scrnDetail');		
	},
	onBtnLpDetailBackClick: function(b){
		var me 		= this;
		var win		= b.up('window');
		win.getLayout().setActiveItem('scrnIntro');		
	},
	onBtnLpDetailNextClick: function(b){
		var me 		= this;
		var win		= b.up('window');
		var form    = win.down('form');
		form.setLoading('Submitting request...');
        form.submit({
            clientValidation	: true,
            url					: me.application.config.urlLostPw,
            success				: function(f, action) {
				f.reset();
				form.setLoading(false);
				win.getLayout().setActiveItem('scrnEnd');
            },
            failure				: function(f,action){
				form.setLoading(false);
            }
        });
	},

	//========== Social Login =======
	socialButtonClicked: function(b){
		var me 				= this;
		me.SocialName 		= b.getItemId().toLowerCase();
        var urlStatus 		= 'http://'+me.uamIp+':'+me.uamPort+'/json/status';

		me.getConnect().setLoading('Starting social login for '+me.SocialName);

        Ext.data.JsonP.request({
            url			: urlStatus,
            timeout		: me.application.config.jsonTimeout,
            callbackKey	: 'callback',
            success: function(j){
                me.currentRetry = 0;
				me.getConnect().setLoading();
                if(j.clientState == 0){
					me.userName = b.up('pnlConnect').jsonData.settings.social_login.temp_username; //Makes this unique
        			me.password = b.up('pnlConnect').jsonData.settings.social_login.temp_password;  
                    me.socialTempEncPwd(j.challenge);
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
				me.getConnect().setLoading();
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
		me.getConnect().setLoading('Encrypting password for temp connection'); 
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
				me.getConnect().setLoading();
                me.socialTempLogin(j.response);
            },
            failure: function(){
               // console.log("UAM service is down");
				me.getConnect().setLoading();
                me.showLoginError("UAM service is down"); 
            },
            scope: me 
        });
    },
    socialTempLogin:  function(encPwd){
        var me = this;
		me.getConnect().setLoading('Trying temp connection');
        var urlLogin = 'http://'+me.uamIp+':'+me.uamPort+'/json/logon';
        Ext.data.JsonP.request({
            url: urlLogin,
            timeout: me.application.config.jsonTimeout,
            callbackKey: 'callback',
            params: {
                username: me.userName,
                password: encPwd
            },
            success: me.socialTempLoginResults,           
            failure: function(){
				me.getConnect().setLoading();
                //We will retry for me.retryCount
				me.getConnect().setLoading();
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

		me.getConnect().setLoading('Checking feedback results');

        me.currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){    
            var msg = 'Temp Social Login user failed authentication'
            if(j.message != undefined){
                msg =j.message;
            }
			me.getConnect().setLoading();
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
			window.location=me.application.config.urlSocialBase+me.SocialName+"?"+q_s;
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
				url     : me.application.config.urlSocialInfoFor,
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
		me.getConnect().setLoading('Disconnecting temp user');
        var urlLogoff = 'http://'+me.uamIp+':'+me.uamPort+'/json/logoff';
        Ext.data.JsonP.request({
            url: urlLogoff,
            timeout: me.application.config.jsonTimeout,
            callbackKey: 'callback',
            success: function (){
                me.currentRetry = 0;
				//console.log("Disconnected well - now connect with the final userzzz");
				me.getConnect().setLoading();
				me.socialFinalSatus();
            },           
            failure: function(){
				me.getConnect().setLoading();
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
            timeout		: me.application.config.jsonTimeout,
            callbackKey	: 'callback',
            success: function(j){
                me.currentRetry = 0;
				me.getConnect().setLoading();
                if(j.clientState == 0){
                    me.socialFinalEncPwd(j.challenge);
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
				me.getConnect().setLoading();
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
		me.getConnect().setLoading('Encrypting final password');
        //In order to prevent the cleartext password to traverse the line; we to a JSONP https call

        Ext.data.JsonP.request({
            url: me.application.config.urlUam, //This needs to be https!
            callbackKey: 'callback',
            params: {
                challenge: challenge,
                password: me.password
            },
            success: function(j){
				me.getConnect().setLoading();
                me.socialFinalLogin(j.response);
            },
            failure: function(){
               // console.log("UAM service is down");
				me.getConnect().setLoading();
                me.showLoginError("UAM service is down"); 
            },
            scope: me 
        });
    },
    socialFinalLogin:  function(encPwd){
        var me = this;
		me.getConnect().setLoading('Doing final login');
        var urlLogin = 'http://'+me.uamIp+':'+me.uamPort+'/json/logon';
        Ext.data.JsonP.request({
            url: urlLogin,
            timeout: me.application.config.jsonTimeout,
            callbackKey: 'callback',
            params: {
                username: me.userName,
                password: encPwd
            },
            success: me.socialFinalLoginResults,           
            failure: function(){
				me.getConnect().setLoading();
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
		me.getConnect().setLoading();
        me.currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){    
            var msg = 'Temp Social Login user failed authentication'
            if(j.message != undefined){
                msg =j.message;
            }
			me.showConnect();
            me.showLoginError(msg);
        }else{
			if(me.application.config.noStatus == true){
                window.location=me.application.config.redirectTo;
            }else{              
                me.coovaRefresh(); //Refresh 
            }
        }
    }
});
