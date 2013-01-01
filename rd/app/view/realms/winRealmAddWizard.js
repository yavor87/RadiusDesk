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
            columns: [
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Access Provider',
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
                      //  disabled: true,
                        margin: '0 20 40 0'
                    }
                ]
        });
        return pnlTree;
    },
/*
     //____ Realm Detail SCREEN ____
    mkScrnRealmDetail: function(){

        //A form which allows the user to select
        var pnlTree = Ext.create('Ext.form.Panel',{
                itemId:     'scrnRealmDetail',
                border:     false,
                layout:     'anchor',
                width:      '100%',
                flex:       1,
                defaults: {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget:      'under',
                    labelClsExtra:  'lblRd',
                    labelAlign:     'top',
                    labelSeparator: '',
                    margin:         15
                },
                defaultType: 'textfield',
                items: [
                    {
                        itemId  : 'user_id',
                        xtype   : 'textfield',
                        name    : "user_id",
                        hidden  : true
                    }, 
                    {
                        itemId      : 'creator',
                        xtype       : 'displayfield',
                        fieldLabel  : 'Creator',
                        value       : '',
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Name',
                        name        : "name",
                        allowBlank  : false,
                        blankText   : "Enter a name",
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'checkbox',      
                        boxLabel    : 'Make available to sub-providers',
                        name        : 'available_to_siblings',
                        inputValue  : 'available_to_siblings',
                        checked     : false,
                        boxLabelCls : 'lblRdReq'
                    }

                    ],
                buttons: [
                    {
                        itemId:     'btnRealmDetailPrev',
                        text:       'Prev',
                        scale:      'large',
                        iconCls:    'b-prev'
                    },
                    {
                        itemId: 'save',
                        text: 'OK',
                        scale: 'large',
                        iconCls: 'b-btn_ok',
                        formBind: true,
                        margin: '0 20 40 0'
                    }
                ]
        });
        return pnlTree;
    }
*/

  mkScrnRealmDetail: function(){

        var frm = Ext.create('Rd.view.realms.frmDetail',{itemId:'scrnRealmDetail'});
        return frm;
    }


});
