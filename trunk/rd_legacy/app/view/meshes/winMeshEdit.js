Ext.define('Rd.view.meshes.winMeshEdit', {
    extend  : 'Ext.window.Window',
    alias   : 'widget.winMeshEdit',
    width   : 800,
    height  : 400,
    iconCls : 'mesh',
    animCollapse:false,
    border  :false,
    isWindow: true,
    minimizable: true,
    maximizable: true,
    constrainHeader:true,
    layout  : 'border',
    stateful: true,
    autoShow:   false,
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
                layout  : 'fit',
                xtype   : 'tabpanel',
                margins : '0 0 0 0',
                border  : false,
                items   : [
                    {
                        title   :  'Entry points',
                        itemId  : 'tabEntryPoints',
                        xtype   : 'gridMeshEntries',
                        meshId  : me.getItemId()
                    },
                    {
                        title   :  'Mesh settings',
                        itemId  : 'tabMeshSettings',
                        xtype   : 'pnlMeshSettings',
                        meshId  : me.getItemId()
                    },
                    {
                        title   :  'Exit points',
                        itemId  : 'tabExitPoints',
                        xtype   : 'gridMeshExits',
                        meshId  : me.getItemId()
                    },
                    {
                        title       : 'Node settings',
                        itemId      : 'tabNodeCommonSettings',
                        xtype       : 'pnlNodeCommonSettings',
                        meshId      : me.getItemId()   
                    },
                     {
                        title       : 'Nodes',
                        itemId      : 'tabNodes',
                        xtype       : 'gridNodes',
                        meshId      : me.getItemId()     
                    },
                    {
                        title   :  'Map',
                        itemId  : 'tabMap'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});
