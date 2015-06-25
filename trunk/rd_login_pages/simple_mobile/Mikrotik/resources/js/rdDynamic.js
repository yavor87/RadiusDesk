var rdDynamic = (function () {

  //Immediately returns an anonymous function which builds our modules
  return function (co,$) {    //co is short for config object

    //Public -> Test for hotspot  
    var isHotspot = function(){     
        var byName = $.getUrlVar(co.queryItem);
        if(byName == undefined){
            return false;
        }else{
            return true;
        }
    }

    //Public -> Add Dynamic info
    var addDynamicInfo = function(){
        var retInfo;

        var urlScaler = '/cake2/rd_cake/webroot/files/image.php';

        var url = co.dynUrl+document.location.search;
        $.getJSON(url, null, function(j) { //We send the query string along

			//If there is not a dynamic login page for this guy ---- let it be known
			if(j.success == false){
				$("#cNotHotspot h3").text("Huston we have a problem....");

				$("#cNotHotspot p").html("Go to RADIUSdesk, open the <b>Dynamic Login Pages</b> applet. Select an entry and <b>edit</b> it<br>"+
                "Make sure you added an identifier from this URL's query string under <b>Dynamic Keys</b>"+
                " to ensure proper working of this login page<br>");

				$("#cNotHotspot").show(); 
                $("#cConnect").hide(); 
				return;
			}

			//Store this data JQuery style
			$("body").data("DynamicDetail",j);

			pvtBuildGui();

			addConnect();

            //______________________________________
            //____Add the photo's if there are any

            var small, large, caption, item;
            var img_scaler  = co.scaler+'?height='+co.thumb_h+'&width='+co.thumb_w+'&image=';

            for(i in j.data.photos){
              //  console.log(j.data.photos[i]);
                small   = img_scaler+j.data.photos[i].file_name;
                large   = j.data.photos[i].file_name;
                caption = j.data.photos[i].title;
                item    = "<a class='rdThumb' href='"+large+"' rel='external'><img src='"+small+"' alt='"+caption+"' /></a>";
               // console.log(item)
                $('#GalUl').append(item);      
            }

            //______________________________________________
            //___ Populate the dynamic info ________________
            $('#dynAbout').text(j.data.detail.name);
            //$('#dynIcon').attr('src',j.data.detail.icon_file_name);
            //$('#dynLogo').attr('src',j.data.detail.icon_file_name);

            $('#dynIcon').attr('src',urlScaler+'?height=100&width=100&image='+j.data.detail.icon_file_name);
            $('#dynLogo').attr('src',urlScaler+'?height=100&width=100&image='+j.data.detail.icon_file_name);
            $('#dynPhone').text(j.data.detail.phone);
            $('#dynFax').text(j.data.detail.fax);
            $('#dynCell').text(j.data.detail.cell);
            $('#dynAddr').html(j.data.detail.street_no+" "+j.data.detail.street+"<br>"+j.data.detail.town_suburb+"<br>"+j.data.detail.city);
           // $('#dynLat').text(j.data.detail.lat);
          //  $('#dynLng').text(j.data.detail.lon);
            $('#dynUrl').text(j.data.detail.url);
            $('#dynUrl').attr('href',j.data.detail.url);
            $('#dynMail').text(j.data.detail.email);
            $('#dynMail').attr('href','mailto:'+j.data.detail.email);

            //Add the own pages as content of Help page
             for(i in j.data.pages){
                var previous = $('#HelpContent').html();
                $('#HelpContent').html(previous+"<h2>"+j.data.pages[i].name+"</h2>"+j.data.pages[i].content+"<br>");
            }
        });
    }


	var addConnect = function(){

		//______ Connect part ______
        var c       = rdConnect({},window.jQuery);

		co.connect = c //Set this globally

		//We prime it since we assume the pageshow event already fired
        c.index();
		//Check if this page was a sosial login return
		c.checkSocialLoginReturn();

        $('#Connect')
            .on('pageshow', function(e){
				//console.log("Connect pageshow event fired")
                c.index();
            })
            .on('pagehide', function(e){
                c.clearRefresh();
            });

		//Disconnect button
		$("a[name=btn_disconnect]").on('click',function(){
	        c.onBtnDisconnectClick();
	    });
        //___ END Connect Part ____
	}

	//Private build gui
	var pvtBuildGui = function(){
		//console.log($("body").data("DynamicDetail"));

		//The voucher field
		if (($("body").data("DynamicDetail").data.settings.voucher_login_check == true)&&
			($("body").data("DynamicDetail").data.settings.connect_only == false)
		){
			var v = '<input type="text" name="voucher"  id="voucher"  required="required" placeholder="Voucher here..">';
			$('[data-rd="login_field"]').append(v).enhanceWithin();
		}

		//The OR label
		if (($("body").data("DynamicDetail").data.settings.voucher_login_check == true)&&
			($("body").data("DynamicDetail").data.settings.user_login_check == true)&&
			($("body").data("DynamicDetail").data.settings.connect_only == false)
		){
			var or = '<h3 class="center">OR</h3>';
			$('[data-rd="login_field"]').append(or).enhanceWithin();
		}

		//The username and password fields
		if (($("body").data("DynamicDetail").data.settings.user_login_check == true)&&
			($("body").data("DynamicDetail").data.settings.connect_only == false)
		){
			var un_pw = '<input type="text" name="Username"  id="Username"  required="required" placeholder="Username here...">'+
            '<input type="password" name="Password" id="Password" required="required" placeholder="Password here...">'+
            '<input type="checkbox" name="remember" id="remember" class="custom" />'+      
            '<label for="remember">Remember me</label>';
			$('[data-rd="login_field"]').append(un_pw).enhanceWithin();
		}

		if ($("body").data("DynamicDetail").data.settings.t_c_check == true){
			var tc = '<a href="#" data-role="button" name="btnViewTC" data-icon="eye" >View Terms & Conditions </a>'+
            '<input type="checkbox" name="chkTandC" id="chkTandC" class="custom" />'+      
            '<label for="chkTandC">Accept T&C</label>';
			$('[data-rd="login_field"]').append(tc).enhanceWithin();
		}

		//Social Login
		if (($("body").data("DynamicDetail").data.settings.social_login.active == true)&&
			($("body").data("DynamicDetail").data.settings.connect_only == false)
		){

			$.each($("body").data("DynamicDetail").data.settings.social_login.items, function( index, value ) {
				var n = value.name;
				var icn = "star"
				if(n == 'Facebook'){
					icn = "facebook-square";
				}
				if(n == 'Twitter'){
					icn = "twitter";
				}
				if(n == 'Google'){
					icn = "google-plus";
				}
				var sl_btn = '<a href="#" data-role="button" name="'+n+'" data-rd="'+n+'" data-icon="'+icn+'">Connect with '+n+'</a>';
				$('[data-rd="login_field"]').append(sl_btn).enhanceWithin();

				//Bind the events
				$("a[data-rd='"+n+"']").on('click',function(){
			        co.connect.onBtnClickSocialLogin(n);
			    });
			});
		}

		//Add the feedback div
		var fb_div = "<div id='connect_info' class='info'></div>";
		$('#cConnect').append(fb_div).enhanceWithin();

		//Buttons: only click to connect
		if (($("body").data("DynamicDetail").data.settings.connect_check == true)&&
			($("body").data("DynamicDetail").data.settings.connect_only == true)
		){
			var c_t_c_b = '<a href="#" data-role="button" name="btn_click_to_connect" data-icon="clock" >Free Access</a>';
			$('#cConnect').append(c_t_c_b).enhanceWithin();

			//Bind the events
			$("a[name=btn_click_to_connect]").on('click',function(){
	            co.connect.onBtnClickToConnectClick();
	        });
		}

		//Buttons: click connect and connect
		if (($("body").data("DynamicDetail").data.settings.connect_check == true)&&
			($("body").data("DynamicDetail").data.settings.connect_only == false)
		){
			var b =  '<div data-role="controlgroup" data-type="horizontal">'+
			  '<a href="#" data-role="button" name="btn_click_to_connect" data-icon="clock" >Free Access</a>'+
			  '<a href="#" data-role="button" name="btn_connect" data-icon="check" >Login</a>'+
			'</div>';
			$('#cConnect').append(b).enhanceWithin();

			//Bind the events
			$("a[name=btn_click_to_connect]").on('click',function(){
	            co.connect.onBtnClickToConnectClick();
	        });

			$("a[name=btn_connect]").on('click',function(){
	            co.connect.onBtnConnectClick();
		    });
		}

		//Buttons: only connect
		if ($("body").data("DynamicDetail").data.settings.connect_check == false){

			var bb =  '<a href="#" data-role="button" name="btn_connect" data-icon="check" >Login</a>';
			$('#cConnect').append(bb).enhanceWithin();

			$("a[name=btn_connect]").on('click',function(){
	            co.connect.onBtnConnectClick();
		    });
		}

		//If we need to diaplay usage:
		if ($("body").data("DynamicDetail").data.settings.usage_show_check == true){
			var u =   '<div data-role="collapsible" data-collapsed="false" data-theme="a" data-content-theme="a">'+
                '<h3>Usage</h3>'+
                '<div id="div_time">'+
                    '<h3>Time</h3>'+
                    '<div id="lbl_slider-time"></div>'+
                    '<br style="clear:both">'+
                    '<input type="range" name="slider-time" id="slider-time" value="0" min="0" max="100" data-highlight="true"  /><b>%</b>'+
                '</div>'+
                '<div id="div_data">'+
                    '<h3>Data</h3>'+
                    '<div id="lbl_slider-data"></div>'+
                    '<br style="clear:both">'+
                    '<input type="range" name="slider-data" id="slider-data" value="0" min="0" max="100" data-highlight="true"  /><b>%</b>'+
	            '</div>'+
            '</div>';
			$('#csUsage').prepend(u).enhanceWithin();

			//Bind the event which will change their color
			$("#slider-time").on("change", function(){
  				HighlightColor($(this));
			});
			$("#slider-data").on("change", function(){
  				HighlightColor($(this));
			});
		}
	}

	var HighlightColor = function (slider){
  		var theVal = slider.val();
		color = "#0DB8B5"; //Light blue
		if (theVal > 20){
			color = "#6FCC43"; //Light green	
		}
		if (theVal > 40){
			color = "#FFE433"; //Yello
		} 
		if (theVal > 60){
			color = "#FC8F12"; //Orange 
		}
		if (theVal > 80){
			color = "#D92727"; //Red
		}        
		slider.closest(".ui-slider").find(".ui-slider-bg").css("background-color", color);        
	}

    //Expose those public items...
    return {         
        isHotspot       : isHotspot,
        addDynamicInfo  : addDynamicInfo
    }   
  }
})();
