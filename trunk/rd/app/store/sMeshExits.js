Ext.define('Rd.store.sMeshExits', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mMeshExit',
    //To force server side sorting:
    remoteSort: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/meshes/mesh_exits_index.json',
            reader: {
                type            : 'json',
                root            : 'items',
                messageProperty : 'message',
                totalProperty   : 'totalCount' //Required for dynamic paging
            },
            api: {
                destroy  : '/cake2/rd_cake/meshes/mesh_exit_delete.json'
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad: false
});
