Ext.define('Rd.view.components.gridNote' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridNote',
    multiSelect: true,
    border: false,
    noteForId   : '',
    noteForGrid : '',
    requires: ['Rd.model.mNote'],
    tbar:   [
        { xtype: 'button',  iconCls: 'b-reload',    scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},              
        { xtype: 'button',  iconCls: 'b-add',       scale: 'large', itemId: 'add',      tooltip:    i18n('sAdd')   },
        { xtype: 'button',  iconCls: 'b-delete',    scale: 'large', itemId: 'delete',   tooltip:    i18n('sDelete')}
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    columns: [
        {xtype: 'rownumberer'},
        { text: 'Note',   dataIndex: 'note',    tdCls: 'multiLine', flex: 1},
        { text: 'Owner',  dataIndex: 'owner',   tdCls: 'gridTree', width: 70}
    ],
    initComponent: function(){
        var me      = this;  
        me.store    = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mNote',
            extend: 'Ext.data.Store',
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : '/cake2/rd_cake/' + me.noteForGrid + '/note_index.json',
                extraParams: { 'for_id' : me.noteForId },
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message'
                },
                api: {
                    destroy  : '/cake2/rd_cake/' + me.noteForGrid + '/note_del.json'
                }
            },
            autoLoad: true
        });
        me.getStore().addListener('load',me.onStoreNoteLoaded, me); 
        me.callParent(arguments);
    },
    onStoreNoteLoaded: function() {
        var me      = this;
        console.log(me.getStore().getTotalCount());
        var count   = me.getStore().getTotalCount();
        me.down('#count').update({count: count});
    }
});
