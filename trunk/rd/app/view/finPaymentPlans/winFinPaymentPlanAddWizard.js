Ext.define('Rd.view.finPaymentPlans.winFinPaymentPlanAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winFinPaymentPlanAddWizard',
    closable:   true,
    draggable:  true,
    resizable:  true,
    title:      'New Payment Plan',
    width:      400,
    height:     500,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    glyph   : Rd.config.icnAdd,
    autoShow:   false,
    defaults: {
            border: false
    },
    no_tree: false, //If the user has no children we don't bother giving them a branchless tree
    user_id: '',
    owner: '',
    startScreen: 'scrnApTree', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Rd.view.finPaymentPlans.cmbCurrency',
		'Rd.view.finPaymentPlans.cmbPaymentPlanType'
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
                msgTarget: 'under',
                labelClsExtra: 'lblRd',
                labelAlign: 'left',
                labelSeparator: '',
                margin: 15
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: i18n('sSupply_the_following'), cls: 'lblWizard' }
            ],
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
					extraParam  : me.user_id
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
					value		: '0.00',
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
            ],
            buttons: buttons
        });
        return frmData;
    }   
});
