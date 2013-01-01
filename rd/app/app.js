Ext.Loader.setConfig({enabled:true});

Ext.require([
    'Ext.window.MessageBox',
    'Ext.tip.*',
    'Ext.util.*',
    'Ext.state.*'
]);


Ext.application({
    name: 'Rd',
    autoCreateViewport: true,
    desktopData:    null,  //Data on how the desktop will look like which will be returned after login
    languages:      null,
    selLanguage:    null,

    launch: function() {
       var me = this;
       Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
       me.runAction('cStartup','Index');
    },

    runAction:function(controllerName, actionName,a,b){
        var me = this;
        var controller = me.getController(controllerName);
        controller.init(me); //Initialize the contoller
        return controller['action'+actionName](a,b);
    },

    setDesktopData: function(data){
        this.desktopData = data;
    },

    getDesktopData: function(){
        return this.desktopData
    },

    setLanguages: function(data){
        var me = this;
        me.languages = data;
    },
    getLanguages: function(data){
        var me =this;
        return me.languages;
    },

    setSelLanguage: function(data){
        var me =this;
        me.selLanguage = data;
    },
    getSelLanguage: function(data){
        var me =this;
        return me.selLanguage;
    }
});

