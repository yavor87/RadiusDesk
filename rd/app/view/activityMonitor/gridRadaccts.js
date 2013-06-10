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
            { text: i18n('sAcct_session_id'),dataIndex: 'acctsessionid',tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { text: i18n('sAcct_unique_id'),dataIndex: 'acctuniqueid',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { text: i18n('sUsername'),      dataIndex: 'username',      tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sGroupname'),     dataIndex: 'groupname',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { text: i18n('sRealm'),         dataIndex: 'realm',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sNAS_IP_Address'),dataIndex: 'nasipaddress',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sNAS_port_id'),   dataIndex: 'nasportid',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { text: i18n('sNAS_port_type'), dataIndex: 'nasporttype',   tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { 
                text        : i18n('sStart_time'),
                dataIndex   : 'acctstarttime', 
                tdCls       : 'gridTree', 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'}
            },
            { 
                text        : i18n('sStop_time'),   
                dataIndex   : 'acctstoptime',  
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'date',dateFormat: 'Y-m-d'},
                renderer    : function(value,metaData, record){
                    if(value == null){
                        //This is mega cool way to do it using Ext.Date.format      
                        var now         = new Date();
                        var tz_diff     = now.getTimezoneOffset()*60*1000;
                        var elapsed     = Ext.Date.getElapsed(record.get('acctstarttime'));
                        var online      = new Date((elapsed+tz_diff));
                        return "<div class=\"hasRight\">"+i18n("sActive")+" "+Ext.Date.format(online, 'z:H:i:s')+"</div>";
                    }else{
                        return value;
                    }              
                }
            },
            {   text: i18n('sSession_time'), dataIndex: 'acctsessiontime', tdCls: 'gridTree', flex: 1,filter: {type: 'string'},
                renderer    : function(value){
                    if(value == 0){
                        return value; 
                    }
                    var online    = new Date((value * 1000));
                    return Ext.Date.format(online, 'z:H:i:s');              
                }
            }, //Format
            { text: i18n('sAccount_authentic'), dataIndex: 'acctauthentic',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { text: i18n('sConnect_info_start'), dataIndex: 'connectinfo_start',tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sConnect_info_stop'), dataIndex: 'connectinfo_stop',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sData_in'), dataIndex: 'acctinputoctets',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'},
                renderer: function(value){
                    return Ext.ux.bytesToHuman(value)              
                }
            }, //Format!
            { text: i18n('sData_out'), dataIndex: 'acctoutputoctets',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'},
                renderer: function(value){
                    return Ext.ux.bytesToHuman(value)              
                }
            }, //Format!
            { text: i18n('sCalled_station_id'), dataIndex: 'calledstationid',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'},    hidden: true},
            { text: i18n('sCalling_station_id_MAC'), dataIndex: 'callingstationid',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'}}, 
            { text: i18n('sTerminate_cause'), dataIndex: 'acctterminatecause',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'},   hidden: true},
            { text: i18n('sService_type'), dataIndex: 'servicetype',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sFramed_protocol'), dataIndex: 'framedprotocol',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sFramed_ipaddress'), dataIndex: 'framedipaddress',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}},
            { text: i18n('sAcct_start_delay'), dataIndex: 'acctstartdelay',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sAcct_stop_delay'), dataIndex: 'acctstopdelay',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sX_Ascend_session_svr_key'), dataIndex: 'xascendsessionsvrkey',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'}, hidden: true},
            { text: i18n('sUser_type'), dataIndex: 'user_type',   tdCls: 'gridTree', flex: 1,
                sortable: false,
                filter  : {
                    type    : 'list',
                    phpMode : false,
                    options : ['user', 'voucher', 'device']
                }
            }
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."}); 
        me.callParent(arguments);
    }
});
