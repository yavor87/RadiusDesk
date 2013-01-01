Ext.define('Rd.view.acos.treeAco' ,{
    extend:'Ext.tree.Panel',
    useArrows: true,
    alias : 'widget.treeAco',
    store: 'sAcos',
    rootVisible: true,
    rowLines: true,
    stripeRows: true,
    border: false,
    columns: [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Name',
            flex: 1,
            sortable: true,
            dataIndex: 'alias',
            tdCls: 'gridTree'
        },
        {
            text: 'Comment',
            flex: 2,
            dataIndex: 'comment',
            sortable: false,
            tdCls: 'gridTree'
        }
    ],
    tbar: [      
        { xtype: 'button',  iconCls: 'b-reload',    scale: 'large', itemId: 'reload'},              
        { xtype: 'button',  iconCls: 'b-add',       scale: 'large', itemId: 'add'},
        { xtype: 'button',  iconCls: 'b-delete',    scale: 'large', itemId: 'delete'},
        { xtype: 'button',  iconCls: 'b-edit',      scale: 'large', itemId: 'edit'},
        { xtype: 'button',  iconCls: 'b-expand',    scale: 'large', itemId: 'expand', tooltip: 'Expand'},
        { xtype: 'tbfill'}
    ],
    initComponent: function(){

     this.callParent(arguments);
    }
});
