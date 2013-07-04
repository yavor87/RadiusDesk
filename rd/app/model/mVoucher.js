Ext.define('Rd.model.mVoucher', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',           type: 'int'     },
         {name: 'owner',        type: 'string'  },
         {name: 'realm',        type: 'string'  },
         {name: 'profile',      type: 'string'  },
         'name',
         {name: 'batch',        type: 'string'  },
         {name: 'last_accept_time'},
         {name: 'last_accept_nas'},
         {name: 'last_reject_time'},
         {name: 'last_reject_nas'},
         {name: 'last_reject_message'},
         {name: 'from_date'},
         {name: 'to_date'},
         'data_usage',
         'time_usage',
         {name: 'update',       type: 'bool'},
         {name: 'delete',       type: 'bool'}
        ]
});
