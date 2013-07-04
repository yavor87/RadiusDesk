Ext.define('Rd.view.vouchers.gridVouchers' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridVouchers',
    multiSelect: true,
    store : 'sVouchers',
    stateful: true,
    stateId: 'StateGridVouchers',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/vouchers/menu_for_grid.json',
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
            { text: i18n('sOwner'),        dataIndex: 'owner',      tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},  
            { text: i18n('sName'),         dataIndex: 'name',tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sBatch'),        dataIndex: 'batch',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sRealm'),        dataIndex: 'realm',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sProfile'),      dataIndex: 'profile',   tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            {
                text        : i18n('sLast_accept_time'),
                flex        : 1,
                dataIndex   : 'last_accept_time',
                tdCls       : 'gridTree',
                hidden      : true,
                filter      : {type: 'date'}
            },
            {
                text        : i18n('sLast_accept_nas'),
                flex        : 1,
                dataIndex   : 'last_accept_nas',
                tdCls       : 'gridTree',
                hidden      : true,
                filter      : {type: 'string'}
            },
            {
                text        : i18n('sLast_reject_time'),
                flex        : 1,
                dataIndex   : 'last_reject_time',
                tdCls       : 'gridTree',
                hidden      : true,
                filter      : {type: 'date'}
            },
            {
                text        : i18n('sLast_reject_nas'),
                flex        : 1,
                dataIndex   : 'last_reject_nas',
                tdCls       : 'gridTree',
                hidden      : true,
                filter      : {type: 'string'}
            },
            {
                text        : i18n('sLast_reject_message'),
                flex        : 1,
                dataIndex   : 'last_reject_message',
                tdCls       : 'gridTree',
                hidden      : true,
                filter      : {type: 'string'}
            }    
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."}); 
        me.callParent(arguments);
    }
});
