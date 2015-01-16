Ext.define('CoovaChilli.view.frmNewUser', {
    extend	: 'Ext.form.Panel',
    xtype	: 'frmNewUser',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'Ext.field.Text',
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
		                xtype		: 'hiddenfield',
		                name		: 'mac',
		                value		: config.mac
		            },
		            {
		                xtype   	: 'textfield',
		                name    	: 'name',
		                placeHolder : 'Name',
		                itemId  	: 'name'
		            },
					{
		                xtype   	: 'textfield',
		                name    	: 'surname',
		                placeHolder : 'Surname',
		                itemId  	: 'surname'
		            },
					{
				        xtype 		: 'emailfield',
				        name 		: 'username',
				        placeHolder : 'Email (username)',
						itemId		: 'username'
				    },
					{
		                xtype   	: 'textfield',
		                name    	: 'password',
		                placeHolder : 'Password',
		                itemId  	: 'password'
		            },
					{
		                xtype   	: 'textfield',
		                name    	: 'phone',
		                placeHolder : 'Cell',
		                itemId  	: 'phone'
		            }
		        ]
			}
		];
        me.callParent([config]);
	}
});
