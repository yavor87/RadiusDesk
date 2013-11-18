Ext.define('Rd.view.meshes.gridMeshes' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridMeshes',
    multiSelect: true,
    store : 'sMeshes',
    stateful: true,
    stateId: 'StateGridMeshes',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/meshes/menu_for_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;
        var filters = {
            ftype   : 'filters',
            encode  : true, 
            local   : false
        };
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.features = [filters];

        me.columns  = [
            {xtype: 'rownumberer'},
            { text: i18n('sOwner'),     dataIndex: 'owner',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sName'),      dataIndex: 'name',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: 'SSID',             dataIndex: 'ssid',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'BSSID',            dataIndex: 'bssid',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Node count',       dataIndex: 'node_count',    tdCls: 'gridTree', flex: 1},
            { text: 'Nodes up',         dataIndex: 'nodes_up',      tdCls: 'gridTree', flex: 1},
            { text: 'Nodes down',       dataIndex: 'nodes_down',    tdCls: 'gridTree', flex: 1},
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes'
            }      
        ];
        me.callParent(arguments);
    }
});
