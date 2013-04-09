Ext.define('Rd.view.realms.winRealmAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winRealmAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      i18n('sAdd_realm'),
    width:      400,
    height:     400,
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
        var scrnData         = me.mkScrnData();
        me.items = [
            scrnApTree,
            scrnData
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
                        margin: Rd.config.buttonMargin
                    }
                ]
        });
        return pnlTree;
    },

    mkScrnRealmDetail: function(){
        me = this;
        var frm = Ext.create('Rd.view.realms.frmDetail',{itemId:'scrnRealmDetail', user_id: me.user_id, owner:me.owner, no_tree: true });
        return frm;
    },

    mkScrnData: function(){
        var me      = this;
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'fit',
            itemId:     'scrnData',
            autoScroll: true,
            fieldDefaults: {
                msgTarget   : 'under',
                labelClsExtra: 'lblRd',
                labelAlign  : 'left',
                labelSeparator: '',
                labelClsExtra: 'lblRd',
                labelWidth  : Rd.config.labelWidth,
                maxWidth    : Rd.config.maxWidth, 
                margin      : Rd.config.fieldMargin
            },
            defaultType: 'textfield',
            buttons : [
                 {
                    itemId: 'btnDetailPrev',
                    text: i18n('sPrev'),
                    scale: 'large',
                    iconCls: 'b-prev',
                    margin: Rd.config.buttonMargin
                },
                {
                    itemId: 'save',
                    text: i18n('sOK'),
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    formBind: true,
                    margin: Rd.config.buttonMargin
                }
            ],
            items:[
                {
                    xtype   : 'tabpanel',
                    layout  : 'fit',
                    xtype   : 'tabpanel',
                    margins : '0 0 0 0',
                    plain   : true,
                    tabPosition: 'bottom',
                    border  : false,
                    items   : [
                        { 
                            'title'     : i18n('sRequired_info'),
                            'layout'    : 'anchor',
                            itemId      : 'tabRequired',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [
                                {
                                    itemId  : 'user_id',
                                    xtype   : 'textfield',
                                    name    : "user_id",
                                    hidden  : true,
                                    value   : me.user_id
                                },
                                {
                                    itemId      : 'owner',
                                    xtype       : 'displayfield',
                                    fieldLabel  : i18n('sOwner'),
                                    value       : me.owner,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sName'),
                                    name        : "name",
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : i18n('sMake_available_to_sub_providers'),
                                    name        : 'available_to_siblings',
                                    inputValue  : 'available_to_siblings',
                                    checked     : false,
                                    labelClsExtra: 'lblRdReq'
                                }
                            ]
                        },
                        { 
                            'title'     : i18n('sContact_detail'),
                            'layout'    : 'anchor',
                            itemId      : 'tabContact',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [         
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sPhone'),
                                    name        : "phone",
                                    allowBlank  : true,
                                    vtype       : 'Numeric'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sFax'),
                                    name        : "fax",
                                    allowBlank  : true,
                                    vtype       : 'Numeric'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sCell'),
                                    name        : "cell",
                                    allowBlank  : true,
                                    vtype       : 'Numeric'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('s_email'),
                                    name        : "email",
                                    allowBlank  : true,
                                    vtype       : 'email'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sURL'),
                                    name        : "url",
                                    allowBlank  : true,
                                    vtype       : 'url'
                                }
                            ]
                        },
                        { 
                            'title'     : i18n('sAddress'),
                            'layout'    : 'anchor',
                            itemId      : 'tabAddress',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [         
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sStreet_Number'),
                                    name        : "street_no",
                                    allowBlank  : true
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sStreet'),
                                    name        : "street",
                                    allowBlank  : true,
                                    margin: 15
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sTown_fs_Suburb'),
                                    name        : "town_suburb",
                                    allowBlank  : true,
                                    margin: 15
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sCity'),
                                    name        : "city",
                                    allowBlank  : true
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sCountry'),
                                    name        : "country",
                                    allowBlank  : true
                                },
                                {
                                    xtype       : 'numberfield',
                                    name        : 'lon',  
                                    fieldLabel  : i18n('sLongitude'),
                                    value       : 0,
                                    maxValue    : 180,
                                    minValue    : -180,
                                    decimalPrecision: 14,
                                    labelClsExtra: 'lblRd'
                                },
                                {
                                    xtype       : 'numberfield',
                                    name        : 'lat',  
                                    fieldLabel  : i18n('sLatitude'),
                                    value       : 0,
                                    maxValue    : 90,
                                    minValue    : -90,
                                    decimalPrecision: 14,
                                    labelClsExtra: 'lblRd'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return frmData;
    }
});
