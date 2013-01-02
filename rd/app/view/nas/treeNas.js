Ext.define('Rd.view.nas.treeNas' ,{
    extend:'Ext.tree.Panel',
    useArrows: true,
    alias : 'widget.treeNas',
    store: 'sAccessProviders',
    rootVisible: true,
    rowLines: true,
    stripeRows: true,
    title: 'Group / Filter',
    border: false 
});
