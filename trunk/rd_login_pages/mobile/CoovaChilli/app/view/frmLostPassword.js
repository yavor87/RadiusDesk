Ext.define('CoovaChilli.view.frmLostPassword', {
    extend	: 'Ext.form.Panel',
    xtype	: 'frmLostPassword',
    requires: [
        'Ext.form.FieldSet',
		'Ext.field.Email'
    ],
    config: {
        layout: 'vbox'
    },
	constructor: function(config) {
		var me          = this;
		config.items =  [
			{
				xtype		: 'fieldset',
				title       : 'Required info',
		        instructions: 'Scroll down to see all fields',
		        scrollable  : true,
		        flex        : 1,
				items: [	
					{
				        xtype 		: 'emailfield',
				        name 		: 'email',
				        placeHolder : 'Email (username)',
						itemId		: 'email'
				    }
		        ]
			}
		];
        me.callParent([config]);
	}
});
