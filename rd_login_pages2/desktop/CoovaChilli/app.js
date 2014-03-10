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
    name    : 'CoovaChilli',
    extend  : 'CoovaChilli.Application',
    autoCreateViewport: true,

    //____Configuration settings comes here____:
    config: {
        urlRealmInfo: infoServer+'/cake2/rd_cake/dynamic_details/info_for.json',
        urlUam      : infoServer+'/rd_login_pages/services/uam.php',
        urlUsage    : infoServer+'/c2/yfi_cake/third_parties/json_usage_check',
        urlBase     : infoServer,
        noStatus    : false,
        redirectTo  : "http://google.com"
    },
    //____ End of Configuration settings _____
    showHelp: false,
    //This is an enhancement which will auto appen the user's realm when they log in etc.
    realm: {
        name: false,
        auto_append: false,
        append: true
    },

    //We put the active window property at the application level in order to have a central place to set and get it
    activeWindow: undefined,
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
        this.getController('Desktop').startUp();
    },
    addConstants: function(){

        Ext.namespace('CoovaChilli.config');
        //Declare some constants
        Ext.namespace('CoovaChilli').config = {
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
            icnConnect      : 57489
        };
    }
});
