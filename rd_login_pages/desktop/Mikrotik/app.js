/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

var splashscreen;
Ext.onReady(function() {
    // Start the mask on the body and get a reference to the mask
   splashscreen = Ext.getBody().mask('Loading website....', 'splashscreen');
    // Add a new class to this mask as we want it to look different from the default.
   splashscreen.addCls('splashscreen');

    // Insert a new div before the loading icon where we can place our logo.
  Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
       cls: 'x-splash-icon'
   });
});

Ext.Loader.setConfig({enabled:true,disableCaching: false});
var infoServer= "http://"+document.location.hostname;

Ext.application({
    name                : 'Mikrotik',
    extend              : 'Mikrotik.Application',
    autoCreateViewport  : true,
    controllers         : ['Desktop'],

    //____Configuration settings comes here____:
    config: {
        urlRealmInfo: infoServer+'/cake2/rd_cake/dynamic_details/info_for.json',
        urlUam      : infoServer+'/rd_login_pages/services/uam.php',
        urlBase     : infoServer,
        noStatus    : false,
        redirectTo  : "http://google.com",
        urlScaler   : '/cake2/rd_cake/webroot/files/image.php',
        removeMacUrl: infoServer+"/cake2/rd_cake/devices/remove_mac.json",
        jsonTimeout : 10000,
        urlPayPalVoucher: infoServer+'/cake2/rd_cake/fin_paypal_transactions/voucher_info_for.json',
        urlPayUVoucher  : infoServer+'/cake2/rd_cake/fin_pay_u_transactions/voucher_info_for.json',
		urlUsage		: infoServer+'/cake2/rd_cake/radaccts/get_usage.json',
		urlAdd			: infoServer+'/cake2/rd_cake/register_users/new_permanent_user.json',
		urlLostPw		: infoServer+'/cake2/rd_cake/register_users/lost_password.json',
		urlMyGateToken	: infoServer+'/cake2/rd_cake/fin_my_gate_tokens/cc_to_token.json',
		urlSocialBase	: infoServer+'/cake2/rd_cake/auth/', //Be sure this is the same as specified in FB e.g. IP or DNS!!
		urlSocialInfoFor: infoServer+'/cake2/rd_cake/third_party_auths/info_for.json' //To pull the username and password associated with this ID + type
    },
    //____ End of Configuration settings _____

    init: function(){
        var me = this;
        me.addConstants();
        Ext.setGlyphFontFamily('typicons');
    },
    launch: function() {
        if (window.console) {
            window.console.log("App starting");     
        }   
        // Setup a task to fadeOut the splashscreen
        var task = new Ext.util.DelayedTask(function() {
            // Fade out the body mask
            splashscreen.fadeOut({
                duration: 1000,
                remove:true
            });
            // Fade out the icon and message
            splashscreen.next().fadeOut({
                duration: 1000,
                remove:true,
                listeners: {
                    afteranimate: function() {
                        // Set the body as unmasked after the animation
   
                    }
                }
            });
        });
        // Run the fade 500 milliseconds after launch.
        task.delay(500);
    },
    addConstants: function(){

        Ext.namespace('Mikrotik.config');
        //Declare some constants
        Ext.namespace('Mikrotik').config = {
			buttonMargin    : '10 15 10 15',
            fieldMargin     : 15,
            labelWidth      : 150,
            maxWidth        : 400,
            icnLock         : 57495,    //Glyphs
            icnYes          : 57605,
            icnMenu         : 57594,
            icnInfo         : 57479,
            icnPower        : 57541,
            icnSpanner      : 57583,
            icnHome         : 57473,
            icnDynamic      : 57392,
            icnVoucher      : 57606,
            icnPdf          : 57447,
            icnCsv          : 57415,
            icnNext         : 57370,
            icnBack         : 57357,
            icnReload       : 57374,
            icnAdd          : 57537,
            icnEdit         : 57524,
            icnDelete       : 57610,
            icnTime         : 57588,
            icnKey          : 57485,
            icnClose        : 57609,
            icnHelp         : 57347,
            icnLight        : 57487,
            icnNote         : 57531,
            icnExpand       : 57457,
            icnRealm        : 57557,
            icnFolder       : 57463,
            icnTags         : 57592,
            icnComponent    : 57544,
            icnProfile      : 57468,
            icnRadius       : 57444,
            icnNas          : 57589,
            icnMap          : 57645,
            icnSnapshot     : 57400,
            icnActivity     : 57408,
            icnGraph        : 57410,
            icnHistory      : 57628,
            icnClear        : 57552,
            icnStart        : 57604,
            icnStop         : 57608,
            icnLog          : 57438,
            icnBug          : 57344,
            icnTranslate    : 57466,
            icnCopy         : 57590,
            icnMeta         : 57630,
            icnFlag         : 57454,
            icnCountry      : 57645,
            icnLanguage     : 57516,
            icnUser         : 57618,
            icnDevice       : 57432,
            icnMesh         : 57460,
            icnShop         : 57554,
            icnConnect      : 57489,
            icnOptions      : 57596,
			icnFacebook		: 57558,
			icnGoogle		: 57614,
			icnTwitter		: 57574
        };
    }
});
