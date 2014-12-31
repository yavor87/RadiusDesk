Ext.define('CoovaChilli.view.winNewUser', {
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
	mac			: undefined,
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
			bodyCls	: 'pnlNewUser',
			html	: [
				"<h1>Sign-up for free Internet</h1>",
				"We would like to give you some free Internet!<br>",
				"Before we can do that though, please sign up with us."
			],
			buttons : [
                 {
                    itemId		: 'btnIntroNext',
                    text		: 'Next',
                    scale		: 'large',
                    glyph		: CoovaChilli.config.icnNext,
                    margin		: CoovaChilli.config.buttonMargin
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
                labelWidth  	: CoovaChilli.config.labelWidth,
                maxWidth    	: CoovaChilli.config.maxWidth, 
                margin      	: CoovaChilli.config.fieldMargin
            },
			defaults    : {
                anchor: '100%'
            },
			items       : [
				{
                    itemId  : 'mac',
                    xtype   : 'textfield',
                    name    : 'mac',
                    hidden  : true,
					value	: me.mac
                }, 
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Name',
                    name        : 'name',
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Surname',
                    name        : 'surname',
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq'
                },
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
                    xtype       : 'textfield',
                    fieldLabel  : 'Password',
                    name        : 'password',
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq',
					minLength 	: 5,
					minLengthText 	: 'Password needs to be 5 characters or more'
                },
				{
                    xtype       : 'textfield',
                    fieldLabel  : 'Cell',
                    name        : 'phone',
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
                    glyph		: CoovaChilli.config.icnBack,
                    margin		: CoovaChilli.config.buttonMargin
                },
				{
                    itemId		: 'btnDetailNext',
                    text		: 'Next',
                    scale		: 'large',
					formBind	: true,
                    glyph		: CoovaChilli.config.icnNext,
                    margin		: CoovaChilli.config.buttonMargin
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
				"Thank you for registring with us<br>",
				"Your username and password are already populated, simply click the <b>Connect</b> button to start using the Internet."
			],
			buttons : [
                 {
                    itemId		: 'btnLastNext',
                    text		: 'Next',
                    scale		: 'large',
                    glyph		: CoovaChilli.config.icnNext,
                    margin		: CoovaChilli.config.buttonMargin
                }
            ]
		});
        return pnl;
	}
}); 

