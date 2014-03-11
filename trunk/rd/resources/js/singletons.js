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

