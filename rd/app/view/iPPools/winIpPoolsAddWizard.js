Ext.define('Rd.view.iPPools.winIpPoolsAddWizard', {
    extend		: 'Ext.window.Window',
    alias 		: 'widget.winIpPoolsAddWizard',
    closable	: true,
    draggable	: true,
    resizable	: true,
    title		: 'New IP Pool',
    width		: 400,
    height		: 400,
    plain		: true,
    border		: false,
    layout		: 'card',
    iconCls		: 'add',
    glyph   	: Rd.config.icnAdd,
    autoShow	:   false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer'
    ],
    initComponent: function() {
        var me = this;
		var scrnChoice       = me.mkScrnChoice();
        var scrnNewPool      = me.mkScrnNewPool();
        var scrnExistingPool = me.mkScrnExistingPool();
        me.items = [
            scrnChoice,
            scrnNewPool,
			scrnExistingPool
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ Choice SCREEN ____
    mkScrnChoice: function(){
       var me      = this;
        var buttons = [
                {
                    itemId	: 'btnScrnChoiceNext',
                    text	: i18n('sNext'),
                    scale	: 'large',
                    iconCls	: 'b-next',
                    glyph   : Rd.config.icnNext,
                    formBind: true,
                    margin	: '0 20 40 0'
                }
            ];

        var frmChoice = Ext.create('Ext.form.Panel',{
            border		: false,
            layout		: 'anchor',
            itemId		: 'scrnChoice',
            autoScroll	: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget		: 'under',
                labelClsExtra	: 'lblRd',
                labelAlign		: 'left',
                labelSeparator	: '',
                margin			: 15
            },
            defaultType: 'textfield',
            items:[{
                xtype		: 'radiogroup',
                fieldLabel	: 'Choose one',
                columns		: 1,
                vertical	: true,
				items		: [
								{ boxLabel: 'New IP pool', 		name: 'rb', inputValue: 'new_pool', checked: true },
            					{ boxLabel: 'Add IP to pool', 	name: 'rb', inputValue: 'new_ip'}
				]
            }],
            buttons: buttons
        });
        return frmChoice;
    },

    //_______ New Pool  _______
    mkScrnNewPool: function(){
        var me      = this;
        var buttons = [
                {
                    itemId	: 'btnNewPoolPrev',
                    text	: i18n('sPrev'),
                    scale	: 'large',
                    iconCls	: 'b-prev',
                    glyph   : Rd.config.icnBack,
                    margin	: '0 20 40 0'
                },
                {
                    itemId	: 'btnNewPoolNext',
                    text	: i18n('sNext'),
                    scale	: 'large',
                    iconCls	: 'b-next',
                    glyph   : Rd.config.icnNext,
                    formBind: true,
                    margin	: '0 20 40 0'
                }
            ];

        var frmNewPool = Ext.create('Ext.form.Panel',{
            border		: false,
            layout		: 'anchor',
            itemId		: 'scrnNewPool',
            autoScroll	: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget		: 'under',
                labelClsExtra	: 'lblRd',
                labelAlign		: 'left',
                labelSeparator	: '',
                margin			: 15
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: i18n('sSupply_the_following'), cls: 'lblWizard' }
            ],
            items:[
                {
                    xtype       	: 'textfield',
                    fieldLabel  	: i18n('sName'),
                    name        	: "name",
                    allowBlank  	: false,
                    blankText   	: i18n('sSupply_a_value'),
                    labelClsExtra	: 'lblRdReq'
                }
            ],
            buttons: buttons
        });
        return frmNewPool;
    },   

	//_______ Existing Pool  _______
    mkScrnExistingPool: function(){
        var me      = this;
        var buttons = [
                {
                    itemId	: 'btnExistingPoolPrev',
                    text	: i18n('sPrev'),
                    scale	: 'large',
                    iconCls	: 'b-prev',
                    glyph   : Rd.config.icnBack,
                    margin	: '0 20 40 0'
                },
                {
                    itemId	: 'btnExistingPoolNext',
                    text	: i18n('sNext'),
                    scale	: 'large',
                    iconCls	: 'b-next',
                    glyph   : Rd.config.icnNext,
                    formBind: true,
                    margin	: '0 20 40 0'
                }
            ];

        var frmExistingPool = Ext.create('Ext.form.Panel',{
            border		: false,
            layout		: 'anchor',
            itemId		: 'scrnExistingPool',
            autoScroll	: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget		: 'under',
                labelClsExtra	: 'lblRd',
                labelAlign		: 'left',
                labelSeparator	: '',
                margin			: 15
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: i18n('sSupply_the_following'), cls: 'lblWizard' }
            ],
            items:[
                {
                    xtype       	: 'textfield',
                    fieldLabel  	: i18n('sName'),
                    name        	: "name",
                    allowBlank  	: false,
                    blankText   	: i18n('sSupply_a_value'),
                    labelClsExtra	: 'lblRdReq'
                }
            ],
            buttons: buttons
        });
        return frmExistingPool;
    }   

});
