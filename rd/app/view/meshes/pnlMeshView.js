Ext.define('Rd.view.meshes.pnlMeshView', {
    extend      : 'Ext.tab.Panel',
    alias       : 'widget.pnlMeshView',
    mesh_id     : undefined,
    meshName    : undefined,
    plain       : true,
    tabPosition : 'top',
    cls         : 'subTab',
    initComponent: function() {
        var me      = this;     
        me.items    = [
		    {
                title   : i18n("sOverview"),
                itemId  : 'tabMeshViewOverwiew',
			    xtype	: 'pnlMeshViewNodes',
                meshId  : me.mesh_id
            },
            {
                title   : i18n("sSSID_to_Device"),
                itemId  : 'tabMeshViewEntries',
                xtype   : 'gridMeshViewEntries',
                meshId  : me.mesh_id
            },
            {
                title   : i18n("sNode_to_Device"),
                itemId  : 'tabMeshViewNodes',
                xtype   : 'gridMeshViewNodes',
                meshId  : me.mesh_id
            },
		    {
                title   : i18n("sNode_to_Nodes"),
                itemId  : 'tabMeshViewNodeNodes',
			    xtype   : 'gridMeshViewNodeNodes',
                meshId  : me.mesh_id
            },
		    {
                title   : i18n("sNodes"),
                itemId  : 'tabMeshViewNodeDetails',
			    xtype   : 'gridMeshViewNodeDetails',
                meshId  : me.mesh_id
            }
        ];
        me.callParent(arguments);
    }
});
