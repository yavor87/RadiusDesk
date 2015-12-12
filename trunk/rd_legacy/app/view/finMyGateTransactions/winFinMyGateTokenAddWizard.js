Ext.define('Rd.view.finPaymentPlans.winFinMyGateTokenAddWizard', {
    extend		: 'Ext.window.Window',
    alias 		: 'widget.winFinMyGateTokenAddWizard',
    closable	: true,
    draggable	: true,
    resizable	: true,
    title		: 'New MyGate Token',
    width		: 500,
    height		: 500,
    plain		: true,
    border		: false,
    layout		: 'card',
    iconCls		: 'add',
    glyph   	: Rd.config.icnAdd,
    autoShow	: false,
    defaults	: {
            border: false
    },
    no_tree		: false, //If the user has no children we don't bother giving them a branchless tree
    user_id		: '',
    owner		: '',
    startScreen	: 'scrnApTree', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnData        = me.mkScrnData();
        me.items = [
            scrnApTree,
            scrnData
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){
        var pnlTree = Ext.create('Rd.view.components.pnlAccessProvidersTree',{
            itemId: 'scrnApTree'
        });
        return pnlTree;
    },

    //_______ Data for mesh  _______
    mkScrnData: function(){


        var me      = this;
        var buttons = [
                {
                    itemId: 'btnDataPrev',
                    text: i18n('sPrev'),
                    scale: 'large',
                    iconCls: 'b-prev',
                    glyph   : Rd.config.icnBack,
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'btnDataNext',
                    text: i18n('sNext'),
                    scale: 'large',
                    iconCls: 'b-next',
                    glyph   : Rd.config.icnNext,
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
                    glyph   : Rd.config.icnNext,
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];
        }

        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnData',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget		: 'under',
                labelClsExtra	: 'lblRd',
                labelAlign		: 'left',
                labelSeparator	: '',
                margin			: 15,
				labelWidth		: Rd.config.labelWidth
            },
            defaultType: 'textfield',
            items:[ 
				{
                    itemId  : 'user_id',
                    xtype   : 'textfield',
                    name    : "user_id",
                    hidden  : true,
                    value   : me.user_id
                },
                {
                    xtype   : 'textfield',
                    name    : "id",
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
            ],
            buttons: buttons
        });
        return frmData;
    }   
});
