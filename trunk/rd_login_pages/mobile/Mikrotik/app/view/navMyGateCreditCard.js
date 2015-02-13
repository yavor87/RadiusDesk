Ext.define('Mikrotik.view.navMyGateCreditCard', {
    extend	: 'Ext.navigation.View',
    xtype	: 'navMyGateCreditCard',
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
				html		: "<h1>Pay Please</h1>"+
				"If you are registered with us "+
				"we will email your credentials to you.",
				itemId		: 'pnlMyGateCreditCardIntro',
				styleHtmlContent : true,
				styleHtmlCls: 'regHtml'
			}
		]
    }
});
