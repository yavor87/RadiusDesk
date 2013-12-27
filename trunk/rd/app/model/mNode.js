Ext.define('Rd.model.mNode', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',               type: 'int'     },
         {name: 'name',             type: 'string'  },
         {name: 'encryption',       type: 'string'  },
         {name: 'hidden',           type: 'bool'},
         {name: 'isolate',          type: 'bool'},
         {name: 'apply_to_all',     type: 'bool'}
        ]
});
