Ext.define('Mikrotik.view.frmMyGateCreditCard', {
    extend	: 'Ext.form.Panel',
    xtype	: 'frmMyGateCreditCard',
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
		                xtype		: 'emailfield',
						placeHolder : 'Email (username)',
		                name		: 'username',
						itemId		: 'username'
		            },
					{
		                xtype		: 'selectfield',
		                name    	: 'fin_payment_plan_id',
		                placeHolder : 'Payment Plan (choose one)',
		                itemId  	: 'fin_payment_plan_id',
						store		: 'sFinPaymentPlans',
						displayField: 'name',
						valueField	: 'id'
		            },
					{
		                xtype   	: 'textfield',
		                name    	: 'card_holder',
		                placeHolder : 'Card holder',
		                itemId  	: 'card_holder'
		            },
					{
		                xtype   	: 'textfield',
		                name    	: 'card_number',
		                placeHolder : 'Card number',
		                itemId  	: 'card_number'
		            },
					{
		                xtype		: 'numberfield',
		                placeHolder	: 'Expiry month (eg 7)',
		                minValue	: 1,
		                maxValue	: 12,
		                name		: 'expiry_month'
		            },
					{
		                xtype		: 'numberfield',
		                placeHolder	: 'Expiry year (eg 2017)',
		                minValue	: 2015,
		                maxValue	: 2025,
		                name		: 'expiry_year'
		            }
		        ]
			}
		];
        me.callParent([config]);
	}
});
