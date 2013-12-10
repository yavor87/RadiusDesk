Ext.define('Rd.model.mMeshExit', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',               type: 'int'     },
         {name: 'name',             type: 'string'  },
         {name: 'type',             type: 'string'  },
         {name: 'connects_with',    type: 'string'},
         {name: 'auto_detect',      type: 'bool'}
        ]
});
