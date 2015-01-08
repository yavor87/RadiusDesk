Ext.define('Mikrotik.view.navNewUser', {
    extend	: 'Ext.navigation.View',
    xtype	: 'navNewUser',
    requires: [
    ],
	activeItem	: 0,
	config: {
        navigationBar: {
			ui		: 'light',
			docked	: 'bottom',
			items: [{
				xtype	: 'button',
				text	: 'Next',
				align	: 'right',
				itemId	: 'navBtnNext'
			}]
		}
    },
	constructor: function(config) {
        var me 	= this;
		
		var strVar	= "";
		strVar += "<h1>Sign-up for free Internet</h1>";
		strVar += "We would like to give you some free Internet!<br>";
		strVar += "Before we can do that though, please sign up with us.";

        config.items    =	[
			{
				title		: 'Read first',
				html		: strVar,
				itemId		: 'pnlUsrRegIntro',
				styleHtmlContent : true,
				styleHtmlCls: 'regHtml'
			}
		]; 
        me.callParent([config]); 
    }
});
