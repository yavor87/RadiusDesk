Ext.define('Rd.model.mDevice', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',           type: 'int'     },
         {name: 'user',         type: 'string'  },
         {name: 'realm',        type: 'string'  },
         {name: 'profile',      type: 'string'  },
         'name', 'description','vendor_id',
         {name: 'active',       type: 'bool'    },
         {name: 'activate'},
         {name: 'expire'},
         'data_usage',
         'time_usage',
         {name: 'notes',        type: 'bool'},
         {name: 'update',       type: 'bool'},
         {name: 'delete',       type: 'bool'},
        ]
});
