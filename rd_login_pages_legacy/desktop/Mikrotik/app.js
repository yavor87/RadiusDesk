/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

var splashscreen;
Ext.Loader.setConfig({enabled:true,disableCaching: false});
var infoServer= "http://"+document.location.hostname;

Ext.onReady(function() {
    // Start the mask on the body and get a reference to the mask
    splashscreen = Ext.getBody().mask('Loading website....');
});


Ext.application({
    name                : 'MikrotikLogin',
    extend              : 'MikrotikLogin.Application',
    autoCreateViewport  : true,

    //____Configuration settings comes here____:
    config: {
        urlRealmInfo: infoServer+'/cake2/rd_cake/dynamic_details/info_for.json',
        urlBase     : infoServer,
        noStatus    : false,
        redirectTo  : "http://google.com"
    },
    //____ End of Configuration settings _____

    //We put the active window property at the application level in order to have a central place to set and get it
    activeWindow    : undefined,
    controllers: [
        'cDesktop',
        'cConnect'
    ],

    launch: function() {

        var me = this;
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
                        
                    }
                }
            });

        });
        // Run the fade 500 milliseconds after launch.
        task.delay(500);
    }
});
