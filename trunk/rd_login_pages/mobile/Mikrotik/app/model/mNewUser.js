Ext.define('Mikrotik.model.mNewUser', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['name','surname'],
        validations: [
            { type: 'presence', field: 'name' },
            { type: 'presence', field: 'surname' },
            { type: 'length', field: 'name', max: 20 },
            { type: 'length', field: 'surname', max: 20 }
        ]
    }
});
