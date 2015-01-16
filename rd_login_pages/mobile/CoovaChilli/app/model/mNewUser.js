Ext.define('CoovaChilli.model.mNewUser', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['name','surname','email','password','phone'],
        validations: [
            { type	: 'presence', 	field	: 'name' 	},
            { type	: 'presence', 	field	: 'surname' },
			{ type	: 'presence', 	field	: 'username'},
            { type	: 'presence', 	field	: 'password'},
			{ type	: 'presence', 	field	: 'phone'	},
			{ type	: 'email', 	    field	: 'username'},
			{ type	: 'format', 	field	: 'phone', 		matcher: /^\d{10}$/i},
			{ type	: 'length', 	field	: 'password', 	min: 5, max: 15},
            { type	: 'length', 	field	: 'name', 		max: 30 },
            { type	: 'length', 	field	: 'surname', 	max: 30 }
        ]
    }
});
