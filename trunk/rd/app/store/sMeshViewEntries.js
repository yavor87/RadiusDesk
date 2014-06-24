Ext.define('Rd.store.sMeshViewEntries', {
    extend  : 'Ext.data.Store',
    model   : 'Rd.model.mMeshViewEntry',
    //To force server side sorting:
    remoteSort: true,
    proxy: {
            type    : 'ajax',
            format  : 'json',
            batchActions: true, 
            url     : '/cake2/rd_cake/mesh_reports/view_entries.json',
            reader  : {
                type            : 'json',
                root            : 'items',
                messageProperty : 'message',
                totalProperty   : 'totalCount' //Required for dynamic paging
            },
            simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
    },
    autoLoad: false
});
