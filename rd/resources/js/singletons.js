//-- The purpose of this file is to contain all the singletons which will be used by the aplication.
//-- Things like the toaster; the translator etc, all which are singletons will be placed in this file

function i18n(key, arrInsertValues) {
    return Local.getLocalizedString(key, arrInsertValues);
}

// "Local" is a simple "static" object containing methods and localization strings
Local = {
    languageCode: 'ja',
    languageCodeDefault: 'en',
    charset: 'utf-8',
    languages: [],  

    getLocalizedString: function(key, objInsertValues) {
        if (!this.localizedStrings[key]) {    
            return 'Not Defined'; // return empty string if key is undefined
        }
        
        // give 'em what they asked for
        return (this.formatString(this.localizedStrings[key], objInsertValues));
    },
    // returns a localized string formatted to replace values {x} with that specified in the object
    formatString: function(string, objInsertValues) {
        var formattedString = string;
        if (objInsertValues) {  
            var keys = Ext.Object.getKeys(objInsertValues);
            Ext.Array.forEach(keys, function(k){
                formattedString = formattedString.replace('{' + k + '}', objInsertValues[k]);
            });
        }
        return formattedString;
    },
    localizedStrings: {}    //We start with an empty object which we will poplulate 
                            //by doing a AJAX call to the server for the strings
}

//---------------------------------------------

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
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

