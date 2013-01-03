Ext.define('Rd.view.realms.winRealmAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winRealmAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Add realm',
    width:      380,
    height:     380,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    autoShow:   false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
        'Rd.view.realms.frmDetail'
    ],
     initComponent: function() {
        var me = this;
        var scrnApTree       = me.mkScrnApTree();
        var scrnRealmDetail  = me.mkScrnRealmDetail();
        this.items = [
            scrnApTree,
            scrnRealmDetail
        ]; 
        this.callParent(arguments);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){

        //A form which allows the user to select
        var pnlTree = Ext.create('Ext.tree.Panel',{
            itemId: 'scrnApTree',
            useArrows: true,
            store: 'sAccessProviders',
            rootVisible: true,
            rowLines: true,
            layout: 'fit',
            stripeRows: true,
            border: false,
            tbar: [
                { xtype: 'tbtext', text: 'Select an owner for the realm', cls: 'lblRd' }
            ],
            columns: [
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Owner',
                    sortable: true,
                    flex: 1,
                    dataIndex: 'username',
                    tdCls: 'gridTree'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnTreeNext',
                        text: 'Next',
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0'
                    }
                ]
        });
        return pnlTree;
    },

    mkScrnRealmDetail: function(){
        var frm = Ext.create('Rd.view.realms.frmDetail',{itemId:'scrnRealmDetail'});
        return frm;
    }
});
