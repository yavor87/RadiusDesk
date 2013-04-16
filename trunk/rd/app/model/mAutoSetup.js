Ext.define('Rd.model.mAutoSetup', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',           type: 'int'     },
         {name: 'name',         type: 'string'  },
         {name: 'owner',        type: 'string'  },
         {name: 'notes',        type: 'bool'}
        ]
});
