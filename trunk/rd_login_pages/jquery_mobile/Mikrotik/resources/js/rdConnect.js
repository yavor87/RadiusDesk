var rdConnect = (function () {

  //Immediately returns an anonymous function which builds our modules
  return function (co,$) {    //co is short for config object

    var h               = document.location.hostname;
    var counter         = undefined; //refresh counter's id
    var timeUntilStatus = 20; //interval to refresh
    var refreshInterval = 20; //ditto

    var mtStatusUrl;

    //Sometimes the MT JSON interface is stubborn; so we have to try again
    var retryCount      = 20; //Make it high to start with --- sometimes it really takes long!
    var currentRetry    = 0;

    var userName        = undefined;
    var password        = undefined;
    var remember        = false;

    var noStatus        = false;
    var redirectTo      = "http://google.com";

    var sessionData     = undefined;
    var counter         = undefined;

    var mac_username    = undefined;

    var index   = function(){
        if(mtStatusUrl == undefined){
            if(testForHotspot()){
                //It is a hotspot, now check if connected or not...
                $("#cNotHotspot").hide(); //Initial hide
                mtRefresh();
            }else{
                $("#cNotHotspot").show(); 
                $("#cConnect").hide();  
            }  
        }else{
            mtRefresh();  //Already established we are a hotspot, simply refresh
        }
    }

    var clearRefresh = function(){
        if(counter != undefined){
            clearInterval(counter);
            counter   = undefined;
            timeUntilStatus = refreshInterval;
        }
    }

    var testForHotspot = function(){
        var ls      = $.getUrlVar('link_status');
        if(ls != undefined){  //Override defaults
            mtStatusUrl = ls;
            return true
        }else{
            return false;   //Not a hotspot
        }
    }

    var mtRefresh    = function(){
        var urlStatus = $.getUrlVar('link_status');

        $.ajax({url: urlStatus + "?var=?", dataType: "jsonp",timeout: 4000})
            .done(function(j){
                currentRetry = 0 //Reset the current retry if it was perhaps already some value
                if(j.logged_in == 'no'){
                    clearRefresh();
                    showLoginError('');
                    $("#cConnect").show(); 
                    $("#cStatus").hide(); 

                    //Try cookies if available                 
                    if(($.cookie("mt_un") != undefined)&&($.cookie("mt_pw") != undefined)){
                        userName = $.cookie("mt_un");
                        password = $.cookie("mt_pw");
                        login();
                    }
                }

                if(j.logged_in == 'yes'){
                    if(noStatus == true){
                        window.location=redirectTo;
                    }else{
                        //Refresh status window
                        refreshStatus(j);
                        $("#cStatus").show();
                        $("#cConnect").hide();
                        if(counter == undefined){    //If it is the first time so initialise the loop counter
                            sessionData = j;
                            refreshCounter();
                        }
                    }
                }
            })
            .fail(function(){
               // console.log("Could not fetch the Mikrotik status");
                //We will retry for retryCount
                currentRetry = currentRetry+1;
                if(currentRetry <= retryCount){
                    //console.log("Retry to fetch MT status "+currentRetry);
                    mtRefresh();
                }else{
                    $("#cNotHotspot").show(); //Assume there is not hotspot running any more
                    $("#cConnect").hide();
                    $("#cStatus").hide();   
                }
            });
    }

    var refreshStatus = function(j){

        $('#acct_un').text(j.username);
        $('#acct_ut').text(j.uptime);
        $('#acct_di').text(j.bytes_in_nice);
        $('#acct_do').text(j.bytes_out_nice);
    }

    var refreshCounter = function(){
        var me = this; 
        counter = setInterval (function(){
            timeUntilStatus = timeUntilStatus-1;
            if(false){    //We remove ourself gracefully FIXME
                clearInterval(counter);
                counter   = undefined;
                timeUntilStatus = refreshInterval;
            }else{
                $('#status_refresh').text(timeUntilStatus);
                if(timeUntilStatus == 0){      //Each time we reach null we refresh the screens
                    timeUntilStatus = refreshInterval; //Start anew
                    mtRefresh();
                }
            }
        }, 1000 );
    }

    var onBtnConnectClick = function(){  //Get the latest challenge and continue from there onwards....
         //Before we do anything, test if username and password is not empty        
        if(($('#Username').val().length == 0)||($('#Password').val().length == 0)){
            $('#connect_fb').html("Required values missing - Please supply");
            return;

        }else{  //Set the username 
            //Test to see if the #Username contains an @<realm> and if not, add a default realm...
            userName = escape($('#Username').val());
            password = $('#Password').val();
 
            //Check if we should store these values as cookies
            if($('#remember').is(':checked')){
                $.cookie("mt_un", userName, { expires: 70 });
                $.cookie("mt_pw", password, { expires: 70 });
            }
            login();   
        } 
    }
    
    var onBtnDisconnectClick = function(){
        var urlLogout = $.getUrlVar('link_logout');
        $.ajax({url: urlLogout + "?var=?", dataType: "jsonp",timeout: 4000,date: {}})
        .done(function(j){
            mtRefresh(); //Refresh
        })
        .fail(function(){     
            showLoginError("MT Not responding to logout requests");
        });
    }

    var onBtnRemoveMac = function(){
        var url = co.removeMacUrl
        $.ajax({url: url , dataType: "json",timeout: 10000,date: {},data: {'mac':mac_username}})
        .done(function(j){
            console.log("Ajax call fine");
            if(j.success == true){
                showLoginError("Device "+mac_username+" removed from realm, please log in again");
                $('#remove_mac').hide();
            }else{
                showLoginError(j.message);
            }
        })
        .fail(function(){     
            showLoginError('Problems encountered while trying to remove '+mac_username);
        });
    }

    var login =  function(){
        var urlLogin = $.getUrlVar('link_login_only');
        $.ajax({url: urlLogin + "?var=?", dataType: "jsonp",timeout: 4000, data: {username: userName, password: password}})
        .done(function(j){
            loginResults(j);
        })
        .fail(function(){
            //We will retry for retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                login();
            }else{
                showLoginError("MT Not responding to login requests");
            }
        });
    }
    var loginResults = function(j){

        currentRetry = 0;    //Reset if there were retries
        if(j.logged_in == 'yes'){
            // console.log("Check if we need to store the credentials")
            if(remember == true){
              //  console.log("Store credentails");
            }              
            mtRefresh(); //Refresh
        }else{
            //Clear the cookies
            $.cookie("mt_un", null);
            $.cookie("mt_pw", null); 
            var msg = 'Authentication failure please try again'
            if(j.error_orig != undefined){
                msg =j.error_orig;
                //Test to see if it moans about the MAC
                //var res = msg.match(/^User koos not registered/); //dummy
                var res = msg.match(/^User ([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F]) belongs to realm/);   //Real one
                if(res != null){
                    //Get the MAC
                    var mac = msg.match(/([0-9a-fA-F][0-9a-fA-F]-){5}([0-9a-fA-F][0-9a-fA-F])/);
                   // var mac = msg.match(/koos/);
                    mac_username = mac[0];            
                   // console.log("Here we have a match!!! ");
                    $('#remove_mac').show();
                }else{
                  //  console.log("Here we have NOOOO match!!! ");
                    $('#remove_mac').hide();
                }
            }
            showLoginError(msg);  
        }
    }

    var showLoginError = function(msg){
        $('#connect_fb').show().text(msg);
    }

    //Expose those public items...
    return {         
        index               : index,
        clearRefresh        : clearRefresh,
        onBtnConnectClick   : onBtnConnectClick,
        onBtnDisconnectClick: onBtnDisconnectClick,
        onBtnRemoveMac      : onBtnRemoveMac
    }   
  }
})();
