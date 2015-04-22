Ext.define('Rd.view.meshes.winMeshEdit', {
    extend  : 'Ext.window.Window',
    alias   : 'widget.winMeshEdit',
    width   : 800,
    height  : 400,
    iconCls : 'mesh',
    glyph   : Rd.config.icnMesh,
    animCollapse:false,
    border  :false,
    isWindow: true,
    minimizable: true,
    maximizable: true,
    constrainHeader:true,
    layout  : 'border',
    stateful: true,
    autoShow:   false,
	meshName: '',
    initComponent: function() {
        var me      = this; 
        me.items    = [
            {
                region: 'north',
                xtype:  'pnlBanner',
                heading: me.title,
                image:  'resources/images/48x48/mesh.png'
            },
            {
                region  : 'center',
                xtype   : 'panel',
                layout  : 'fit',
                border  : false,
                items   : [
                    {
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        margins : '0 0 0 0',
                        border  : true,
                        plain   : true,
                        items   : [
                                {
                                    title   :  i18n('sEntry_points'),
                                    itemId  : 'tabEntryPoints',
                                    xtype   : 'gridMeshEntries',
                                    meshId  : me.getItemId()
                                },
                                {
                                    title   :  i18n('sMesh_settings'),
                                    itemId  : 'tabMeshSettings',
                                    xtype   : 'pnlMeshSettings',
                                    meshId  : me.getItemId()
                                },
                                {
                                    title   :  i18n('sExit_points'),
                                    itemId  : 'tabExitPoints',
                                    xtype   : 'gridMeshExits',
                                    meshId  : me.getItemId()
                                },
                                {
                                    title       : i18n('sNode_settings'),
                                    itemId      : 'tabNodeCommonSettings',
                                    xtype       : 'pnlNodeCommonSettings',
                                    meshId      : me.getItemId()   
                                },
                                 {
                                    title       : i18n('sNodes'),
                                    itemId      : 'tabNodes',
                                    xtype       : 'gridNodes',
                                    meshId      : me.getItemId()     
                                }
                            ]
                        }
                    ]
            }
        ];
        me.callParent(arguments);
    }
});
