var rdClient = (function () {

    //Immediately returns an anonymous function which builds our modules
    return function (co) {    //co is short for config object
    
    
        //=====Constants======
        var h               = document.location.hostname;
        var urlUse          = location.protocol+'//'+h+'/cake2/rd_cake/radaccts/get_usage.json'
        var cAjaxTimeout    = 3000;
        var cDynamicData    = undefined; //Will be populated when gettting DynamicDetail from back-end
        var cDebug          = false;
        
        //Change the following when using this on the Mobile page
        var cMaxWidth       = 300; //300 mobile 600 desktop
        var cMinWidth       = 280; //280 mobile 300 desktop
        var hideLogin       = false;//false mobile true desktop
        
        var userName        = '';
        var voucher         = '';
        
        var counter         = undefined; //refresh counter's id
        
        var timeUntilUsage  = 20 //Default value
	    var usageInterval	= 20;
            
        //====Functions======
        fDebug          = function(message){  
            if(cDebug){
                console.log(message)  
            }
        };
        
        var init = function(){
            fDebug("Logic Inited");
            fShowLogin();       
        };
        
        var fShowLogin = function(){
            fDebug("Show Login Screen");
            
            var voucher_user = [
                {
                    view    :"tabbar", 
                    id      :'tabbar', 
                    multiview: {
                      fitBiggest:false
                    }, 
                    value   :'userView',
                    css     :"tabSmaller",
                    options : [
                        { value: "<span class='webix_icon fa-user'></span>User", id: 'userView' },
                        { value: "<span class='webix_icon fa-ticket'></span>Voucher", id: 'voucherView'}
                    ]
                },
                {
                    cells   :[
                        {
                            id:"userView",
                            rows:[
                                { view:"text", label:"Username",    name: "username",id:'Username'}
                            ]
                        },
                        {
                            id  :"voucherView", 
                            rows:[
                                { view:"text", label:"Voucher", name: "voucher",id:'voucher'}
                            ]
                        }
                    ]
                }
            ]; 
            
            //Buttons
            var b = [];
            
            b.push({view:"template",borderless:true,id:'tplConnectInfo',height: 40});
            
            b.push({
                view    : "button", 
                value   : "Check usage" , 
                type    : "form",
                id      : 'btnLogin'
            }); 
            
            var con_insides  = voucher_user.concat(b);
            
            
            var c_v = {
                cols: [
		            {view:"template",borderless:true,css:'divClear'},
		            {
		                minWidth    : cMinWidth,
                        maxWidth    : cMaxWidth,
                        id          : 'layoutConnect',
                        visibleBatch: 'scrnConnect',
                        borderless  : true,
                        type        : 'space',
		                rows: [{
		                        //scrnConnect
		                        view    :"form",
		                        scroll  :true,
                                rows:[
                                    {
                                        view        :"form",
                                        borderless  :true,
                                        id          :"formConnect", 
                                        css         : 'formConnect',                       
                                        elementsConfig:{
                                            labelPosition:"top"
                                        },
                                        rows: con_insides
                                    }
                                 ]
                             }
                        ]
                    },
                    {view:"template",borderless:true,css:'divClear'}  
		            ]
            }; 
            webix.ui([c_v], $$('scrnHome'));
            
            if($$('btnLogin') != undefined){
                $$('btnLogin').attachEvent("onItemClick", function(){
                    onBtnConnectClick()
                });
            }   
        };
        
        
         var onBtnConnectClick = function(){  //Get the latest challenge and continue from there onwards....
            
		    //Clear previous errors
		    clearLoginError();
		    
		    if(	($$('voucher').getValue().length == 0)&&
			    ($$('Username').getValue().length == 0)
		    ){
			    //console.log("voucher and user EMPTY");
			    showLoginError("Required value missing - Please supply");
		    }else{
		        if($$('voucher').getValue().length == 0){
		            userName = escape($$('Username').getValue());
		        }else{
        		    userName  = escape($$('voucher').getValue());
        	    }
        		doLogin();
		    }   
        }
        
        var doLogin = function(){
        
            var c_v = {
                cols: [
		            {view:"template",borderless:true,css:'divClear'},
		            {
		                minWidth    : cMinWidth,
                        maxWidth    : cMaxWidth,
                        id          : 'layoutUsage',
                        borderless  : true,
                        type        : 'space',
		                rows: [{
		                        //scrnConnect
		                        view    :"form",
		                        scroll  :true,
                                id  :"usageView",   
                                rows:[
                                    {
                                        view: 'template',
                                        borderless:true,
                                        height: 25,
                                        id  : 'tmplCenter',
                                        template: "User/Voucher <strong>"+userName+"</strong>"
                                    },
                                    { view:"slider", label:"Data", value:"20", name:"data",       
                                        height: 100,
                                        id: 'sliderData'
                                    },
                                    { view:"slider", label:"Time", value:"20", name:"time",
                                        height: 100,
                                        id: 'sliderTime'
                                    },
                                    {
                                        view: 'template',
                                        borderless:true,
                                        height: 25,
                                        id  : 'templateUsagerRefesh',
                                        template: "<strong>Refreshing in </strong><span id='usage_refresh' class='info'> </span><strong> seconds.</strong>"
                                    },
                                    {
                                        view    : "button", 
                                        value   : "Exit" , 
                                        type    : "danger",
                                        id      : 'btnExit'
                                    }
                                ]
                             }
                        ]
                    },
                    {view:"template",borderless:true,css:'divClear'}  
		            ]
            }; 
            webix.ui([c_v], $$('scrnHome'));
            
            if($$('btnExit') != undefined){
                $$('btnExit').attachEvent("onItemClick", function(){
                    clearInterval(counter);
                    fShowLogin();
                });
            }      
            refreshCounter();        
        }
        
        var showLoginError = function(msg){
		    if($$('tplConnectInfo') == undefined){
		        return;
		    }
		    var t= $$('tplConnectInfo').getNode();
		    $(t).removeClass("fbInfo");
		    $(t).addClass("fbError");
		    $$('tplConnectInfo').setHTML(msg);
            $$('tplConnectInfo').show();	
        }

        var clearRefresh = function(){
            if(counter != undefined){
                clearInterval(counter);
                counter   = undefined;
			    timeUntilUsage  = usageInterval;
            }
        }
        
        
        var clearLoginError	= function(){
		    hideFeedback();
	    }
	    
	    var refreshCounter = function(){
            var me = this;
            //Prime it
            rdUsageRefresh(); 

            counter = setInterval (function(){    
			    //Usage part
			    timeUntilUsage = timeUntilUsage-1;
                if(false){    //We remove ourself gracefully FIXME
                    clearInterval(counter);
                    counter   = undefined;
                    timeUntilUsage = usageInterval;
                }else{
                    $('#usage_refresh').text(timeUntilUsage);
                    if(timeUntilUsage == 0){      //Each time we reach null we refresh the screens
                        timeUntilUsage = usageInterval; //Start anew
                        rdUsageRefresh();
                    }
                }

            }, 1000 );
        }
        
        var rdUsageRefresh = function(){
        
		    var un = userName;
		    
            $.getJSON(urlUse,{'username' : un,'mac' : ''}, 
                function(j) {
                    fDebug(j);
				    if(j.success == false){
					    return;
				    }

                    //If the time available is 'NA' we must hide the time div
                    if(j.data.time_cap == null){
                        $$('sliderTime').hide();

                    }else{

                        var time_total     = j.data.time_cap;
			            var pers_time_used = (j.data.time_used / j.data.time_cap) * 100;
					    var time_avail	   = j.data.time_cap - j.data.time_used;
                        
                        $$('sliderTime').setValue(pers_time_used);
                        $$('sliderTime').define("title", "<strong>Used </strong>"+time(j.data.time_used)+"<strong> Available </strong>"+ time(time_avail));
                        $$('sliderTime').refresh();
                        
                    }

                    //If the data available is 'NA' we must hide the time div
                    if(j.data.data_cap == null){
                        $$('sliderData').hide();
                    }else{

                        var data_total     = j.data.data_cap;
			            var pers_data_used = (j.data.data_used / j.data.data_cap) * 100;  
					    var data_avail	   = j.data.data_cap - j.data.data_used;
					    
                        $$('sliderData').setValue(pers_data_used);
                        $$('sliderData').define("title", "<strong>Used </strong>"+bytes(j.data.data_used)+"<strong><br>Available </strong>"+ bytes(data_avail));
$$('sliderData').refresh();
                        
                        //.html("<strong>Used </strong>"+bytes(j.data.data_used)+"<strong> Available </strong>"+ bytes(data_avail));


                    }
                });
        }
	    
	    
        
        var showFeedback	= function(msg){
		    //console.log("Show feedback "+msg);
		    if($$('tplConnectInfo') == undefined){
		        return;
		    }
		    var t= $$('tplConnectInfo').getNode();
		    $(t).removeClass("fbError");
		    $(t).addClass("fbInfo");
            $$('tplConnectInfo').setHTML(msg);
            $$('tplConnectInfo').show();
	    }

	    var hideFeedback	= function(){
		    fDebug("Hide feedback");
		    
		    if($$('tplConnectInfo') == undefined){
		        return;
		    }
		    
		    $$('tplConnectInfo').setHTML("");
		    $$('tplConnectInfo').define("css", "");
		    $$('tplConnectInfo').refresh();
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
            init            : init
        }   
    }
})();
