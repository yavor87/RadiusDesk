Ext.define('Rd.view.finPaymentPlans.winFinMyGateTokenEdit', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winFinMyGateTokenEdit',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Edit Token',
    width       : 500,
    height      : 400,
    plain       : true,
    border      : false,
    layout      : 'fit',
    iconCls     : 'edit',
    glyph       : Rd.config.icnEdit,
    autoShow    : false,
	tokenId		: false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.tab.Panel',
        'Ext.form.Panel',
        'Ext.form.field.Text'
    ],
     initComponent: function() {
        var me 		= this; 

        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'left',
                labelSeparator  : '',
                labelClsExtra   : 'lblRd',
                labelWidth      : Rd.config.labelWidth,
                maxWidth        : Rd.config.maxWidth, 
                margin          : Rd.config.fieldMargin
            },
            defaultType: 'textfield',
            buttons : [
                {
                    itemId: 'save',
                    text: i18n('sOK'),
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    glyph   : Rd.config.icnYes,
                    formBind: true,
                    margin: Rd.config.buttonMargin
                }
            ],
            items: [
				{
                    xtype   : 'textfield',
                    name    : "id",
                    hidden  : true,
                    value   : me.tokenId
                },
				{
                    xtype       	: 'cmbPermanentUser',
                    allowBlank  	: false,
                    labelClsExtra	: 'lblRdReq',
                    itemId      	: 'permanent_user_id',
					fieldLabel  	: 'Permanent User',
					name			: 'permanent_user_id'
                },
				{
                    xtype       	: 'cmbFinPaymentPlans',
                    allowBlank  	: false,
                    labelClsExtra	: 'lblRdReq',
					itemId			: 'fin_payment_plan_id'
                },
				{
                    xtype       	: 'textfield',
                    fieldLabel  	: "Client PIN",
                    name        	: "client_pin",
                    allowBlank  	: false,
                    labelClsExtra	: 'lblRdReq'
                },
				{
                    xtype       	: 'textfield',
                    fieldLabel  	: "Client UCI",
                    name        	: "client_uci",
                    allowBlank  	: false,
                    labelClsExtra	: 'lblRdReq'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : "Client UID",
                    name        : "client_uid",
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Override',
                    name        : "override",
                    allowBlank  : true,
                    labelClsExtra: 'lblRd',
					regex		: /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/i,
					maskRe		: /\d|\./i,
					regexText   : 'Currency format please e.g. 10.95'
                },
				{
					xtype       : 'checkbox',      
					fieldLabel  : 'Override completed',
					name        : 'override_completed',
                    inputValue  : 'override_completed',
                    checked     : false,
                    boxLabelCls : 'lblRdCheck'
		
				},
				{
					xtype       : 'checkbox',      
					fieldLabel  : i18n('sActive'),
					name        : 'active',
                    inputValue  : 'active',
                    checked     : true,
                    boxLabelCls : 'lblRdCheck'
		
				}
        
            ]
        });
        me.items = frmData;
        me.callParent(arguments);
    }
});
