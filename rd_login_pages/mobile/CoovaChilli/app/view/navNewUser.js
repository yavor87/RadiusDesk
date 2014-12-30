Ext.define('CoovaChilli.view.navNewUser', {
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
		},
		items:	[
			{
				title		: 'Read first',
				html		: "<h1>Sign-up for free Internet</h1>"+
				"We would like to give you some free Internet!<br>"+
				"Before we can do that though, please sign up with us.",
				itemId		: 'pnlUsrRegIntro',
				styleHtmlContent : true,
				styleHtmlCls: 'regHtml'
			}
		]
    }
});
