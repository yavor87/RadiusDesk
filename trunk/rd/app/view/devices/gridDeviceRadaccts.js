Ext.define('Rd.view.permanentUsers.gridDeviceRadaccts' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridDeviceRadaccts',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridDeviceRadaccts',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/devices/menu_for_accounting_data.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' },
        '->',
        {   xtype: 'component', itemId: 'totals',  tpl: i18n('tpl_In_{in}_Out_{out}_Total_{total}'),   style: 'margin-right:5px', cls: 'lblRd' }
    ],
    columns: [
        {xtype: 'rownumberer'},
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
    ],
    username: 'nobody', //dummy value
    initComponent: function(){
        var me      = this;

        var filters = {
            ftype   : 'filters',
            encode  : true, 
            local   : false
        };
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.features = [filters];

        //Create a store specific to this Permanent User
        me.store = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mRadacct',
            buffered: true,
            leadingBufferZone: 450, 
            pageSize: 150,
            //To force server side sorting:
            remoteSort: true,
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : '/cake2/rd_cake/radaccts/index.json',
                extraParams: { 'callingstationid' : me.username },
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message',
                    totalProperty: 'totalCount' //Required for dynamic paging
                },
                api: {
                    destroy  : '/cake2/rd_cake/radaccts/delete.json'
                },
                simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
            },
            listeners: {
                load: function(store, records, successful) {
                    if(!successful){
                        Ext.ux.Toaster.msg(
                            'Error encountered',
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                        //console.log(store.getProxy().getReader().rawData.message.message);
                    }else{
                        var count       = me.getStore().getTotalCount();
                        var totalIn     = Ext.ux.bytesToHuman(me.getStore().getProxy().getReader().rawData.totalIn);
                        var totalOut    = Ext.ux.bytesToHuman(me.getStore().getProxy().getReader().rawData.totalOut);
                        var totalInOut  = Ext.ux.bytesToHuman(me.getStore().getProxy().getReader().rawData.totalInOut);
                        me.down('#count').update({count: count});
                        me.down('#totals').update({'in': totalIn, 'out': totalOut, 'total': totalInOut });
                    }   
                },
                scope: this
            },
            //autoLoad: true    
        });
       
        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});
        me.callParent(arguments);
    }
});
