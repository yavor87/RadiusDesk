Ext.define('Rd.view.accessProviders.frmDetail', {
    extend: 'Ext.form.Panel',
    alias : 'widget.frmAccessProviderDetail',
    border: false,
    requires: [
        'Rd.view.components.vCmbLanguages',
        'Rd.view.components.ajaxCheckbox'
    ],
    urlCheckbox: '/cake2/rd_cake/access_providers/record_activity_checkbox.json',
    layout: 'anchor',
    autoScroll:true,
    defaults: {
        anchor: '100%'
    },
    fieldDefaults: {
        msgTarget: 'under',
        labelClsExtra: 'lblRd',
        labelAlign: 'left',
        labelSeparator: '',
        margin: 15
    },
    pwdHidden: true,//For pwd display
    noTree: false, //For back button control
    defaultType: 'textfield',
    initComponent: function() {
        var me = this;

        var pwdBlankAllow = false;
        if(me.pwdHidden == true){
            pwdBlankAllow = true;
        } 

        var buttons = [
                {
                    itemId: 'btnDetailPrev',
                    text: i18n('sPrev'),
                    scale: 'large',
                    iconCls: 'b-prev',
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'save',
                    text: i18n('sOK'),
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];

        if(me.noTree == true){
            var buttons = [
                {
                    itemId: 'save',
                    text: i18n('sOK'),
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];
        }
        me.buttons = buttons;

        var aCb = Ext.create('Rd.view.components.ajaxCheckbox',{
            'url':      me.urlCheckbox,
            boxLabel  : i18n('sRecord_all_acivity'),
            name      : 'monitor',
            inputValue: 'monitor',
            checked   : true,
            boxLabelCls: 'lblRdReq'
        });

        me.items = [
        {
            itemId  : 'parent_id',
            xtype   : 'textfield',
            name    : "parent_id",
            value   : me.user_id,
            hidden  : true
        },   
        {
            itemId      : 'owner',
            xtype       : 'displayfield',
            fieldLabel  : i18n('sOwner'),
            value       : me.owner,
            labelClsExtra: 'lblRdReq'
        },
        {
            xtype: 'textfield',
            name : "id",
            hidden: true
        },
        {
            xtype: 'textfield',
            fieldLabel: i18n('sUsername'),
            name : "username",
            allowBlank:false,
            blankText: i18n("sEnter_a_value"),
            labelClsExtra: 'lblRdReq'
        },
        {
            xtype: 'textfield',
            fieldLabel: i18n('sPassword'),
           // inputType: 'password',
            name : "password",
            allowBlank:pwdBlankAllow,
            blankText: i18n("sEnter_a_value"),
            labelClsExtra: 'lblRdReq',
            hidden: me.pwdHidden
        }, 
        { xtype: 'cmbLanguages', width: 350, fieldLabel: i18n('sLanguage'),  name: 'language', allowBlank: false,labelClsExtra: 'lblRdReq' },
        {
            xtype     : 'checkbox',      
            boxLabel  : i18n('sActivate'),
            name      : 'active',
            inputValue: 'active',
            checked   : true,
            boxLabelCls: 'lblRdReq'
        },
        aCb, //Ajax checkbox - state depends on the rights of the AP and their own record activity setting
        {
            xtype:'fieldset',
            title: i18n('sOptional_Info'),
            collapsible: true,
            border: false,
            collapsed: true,
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n('sName'),
                    name : "name",
                    allowBlank:true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n('sSurname'),
                    name : "surname",
                    allowBlank:true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n('sPhone'),
                    name : "phone",
                    allowBlank:true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n('s_email'),
                    name : "email",
                    allowBlank:true
                },
                {
                    xtype     : 'textareafield',
                    grow      : true,
                    name      : 'address',
                    fieldLabel: i18n('sAddress'),
                    anchor    : '100%'
                }
            ]
        }
        ];
        this.callParent(arguments);
    }
});
