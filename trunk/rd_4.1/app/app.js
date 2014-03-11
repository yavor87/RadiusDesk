Ext.Loader.setConfig({enabled:true});
//Ext.Loader.setConfig({enabled:true,disableCaching: false});

Ext.require([
    'Ext.window.MessageBox',
    'Ext.tip.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.field.*'
]);

//Declare some constants
Ext.namespace('Rd').config = {
    //buttonMargin    : '0 20 40 0',
    buttonMargin    : '10 15 10 15',
    fieldMargin     : 15,
    labelWidth      : 150,
    maxWidth        : 400,
    panelGrey       : '#e5e6ef'
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
        //We call it here pre-maturely else it gives an error
        me.applyVtypes();
      // Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
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
    },
    applyVtypes: function(){

        Ext.apply(Ext.form.field.VTypes, {

            //__IP Address__
            IPAddress:  function(v) {
                return (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/).test(v);
            },
            IPAddressText:  i18n('sExample') + ': 192.168.1.1',
            IPAddressMask: /[\d\.]/i,
         
            //__ MAC Address __
            MacAddress: function(v) {
                return (/^([a-fA-F0-9]{2}-){5}[a-fA-F0-9]{2}$/).test(v);
            },
            MacAddressMask: /[a-fA-F0-9\-]/,
            MacAddressText: i18n('sExample') + ': 01-23-45-67-89-AB',
         
            //__ Hostname __
            DnsName: function(v) {
                return (/^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/).test(v);
            },
            DnsNameText: i18n('This is not a valid DNS name'),
            
            //__ Password match __
            PasswordMatch: function(a,b){
                var me  = this;
                var f   = b.up('form');
                var pwd = f.down('#password');
                if(pwd != null){
                    if(a != pwd.getValue()){
                        return false;
                    }else{
                        return true;
                    }   
                }
                return true;
            },
            PasswordMatchText: i18n('sPasswords_does_not_match'),

            //__ Numeric __
            Numeric : function(){
				  var objRegExp  =  /[0-9]/;
				  return function(strValue){
					  //check for numeric characters
					  return objRegExp.test(strValue);
				  }
		    }(),
		    NumericText: 'Only numbers are allowed',
            NumericMask: /[0-9]/

            //__ Voucher batch required __

        });

    }
    
});

