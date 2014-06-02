var rdConnect = (function () {

  //Immediately returns an anonymous function which builds our modules
  return function (co,$) {    //co is short for config object

    var uamIp,uamPort;  //Variables with 'global' scope

    var h               = document.location.hostname;
    var urlUse          = 'http://'+h+'/c2/yfi_cake/third_parties/json_usage_check?key=12345&username='
    var urlUam          = 'http://'+h+'/rd_login_pages/services/uam.php';
    var counter         = undefined; //refresh counter's id
    var timeUntilStatus = 20; //interval to refresh
    var refreshInterval = 20; //ditto

    //Sometimes the CoovaChilli JSON interface is stubborn; so we have to try again
    var retryCount      = 20; //Make it high to start with --- sometimes it really takes long!
    var currentRetry    = 0;

    var userName        = undefined;
    var password        = undefined;
    var remember        = false;

    var noStatus        = false;
    var redirectTo      = "http://google.com";

    var sessionData     = undefined;
    var counter         = undefined;

    var index   = function(){
        if(uamIp == undefined){
            if(testForHotspot()){
                //It is a hotspot, now check if connected or not...
                $("#cNotHotspot").hide(); //Initial hide
                coovaRefresh();
            }else{
                $("#cNotHotspot").show(); 
                $("#cConnect").hide();  
            }  
        }else{
            coovaRefresh();  //Already established we are a hotspot, simply refresh
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

        var ip      = $.getUrlVar('uamip');
        var port    = $.getUrlVar('uamport');

        if(ip != undefined){  //Override defaults
            uamIp = ip;
        }else{
            return false;   //Not a hotspot
        }

        if(port != undefined){    //Override defaults
            uamPort = port;
        }
        return true;        //Is a hotspot
    }

    var coovaRefresh    = function(){
        var urlStatus = 'http://'+uamIp+':'+uamPort+'/json/status';

        $.ajax({url: urlStatus + "?callback=?", dataType: "jsonp",timeout: 2000})
            .done(function(j){
                currentRetry = 0 //Reset the current retry if it was perhaps already some value
                if(j.clientState == 0){
                    clearRefresh();
                    showLoginError('');
                    $("#cConnect").show(); 
                    $("#cStatus").hide(); 

                    //Try cookies if available                 
                    if(($.cookie("coova_un") != undefined)&&($.cookie("coova_pw") != undefined)){
                        userName = $.cookie("coova_un");
                        password = $.cookie("coova_pw");
                        getLatestChallenge();
                    }
                }

                if(j.clientState == 1){
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
                            //Refresh the usage ....
                           //// yfiUsageRefresh();
                        }
                    }
                }
            })
            .fail(function(){
               // console.log("Could not fetch the coova status");
                //We will retry for me.retryCount
                currentRetry = currentRetry+1;
                if(currentRetry <= retryCount){
                    //console.log("Retry to fetch Coova status "+currentRetry);
                    coovaRefresh();
                }else{
                    $("#cNotHotspot").show(); //Assume there is not hotspot running any more
                    $("#cConnect").hide();
                    $("#cStatus").hide();   
                }
            });
    }

    var refreshStatus = function(j){

        var gw = 4294967296;

        var time_i  = time(j.accounting.idleTime);
        var time_s  = time(j.accounting.sessionTime);
        var d_in    = (j.accounting.inputOctets+(j.accounting.inputGigawords*gw));
        var d_out   = (j.accounting.outputOctets+(j.accounting.outputGigawords*gw));

        var dat_i   = bytes(d_in);
        var dat_o   = bytes(d_out);
        var t       = d_in + d_out;
        var dat_t   = bytes(t);

        $('#acct_it').text(time_i);
        $('#acct_st').text(time_s);
        $('#acct_di').text(dat_i);
        $('#acct_do').text(dat_o);
        $('#acct_dt').text(dat_t);
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
                    coovaRefresh();
                   ///// yfiUsageRefresh();
                }
            }
        }, 1000 );
    }

    var yfiUsageRefresh = function(){
        var me = this;
        //We need to see if we can get padded json form the YFi server
        $.getJSON(urlUse +escape(userName)+"&callback=?", 
            function(data) {
                //console.log(data);
                //If the time available is 'NA' we must hide the time div
                if(data.json.summary.time_avail == 'NA'){
                    $('#div_time').hide().trigger('updatelayout');


                }else{
                    $('#div_time').show().trigger('updatelayout');
                    var time_total     = data.json.summary.time_used + data.json.summary.time_avail;
			        var pers_time_used = (data.json.summary.time_used / time_total) * 100;

                    var l = $("#lbl_slider-time");
                    l.html("<strong>Used </strong>"+time(data.json.summary.time_used)+"<strong> Available </strong>"+ time(data.json.summary.time_avail));

                    var sd = $("#slider-time");
                    sd.val(pers_time_used).slider("refresh");

                    if( (pers_time_used >= 0)&(pers_time_used < 50)){
                        $('#div_time [aria-valuemin="0"]').removeClass('slider_bg_red');
                        $('#div_time [aria-valuemin="0"]').removeClass('slider_bg_yellow');
                        $('#div_time [aria-valuemin="0"]').addClass('slider_bg_green');
                        $('#div_time [role="application"]').removeClass('slider_bg_red');
                        $('#div_time [role="application"]').removeClass('slider_bg_yellow');
                        $('#div_time [role="application"]').addClass('slider_bg_green');
                    }

                    if( (pers_time_used >= 50)&&(pers_time_used <=75)){
                        $('#div_time [aria-valuemin="0"]').removeClass('slider_bg_green');
                        $('#div_time [aria-valuemin="0"]').removeClass('slider_bg_red');
                        $('#div_time [aria-valuemin="0"]').addClass('slider_bg_yellow');
                        $('#div_time [role="application"]').removeClass('slider_bg_green');
                        $('#div_time [role="application"]').removeClass('slider_bg_red');
                        $('#div_time [role="application"]').addClass('slider_bg_yellow');
                    }

                    if( (pers_time_used >= 75)&&(pers_time_used <=100)){
                        $('#div_time  [aria-valuemin="0"]').removeClass('slider_bg_green');
                        $('#div_time  [aria-valuemin="0"]').removeClass('slider_bg_yellow');
                        $('#div_time  [aria-valuemin="0"]').addClass('slider_bg_red');
                        $('#div_time  [role="application"]').removeClass('slider_bg_green');
                        $('#div_time  [role="application"]').removeClass('slider_bg_yellow');
                        $('#div_time  [role="application"]').addClass('slider_bg_red');
                    }
                }

                //If the data available is 'NA' we must hide the time div
                if(data.json.summary.data_avail == 'NA'){
                    $('#div_data').hide().trigger( 'updatelayout' );;
                }else{
                    $('#div_data').show().trigger( 'updatelayout' );;
                    var data_total     = data.json.summary.data_used + data.json.summary.data_avail;
			        var pers_data_used = (data.json.summary.data_used / data_total) * 100;

                    var l = $("#lbl_slider-data");
                    l.html("<strong>Used </strong>"+bytes(data.json.summary.data_used)+"<strong> Available </strong>"+ bytes(data.json.summary.data_avail));

                    var sd = $("#slider-data");
                    sd.val(pers_data_used).slider("refresh");

                    if( (pers_data_used >= 0)&(pers_data_used < 50)){
                        $('#div_data [aria-valuemin="0"]').removeClass('slider_bg_red');
                        $('#div_data [aria-valuemin="0"]').removeClass('slider_bg_yellow');
                        $('#div_data [aria-valuemin="0"]').addClass('slider_bg_green');
                        $('#div_data [role="application"]').removeClass('slider_bg_red');
                        $('#div_data [role="application"]').removeClass('slider_bg_yellow');
                        $('#div_data [role="application"]').addClass('slider_bg_green');
                    }

                    if( (pers_data_used >= 50)&&(pers_data_used <=75)){
                        $('#div_data [aria-valuemin="0"]').removeClass('slider_bg_green');
                        $('#div_data [aria-valuemin="0"]').removeClass('slider_bg_red');
                        $('#div_data [aria-valuemin="0"]').addClass('slider_bg_yellow');
                        $('#div_data [role="application"]').removeClass('slider_bg_green');
                        $('#div_data [role="application"]').removeClass('slider_bg_red');
                        $('#div_data [role="application"]').addClass('slider_bg_yellow');
                    }

                    if( (pers_data_used >= 75)&&(pers_data_used <=100)){
                        $('#div_data  [aria-valuemin="0"]').removeClass('slider_bg_green');
                        $('#div_data  [aria-valuemin="0"]').removeClass('slider_bg_yellow');
                        $('#div_data  [aria-valuemin="0"]').addClass('slider_bg_red');
                        $('#div_data  [role="application"]').removeClass('slider_bg_green');
                        $('#div_data  [role="application"]').removeClass('slider_bg_yellow');
                        $('#div_data  [role="application"]').addClass('slider_bg_red');
                    }
                }
            });
    }

    var onBtnConnectClick = function(){  //Get the latest challenge and continue from there onwards....
         //Before we do anything, test if username and password is not empty        
        if(($('#Username').val().length == 0)||($('#Password').val().length == 0)){
            $('#connect_fb').html("Required values missing - Please supply");
            return;

        }else{  //Set the username 

	    if(!($('#t_c').is(":checked"))){
            	$('#connect_fb').html("Accept T&C first");
            	return;
	    }

            //Test to see if the #Username contains an @<realm> and if not, add a default realm...
            userName = escape($('#Username').val());
            password = $('#Password').val();
 
            //Check if we should store these values as cookies
            if($('#remember').is(':checked')){
                $.cookie("coova_un", userName, { expires: 70 });
                $.cookie("coova_pw", password, { expires: 70 });
            }
            getLatestChallenge();   
        } 
    }
  
    var getLatestChallenge = function(){
        var urlStatus = 'http://'+uamIp+':'+uamPort+'/json/status';
        $.ajax({url: urlStatus + "?callback=?", dataType: "jsonp",timeout: 2000})
        .done(function(j){
            currentRetry = 0;
            if(j.clientState == 0){
                encPwd(j.challenge);
            }
            if(j.clientState == 1){
                //Show status screen since we don't need the challenge
                coovaRefresh();
            }
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                getLatestChallenge();
            }
        });
    }

    var encPwd = function(challenge){  
        $.ajax({url: urlUam + "?callback=?", dataType: "jsonp",timeout: 2000, data: {'challenge': challenge, password: password}})
        .done(function(j){
            login(j.response);
        })
        .fail(function(){
            showLoginError("UAM service is down"); 
        });
    }

    var login =  function(encPwd){
        var urlLogin = 'http://'+uamIp+':'+uamPort+'/json/logon';
        $.ajax({url: urlLogin + "?callback=?", dataType: "jsonp",timeout: 2000, data: {username: userName, password: encPwd}})
        .done(function(j){
            loginResults(j);
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                login(encPwd);
            }else{
                showLoginError("Coova Not responding to login requests");
            }
        });
    }
    var loginResults = function(j){

        currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){
            //Clear the cookies
            $.cookie("coova_un", null);
            $.cookie("coova_pw", null); 
            var msg = 'Authentication failure please try again'
            if(j.message != undefined){
                msg =j.message;
            }
            showLoginError(msg);
        }else{
           // console.log("Check if we need to store the credentials")
            if(remember == true){
                console.log("Store credentails");
               // Ext.util.Cookies.set('coovaUn',me.userName);
               // Ext.util.Cookies.set('coovaPw',me.password);
            }              
            coovaRefresh(); //Refresh
        }
    }

    var showLoginError = function(msg){
        $('#connect_fb').show().text(msg);
    }

    var time =   function ( t , zeroReturn ) {

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
    }

    var bytes   = function ( b , zeroReturn ) {

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

    //Expose those public items...
    return {         
        index               : index,
        clearRefresh        : clearRefresh,
        onBtnConnectClick   : onBtnConnectClick
    }   
  }
})();
