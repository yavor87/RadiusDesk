Ext.define('CoovaChilli.config.Config', {
    singleton: true,
    config: {
        urlRealmInfo: 'http://'+document.location.hostname+'/cake2/rd_cake/dynamic_details/info_for.json',
        urlUam      : 'http://'+document.location.hostname+'/rd_login_pages/services/uam.php',
        urlUsage    : 'http://'+document.location.hostname+'/c2/yfi_cake/third_parties/json_usage_check',
        urlBase     : 'http://'+document.location.hostname,
        noStatus    : false,
        redirectTo  : "http://google.com",
        urlScaler   : '/cake2/rd_cake/webroot/files/image.php',
        jsonTimeout : 10000
    },
 
    constructor: function(config) {
        this.initConfig(config);
        return this;
    },
 
    isWebApp: function() {
        if(document.URL.indexOf('http') != -1) {
          return true;
        }
        return false;
    }
});
