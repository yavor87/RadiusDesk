/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

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
    panelGrey       : '#e5e6ef',
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
    icnRealm        : 57557
};


Ext.application({

    //Patch like a profesional: http://flexblog.faratasystems.com/2012/02/27/the-best-way-to-organize-your-ext-js-overrides
    requires: ['Rd.patch.ExtJS421Patch'],
    name        : 'Rd',
    extend      : 'Rd.Application',
    desktopData : null,  //Data on how the desktop will look like which will be returned after login
    languages   : null,
    selLanguage : null,
    autoCreateViewport: true,
    

    init: function() {
        var me = this;
        Ext.setGlyphFontFamily('typicons');
        Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
        me.applyVtypes();
    },
    launch: function() {
       var me   = this;
       me.runAction('cStartup','Index');
    },

    runAction:function(controllerName, actionName,a,b){
        var me          = this;
        var controller  = me.getController(controllerName);
        controller.init(me); //Initialize the contoller
        return controller['action'+actionName](a,b);
    },

    setDesktopData: function(data){
        var me          = this;
        me.desktopData  = data;
    },

    getDesktopData: function(){
        var me          = this;
        return me.desktopData;
    },

    setLanguages: function(data){
        var me = this;
        me.languages = data;
    },
    getLanguages: function(data){
        var me = this;
        return me.languages;
    },

    setSelLanguage: function(data){
        var me =this;
        me.selLanguage = data;
    },
    getSelLanguage: function(data){
        var me = this;
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

