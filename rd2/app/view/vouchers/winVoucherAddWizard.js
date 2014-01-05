Ext.define('Rd.view.vouchers.winVoucherAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winVoucherAddWizard',
    closable:   true,
    draggable:  true,
    resizable:  false,
    title:      i18n('sNew_voucher'),
    width:      400,
    height:     450,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    autoShow:   false,
    apId    :   false,
    defaults: {
            border: false
    },
    no_tree : false, //If the user has no children we don't bother giving them a branchless tree
    user_id : '',
    owner   : '',
    startScreen: 'scrnApTree', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.components.pnlAccessProvidersTree'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnData        = me.mkScrnData();
        me.items = [
            scrnApTree,
            scrnData
        ];
        me.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);  
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){
        //A form which allows the user to select
        var pnlTree = Ext.create('Rd.view.components.pnlAccessProvidersTree',{
            itemId: 'scrnApTree'
        });
        return pnlTree;
    },

    //_______ Data for voucher  _______
    mkScrnData: function(){

        var me      = this;

        //Set default values for from and to:
        var dtTo    = new Date();
        dtTo.setYear(dtTo.getFullYear() + 1);

        var buttons = [
                {
                    itemId: 'btnDataPrev',
                    text: i18n('sPrev'),
                    scale: 'large',
                    iconCls: 'b-prev',
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'btnDataNext',
                    text: i18n('sNext'),
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];

        if(me.no_tree == true){
            var buttons = [
                {
                    itemId: 'btnDataNext',
                    text: i18n('sNext'),
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];
        }

        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'fit',
            itemId:     'scrnData',
            autoScroll: true,
            fieldDefaults: {
                msgTarget: 'under',
                labelClsExtra: 'lblRd',
                labelAlign: 'left',
                labelSeparator: '',
                labelWidth: 150,
                margin: 15
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: i18n('sSupply_the_following'), cls: 'lblWizard' }
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
                            'title'     : i18n('sBasic_info'), 
                            'layout'    : 'anchor',
                            defaults    : {
                                anchor: '100%'
                            },
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
                                    name        : 'precede',
                                    fieldLabel  : i18n('sPrecede_string'),
                                    allowBlank  : true,
                                    labelClsExtra: 'lblRd'
                                },
                                {
                                    xtype       : 'cmbRealm',
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq',
                                    itemId      : 'realm',
                                    extraParam  : me.apId
                                },
                                {
                                    xtype       : 'cmbProfile',
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq',
                                    itemId      : 'profile',
                                    extraParam  : me.apId
                                },
                                {
                                    xtype       : 'numberfield',
                                    name        : 'quantity',
                                    fieldLabel  : i18n('sHow_many_qm'),
                                    value       : 1,
                                    maxValue    : 500,
                                    minValue    : 1,
                                    labelClsExtra: 'lblRdReq',
                                    itemId      : 'quantity'
                                },
                                {
                                    xtype       : 'textfield',
                                    name        : 'batch',
                                    fieldLabel  : i18n('sBatch_name'),
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq',
                                    itemId      : 'batch',
                                    disabled    : true,
                                    hidden      : true
                                },
                                {
                                    xtype       : 'slider',
                                    name        : 'pwd_length',
                                    fieldLabel  : i18n('sPassword_length'),
                                    width       : 200,
                                    value       : 3,
                                    increment   : 1,
                                    minValue    : 3,
                                    maxValue    : 15
                                }
                            ]
                        },
                        { 
                            'title' : i18n('sActivate_and_Expire'),
                            'layout'    : 'anchor',
                            defaults    : {
                                anchor: '100%'
                            },
                            items       : [
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : i18n('sActivate_upon_first_login'),
                                    name        : 'activate_on_login',
                                    inputValue  : 'activate_on_login',
                                    itemId      : 'activate_on_login',
                                    checked     : false,
                                    boxLabelCls : 'lblRdCheck'
                                },
                                {
                                    xtype       : 'numberfield',
                                    name        : 'days_valid',
                                    fieldLabel  : i18n('sDays_available_after_first_login'),
                                    value       : 1,
                                    maxValue    : 90,
                                    minValue    : 1,
                                    itemId      : 'days_valid',
                                    hidden      : true,
                                    disabled    : true
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : i18n('sNever_expire'),
                                    name        : 'never_expire',
                                    inputValue  : 'never_expire',
                                    itemId      : 'never_expire',
                                    checked     : true,
                                    boxLabelCls : 'lblRdCheck'
                                },
                                {
                                    xtype       : 'datefield',
                                    fieldLabel  : i18n('sExpire'),
                                    name        : 'expire',
                                    itemId      : 'expire',
                                    minValue    : new Date(),  // limited to the current date or after
                                    disabled    : true,
                                    value       : dtTo
                                }
                            ]
                        }
                    ]
                }              
            ],
            buttons: buttons
        });
        return frmData;

    }   
});
