Ext.define('Rd.view.nas.gridNasActions' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridNasActions',
    border: false,
    stateful: true,
    multiSelect: true,
    stateId: 'StateGridNasActions',
    stateEvents:['groupclick','columnhide'],
    viewConfig: {
        preserveScrollOnRefresh: true
    },
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu:        '/cake2/rd_cake/actions/menu_for_grid.json',
    urlIndex:       '/cake2/rd_cake/actions/index.json',
    columns: [
        {xtype: 'rownumberer'},
        { text: i18n('sAction'),     dataIndex: 'action',        tdCls: 'gridTree', flex: 1, sortable: true},
        { text: i18n('sCommand'),    dataIndex: 'command',       tdCls: 'gridTree', flex: 1, sortable: true},
        { 
            text        : i18n('sStatus'),
            flex        : 1,  
            xtype       : 'templatecolumn', 
            tpl         : new Ext.XTemplate(
                            "<tpl if='status == \"awaiting\"'><div class=\"fieldBlue\">"+i18n('sAwaiting')+"</div></tpl>",
                            "<tpl if='status == \"fetched\"'><div class=\"fieldGreen\">"+i18n('sFetched')+"</div></tpl>"
            ),
            dataIndex   : 'status'
        },
        { text: i18n('sCreated'),    dataIndex: 'created',       tdCls: 'gridTree', flex: 1, sortable: true},
        { text: i18n('sModified'),   dataIndex: 'modified',      tdCls: 'gridTree', flex: 1, sortable: true}
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){

       var me      = this;  
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});


        //Create a store specific to this Owner
        me.store = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mAction',
            proxy: {
                type: 'ajax',
                format  : 'json',
                batchActions: true, 
                url   : me.urlIndex,
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message'
                },
                api: {
                    destroy  : '/cake2/rd_cake/actions/delete.json'
                }
            },
            listeners: {
                load: function(store, records, successful) {      
                    if(!successful){
                        Ext.ux.Toaster.msg(
                            i18n('sError_encountered'),
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                        //console.log(store.getProxy().getReader().rawData.message.message);
                    }else{
                        var count   = me.getStore().getTotalCount();
                        me.down('#count').update({count: count});
                    }  
                },
                update: function(store, records, success, options) {
                    store.sync({
                        success: function(batch,options){
                           
                        },
                        failure: function(batch,options){
                          
                        }
                    });
                },
                scope: this
            },
            autoLoad: false    
        });
        me.callParent(arguments);
    }
});
