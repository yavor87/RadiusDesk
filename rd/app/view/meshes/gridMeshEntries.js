Ext.define('Rd.view.meshes.gridMeshEntries' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridMeshEntries',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridMeshEntries',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/meshes/menu_for_entries_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;

        me.store    = Ext.create(Rd.store.sMeshEntries,{
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
                        var count   = me.getStore().getTotalCount();
                        me.down('#count').update({count: count});
                    }   
                },
                update: function(store, records, success, options) {
                    store.sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sUpdated_item'),
                                i18n('sItem_has_been_updated'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );   
                        },
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_updating_the_item'),
                                i18n('sItem_could_not_be_updated'),
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                        }
                    });
                },
                scope: this
            },
            autoLoad: false 
        });
        me.store.getProxy().setExtraParam('mesh_id',me.meshId);
        me.store.load();

        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.columns  = [
            {xtype: 'rownumberer'},
            { text: 'SSID',                 dataIndex: 'name',          tdCls: 'gridTree', flex: 1},
            { 
                text        : 'Encryption',   
                dataIndex   : 'encryption',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(value,metaData, record){
                    if(value == 'none'){                    
                       return "None"
                    }
                    if(value == 'wep'){
                        return "WEP"
                    } 
                    if(value == 'psk'){
                        return "WPA Personal"
                    } 
                    if(value == 'psk2'){
                        return "WPA2 Personal"
                    } 
                    if(value == 'wpa'){
                        return "WPA Enterprise"
                    } 
                    if(value == 'wpa2'){
                        return "WPA2 Enterprise"
                    }             
                }
            },
            { text: 'Hidden',               dataIndex: 'hidden',        tdCls: 'gridTree', flex: 1},
            { text: 'Client isolation',     dataIndex: 'isolate',       tdCls: 'gridTree', flex: 1},
            { text: 'Apply to all nodes',   dataIndex: 'apply_to_all',  tdCls: 'gridTree', flex: 1},
        ];
        me.callParent(arguments);
    }
});
