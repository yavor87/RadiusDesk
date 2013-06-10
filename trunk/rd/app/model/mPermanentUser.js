Ext.define('Rd.model.mPermanentUser', {
    extend: 'Ext.data.Model',
    fields: [
         {name: 'id',           type: 'int'     },
         {name: 'username',     type: 'string'  },
         {name: 'owner',        type: 'string'  },
         {name: 'auth_type',    type: 'string'  },
         {name: 'realm',        type: 'string'  },
         {name: 'profile',      type: 'string'  },
         'name','surname', 'phone', 'email', 'address',
         {name: 'active',       type: 'bool'    },
         {name: 'last_accept_time'},
         {name: 'last_accept_nas'},
         {name: 'last_reject_time'},
         {name: 'last_reject_nas'},
         {name: 'last_reject_message'},
         {name: 'from_date'},
         {name: 'to_date'},
         'data_usage',
         'time_usage',
         'data_cap',
         'time_cap',
         {name: 'notes',        type: 'bool'},
         {name: 'update',       type: 'bool'},
         {name: 'delete',       type: 'bool'}
        ]
});
