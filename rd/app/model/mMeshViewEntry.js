Ext.define('Rd.model.mMeshViewEntry', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',            type: 'int'     },
        {name: 'name',          type: 'string'  },
        {name: 'mesh_entry_id'},
        {name: 'mac'},
        {name: 'vendor'},
        {name: 'tx_bytes',      type: 'int' },
        {name: 'rx_bytes',      type: 'int' },
        {name: 'signal_avg' },
        {name: 'signal' },
        {name: 'tx_bitrate',    type: 'int' },
        {name: 'rx_bitrate',    type: 'int' }
        ]
});
