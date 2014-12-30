Ext.define('CoovaChilli.model.mLostPassword', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['email'],
        validations: [
			{ type	: 'presence', 	field	: 'email' 	},
			{ type	: 'email', 	    field	: 'email'	}
        ]
    }
});
