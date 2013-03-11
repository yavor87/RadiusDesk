Ext.define('Rd.model.mRadacct', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',           type: 'int'     },
        {name: 'username',     type: 'string'  },
        {name: 'groupname',    type: 'string'  },
        {name: 'realm',        type: 'string'  },
        {name: 'nasipaddress', type: 'string'  },
        'nasportid',
        'nasporttype',  
        'acctstarttime',
        'acctstoptime',
        'acctinputoctets',
        'acctoutputoctets' 
        ]
});
