Ext.define('Rd.view.activityMonitor.gridRadaccts' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridRadaccts',
    multiSelect: true,
    store : 'sRadaccts',
    stateful: true,
    stateId: 'StateGridRadaccts',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/radaccts/menu_for_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' },
        '->',
        {   xtype: 'component', itemId: 'totals',  tpl: i18n('tpl_In_{in}_Out_{out}_Total_{total}'),   style: 'margin-right:5px', cls: 'lblRd' }
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
            { text: i18n('sUsername'),      dataIndex: 'username',      tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sRealm'),         dataIndex: 'realm',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sIP_Address'),    dataIndex: 'nasipaddress',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sNAS_port_id'),   dataIndex: 'nasportid',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sNAS_port_type'), dataIndex: 'nasporttype',   tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sStart_time'),    dataIndex: 'acctstarttime', tdCls: 'gridTree', flex: 1,filter: {type: 'date',dateFormat: 'Y-m-d'}},
            { 
                text        : i18n('sStop_time'),   
                dataIndex   : 'acctstoptime',  
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'date',dateFormat: 'Y-m-d'},
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='acctstoptime == null'><div class=\"hasRight\">"+i18n("sActive")+"</div>",
                                '<tpl else>',
                                '{acctstoptime}',
                                '</tpl>'
                            )
            }
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."}); 
        me.callParent(arguments);
    }
});
