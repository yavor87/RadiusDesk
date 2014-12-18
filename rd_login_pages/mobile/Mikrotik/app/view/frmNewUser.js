Ext.define('Mikrotik.view.frmNewUser', {
    extend	: 'Ext.form.Panel',
    xtype	: 'frmNewUser',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'Ext.field.Text',
		'Ext.field.Email'
    ],
    config: {
        layout: 'vbox',
		items : [
			{
				xtype		: 'fieldset',
				title       : 'Required info',
		        instructions: 'Scroll down to see all fields',
		        //defaults    : { 'labelWidth' : '35%'},
		        scrollable  : true,
		        flex        : 1,
				items: [
		            {
		                xtype   	: 'textfield',
		                name    	: 'name',
		                placeHolder : 'Name',
		                itemId  	: 'name',
						value		: 'Dirk'
		            },
					{
		                xtype   	: 'textfield',
		                name    	: 'surname',
		                placeHolder : 'Surname',
		                itemId  	: 'surname',
						value		: 'van der Walt'
		            },
					{
				        xtype 		: 'emailfield',
				        name 		: 'email',
				        placeHolder : 'Email (username)',
						itemId		: 'email',
						value		: 'dirk@gmail.com'
				    },
					{
		                xtype   	: 'textfield',
		                name    	: 'password',
		                placeHolder : 'Password',
		                itemId  	: 'password',
						value		: 'verysecure'
		            },
					{
		                xtype   	: 'textfield',
		                name    	: 'phone',
		                placeHolder : 'Cell',
		                itemId  	: 'phone',
						value		: '0128043331'
		            }
		        ]
			}
		]
    }
});
