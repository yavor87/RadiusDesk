Ext.define('Rd.view.meshes.winMeshEditNode', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winMeshEditNode',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Edit mesh node',
    width       : 400,
    height      : 450,
    plain       : true,
    border      : false,
    layout      : 'fit',
    iconCls     : 'add',
    glyph       : Rd.config.icnEdit,
    autoShow    : false,
    nodeId      : '',
	hidePower	: false,
    defaults: {
            border: false
    },
    requires: [
        'Ext.tab.Panel',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.meshes.cmbHardwareOptions',
		'Rd.view.meshes.cmbDialoutCode',
		'Rd.view.meshes.cmbCodec',
		'Rd.view.meshes.cmbSoftphoneSupport'
    ],
     initComponent: function() {
        var me 		= this; 
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'fit',
            defaults: {
                anchor: '100%'
            },
            itemId:     'scrnData',
            autoScroll: true,
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
                    xtype   : 'tabpanel',
                    layout  : 'fit',
                    xtype   : 'tabpanel',
                    margins : '0 0 0 0',
                    plain   : true,
                    tabPosition: 'bottom',
                    border  : false,
                    items   : [
                        { 
                            'title'     : i18n('sCommon_settings'),
                            'layout'    : 'anchor',
                            itemId      : 'tabRequired',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [
                                {
						            itemId  : 'node_id',
						            xtype   : 'textfield',
						            name    : "id",
						            hidden  : true,
						            value   : me.nodeId
						        }, 
						        {
						            xtype       : 'textfield',
						            fieldLabel  : i18n('sMAC_address'),
						            name        : "mac",
						            allowBlank  : false,
						            blankText   : i18n('sSupply_a_value'),
						            labelClsExtra: 'lblRdReq',
						            vtype       : 'MacAddress',
						            fieldStyle  : 'text-transform:lowercase',
						            value       : 'A8-40-41-13-60-E3'
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
						            xtype           : 'cmbHardwareOptions',
						            labelClsExtra   : 'lblRdReq',
						            allowBlank      : false 
						        },
						        {
						            xtype       : 'sliderfield',
						            value       : 50,
						            increment   : 10,
						            minValue    : 1,
						            maxValue    : 100,
						            name        : 'power',
						            fieldLabel  : i18n('sTX_Power_br_percent_br'),
									disabled	: me.hidePower,
									hidden		: me.hidePower
						        },
						        {
						            xtype       : 'cmbStaticEntries',
						            meshId      : me.meshId,
						            nodeId      : me.nodeId

						        },
						        {
						            xtype       : 'cmbStaticExits',
						            meshId      : me.meshId,
						            nodeId      : me.nodeId
						        }
                            ]
                        },
                        { 
                            title       : 'VOIP',
                            layout      : 'anchor',
                            disabled    : true,
                            itemId      : 'tabVoip',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [ 
								{
						            xtype       : 'checkbox',      
						            fieldLabel  : 'SIP enable',
						            itemId      : 'chkTc',
						            name        : 'sip_check',
						            inputValue  : 'sip_check',
						            checked     : false,
						            labelClsExtra: 'lblRdReq'
						        },
								{
						            xtype       : 'textfield',
						            fieldLabel  : 'SIP host',
						            name        : "sip_host",
						            allowBlank  : false,
						            blankText   : i18n('sSupply_a_value'),
						            labelClsExtra: 'lblRd'
						        },
								{
						            xtype       : 'textfield',
						            fieldLabel  : 'Username',
						            name        : "sip_username",
						            allowBlank  : false,
						            blankText   : i18n('sSupply_a_value'),
						            labelClsExtra: 'lblRd'
						        },
								{
						            xtype       : 'textfield',
						            fieldLabel  : 'Password',
						            name        : "sip_password",
						            allowBlank  : false,
						            blankText   : i18n('sSupply_a_value'),
						            labelClsExtra: 'lblRd'
						        },
								{
						            xtype       : 'cmbDialoutCode'
						        }          
                               
                            ]
                        },
						{ 
                            title       : 'VOIP - Advanced',
                            layout      : 'anchor',
                            disabled    : true,
                            itemId      : 'tabVoipAdvanced',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [
								{
						            xtype       : 'checkbox',      
						            fieldLabel  : 'Asterisk enable',
						            itemId      : 'chkAsterisk',
						            name        : 'asterisk_check',
						            inputValue  : 'asterisk_check',
						            checked     : false,
						            labelClsExtra: 'lblRdReq'
						        },
								{
									xtype		: 'cmbSoftphoneSupport'
								},
        						{
									xtype		: 'cmbCodec',
									fieldLabel  : 'Codec1',
									value		: 'gsm'
								},
								{
									xtype		: 'cmbCodec',
									fieldLabel  : 'Codec2',
									value		: 'ulaw'
								},
								{
									xtype		: 'cmbCodec',
									fieldLabel  : 'Codec3',
									value		: 'alaw'
								},
								{
						            xtype       : 'checkbox',      
						            fieldLabel  : 'SIP Register',
						            itemId      : 'chkSipRegister',
						            name        : 'sip_register_check',
						            inputValue  : 'sip_register_check',
						            checked     : false,
						            labelClsExtra: 'lblRd'
						        },
								{
						            xtype       : 'textfield',
						            fieldLabel  : 'SIP registrar',
						            name        : "sip_registrar",
						            allowBlank  : true,
						            blankText   : i18n('sSupply_a_value'),
						            labelClsExtra: 'lblRd'
						        },
								{
						            xtype       : 'checkbox',      
						            fieldLabel  : 'Enable Asterisk NAT',
						            itemId      : 'chkAsteriskNat',
						            name        : 'asterisk_nat_check',
						            inputValue  : 'asterisk_nat_check',
						            checked     : false,
						            labelClsExtra: 'lblRd'
						        },
								{
						            xtype       : 'textfield',
						            fieldLabel  : 'NAT external IP',
						            name        : "nat_external_ip",
						            allowBlank  : true,
						            blankText   : i18n('sSupply_a_value'),
						            labelClsExtra: 'lblRd'
						        } 
                            ]
                        } 
                    ]
                }                      
            ]
        });

        me.items = frmData;
        me.callParent(arguments);
    }
});
