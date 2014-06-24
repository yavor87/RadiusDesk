Ext.define('Rd.view.meshes.gridMeshViewEntries' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridMeshViewEntries',
    multiSelect : true,
    stateful    : true,
    stateId     : 'StateGridMeshViewEntries',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    viewConfig: {
        loadMask:true
    },
    tbar: [
        { xtype: 'buttongroup', title: i18n('sAction'), items : [
            { xtype: 'button',  iconCls: 'b-reload',    glyph: Rd.config.icnReload ,scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')}
        ]}    
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create(Rd.store.sMeshViewEntries,{
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

        me.columns  = [
            { xtype: 'rownumberer',                                                         stateId: 'StateGridMeshViewEntries1'},
            { text: i18n("sSSID"),      dataIndex: 'name',      tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshViewEntries2'},     
            { text: 'MAC Address',      dataIndex: 'mac',       tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshViewEntries3'},
            { text: 'Data Tx',          dataIndex: 'tx_bytes',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshViewEntries4'},
            { text: 'Data Rx',          dataIndex: 'rx_bytes',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshViewEntries5'},
            { text: 'Signal avg',       dataIndex: 'signal_avg',tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshViewEntries6'},
            { text: 'Signal now',       dataIndex: 'signal',    tdCls: 'gridTree', flex: 1, stateId: 'StateGridMeshViewEntries7'}
        ];
        me.callParent(arguments);
    }
});
