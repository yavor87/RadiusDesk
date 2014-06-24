Ext.define('Rd.view.meshes.winMeshView', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winMeshView',
    width       : 850,
    height      : 500,
    iconCls     : 'mesh',
    glyph       : Rd.config.icnMesh,
    animCollapse: false,
    border      : false,
    isWindow    : true,
    minimizable : true,
    maximizable : true,
    constrainHeader:true,
    layout      : 'border',
    stateful    : true,
    autoShow    : false,
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
                                    xtype   : 'gridMeshViewEntries',
                                    meshId  : me.getItemId()
                                }
                            ]
                        }
                    ]
            }
        ];
        me.callParent(arguments);
    }
});
