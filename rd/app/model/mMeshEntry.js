Ext.define('Rd.model.mMeshEntry', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',               type: 'int'     },
         {name: 'name',             type: 'string'  },
         {name: 'enctryption',      type: 'string'  },
         {name: 'hidden',           type: 'bool'},
         {name: 'isolate',          type: 'bool'},
         {name: 'all_nodes',        type: 'bool'}
        ]
});
