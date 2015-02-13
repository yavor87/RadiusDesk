Ext.define('Mikrotik.model.mMyGateCreditCard', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			'username',
			'fin_payment_plan_id',
			'card_holder',
			'card_number',
			'expiry_month',
			'expiry_year'
		],
        validations: [
            { type	: 'presence', 	field	: 'username' 		},
            { type	: 'presence', 	field	: 'fin_payment_plan_id' },
			{ type	: 'presence', 	field	: 'card_holder' 	},
            { type	: 'presence', 	field	: 'card_number'		},
			{ type	: 'presence', 	field	: 'expiry_month'	},
			{ type	: 'presence', 	field	: 'expiry_year'		},
			{ type	: 'inclusion', 	field	: 'expiry_month', list: [1, 2, 3,4,5,6,7,8,9,10,11,12]},
			{ type	: 'inclusion', 	field	: 'expiry_year',  list: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]}
        ]
    }
});
