Ext.define('Rd.view.meshes.pnlMeshEdit', {
   extend       : 'Ext.tab.Panel',
    alias       : 'widget.pnlMeshEdit',
    border      : true,
    mesh_id     : undefined,
    meshName    : undefined,
    plain       : true,
    tabPosition : 'top',
    cls         : 'subTab',
    initComponent: function() {
        var me      = this;     
        me.items    = [
            {
                title   :  i18n("sEntry_points"),
                itemId  : 'tabEntryPoints',
                xtype   : 'gridMeshEntries',
                meshId  : me.mesh_id
            },
            {
                title   :  i18n("sMesh_settings"),
                itemId  : 'tabMeshSettings',
                xtype   : 'pnlMeshSettings',
                meshId  : me.mesh_id
            },
            {
                title   :  i18n("sExit_points"),
                itemId  : 'tabExitPoints',
                xtype   : 'gridMeshExits',
                meshId  : me.mesh_id
            },
            {
                title       : i18n("sNode_settings"),
                itemId      : 'tabNodeCommonSettings',
                xtype       : 'pnlNodeCommonSettings',
                meshId      : me.mesh_id  
            },
             {
                title       : i18n("sNodes"),
                itemId      : 'tabNodes',
                xtype       : 'gridNodes',
                meshId      : me.mesh_id     
            }
        ];
        me.callParent(arguments);
    }
});
