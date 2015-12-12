Ext.define('Rd.view.permanentUsers.gridUserRadpostauths' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridUserRadpostauths',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridUserRadpostauths',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/permanent_users/menu_for_authentication_data.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    columns: [
        {xtype: 'rownumberer',stateId: 'StateGridUserRadpostauths1'},
        { text: i18n('sUsername'),      dataIndex: 'username',      tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridUserRadpostauths2'},
        { text: i18n('sPassword'),      dataIndex: 'pass',          tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridUserRadpostauths3'},
        { 
            text            : i18n('sReply'),         
            dataIndex       : 'reply',         
            tdCls           : 'gridTree', 
            flex            : 1,
            filter          : {type: 'string'},
            xtype           : 'templatecolumn',
            tpl             : new Ext.XTemplate(
                            "<tpl if='reply == \"Access-Reject\"'><div class=\"noRight\">{reply}</div>",
                            '<tpl else>',
                            '{reply}',
                            '</tpl>'
                        ),
            stateId: 'StateGridUserRadpostauths4'
        },
        { text: i18n('sNasname'),       dataIndex: 'nasname',       tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridUserRadpostauths5'},
        { text: i18n('sDate'),          dataIndex: 'authdate',      tdCls: 'gridTree', flex: 1,filter: {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridUserRadpostauths6'}
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
            model: 'Rd.model.mRadpostauth',
            buffered: true,
            leadingBufferZone: 450, 
            pageSize: 150,
            //To force server side sorting:
            remoteSort: true,
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : '/cake2/rd_cake/radpostauths/index.json',
                extraParams: { 'username' : me.username },
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message',
                    totalProperty: 'totalCount' //Required for dynamic paging
                },
                api: {
                    destroy  : '/cake2/rd_cake/radpostauths/delete.json'
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
                        me.down('#count').update({count: count});
                    }   
                },
                scope: this
            },
            autoLoad: false    
        });
       
        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});
        me.callParent(arguments);
    }
});
