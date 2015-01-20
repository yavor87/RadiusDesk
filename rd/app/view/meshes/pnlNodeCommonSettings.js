Ext.define('Rd.view.meshes.pnlNodeCommonSettings', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlNodeCommonSettings',
    border  : false,
    layout  : 'hbox',
    align   : 'stretch',
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
    initComponent: function(){
        var me = this;
        me.items =  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                layout:     'anchor',
                defaults: {
                    anchor: '100%'
                },
                autoScroll:true,
                frame   : true,
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
                items       : [
                    {
                        xtype       : 'textfield',
                        fieldLabel  : i18n('sPassword'),
                        name        : 'password',
                        allowBlank  : false,
                        blankText   : i18n("sSupply_a_value"),
                        labelClsExtra: 'lblRdReq'
                    },         
                    {
                        xtype       : 'sliderfield',
                        value       : 50,
                        increment   : 10,
                        minValue    : 1,
                        maxValue    : 100,
                        name        : 'power',
                        fieldLabel  : i18n('sTX_Power_br_percent_br')
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : i18n('sApply_power_to_all_nodes'),
                        name        : 'all_power',
                        inputValue  : 'all_power',
						itemId		: 'all_power',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'numberfield',
                        anchor      : '100%',
                        name        : 'two_chan',
                        fieldLabel  : i18n('s2_pt_4G_Channel'),
                        value       : 5,
                        maxValue    : 14,
                        minValue    : 1
                    },
                    {
                        xtype       : 'cmbFiveGigChannels',
                        anchor      : '100%'
                    },
                    {
                        xtype       : 'numberfield',
                        name        : 'heartbeat_interval',
                        itemId      : 'heartbeat_interval',
                        fieldLabel  : i18n('sHeartbeat_interval'),
                        value       : 60,
                        maxValue    : 21600,
                        minValue    : 60
                    },    
                    {
                        xtype       : 'numberfield',
                        name        : 'heartbeat_dead_after',
                        itemId      : 'heartbeat_dead_after',
                        fieldLabel  : i18n('sHeartbeat_is_dead_after'),
                        value       : 600,
                        maxValue    : 21600,
                        minValue    : 300
                    },
					{
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Bridge Ethernet port',
                        name        : 'eth_br_chk',
                        inputValue  : 'eth_br_chk',
						itemId		: 'eth_br_chk',
                        checked     : true,
                        labelClsExtra: 'lblRd'
                    },
					{
						xtype		: 'cmbEthBridgeOptions',
						meshId		: me.meshId,
						disabled	: true
					},
					{
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Apply bridge to all nodes',
                        name        : 'eth_br_for_all',
                        inputValue  : 'eth_br_for_all',
						itemId		: 'eth_br_for_all',
                        checked     : true,
                        labelClsExtra: 'lblRd',
						disabled	: true
                    }
                ],
                buttons: [
                    {
                        itemId: 'save',
                        formBind: true,
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        glyph   : Rd.config.icnYes,
                        margin: Rd.config.buttonMargin
                    }
                ]
            };
        me.callParent(arguments);
    }
});
