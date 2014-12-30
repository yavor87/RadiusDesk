Ext.define('CoovaChilli.view.navLostPassword', {
    extend	: 'Ext.navigation.View',
    xtype	: 'navLostPassword',
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
				html		: "<h1>Supply you email address</h1>"+
				"If you are registered with us "+
				"we will email your credentials to you.",
				itemId		: 'pnlUsrRegIntro',
				styleHtmlContent : true,
				styleHtmlCls: 'regHtml'
			}
		]
    }
});
