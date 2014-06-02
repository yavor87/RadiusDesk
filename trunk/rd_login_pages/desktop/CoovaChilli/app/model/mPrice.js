Ext.define('CoovaChilli.model.mPrice', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',       type: 'string'  },
        {name: 'name',     type: 'string'  },
        {name: 'price',    type: 'string'  },
        {name: 'currency', type: 'string'  },
        {name: 'position', type: 'string'  }
        ]
});
