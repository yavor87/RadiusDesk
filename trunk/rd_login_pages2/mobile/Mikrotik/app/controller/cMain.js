Ext.define('Mikrotik.controller.cMain', {
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
    uamIp       : undefined,   //ip of mt hotspot
    uamPort     : undefined, //port of mt hotspot

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

    //MT
    mtServer        : undefined,
    queryObj        : undefined,

    mac_username    : undefined,
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        var me = this;

        //?q=/cake2/rd_cake/webroot/dynamic_details/mikrotik_browser_detect/
        //&loginlink=http://10.5.50.1/login&nasid=dirk_test&ssid=dirk_test&type=mikrotik&
        //link_status=http://10.5.50.1/status&link_login_only=http://10.5.50.1/login&link_logout=http://10.5.50.1/logout&

        Ext.Ajax.request({
            url     : Mikrotik.config.Config.getUrlRealmInfo()+document.location.search,
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
        Ext.Viewport.add(Ext.create('Mikrotik.view.cntNotPresent'));
    },
    showMain: function(jsonData){
        var me = this;
       // console.log(jsonData);
        //Load the main view
        Ext.Viewport.add(Ext.create('Mikrotik.view.tabMain',{'jsonData':jsonData}));

        //See how we were called...  
        if(me.mtServer == undefined){
            if(me.testForHotspot()){
                //It is a hotspot, now check if connected or not...
                me.mtRefresh();
            }else{
                me.showNotHotspot()
            }  
        }else{
            me.mtRefresh();  //Already established we are a hotspot, simply refresh
        }  
    },
    testForHotspot: function(){
        var me          = this;
        me.queryObj     = new Object(); 
        window.location.search.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"), function($0,$1,$2,$3) { me.queryObj[$1] = $3; });

        if(me.queryObj.link_status != undefined){  //Override defaults
            return true;        //Is a hotspot
        }else{
            return false;   //Not a hotspot
        }
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
    
        me.userName = me.getFrmConnect().down('#inpUsername').getValue();
        me.password = me.getFrmConnect().down('#inpPassword').getValue();
        me.remember = me.getFrmConnect().down('#inpRememberMe').isChecked();

        if((me.userName.length < 1 )||(me.password.length < 1)){
            me.showLoginError('Some required values missing');
            return;
        }

        //Check if they need to accept T&C
        if(me.getFrmConnect().down('#chkTcCheck').getHidden() == false){
            if(me.getFrmConnect().down('#chkTcCheck').isChecked() == false){
                me.showLoginError('First accept T&C');
                return;
            }
        }

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Connecting....'
        });

        me.doLogin();
    },
    doLogin: function(){

        var me      = this;
      //FIXME  var btnMac  = me.getConnect().down('#btnRemoveMac');

        var xtraParams = { 
            'username': me.userName,
            'password': me.password
        }

        Ext.data.JsonP.request({
            url         : me.queryObj.link_login_only,
            callbackKey : 'var',
            params      : xtraParams,
            timeout     : 10000,
            success: function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value

                //If ok (logon.html)
                if(j.logged_in == 'yes'){
                    // start with the usage...
                    if(me.remember == true){
                        Ext.util.Cookies.set('mtUn',me.userName);
                        Ext.util.Cookies.set('mtPw',me.password);
                    }         
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
/*FIXME                  if(res != null){
                            //Get the MAC

                            var mac = msg.match(/([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F])/);
                            me.mac_username = mac[0];            
                            btnMac.setVisible(true);

                        }else{
                            btnMac.setVisible(false);
                        }
*/

                    }
                    me.showLoginError(msg);
                }      
            },
            failure: function(){
                //We will retry for me.retryCount
                me.showLoginError("Failed to log into Mikrotik");

            },
            scope: me //VERY VERY VERY important
        });

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

    mtRefresh: function(){
        var me = this;   
        Ext.data.JsonP.request({
            url         : me.queryObj.link_status,
            timeout     : 3000,
            callbackKey : 'var',
            success     : function(j){
                me.currentRetry = 0 //Reset the current retry if it was perhaps already some value
                if(j.logged_in == 'no'){ 
                    //Try cookies if available                 
                    if( (Ext.util.Cookies.get('mtUn') != null )&&
                        (Ext.util.Cookies.get('mtPw') != null )){
                            //  console.log("Trying cookies");
                            me.userName     = Ext.util.Cookies.get('mtUn');
                            me.password     = Ext.util.Cookies.get('mtPw');
                            me.doLogin();
                    } 
                    me.showConnect();
                }

                if(j.clientState == 1){
                    if(Mikrotik.config.Config.getNoStatus() == true){
                        window.location=Mikrotik.config.Config.getRedirectTo();
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
               // console.log("Could not fetch the MT status");
                //We will retry for me.retryCount
                me.currentRetry = me.currentRetry+1;
                if(me.currentRetry <= me.retryCount){
                   //// console.log("Retry to fetch MT status "+me.currentRetry);
                    me.mtRefresh();
                }else{
                   me.showLoginError("Failed to get status from Mikrotik");
                   me.showConnect();  
                }
            },
            scope: me //VERY VERY VERY important
        });
    },
    refreshStatus: function(j){
        var me = this;
        me.getCntSession().setData({username : j.username, uptime : j.uptime, bytes_in_nice: j.bytes_in_nice, bytes_out_nice: j.bytes_out_nice});
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
                    me.mtRefresh();
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

        Ext.data.JsonP.request({
            url         : me.queryObj.link_logout,
            timeout     : 3000,
            callbackKey : 'var',
            success: function (){
                me.currentRetry = 0;
                me.mtRefresh();
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
        window.open(Mikrotik.config.Config.getRedirectTo(), '_blank');
    }
});
