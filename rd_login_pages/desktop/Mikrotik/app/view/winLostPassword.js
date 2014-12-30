Ext.define('Mikrotik.view.winLostPassword', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winLostPassword',
	closable	: true,
    draggable	: true,
    resizable	: true,
    title		: 'Lost password',
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
				"<h1>Supply your email address</h1>",
				"If you are registered with us<br>",
				"we will send you your credentials."
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
                    name        : 'email',
                    allowBlank  : false,
                    blankText   : 'Supply a value',
                    labelClsExtra: 'fieldReq',
					vtype		: 'email'
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
				"<h1>Action complete!</h1>",
				"Please check your email<br>"
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

