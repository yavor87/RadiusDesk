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
    pwdHidden: true,
    parent_id: '',
    parent_name: '',
    defaultType: 'textfield',
    buttons: [
        {
            itemId: 'save',
            text: 'OK',
            scale: 'large',
            iconCls: 'b-btn_ok',
            formBind: true,
            margin: '0 20 40 0'
        }
    ],

    initComponent: function() {
        var me = this;

        var pwdBlankAllow = false;
        if(me.pwdHidden == true){
            pwdBlankAllow = true;
        } 

        var aCb = Ext.create('Rd.view.components.ajaxCheckbox',{
            'url':      me.urlCheckbox,
            boxLabel  : 'Record all acivity',
            name      : 'monitor',
            inputValue: 'monitor',
            checked   : true,
            boxLabelCls: 'lblRdReq'
        });

        me.items = [
        {
            xtype: 'textfield',
            name : "parent_id",
            hidden: true,
            value: me.parent_id
        },
        {
            xtype: 'textfield',
            name : "id",
            hidden: true
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Creator',
            value: me.parent_name,
            labelClsExtra: 'lblRdReq'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Username',
            name : "username",
            allowBlank:false,
            blankText:"Enter Message ID",
            labelClsExtra: 'lblRdReq'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Password',
           // inputType: 'password',
            name : "password",
            allowBlank:pwdBlankAllow,
            blankText:"Enter a password",
            labelClsExtra: 'lblRdReq',
            hidden: me.pwdHidden
        }, 
        { xtype: 'cmbLanguages', width: 350, fieldLabel: 'Language',  name: 'language', allowBlank: false,labelClsExtra: 'lblRdReq' },
        {
            xtype: 'textfield',
            fieldLabel: 'Name',
            name : "name",
            allowBlank:true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Surname',
            name : "surname",
            allowBlank:true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Phone',
            name : "phone",
            allowBlank:true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'email',
            name : "email",
            allowBlank:true
        },
        {
            xtype     : 'textareafield',
            grow      : true,
            name      : 'address',
            fieldLabel: 'Address',
            anchor    : '100%'
        },
        {
            xtype     : 'checkbox',      
            boxLabel  : 'Activate',
            name      : 'active',
            inputValue: 'active',
            checked   : true,
            boxLabelCls: 'lblRdReq'

        },
        aCb //Ajax checkbox - state depends on the rights of the AP and their own record activity setting
        ];
        this.callParent(arguments);
    }
});
