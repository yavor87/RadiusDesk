Ext.define('Rd.model.mDynamicClient', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',           type: 'int'     },
         {name: 'name',         type: 'string'  },
         {name: 'owner',        type: 'string'  },
         {name: 'update',       type: 'bool'},
         {name: 'delete',       type: 'bool'}
        ]
});
