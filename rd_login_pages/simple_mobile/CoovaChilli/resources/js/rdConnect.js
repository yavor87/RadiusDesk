var rdConnect = (function () {

  //Immediately returns an anonymous function which builds our modules
  return function (co,$) {    //co is short for config object

    var uamIp,uamPort;  //Variables with 'global' scope

    var h               = document.location.hostname;
    var urlUse          = 'http://'+h+'/cake2/rd_cake/radaccts/get_usage.json'
    var urlUam          = 'http://'+h+'/rd_login_pages/services/uam.php';
	var urlSocialBase   = 'http://'+h+'/cake2/rd_cake/auth/'; //Be sure this is the same as specified in FB e.g. IP or DNS!!
	var urlSocialInfoFor= 'http://'+h+'/cake2/rd_cake/third_party_auths/info_for.json'; //To pull the username and password associated with this ID + typ
    var counter         = undefined; //refresh counter's id
    var timeUntilStatus = 20; //interval to refresh
    var refreshInterval = 20; //ditto

	var timeUntilUsage  = 20 //Default value
	var usageInterval	= 20;

    //Sometimes the CoovaChilli JSON interface is stubborn; so we have to try again
    var retryCount      = 5; //Make it high to start with --- sometimes it really takes long!
    var currentRetry    = 0;

    var userName        = undefined;
    var password        = undefined;
    var remember        = false;

	var ajaxTimeout		= 4000;

    var sessionData     = undefined;
    var counter         = undefined;
	var notRequired		= [ 'q', 'res',	'challenge', 'called', 'mac', 'ip', 'sessionid', 'userurl', 'md'];
	var socialName		= undefined;

	//We store the status feedback in this variable
	var statusFb		= undefined;

    var index   = function(){
        if(uamIp == undefined){
            if(testForHotspot()){
                //It is a hotspot, now check if connected or not...
                $("#cNotHotspot").hide(); //Initial hide

				if($("body").data("DynamicDetail").data.settings.usage_show_check){
					timeUntilUsage = $("body").data("DynamicDetail").data.settings.usage_refresh_interval;
					usageInterval  = usageInterval;
				}
                coovaRefresh(true);
            }else{
                $("#cNotHotspot").show(); 
                $("#cConnect").hide();  
            }  
        }else{
            coovaRefresh(true);  //Already established we are a hotspot, simply refresh
        }
    }

    var clearRefresh = function(){
        if(counter != undefined){
            clearInterval(counter);
            counter   = undefined;
            timeUntilStatus = refreshInterval;
			timeUntilUsage  = usageInterval;
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

    var coovaRefresh    = function(do_usage_also){

		if (typeof(do_usage_also) === "undefined") { do_usage_also = false; } //By default we give feedback
        var urlStatus = 'http://'+uamIp+':'+uamPort+'/json/status';

        $.ajax({url: urlStatus + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout})
            .done(function(j){

				statusFb = j;		//Store the status feedback

				//console.log("coovaRefresh...");
				//console.log(j);

                currentRetry = 0 //Reset the current retry if it was perhaps already some value
				hideFeedback(); //Hide the feedback
                if(j.clientState == 0){
                    clearRefresh();
                    clearLoginError();
                    $("#cConnect").show(); 
                    $("#cStatus").hide();
                }

                if(j.clientState == 1){
					var redirect_check 	= false;
					var redirect_url  	= 'http://google.com';
					if($("body").data("DynamicDetail") != undefined){ //We had to add this sine it is not always populated by the time this is run
						redirect_check = $("body").data("DynamicDetail").data.settings.redirect_check;
						redirect_url = $("body").data("DynamicDetail").data.settings.redirect_url;
					}

					if(redirect_check){
				        window.location= redirect_url;
				    }else{
                        //Refresh status window
                        refreshStatus(j);

						//We also want ot get the latest usage if enabled
						if(do_usage_also){
							rdUsageRefresh();
						}

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
               // console.log("Could not fetch the coova status");	
                //We will retry for me.retryCount
                currentRetry = currentRetry+1;
                if(currentRetry <= retryCount){
                    //console.log("Retry to fetch Coova status "+currentRetry);
                    coovaRefresh(do_usage_also);
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
			//Status part
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
                }
            }

			//Usage part
			timeUntilUsage = timeUntilUsage-1;
            if(false){    //We remove ourself gracefully FIXME
                clearInterval(counter);
                counter   = undefined;
                timeUntilUsage = usageInterval;
            }else{
                if(timeUntilUsage == 0){      //Each time we reach null we refresh the screens
                    timeUntilUsage = usageInterval; //Start anew
                    rdUsageRefresh();
                }
            }

        }, 1000 );
    }

    var rdUsageRefresh = function(){

		if($("body").data("DynamicDetail").data.settings.usage_show_check == false){
			return;
		}

		if(statusFb != undefined){
			if(statusFb.redir == undefined){
				return;
			}else{
				var mac	= statusFb.redir.macAddress;
			}
			if(statusFb.session == undefined){
				return;
			}else{
				var un	= statusFb.session.userName;
			}
		}

        $.getJSON(urlUse,{'username' : un, 'mac' : mac}, 
            function(j) {
				if(j.success == false){
					return;
				}

                //If the time available is 'NA' we must hide the time div
                if(j.data.time_cap == null){
                    $('#div_time').hide().trigger('updatelayout');

                }else{
                    $('#div_time').show().trigger('updatelayout');
                    var time_total     = j.data.time_cap;
			        var pers_time_used = (j.data.time_used / j.data.time_cap) * 100;
					var time_avail	   = j.data.time_cap - j.data.time_used;

                    var l = $("#lbl_slider-time");
                    l.html("<strong>Used </strong>"+time(j.data.time_used)+"<strong> Available </strong>"+ time(time_avail));

                    var sd = $("#slider-time");
                    sd.val(pers_time_used).slider("refresh");

                }

                //If the data available is 'NA' we must hide the time div
                if(j.data.data_cap == null){
                    $('#div_data').hide().trigger( 'updatelayout' );;
                }else{
                    $('#div_data').show().trigger( 'updatelayout' );;
                    var data_total     = j.data.data_cap;
			        var pers_data_used = (j.data.data_used / j.data.data_cap) * 100;
					var data_avail	   = j.data.data_cap - j.data.data_used;

                    var l = $("#lbl_slider-data");
                    l.html("<strong>Used </strong>"+bytes(j.data.data_used)+"<strong> Available </strong>"+ bytes(data_avail));

                    var sd = $("#slider-data");
                    sd.val(pers_data_used).slider("refresh");
                }
            });
    }

    var onBtnConnectClick = function(){  //Get the latest challenge and continue from there onwards....

		//First we need to determine if the user used a Voucher or Username/Password
		var voucher_present = false;
		var user_present	= false;

		if ($('#voucher').length>0){ //This means the voucher controll is there	
			voucher_present = true;
		}

		if ($('#Username').length>0){ //This means the user controll is there	
			user_present = true;
		}

		//User and Voucher present
		if((voucher_present)&&(user_present)){
			//console.log("Voucher and user present");
			var found_flag = false;

			//Both empty
			if(	($('#voucher').val().length == 0)&&
				($('#Username').val().length == 0)
			){
				//console.log("voucher and user EMPTY");
				showLoginError("Required value missing - Please supply");
            	return;
			}

			//Voucher specified
			if($('#voucher').val().length > 0){
				userName = escape($('#voucher').val());
            	password = $('#voucher').val();
				found_flag = true;	   
			}

			//Username specified
			if(($('#Username').val().length > 0)&&($('#Password').val().length > 0)){
				userName = escape($('#Username').val());
        		password = $('#Password').val();
				found_flag = true;
			}

			if(!found_flag){
				showLoginError("Required value missing - Please supply");
            	return;
			}
		}
		
		if((voucher_present)&&(user_present == false)
		){
			if($('#voucher').val().length == 0){
				showLoginError("Supply value for voucher");
				return;
			}
			userName = escape($('#voucher').val());
            password = $('#voucher').val();
		}

		if((user_present)&&(voucher_present == false)
		){
			if(($('#Username').val().length == 0)||($('#Password').val().length == 0)){
				showLoginError("Supply both username and password");
            	return;
			}
			if($('#Username').val().length == 0){
				showLoginError("Supply Username");
            	return;
			}
			if($('#Password').val().length == 0){
				showLoginError("Supply Password");
            	return;
			}
			userName = escape($('#Username').val());
    		password = $('#Password').val();
		}

     	getLatestChallenge();   
    }

	 var onBtnClickToConnectClick = function(){  //Get the latest challenge and continue from there onwards....
			//console.log($("body").data( "DynamicDetail"));
			var c_t_c_element	= $("body").data( "DynamicDetail").data.settings.connect_suffix;
			var element_val     = $.getUrlVar(c_t_c_element);

			var c_t_c_username 	= $("body").data( "DynamicDetail").data.settings.connect_username+"@"+element_val;
			var c_t_c_password	= $("body").data( "DynamicDetail").data.settings.connect_username;
            userName 			= c_t_c_username;
            password 			= c_t_c_password;     
            getLatestChallenge();   
    }


    var getLatestChallenge = function(){
		showFeedback("Get latest challenge");
        var urlStatus = 'http://'+uamIp+':'+uamPort+'/json/status';
        $.ajax({url: urlStatus + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout})
        .done(function(j){
			hideFeedback();
            currentRetry = 0;
            if(j.clientState == 0){
                encPwd(j.challenge);
            }
            if(j.clientState == 1){
                //Show status screen since we don't need the challenge
                coovaRefresh(true);
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
		showFeedback("Get encrypted values");
        $.ajax({url: urlUam + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout, data: {'challenge': challenge, password: password}})
        .done(function(j){
			currentRetry = 0;
            login(j.response);
			hideFeedback();
        })
        .fail(function(){ 
			//We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                encPwd(challenge);
            }else{
                showLoginError("UAM service is down");
            }
        });
    }

    var login =  function(encPwd){
		showFeedback("Log "+userName+" into Captive Portal");
        var urlLogin = 'http://'+uamIp+':'+uamPort+'/json/logon';
        $.ajax({url: urlLogin + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout, data: {username: userName, password: encPwd}})
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
           
            var msg = 'Authentication failure please try again'
            if(j.message != undefined){
                msg =j.message;
            }
            showLoginError(msg);
        }else{            
            coovaRefresh(true); //Refresh
        }
    }

    var showLoginError = function(msg){
		hideFeedback(); //hide any info pop-ups
		$( "#popFb" ).popup("open");
        $('#connect_fb').show().text(msg);
    }

	var clearLoginError	= function(){
		$('#connect_fb').show().text('');
		$( "#popFb" ).popup("close");
	}

	var showFeedback	= function(msg){
		//console.log("Show feedback "+msg);
        $('#connect_info').show().text(msg);
	}

	var hideFeedback	= function(){
		//console.log("Hide feedback");
		$('#connect_info').hide().text('');
	}

	//_______Disconnect_______
	var onBtnDisconnectClick = function(){
		showFeedback("Disconnect the user");
        var urlLogoff = 'http://'+uamIp+':'+uamPort+'/json/logoff';

        $.ajax({url: urlLogoff + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout})
        .done(function(j){
            coovaRefresh();
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                onBtnDisconnectClick();
            }else{
                showLoginError("Coova Not responding to logoff requests");
            }
        });
	}

	//_________ Social Login _________________
	var onBtnClickSocialLogin = function(a){

		socialName = a.toLowerCase();
		showFeedback('Starting social login for '+ socialName)

		var urlStatus = 'http://'+uamIp+':'+uamPort+'/json/status';
        $.ajax({url: urlStatus + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout})
        .done(function(j){
			hideFeedback();
            currentRetry = 0;
            if(j.clientState == 0){
				userName = $("body").data( "DynamicDetail").data.settings.social_login.temp_username; //Makes this unique
        		password = $("body").data( "DynamicDetail").data.settings.social_login.temp_password;  
                socialTempEncPwd(j.challenge);
            }
            if(j.clientState == 1){ //FIXME Think we should redirect to Social Login Login...
                //Show status screen since we don't need the challenge
                coovaRefresh();
            }
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                onBtnClickSocialLogin(a);
            }
        });
	}

	var socialTempEncPwd = function(challenge){
		showFeedback("Get encrypted values for temp login");
        $.ajax({url: urlUam + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout, data: {'challenge': challenge, password: password}})
        .done(function(j){
            socialTempLogin(j.response);
			hideFeedback();
        })
        .fail(function(){
            showLoginError("UAM service is down"); 
        });
	}

	var socialTempLogin	= function(encPwd){
		showFeedback("Log temp user into Captive Portal");
        var urlLogin = 'http://'+uamIp+':'+uamPort+'/json/logon';
        $.ajax({url: urlLogin + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout, data: {username: userName, password: encPwd}})
        .done(function(j){
            socialTempLoginResults(j);
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                socialTempLogin(encPwd);
            }else{
                showLoginError("Coova Not responding to login requests");
            }
        });
	}

	var socialTempLoginResults = function(j){
        currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){       
            var msg = 'Authentication failure please try again'
            if(j.message != undefined){
                msg =j.message;
            }
            showLoginError(msg);
        }else{            
            //console.log("Temp social login user logged in fine.... time to check if we are authenticated");
			//We need to add a query string but do not need to add ALL the items

			var queryString 		= window.location.search;
			queryString 			= queryString.substring(1);
			var query_object		= parseQueryString(queryString);
			var required			= query_object;

			$.each(notRequired, function( index, value ) {
				//console.log( index + ": " + value );
				delete required[value];
			});

			required.pathname   	= window.location.pathname;
            required.hostname   	= window.location.hostname;
            required.protocol   	= window.location.protocol;
			required.social_login 	= 1;

			var q_s 	 			= $.param(required);
			//console.log(q_s);
			//Dynamically build the redirect URL to which Social Login we will use...
			window.location			= urlSocialBase+socialName+"?"+q_s;
			//window.location="http://rd01.wificity.asia/cake2/rd_cake/auth/facebook?"+q_s;
        }
	}

	var checkSocialLoginReturn = function(){

		//console.log("Check for social login returns...");

       	if(	($.getUrlVar('sl_type') 	!= undefined)&& //e.g. user or voucher
			($.getUrlVar('sl_name') 	!= undefined)&& //e.g. Facebook
			($.getUrlVar('sl_value') 	!= undefined)   //e.g. 3_34564654645694 (Dynamic Pages ID + provider unique ID)
		){ 
			//console.log("Finding transaction details for "+ me.queryObj.tx);
			

			var t = $.getUrlVar('sl_type');
			var n = $.getUrlVar('sl_name');
			var v = $.getUrlVar('sl_value');

			t = t.replace(/#.?/g, ""); //JQuery Mobile tend to add a #bla which we need to filter out
			n = n.replace(/#.?/g, "");
			v = v.replace(/#.?/g, "");

			var jqxhr = $.getJSON( urlSocialInfoFor, {'sl_type' : t,'sl_name' : n,'sl_value' : v}, function(j) {
				//console.log( "success getting social login return" );
				if(j.success){   
					userName = j.data.username; //Makes this unique
					password = j.data.password;   
					//console.log(j.data.username);
					//console.log(j.data.password);
					socialTempDisconnect();
				}else{
					//console.log("big problems");
					showLoginError("Could not retrieve Social Login Info");
				}
			})
			.fail(function() {
				showLoginError("Could not retrieve Social Login Info"); 
			});
        }
	}

	var socialTempDisconnect 	=  function(){

        showFeedback("Disconnect the social temp user");
        var urlLogoff = 'http://'+uamIp+':'+uamPort+'/json/logoff';

        $.ajax({url: urlLogoff + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout})
        .done(function(j){     
			socialFinalSatus();
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                socialTempDisconnect();
            }else{
                showLoginError("Coova Not responding to logoff requests");
            }
        });
    }

	var socialFinalSatus = function(){
		showFeedback('Get final status for social login');
		var urlStatus = 'http://'+uamIp+':'+uamPort+'/json/status';
        $.ajax({url: urlStatus + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout})
        .done(function(j){
			hideFeedback();
            currentRetry = 0;
            if(j.clientState == 0){
				socialFinalEncPwd(j.challenge);
            }
            if(j.clientState == 1){ //FIXME sort out redirect code
				var redirect_check 	= false;
				var redirect_url  	= 'http://google.com';
				if($("body").data("DynamicDetail") != undefined){ //We had to add this sine it is not always populated by the time this is run
					redirect_check = $("body").data("DynamicDetail").data.settings.redirect_check;
					redirect_url = $("body").data("DynamicDetail").data.settings.redirect_url;
				}
				if(redirect_check){
			        window.location= redirect_url;
				}else{             
                    coovaRefresh(); //Refresh 
                }
            }
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                socialFinalSatus();
            }
        });
    }

	var socialFinalEncPwd = function(challenge){

		showFeedback('Encrypting final password');
        $.ajax({url: urlUam + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout, data: {'challenge': challenge, password: password}})
        .done(function(j){
            socialFinalLogin(j.response);
			hideFeedback();
        })
        .fail(function(){
            showLoginError("UAM service is down"); 
        });
    }
    
	var socialFinalLogin = function(encPwd){
		showFeedback('Doing final login');

		var urlLogin = 'http://'+uamIp+':'+uamPort+'/json/logon';
        $.ajax({url: urlLogin + "?callback=?", dataType: "jsonp",timeout: ajaxTimeout, data: {username: userName, password: encPwd}})
        .done(function(j){
            socialFinalLoginResults(j);
        })
        .fail(function(){
            //We will retry for me.retryCount
            currentRetry = currentRetry+1;
            if(currentRetry <= retryCount){
                socialTempLogin(encPwd);
            }else{
                showLoginError("Coova Not responding to login requests");
            }
        });
    }

    var socialFinalLoginResults = function(j){
		hideFeedback();
		currentRetry = 0;    //Reset if there were retries
        if(j.clientState == 0){    
            var msg = 'Social Login user failed authentication'
            if(j.message != undefined){
                msg =j.message;
            }
			$("#cConnect").show(); 
            $("#cStatus").hide();
            showLoginError(msg);
        }else{
			var redirect_check 	= false;
			var redirect_url  	= 'http://google.com';
			if($("body").data("DynamicDetail") != undefined){ //We had to add this sine it is not always populated by the time this is run
				redirect_check = $("body").data("DynamicDetail").data.settings.redirect_check;
				redirect_url = $("body").data("DynamicDetail").data.settings.redirect_url;
			}
			if(redirect_check){
		        window.location= redirect_url;
			}else{             
                coovaRefresh(true); //Refresh session and usage
            }
        }
    }

	//_________ END Social Login _____________

	var parseQueryString = function( queryString ) {
    	var params = {}, queries, temp, i, l;
 
    	// Split into key/value pairs
    	queries = queryString.split("&");
 
    	// Convert the array of strings into an object
    	for ( i = 0, l = queries.length; i < l; i++ ) {
        	temp = queries[i].split('=');
        	params[temp[0]] = temp[1];
    	}
    	return params;
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
        index               		: index,
        clearRefresh        		: clearRefresh,
        onBtnConnectClick   		: onBtnConnectClick,
		onBtnClickToConnectClick   	: onBtnClickToConnectClick,
		onBtnClickSocialLogin		: onBtnClickSocialLogin,
		onBtnDisconnectClick		: onBtnDisconnectClick,
		checkSocialLoginReturn		: checkSocialLoginReturn
    }   
  }
})();
