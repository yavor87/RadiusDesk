Ext.define('Mikrotik.view.winCreditCard', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winCreditCard',
	closable	: true,
    draggable	: true,
    resizable	: true,
    title		: 'Credit Card Payment',
    width		: 400,
    height		: 400,
    plain		: true,
    border		: false,
    layout		: 'card',
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
		'Mikrotik.view.cmbFinPaymentPlans'
    ],
    initComponent: function() {
       	var me 			= this;
		var scrnIntro  	= me.mkScrnIntro();
        var scrnDetail 	= me.mkScrnDetail();
		var scrnEnd		= me.mkScreenEnd()
        me.items = [
            scrnIntro,
            scrnDetail,
			scrnEnd
        ];
        me.callParent(arguments);
        me.getLayout().setActiveItem(scrnIntro);
    },
	mkScrnIntro: function(){
        me 		= this;
        var pnl = Ext.create('Ext.panel.Panel',{
			itemId	: 'scrnIntro',
			bodyCls	: 'pnlNewUser',
			html	: [
				"<h1>Time to pay</h1>",
				"Now you are sure you want to stick with us we need you to pay ;-)<br>",
				"We will deduct a monthly fee based on the plan you choose"
			],
			buttons : [
                 {
                    itemId		: 'btnIntroNext',
                    text		: 'Next',
                    scale		: 'large',
                    glyph		: Mikrotik.config.icnNext,
                    margin		: Mikrotik.config.buttonMargin
                }
            ]
		});
        return pnl;
    },
	mkScrnDetail: function(){
        me 		= this;
        var pnl = Ext.create('Ext.form.Panel',{
			itemId	: 'scrnDetail', 
			layout  : 'anchor',
			fieldDefaults: {
                msgTarget   	: 'under',
                labelClsExtra	: 'lblRd',
                labelAlign  	: 'left',
                labelSeparator	: '',
                labelClsExtra	: 'lblRd',
                labelWidth  	: Mikrotik.config.labelWidth,
                maxWidth    	: Mikrotik.config.maxWidth, 
                margin      	: Mikrotik.config.fieldMargin
            },
			defaults    : {
                anchor: '100%'
            },
			items       : [
			
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Email (username)',
                    name        : 'username',
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq',
					vtype		: 'email'
                },
				{
                    xtype       	: 'cmbFinPaymentPlans',
                    allowBlank  	: false,
                    labelClsExtra	: 'fieldReq'
                },
				{
                    xtype       	: 'textfield',
                    fieldLabel  	: 'Card holder',
                    name        	: 'card_holder',
                    allowBlank  	: false,
                    blankText   	: 'Supply a value',
                    labelClsExtra	: 'fieldReq',
					value			: 'Joe Soap'
                },
				{
					xtype       	: 'textfield',
					fieldLabel		: 'Card number',
					name			: 'card_number',
					vtype			: 'creditcard',
					allowBlank  	: false,
					blankText   	: 'Supply a value',
					labelClsExtra	: 'fieldReq',
					value			: '4111111111111111'
				},
				{
					xtype			: 'numberfield',
					fieldLabel  	: 'Expiry month',
                    name        	: 'expiry_month',
                    allowBlank  	: false,
                    blankText   	: 'Supply a value',
					value			: 12,
					maxValue		: 12,
					minValue		: 1,
					labelClsExtra	: 'fieldReq'
				},
				{
					xtype			: 'numberfield',
					fieldLabel  	: 'Expiry year',
                    name        	: 'expiry_year',
                    allowBlank  	: false,
                    blankText   	: 'Supply a value',
					value			: 2015,
					maxValue		: 2030,
					minValue		: 2015,
					labelClsExtra	: 'fieldReq'
				}
			],   
			buttons : [
                 {
                    itemId		: 'btnDetailBack',
                    text		: 'Back',
                    scale		: 'large',
                    glyph		: Mikrotik.config.icnBack,
                    margin		: Mikrotik.config.buttonMargin
                },
				{
                    itemId		: 'btnDetailNext',
                    text		: 'Next',
                    scale		: 'large',
					formBind	: true,
                    glyph		: Mikrotik.config.icnNext,
                    margin		: Mikrotik.config.buttonMargin
                }
            ]
		});
        return pnl;
    },
	mkScreenEnd : function(){

		me 		= this;
        var pnl = Ext.create('Ext.panel.Panel',{
			itemId	: 'scrnEnd',
			bodyCls	: 'pnlNewUser', 
			html	: [
				"<h1>Thank you!</h1>",
				"Thank you for signing up for reccuring billing<br>"
			],
			buttons : [
                 {
                    itemId		: 'btnLastNext',
                    text		: 'Next',
                    scale		: 'large',
                    glyph		: Mikrotik.config.icnNext,
                    margin		: Mikrotik.config.buttonMargin
                }
            ]
		});
        return pnl;
	}
}); 

