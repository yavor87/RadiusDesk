Ext.define('Mikrotik.view.winNewUser', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winNewUser',
	closable	: true,
    draggable	: true,
    resizable	: true,
    title		: 'New user registration',
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
        'Ext.form.field.Radio'
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
			html	: [
				"<h1>Intro here</h1>",
				"Get one month of usage for free",
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
                    fieldLabel  : 'Name',
                    name        : "name",
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq'
					
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Surname',
                    name        : "name",
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Email',
                    name        : "email",
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq',
					vtype		: 'email' // applies email validation rules to this field
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Password',
                    name        : "password",
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq',
					minLength 	: 5,
					minLengthText 	: 'Password needs to be 5 characters or more'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Cell',
                    name        : "phone",
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq',
					regex		: /^\d{10}$/i,
					maskRe		: /\d/i
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
			html	: [
				"<h1>Conclusion here</h1>",
				"Thank you for registring with us",
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

