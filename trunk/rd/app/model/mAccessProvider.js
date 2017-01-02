Ext.define('Rd.model.mAccessProvider', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',       type: 'int'     },
         {name: 'username', type: 'string'  },
         'name','surname', 'phone', 'email', 'address', 'monitor', 'active','language'
        ],
    idProperty: 'id'
});
