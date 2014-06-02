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
                        fieldLabel  : 'Password',
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
                        maxValue    : 99,
                        name        : 'power',
                        fieldLabel  : 'TX Power (%)'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Apply power to all nodes',
                        name        : 'all_power',
                        inputValue  : 'all_power',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'numberfield',
                        anchor      : '100%',
                        name        : 'two_chan',
                        fieldLabel  : '2.4G Channel',
                        value       : 5,
                        maxValue    : 14,
                        minValue    : 1
                    },
                    {
                        xtype       : 'numberfield',
                        anchor      : '100%',
                        name        : 'five_chan',
                        fieldLabel  : '5G Channel',
                        value       : 44,
                        maxValue    : 116,
                        minValue    : 36,
                        step        : 8
                    },
                    {
                        xtype       : 'numberfield',
                        name        : 'heartbeat_interval',
                        itemId      : 'heartbeat_interval',
                        fieldLabel  : 'Heartbeat interval',
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
                    }
                ],
                buttons: [
                    {
                        itemId: 'save',
                        formBind: true,
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        margin: Rd.config.buttonMargin
                    }
                ]
            };
        me.callParent(arguments);
    }
});
