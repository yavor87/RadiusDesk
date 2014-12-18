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
		},
		items:	[
			{
				title		: 'Read first',
				html		: "Read first text",
				itemId		: 'pnlUsrRegIntro'
			}
		]
    },
	onBackButtonTap:function(){
		var me = this;
		console.log("Back button tapped");
        me.callParent(arguments);
    }
});
