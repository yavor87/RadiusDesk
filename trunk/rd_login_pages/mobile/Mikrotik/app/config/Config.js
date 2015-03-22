Ext.define('Mikrotik.config.Config', {
    singleton: true,
    config: {
        urlRealmInfo: 'http://'+document.location.hostname+'/cake2/rd_cake/dynamic_details/info_for.json',
        urlUam      : 'http://'+document.location.hostname+'/rd_login_pages/services/uam.php',
        urlUsage    : 'http://'+document.location.hostname+'/c2/yfi_cake/third_parties/json_usage_check',
        urlBase     : 'http://'+document.location.hostname,
        noStatus    : false,
        redirectTo  : "http://google.com",
        urlScaler   : '/cake2/rd_cake/webroot/files/image.php',
        removeMacUrl: 'http://'+document.location.hostname+"/cake2/rd_cake/devices/remove_mac.json",
        jsonTimeout : 10000,
        paymentGw   : true,
        paymentGwType   : 'cntPayAd',
        urlPayPalVoucher: 'http://'+document.location.hostname+'/cake2/rd_cake/fin_paypal_transactions/voucher_info_for.json',
        urlPayUVoucher  : 'http://'+document.location.hostname+'/cake2/rd_cake/fin_pay_u_transactions/voucher_info_for.json',
		urlUsage		: 'http://'+document.location.hostname+'/cake2/rd_cake/radaccts/get_usage.json',
		urlAdd			: 'http://'+document.location.hostname+'/cake2/rd_cake/register_users/new_permanent_user.json',
		urlLostPw		: 'http://'+document.location.hostname+'/cake2/rd_cake/register_users/lost_password.json',
		urlSocialBase	: 'http://'+document.location.hostname+'/cake2/rd_cake/auth/', 
		urlSocialInfoFor: 'http://'+document.location.hostname+'/cake2/rd_cake/third_party_auths/info_for.json' 
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
