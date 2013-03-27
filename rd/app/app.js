Ext.Loader.setConfig({enabled:true});

Ext.require([
    'Ext.window.MessageBox',
    'Ext.tip.*',
    'Ext.util.*',
    'Ext.state.*'
]);

//Declare some constants
Ext.namespace('Rd').config = {
    //buttonMargin    : '0 20 40 0',
    buttonMargin    : '10 15 10 15',
    fieldMargin     : 15,
    labelWidth      : 150,
    maxWidth        : 400,
};


Ext.application({
    //Patch like a profesional: http://flexblog.faratasystems.com/2012/02/27/the-best-way-to-organize-your-ext-js-overrides
    requires: ['Rd.patch.ExtJS411aPatch'],
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

