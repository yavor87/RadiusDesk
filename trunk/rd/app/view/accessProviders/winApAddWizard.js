Ext.define('Rd.view.tags.winApAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winApAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      i18n('sNew_Access_Provider'),
    width:      400,
    height:     400,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    autoShow:   false,
    defaults: {
            border: false
    },
    no_tree: false, //If the user has no children we don't bother giving them a branchless tree
    user_id: '',
    owner: '',
    startScreen: 'scrnApTree', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
        'Rd.view.accessProviders.frmDetail'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnDetail      = me.mkScrnDetail();
        me.items = [
              scrnApTree,
              scrnDetail
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){

        //A form which allows the user to select
        var pnlTree = Ext.create('Ext.tree.Panel',{
            itemId: 'scrnApTree',
            useArrows: true,
            store: 'sAccessProvidersTree',
            rootVisible: true,
            rowLines: true,
            layout: 'fit',
            stripeRows: true,
            border: false,
            tbar: [
                { xtype: 'tbtext', text: i18n('sSelect_the_Parent_Access_provider'), cls: 'lblWizard' }
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

    //_______ Data for tag  _______
    mkScrnDetail: function(){
        var me          = this;
        var frmDetail   = Ext.create('Rd.view.accessProviders.frmDetail',
        {
            pwdHidden   :false,
            itemId      :'scrnDetail',
            user_id     : me.user_id,
            owner       : me.owner
        });
        return frmDetail;
    }
    
});
