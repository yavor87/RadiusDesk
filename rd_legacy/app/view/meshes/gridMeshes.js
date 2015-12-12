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
            {xtype: 'rownumberer',stateId: 'StateGridMeshes1', width: Rd.config.buttonMargin},
            { text: i18n('sOwner'),     dataIndex: 'owner',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridMeshes2'},
            { text: i18n('sName'),      dataIndex: 'name',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridMeshes3'},
			{ 
                text:   i18n('sAvailable_to_sub_providers'),
                flex: 1,
				hidden: true,  
                xtype:  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            "<tpl if='available_to_siblings == true'><div class=\"hasRight\">"+i18n("sYes")+"</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"noRight\">"+i18n("sNo")+"</div></tpl>"
                        ),
                dataIndex: 'available_to_siblings',
                filter  : {
                    type: 'boolean'    
                },stateId: 'StateGridSsids4'
            },
            { text: i18n('sSSID'),      dataIndex: 'ssid',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true,stateId: 'StateGridMeshes5'},
            { text: i18n('sBSSID'),    dataIndex: 'bssid',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true,stateId: 'StateGridMeshes6'},
            { text: i18n('sNode_count'),dataIndex: 'node_count',    tdCls: 'gridTree', flex: 1,stateId: 'StateGridMeshes7'},
            { 
                text        : i18n('sNodes_up'),  
                dataIndex   : 'nodes_up',      
                xtype       :  'templatecolumn', 
                flex        : 1,
                tpl         :    new Ext.XTemplate(
                            "<tpl if='nodes_up &gt; 0'><div class=\"fieldGreenWhite\">{nodes_up}</div>",
                            "<tpl else><div class=\"fieldBlue\">{nodes_up}</div></tpl>"
                        ),
                stateId     : 'StateGridMeshes8'
            },

            { 
                text        : i18n('sNodes_down'),  
                dataIndex   : 'nodes_down',      
                xtype       :  'templatecolumn', 
                flex        : 1,
                tpl         :    new Ext.XTemplate(
                            "<tpl if='nodes_down &gt; 0'><div class=\"fieldRedWhite\">{nodes_down}</div>",
                            "<tpl else><div class=\"fieldBlue\">{nodes_down}</div></tpl>"
                        ),
                stateId     : 'StateGridMeshes9'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'StateGridMeshes10'
            }      
        ];
        me.callParent(arguments);
    }
});
