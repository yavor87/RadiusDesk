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
				        name 		: 'email',
				        placeHolder : 'Email (username)',
						itemId		: 'email'
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
		]
    }
});
