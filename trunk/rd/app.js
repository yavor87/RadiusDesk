/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

//Ext.Loader.setConfig({enabled:true});
Ext.Loader.setConfig({enabled:true,disableCaching: false});

Ext.application({

    //Patch like a profesional: http://flexblog.faratasystems.com/2012/02/27/the-best-way-to-organize-your-ext-js-overrides
    requires: [
        'Rd.patch.ExtJS421Patch',
        'Ext.*'
    ],

    controllers: [
        'cStartup',
        'cLogin'
    ],
    models: ['mDesktopShortcut', 'mWallpaper'],
    name        : 'Rd',
    extend      : 'Rd.Application',
    desktopData : null,  //Data on how the desktop will look like which will be returned after login
    languages   : null,
    selLanguage : null,
    autoCreateViewport: true,
    init: function() {
        var me = this;

        me.addConstants();
        me.addUx();

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
    },

    addConstants: function(){

        Ext.namespace('Rd.config');
        //Declare some constants
        Ext.namespace('Rd').config = {
            //buttonMargin    : '0 20 40 0',
            buttonMargin    : '10 15 10 15',
            radioMargin     : '0 10 0 0',
            fieldMargin     : 15,
            labelWidth      : 150,
            maxWidth        : 400,
			numWidth		: 30,
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
            icnOnlineShop   : 57554,
            icnEmail        : 57378,
            icnAttach       : 57380,
            icnCut          : 57551,
            icnTopUp        : 57419,
            icnSubtract     : 57520,
            icnView         : 57650,
			icnConfigure	: 57583,
			icnWatch		: 57628,
			icnStar			: 57585,
			icnGrid			: 57600,
			icnFacebook		: 57558,
			icnGoogle		: 57614,
			icnTwitter		: 57574,
			icnWifi			: 57550,
			icnIP			: 57479,
			icnThumbUp		: 57603,
			icnThumbDown	: 57602,
            icnCPU          : 57452,
            icnNotify       : 57624,
            icnCamera       : 57399,
            icnRedirect     : 57372
        };
    },
    addUx: function(){

        Ext.namespace('Ext.ux'); 

        //-- Constants -->

        Ext.ux.Constants = {
                msgWarn : 4000, //Timeout values for toaster message
                msgInfo : 2000,
                msgError: 8000,
                clsWarn : 'warn', //Classes for the message types
                clsInfo : 'info',
                clsError: 'error'
        }
        //<-- Constants --

        //--- Toaster --->

        //We create a toaster to inform people of our actions
        //This utility can be called the following ways:
        //Ext.ux.Toaster.msg('Buiding added','Adding went fine');
        //Ext.ux.Toaster.msg('Color Selected', 'You choose red',Ext.ux.Constants.clsInfo );
        //Ext.ux.Toaster.msg('Color Selected', 'You choose red',Ext.ux.Constants.clsError, Ext.ux.Constants.msgError );
        //The 3rd and 4th arguments are optional
                
        Ext.ux.Toaster = function(){
            var msgCt;
            var defaultTimeout = 500;
            function createBox(t, s){
                    return '<div class="msg">'+
                                '<h3>' + t + '</h3>'+
                                '<p>'  + s + '</p>' +
                            '</div>';
            }
            //This is a new thing, but valid. JS allows you to return an object, so when we call
            //Ext.toaster.msg('a','b'); we do in fact to the following by chaining
            // var t = Ext.toaster
            // t.msg('a','b');
            //Note that the context in which variables are called in the return object is in the falled function
            //This is why we can refer to msgCt as a local variable defined in this closure.
            return {
                msg : function(title, content, type, timeout){
                    //So this first part check if there is already a msgCt element, if not adds it to the document
                    //Using the Ext.DomHelper which will add a 'div' element by default, now with msg-div as id
                    //The original specified the return of an Ext.Element (true) but it works fine by returning a
                    //dom element (false)
                    if(!msgCt){
                        msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, false);
                    }
                    //Here the 'true' is important to get Ext.Element to do animation on
                    var m = Ext.DomHelper.append(msgCt, createBox(title, content), true);
                    //Add a class if required
                    if(type !== undefined){
                        m.addCls(type);
                    }
                    //Change the timeout if required
                    if(timeout === undefined){
                        timeout = defaultTimeout;   
                    }
                    m.on('click',function(){ //Allow the user to destroy the message (that't typically their natural reaction)
                        m.destroy();
                    })
                    //Here we hide the newly created element first
                    m.hide();  
                    //Then we slide it in (default 2000ms), chained by a ghost effect of 500ms that will remove the message
                    m.slideIn('t').ghost("t", { delay: timeout, remove: true}); 
                }
            };
        }();

        //<-- Toaster --

        //--- Form Fail message --->
        Ext.ux.formFail = function(form,action){
            switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                Ext.ux.Toaster.msg(
                    i18n('sFailure'),
                    i18n('Form fields may not be submitted with invalid values'),
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
            break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                Ext.ux.Toaster.msg(
                    i18n('sFailure'),
                    i18n('Ajax communication failed'),
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
            break;
            case Ext.form.action.Action.SERVER_INVALID:
                Ext.ux.Toaster.msg(
                    i18n('sFailure'),
                    action.result.message.message,
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
            }
        }

        //<-- Form Fail message

        //-- Format to a readable unit --->
        Ext.ux.bytesToHuman = function (fileSizeInBytes) {

            if((fileSizeInBytes == 0)||(fileSizeInBytes == null)){
                return '0 kb';
            }
            var i = -1;
            var byteUnits = [' kb', ' Mb', ' Gb', ' Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
            do {
                fileSizeInBytes = fileSizeInBytes / 1024;
                i++;
            } while (fileSizeInBytes >= 1024);

            return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
        };

        //-- Format to a readable time -->
        Ext.ux.secondsToHuman = function(seconds) {
            var numdays     = Math.floor(seconds / 86400); 
            var numhours    = Math.floor((seconds % 86400) / 3600);
            var numminutes  = Math.floor(((seconds  % 86400) % 3600) / 60);
            var numseconds  = ((seconds % 86400) % 3600) % 60;
            return  padDigits(numdays,2) + ":" + padDigits(numhours,2) + ":" + padDigits(numminutes,2) + ":" + padDigits(numseconds,2);

            function padDigits(number, digits) {
                return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
            }
        }

        //-- Format to a readable amount -->
        Ext.ux.centsToHuman = function(cents) {
            return (cents/100).toFixed(2); 
        }

    }
});

