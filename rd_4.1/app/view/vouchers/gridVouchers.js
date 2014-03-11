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
            { text: i18n('sName'),         dataIndex: 'name',       tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sPassword'),     dataIndex: 'password',   tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, sortable: false},
            { 
                text        : i18n('sBatch'),
                sortable    : true,
                flex        : 1,  
                xtype       : 'templatecolumn', 
                tpl:        new Ext.XTemplate(
                                '<tpl if="Ext.isEmpty(batch)"><div class=\"fieldBlue\">'+i18n('s_br_Single_voucher_br')+'</div>',
                                '<tpl else><div class=\"fieldGrey\">','{batch}','</div></tpl>' 
                            ),
                dataIndex   : 'batch',
                filter: { type: 'string'}
            },
            { text: i18n('sRealm'),        dataIndex: 'realm',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, sortable : false},
            { text: i18n('sProfile'),      dataIndex: 'profile',   tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, sortable : false},
            {
                header: i18n('sData_used'),
                dataIndex: 'perc_data_used',
                width: 110,
                renderer: function (v, m, r) {
                    if(v != null){
                        var id = Ext.id();
                        Ext.defer(function () {
                            Ext.widget('progressbar', {
                                renderTo: id,
                                value: v / 100,
                                width: 100,
                                text: v +" %"
                            });
                        }, 50);
                        return Ext.String.format('<div id="{0}"></div>', id);
                    }else{
                        return "N/A";
                    }
                }
            },
            {
                header: i18n('sTime_used'),
                dataIndex: 'perc_time_used',
                width: 110,
                renderer: function (v, m, r) {
                    if(v != null){
                        var id = Ext.id();
                        Ext.defer(function () {
                            Ext.widget('progressbar', {
                                renderTo: id,
                                value: v / 100,
                                width: 100,
                                text: v+" %"
                            });
                        }, 50);
                        return Ext.String.format('<div id="{0}"></div>', id);
                    }else{
                        return "N/A";
                    }
                }
            },
            { 
                text        : i18n('sStatus'),
                flex        : 1,  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='status == \"new\"'><div class=\"fieldGreen\">"+i18n('sNew')+"</div></tpl>",
                                "<tpl if='status == \"used\"'><div class=\"fieldYellow\">"+i18n('sUsed')+"</div></tpl>",
                                "<tpl if='status == \"depleted\"'><div class=\"fieldOrange\">"+i18n('sDepleted')+"</div></tpl>",
                                "<tpl if='status == \"expired\"'><div class=\"fieldRed\">"+i18n('sExpired')+"</div></tpl>"
                ),
                dataIndex   : 'status',
                filter      : {
                                type    : 'list',
                                phpMode : false,
                                options : ['new', 'used', 'depleted', 'expired']
                              }
            },
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
