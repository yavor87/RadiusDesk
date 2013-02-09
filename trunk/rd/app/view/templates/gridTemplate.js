Ext.define('Rd.view.templates.gridTemplate' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridTemplate',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGridTemplate',
    stateEvents:['groupclick','columnhide'],
    border: false,
    tmpl_id:  null,
    columns: [
        {xtype: 'rownumberer'},
        { text: i18n('sAttribute_name'),    dataIndex: 'attribute', tdCls: 'gridTree', flex: 1},
        { text: i18n('sTooltip_text'),      dataIndex: 'tooltip',   tdCls: 'grdEditable', flex: 1,editor: { xtype: 'textfield',  allowBlank: false}},
        {
            header: i18n('sType'),
            dataIndex: 'type',
            width: 130,
            tdCls: 'grdEditable',
            editor: {
                xtype: 'combobox',
                typeAhead: true,
                triggerAction: 'all',
                selectOnTab: true,
                store: [
                    ['Check',i18n('sCheck')],
                    ['Reply',i18n('sReply')]
                ],
                lazyRender: true,
                listClass: 'x-combo-list-small'
            },
            renderer: function(value){
                if(value == "Check"){
                    return i18n('sCheck');
                }else{
                    return i18n('sReply');
                }
            }
        },
        {
            header: i18n('sUnits'),
            dataIndex: 'unit',
            width: 130,
            tdCls: 'grdEditable',
            editor: {
                xtype: 'combobox',
                typeAhead: true,
                triggerAction: 'all',
                selectOnTab: true,
                store: [
                    ['check','Check'],
                    ['reply','Reply']
                ],
                lazyRender: true,
                listClass: 'x-combo-list-small'
            }
        }
    ],
    tbar: [
        { xtype: 'buttongroup', title: i18n('sAction'),items : [ 
            {   xtype: 'button',  iconCls: 'b-reload',    scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},
            {   xtype: 'button',  iconCls: 'b-delete', scale: 'large', itemId: 'delete',    tooltip:    i18n('sDelete')}
        ]}, 
        { xtype: 'buttongroup', title: i18n('sSelection'),items : [
            {   xtype: 'cmbVendor'     , itemId:'cmbVendor',    emptyText: i18n('sSelect_a_vendor') },
            {   xtype: 'cmbAttribute'  , itemId:'cmbAttribute', emptyText: i18n('sSelect_an_attribute') },
            {   xtype: 'button',  iconCls: 'b-add',    scale: 'large', itemId: 'add',       tooltip:    i18n('sAdd')}
        ]}        
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi'  }
    ],
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    initComponent: function(){

        var me = this;
        //Create a store specific to this Access Provider
        me.store = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mTemplateEdit',
            proxy: {
                type        : 'ajax',
                format      : 'json',
                batchActions: true,
                extraParams : { 'tmpl_id' : me.tmpl_id },
                reader      : {
                    type        : 'json',
                    root        : 'items',
                    messageProperty: 'message'
                },
                api         : {
                    create      : '/cake2/rd_cake/templates/add_tmpl.json',
                    read        : '/cake2/rd_cake/templates/index_tmpl.json',
                    update      : '/cake2/rd_cake/templates/edit_tmpl.json',
                    destroy     : '/cake2/rd_cake/templates/delete_tmpl.json'
                }
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
                                i18n('sProblems_updating_the_right'),
                                i18n('sRight_could_not_be_updated'),
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                        }
                    });
                },
                scope: this
            },
            autoLoad: true    
        });
        me.callParent(arguments);
    }
});
