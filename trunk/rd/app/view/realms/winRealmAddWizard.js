Ext.define('Rd.view.realms.winRealmAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winRealmAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      i18n('sAdd_realm'),
    width:      380,
    height:     380,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    autoShow:   false,
    startScreen:'scrnApTree',
    owner:      '',
    user_id:    '',
    no_tree:    false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
        'Rd.view.realms.frmDetail',
        'Rd.store.sAccessProvidersTree',
        'Rd.model.mAccessProviderTree'
    ],
     initComponent: function() {
        var me = this;
        var scrnApTree       = me.mkScrnApTree();
        var scrnRealmDetail  = me.mkScrnRealmDetail();
        me.items = [
            scrnApTree,
            scrnRealmDetail
        ]; 
        me.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){
        var me = this;

        var store = Ext.create('Rd.store.sAccessProvidersTree', {});

        //A form which allows the user to select
        var pnlTree = Ext.create('Ext.tree.Panel',{
            itemId: 'scrnApTree',
            useArrows: true,
            store: store,
            rootVisible: true,
            rowLines: true,
            layout: 'fit',
            stripeRows: true,
            border: false,
            tbar: [
                { xtype: 'tbtext', text: i18n('sSelect_an_owner_for_the_realm'), cls: 'lblRd' }
            ],
            columns: [
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: i18n('sOwner'),
                    sortable: true,
                    flex: 1,
                    dataIndex: 'username',
                    tdCls: 'gridTree'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnTreeNext',
                        text: i18n('sNext'),
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0'
                    }
                ]
        });
        return pnlTree;
    },

    mkScrnRealmDetail: function(){
        me = this;
        var frm = Ext.create('Rd.view.realms.frmDetail',{itemId:'scrnRealmDetail', user_id: me.user_id, owner:me.owner, no_tree: true });
        return frm;
    }
});
