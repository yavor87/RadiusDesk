Ext.define('Rd.store.sMeshEntryPoints', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mMeshEntryPoint',
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/meshes/mesh_entry_points.json',
            reader: {
                type            : 'json',
                root            : 'items',
                messageProperty : 'message'
            }
    },
    autoLoad: false
});
