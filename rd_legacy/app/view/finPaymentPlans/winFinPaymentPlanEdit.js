Ext.define('Rd.view.finPaymentPlans.winFinPaymentPlanEdit', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winFinPaymentPlanEdit',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Edit Payment Plan',
    width       : 400,
    height      : 500,
    plain       : true,
    border      : false,
    layout      : 'fit',
    iconCls     : 'edit',
    glyph       : Rd.config.icnEdit,
    autoShow    : false,
    planId      : '',
	apId		: false,
	hidePower	: false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.tab.Panel',
        'Ext.form.Panel',
        'Ext.form.field.Text',
		'Rd.view.finPaymentPlans.cmbCurrency',
		'Rd.view.finPaymentPlans.cmbPaymentPlanType'
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
                    value   : me.planId
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : i18n('sName'),
                    name        : "name",
                    allowBlank  : false,
                    blankText   : i18n('sSupply_a_value'),
                    labelClsExtra: 'lblRdReq'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : i18n('sDescription'),
                    name        : "description",
                    allowBlank  : true,
                    labelClsExtra: 'lblRd'
                },
				{
                    xtype       : 'cmbProfile',
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq',
                    itemId      : 'profile',
					extraParam  : me.apId,
					name		: 'profile_id'
                },
				{ 
                    xtype       : 'cmbPaymentPlanType', 
                    width       : 350, 
                    fieldLabel  : 'Type',  
                    name        : 'type',
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq' 
                },
				{ 
                    xtype       : 'cmbCurrency', 
                    width       : 350, 
                    fieldLabel  : 'Currency',  
                    name        : 'currency_code',
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq' 
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : i18n('sValue'),
                    name        : "value",
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq',
					regex		: /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/i,
					maskRe		: /\d|\./i,
					regexText   : 'Currency format please e.g. 10.95'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Tax %',
                    name        : "tax",
                    allowBlank  : false,
                    labelClsExtra: 'lblRdReq',
					regex		: /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/i,
					maskRe		: /\d|\./i,
					regexText   : 'Max two decimal places e.g. 10.95'
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
