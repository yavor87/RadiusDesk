Ext.define('Rd.view.autoSetups.gridAutoSetups' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridAutoSetups',
    multiSelect: true,
    store : 'sAutoSetups',
    stateful: true,
    stateId: 'StateGridAutoSetups',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/auto_macs/menu_for_grid.json',
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
            { text: i18n('sOwner'),         dataIndex: 'owner',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'DNS name',             dataIndex: 'dns_name',       tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: false},
            { text: 'MAC Address',          dataIndex: 'name',           tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: false},
            { text: 'IP Address',           dataIndex: 'ip_address',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: false},
            { text: 'Mask',                 dataIndex: 'ip_mask',        tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Gateway',              dataIndex: 'ip_gateway',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'DNS 1',                dataIndex: 'ip_dns_1',       tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'DNS 2',                dataIndex: 'ip_dns_2',       tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Wifi Active',          dataIndex: 'wifi_active',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Channel',              dataIndex: 'channel',        tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Power',                dataIndex: 'power',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Connect distance',     dataIndex: 'distance',       tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Secure SSID',          dataIndex: 'ssid_secure',    tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'RADIUS',               dataIndex: 'radius',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Secret',               dataIndex: 'secret',         tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'OpenSSID',             dataIndex: 'ssid_open',      tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { 
                text:   'Eduroam',
                flex: 1,  
                xtype:  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            "<tpl if='eduroam == true'><div class=\"fieldGreen\">"+i18n("sYes")+"</div></tpl>",
                            "<tpl if='eduroam == false'><div class=\"fieldBlue\">"+i18n("sNo")+"</div></tpl>"
                        ),
                dataIndex: 'eduroam',
                filter  : {
                    type: 'boolean'    
                },
                hidden: true
            },
            { text: 'VPN Server',           dataIndex: 'vpn_server',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: true},
            { text: 'Tunnel IP',            dataIndex: 'tunnel_ip',      tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: false},
            { text: 'Contact IP',           dataIndex: 'contact_ip',     tdCls: 'gridTree', flex: 1,filter: {type: 'string'},hidden: false},
            { text: 'Last contact',         dataIndex: 'last_contact',   tdCls: 'gridTree', flex: 1,hidden: false,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},
                renderer    : function(value,metaData, record){
                    if(value != null){
                        return "<div class=\"fieldGreen\">"+Ext.Date.format(value, 'Y-m-d H:i:s')+"</div>";
                    }else{
                        return "<div class=\"fieldBlue\">Never</div>";
                    }              
                }
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+
                                i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes'
            }      
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});       
        me.callParent(arguments);
    }
});
