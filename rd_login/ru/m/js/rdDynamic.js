var rdDynamic = (function () {

    //Immediately returns an anonymous function which builds our modules
    return function (co) {    //co is short for config object
    
    
        //=====Constants======
        cDynUrl         = "http://"+document.location.hostname+"/cake3/rd_cake/dynamic-details/info-for.json";
        cAjaxTimeout    = 3000;
        cDynamicData    = undefined; //Will be populated when gettting DynamicDetail from back-end
        cDebug          = false;
        
        //Change the following when using this on the Mobile page
        cMaxWidth       = 300; //300 mobile 600 desktop
        cMinWidth       = 280; //280 mobile 300 desktop
        hideLogin       = false;//false mobile true desktop
        
        //====Functions======
        fDebug          = function(message){  
            if(cDebug){
                console.log(message)  
            }
        };
        
        var init = function(){
            fDebug("Logic Inited");
               
            //Take care of resizing      
            window.onresize = resize; //Bind the resize event  
            resize();
            
            //Take care of the toolbar
            toolbar();   
              
            getDynamicDetail();
        };
        
        var  resize = function(){
        
            if($$("menuToolbar") == undefined){
                return
            }
        
            var h = $$("menuToolbar").$height;

            $$("scrollMain").define("height", window.innerHeight-h);
            $$("scrollMain").resize();
            
            $$('scrnHome').define("height", window.innerHeight-h);
            $$('scrnHome').resize();
            
            $$('scrnHelp').define("height", window.innerHeight-h);
            $$('scrnHelp').resize();
            
            $$('scrnPhoto').define("height", window.innerHeight-h);
            $$("scrnPhoto").resize();
            
            $$("scrnAbout").define("height", window.innerHeight-h);
            $$("scrnAbout").resize();

        };
        
        var toolbar = function(){
        
            if($$("menuToolbar") == undefined){
                return
            }
        
            $$("btnHome").attachEvent("onItemClick",function(){ $$("scrollMain").showView("scrnHome");});
            $$("btnHelp").attachEvent("onItemClick",function(){ $$("scrollMain").showView("scrnHelp");});
            $$("btnPhoto").attachEvent("onItemClick",function(){ $$("scrollMain").showView("scrnPhoto");});
            $$("btnAbout").attachEvent("onItemClick",function(){ 
                $$("scrollMain").showView("scrnAbout");
            });
            
            $$("btnConnect").attachEvent("onItemClick",function(){ 
            
                if($$("layoutConnect").isVisible()){
                    $$("layoutConnect").hide();
                }else{
                    $$("layoutConnect").show();
                }
                $$("scrollMain").showView("scrnHome");
                
            });       
        };    
        
        var getDynamicDetail = function(){
            var h       = document.location.hostname;
		    var dynUrl  = "http://"+h+"/cake3/rd_cake/dynamic-details/info-for.json";
            var s       = document.location.search;
            
            fDebug("Fetching DynamicDetail");
           
            webix.ajax().timeout(cAjaxTimeout).get(
                cDynUrl+s,{ 
                error   : function(text, data, XmlHttpRequest){
                    fDebug("Problems fetching Dynamic Detail");    
                },
                success : function(text, data, XmlHttpRequest){
                    if(data.json().success == true){
                        fDebug("Got Dynamic Detail");                
                        cDynamicData = data.json().data;
                        fDebug(cDynamicData);
                        buildGuiBasedOnData();
                    }else{
                        webix.alert({
                            title: "Huston we have a problem",
                            text: "Go to RADIUSdesk, open the <b>Dynamic Login Pages</b> applet.<br>"+
                            "Select an entry and <b>edit</b> it.<br>"+
                            "Make sure you added an identifier from this URL's query string under <b>Dynamic Keys</b>"+
                            " to ensure proper working of this login page<br>",
                            type:"confirm-error"
                        });
                    }
                }
            });
        };
        
        
        var buildGuiBasedOnData = function(){
            fDebug("Building GUI");
            
            //The Connect Screen
            guiConnect();
            
            //The Help Screen
            guiHelp();
                    
            //We build the photo's
            guiGallery();
            
            //About Gui
            guiAbout();
            
            //Fill it 
            
            //Call the Connect side....
            var c       = rdConnect({cDynamicData: cDynamicData});
            c.index(); 
            //Check if this page was a sosial login return
		    c.checkSocialLoginReturn(); 
        };
    
        var guiConnect  = function(){
    
            //Username and or Voucher
            var voucher_user = []; //Default is to have the voucher;
        
            if(
                (cDynamicData.settings.voucher_login_check == true)&&
                (cDynamicData.settings.user_login_check == true)){
               
                    voucher_user = [
                        {
                            view    :"tabbar", 
                            id      :'tabbar', 
                            multiview:true, 
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
                                        { view:"text", label:"Username", name: "username",id:'Username'},
                                        { view:"text", type:"password", name: "password",label:"Password",id:"Password"}
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
                         
            }else{
                if(
                    (cDynamicData.settings.voucher_login_check == false)&&
                    (cDynamicData.settings.user_login_check == true)){
                
                    voucher_user = [
                        { view:"text", label:"Username", name: "username",id:'Username'},
                        { view:"text", type:"password", name: "password",label:"Password",id:"Password"}
                    ];
                }
                
                
                if(
                    (cDynamicData.settings.voucher_login_check == true)&&
                    (cDynamicData.settings.user_login_check == false)){
                
                        voucher_user = [{ view:"text", label:"Voucher", name: "voucher",id:'voucher'}]; //Default is to have the voucher;
                }
                
            }
            
            //Buttons
            var b = [];
            
            if(cDynamicData.settings.connect_only == true){
                 if(cDynamicData.settings.t_c_check == true){
                    b.push({ 
                        view    : "checkbox",
                        id      : 'checkboxTandC',
                        labelRight:"<a href='"+cDynamicData.settings.t_c_url+"' target='_blank'>Terms and Conditions</a>"
                    });
                    
                     b.push({
                        view        : 'template',
                        borderless  : true,
                        height      : 40,
                        css         : 'tcText',
                        template    : "* By continuing, you agree to the terms and conditions."
                    });
                    
                }
                
                b.push({view:"template",borderless:true,id:'tplConnectInfo',height: 50});
                
                b.push({ 
                    view    : "button", 
                    value   : "Free Access" , 
                    id      : 'btnClickToConnect',
                    css     : 'btnDashed'
                });  
                
                var con_insides  = b;
            }else{
            
                if(cDynamicData.settings.t_c_check == true){
                    b.push({ 
                        view    : "checkbox", 
                        id      : 'checkboxTandC',
                        css     : 'checkboxTandC',
                        labelRight:"<a href='"+cDynamicData.settings.t_c_url+"' target='_blank'>Terms and Conditions</a>"
                    });
                    
                     b.push({
                        view        : 'template',
                        borderless  : true,
                        height      : 40,
                        css         : 'tcText',
                        template    : "* By continuing, you agree to the terms and conditions."
                    });
                    
                }
                
                b.push({view:"template",borderless:true,id:'tplConnectInfo',height: 50});
                
                if(
                    (cDynamicData.settings.voucher_login_check == true)||
                    (cDynamicData.settings.user_login_check == true)){
                
                        b.push({
                            view    : "button", 
                            value   : "Login" , 
                            type    : "form",
                            id      : 'btnLogin'
                        });
                }
                
                
                if(cDynamicData.settings.connect_check == true){
                    b.push({ 
                        view    : "button", 
                        value   : "Free Access" , 
                        id      : 'btnClickToConnect',
                        css     : 'btnDashed'
                    });
                }
                
                if(cDynamicData.settings.social_login.active == true){
                    cDynamicData.settings.social_login.items.forEach(function(i){
                        var n = i.name;
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
				               
                        b.push({ 
                            view    : 'button',
                            type    : "htmlbutton", 
                            label   : '<span class="webix_icon fa-'+icn+'"></span><span class="text"> Connect with '+i.name+'</span>',
                            id      : 'btn'+n,
                            css     : 'btnDashed btn'+n
                        });
                    });
                }
                
                if(cDynamicData.settings.register_users == true){
                    b.push({ 
                        view    : 'button',
                        type    : "htmlbutton", 
                        label   : '<span class="webix_icon fa-star"></span><span class="text"> Sign Up</span>',
                        id      : 'btnRegister',
                        css     : 'btnDashed btnRegister'
                    });
                }
                
                if(cDynamicData.settings.lost_password == true){
                    b.push({ 
                        view    : 'button',
                        type    : "htmlbutton", 
                        label   : '<span class="webix_icon fa-key"></span><span class="text"> Lost Password</span>',
                        id      : 'btnPassword',
                        css     : 'btnDashed btnPassword'
                    });
                }
                
                
                var con_insides  = voucher_user.concat(b);
            };
                 
            //-----
            
            var sTabBarOptions  = [{ value: "<span class='webix_icon fa-heartbeat'></span>Session", id: 'sessionView' }];
            var sTabBarCells    = [
                {
                    id:"sessionView",
                    rows:[
                        { 
                            view    :"property",
                            id      :'propertySession',
                            height  : 160,
                            editable:false,
                            elements:[
                                { label :"Username", type :"text", id:"acct_un"}
                            ]
                        },
                        {
                            view: 'template',
                            borderless:true,
                            height: 25,
                            id  : 'templateSessionRefesh',
                            template: "<strong>Refreshing in </strong><span id='status_refresh' class='info'> </span><strong> seconds.</strong>"
                        }
                    ]
                }
            ];   
            
            if(cDynamicData.settings.usage_show_check == true){
                sTabBarOptions.push({ value: "<span class='webix_icon fa-gears'></span>Usage", id: 'usageView'});
                
                sTabBarCells.push(
                    {
                        id  :"usageView",   
                        rows:[
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
                            }
                        ]
                    }
                );
            }
                
            var tabBarStatus = {
                view    :"tabbar", 
                id      :'tabStatus',
                batch   : 'scrnStatus', 
                multiview:true, 
                css     :"tabSmaller",
                options : sTabBarOptions
            };
            
            var tabStatusContent = {
                batch   : 'scrnStatus',
                cells   : sTabBarCells       
            };      
                    
            //-----
            
            
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
                        hidden      : hideLogin,
		                rows: [{
		                        //scrnConnect
		                        view    :"form",
		                        scroll  :true,
		                        batch   : 'scrnConnect',
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

                             },
                            //scrnStatus
                            {
                                view    :"form",
                                scroll  :true,
                                batch   : 'scrnStatus',
                                rows:[
                                    {
                                        view        : 'form',
                                        elementsConfig:{
                                            labelPosition:"top"
                                        },
                                        rows        : [
                                            tabBarStatus,
                                            tabStatusContent,
                                            { 
                                                view    :"button", 
                                                value   :"Go Onto Internet" , 
                                                type    :"form",
                                                id      : 'btnGoInternet'
                                            },
                                            { 
                                                view    :"button", 
                                                value   :"Disconnect" , 
                                                type    :"danger",
                                                id      : 'btnDisconnect'
                                            },
                                            {}
                                        ]
                                    }
                                ]
                            },
                            //scrnNotHotspot
                            {view:"template",borderless:true, template: "Not a hotspot", type: "header" , batch   : 'scrnNotHotspot'}, 
                            {view:"template",borderless:true, template: "<br><b>Connect through a hotspot please</b>", batch   : 'scrnNotHotspot'}   
                            
                        ]
                    },
                    {view:"template",borderless:true,css:'divClear'}  
		            ]
            };
                    
            webix.ui([c_v], $$('scrnHome'));
            
            //We need this to show an overlay when connecting
            webix.extend($$("layoutConnect"), webix.OverlayBox);
            
            if(cDynamicData.photos[0] != undefined){
                if(cDynamicData.photos[0].file_name != undefined){
                    //If there is not enough space we don't want to squeeze it in
                    if(window.innerWidth > 450){
                        var t= $$('scrnHome').getNode();
                        $(t).css('background-image', 'url(' + cDynamicData.photos[0].file_name + ')');
                    }
                }
            }             
        };
    
        var guiHelp     = function(){ 

            var pages = [];
            
            //Create an array from the list of pages
            cDynamicData.pages.forEach(function(i){
                var item = {view:"template",borderless:true,template:"<h1>"+i.name+"</h1>"+i.content,autoheight:true}
                pages.push(item)
            });
            
            var c_v = {
                cols: [
	                {view:"template",borderless:true,css:'divClear'},
	                { 
	                    view        : "form",
	                    scroll      : true,
	                    minWidth    : cMinWidth,
                        maxWidth    : cMaxWidth,  
                        rows        : pages  
	                },
                    {view:"template",borderless:true,css:'divClear'}  
	                ]
            };
            webix.ui([c_v], $$('scrnHelp'));

        };
    
        var guiGallery = function(){ 
            var photos = [];  
            //Create an array from the list of photos
            cDynamicData.photos.forEach(function(i){
                var file = i.file_name;
                var item = { css: "imgCarousel", template:img, data:{src:file} }
                photos.push(item)
            });
        
            var c = {
                view    :"carousel",
			    id      :"carousel",
			    cols    :photos,
			    navigation:{
                    type: "side",
                    items:true,
                    buttons:true
                }
            }
                
            function img(obj){
		        return '<img src="'+obj.src+'" class="content" ondragstart="return false"/>'
	        }        
           //var id = $$("scrnPhoto").addView(c, 0); 
           webix.ui([c], $$('scrnPhoto')); 
        };
    
        var guiAbout    = function(){
        
            var c = { 
                view        :"property",
                id          :'propertyAbout',
                editable    :false,
                css         :'layoutAbout', 
                height      : 400,
                elements:[
                    { label:"Contact Detail", type:"label"},
                    { label :"Cell",            type :"text", id:"abt_cell"},
                    { label :"Phone",           type :"text", id:"abt_phone"},
                    { label :"Fax",             type :"text", id:"abt_fax"},
                    { label :"email",           type :"text", id:"abt_email"},
                    { label :"URL",             type :"text", id:"abt_url"},
                    {},
                    { label:"Other Info", type:"label"},
                    { label :"Street",          type :"text", id:"abt_street"},
                    { label :"Town/Suburb",     type :"text", id:"abt_town_suburb"},
                    { label :"City",            type :"text", id:"abt_city"},
                    { label :"Country",         type :"text", id:"abt_country"},
                    { label :"Lat/Lon",         type :"text", id:"abt_lat_lon"}
                ]
            } 
            
            var c_v = {
                css         : 'layoutAbout',
                cols: [
		            {view:"template",borderless:true,css:'divClear'},
		            { 
	                    view    :"form",
	                    scroll  :true,
                        rows    :[ 
                            {
	                            borderless  : true,
                                type        : 'space',
                                minWidth    : cMinWidth,
                                maxWidth    : cMaxWidth,  
                                id          : 'layoutAbout',
                                rows        : [
                                    { 
                                        view        : "template", 
                                        template    : "<img src='"+cDynamicData.detail.icon_file_name+"' alt='logo'>", 
                                        height      : 150, 
                                        css         : 'aboutHead' 
                                    },
                                    c/*,
                                    {
                                        view        : "template",
                                        css         : 'powerBy',
                                        template    : "<img src='img/powered_by_small.png' alt='Powered By Logo'>",
                                        height      : 50
                                    }*/
                                ]
                            }
                        ]    
		            },
                    {view:"template",borderless:true,css:'divClear'}
                ]
            };
            
            webix.ui([c_v], $$('scrnAbout'));
            
            //Fill the About gui
            fillAbout();       
        };
        
        var fillAbout = function(){
        
            var name    = cDynamicData.detail.name;
            var cell    = cDynamicData.detail.cell;
            var phone   = cDynamicData.detail.phone;
            var fax     = cDynamicData.detail.fax;
            var email   = cDynamicData.detail.email;
            var url     = cDynamicData.detail.url;
            
            var street_no = cDynamicData.detail.street_no;
            var street    = cDynamicData.detail.street;
            var city      = cDynamicData.detail.city;
            var country   = cDynamicData.detail.country;
            
            var lat       = cDynamicData.detail.lat;
            var lon       = cDynamicData.detail.lon;
            
            $$('propertyAbout').setValues({
                abt_name : name,  
                abt_cell : cell,
                abt_phone: phone,
                abt_fax  : fax,
                abt_email: "<a href='mailto:"+email+"'>"+email+"</a>",
                abt_url  : "<a href='"+url+"'>"+url+"</a>",
                abt_street: street_no+" "+street,
                abt_city : city,
                abt_country : country,
                abt_lat_lon : lat + ' ' + lon
            });
            
            //Set the title
            document.title = name;
        
        }
        
        
       var showNotHotspot = function(){ 
            $$('layoutConnect').showBatch('scrnNotHotspot');
        };
           
        var showStatus = function(){
            $$('layoutConnect').showBatch('scrnStatus');
        };
        
        var showConnect = function(){
            $$('layoutConnect').showBatch('scrnConnect');
        };
              
        //Expose those public items...
        return {         
            init            : init,
            showStatus      : showStatus,
            showNotHotspot  : showNotHotspot,
            showConnect     : showConnect
        }   
    }
})();
