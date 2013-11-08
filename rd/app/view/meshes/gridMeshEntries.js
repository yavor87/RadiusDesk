Ext.define('Rd.view.meshes.gridMeshEntries' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridMeshEntries',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridMeshEntries',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/meshes/menu_for_entries_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;

        me.store    = Ext.create(Rd.store.sMeshEntries,{});
        me.store.getProxy().setExtraParam('mesh_id',me.getItemId());
        me.store.load();

        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.columns  = [
            {xtype: 'rownumberer'},
            { text: 'SSID',                 dataIndex: 'name',          tdCls: 'gridTree', flex: 1},
            { text: 'Encryption',           dataIndex: 'encryption',    tdCls: 'gridTree', flex: 1},
            { text: 'Hidden',               dataIndex: 'hidden',        tdCls: 'gridTree', flex: 1},
            { text: 'Client isolation',     dataIndex: 'isolate',       tdCls: 'gridTree', flex: 1},
            { text: 'Apply to all nodes',   dataIndex: 'all_nodes',     tdCls: 'gridTree', flex: 1},
        ];
        me.callParent(arguments);
    }
});
