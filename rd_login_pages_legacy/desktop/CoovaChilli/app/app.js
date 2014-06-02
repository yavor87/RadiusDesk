/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

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
    name: 'CoovaLogin',

    views: [
        'Main',
        'Viewport'
    ],

    controllers: [
        'Desktop',
        'Connect'
    ],

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
                        Ext.getBody().unmask();
                    }
                }
            });
        });

        // Run the fade 500 milliseconds after launch.
        task.delay(500);
        this.getController('Desktop').startUp();
    }
});
