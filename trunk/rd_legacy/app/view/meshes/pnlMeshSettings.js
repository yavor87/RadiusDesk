Ext.define('Rd.view.meshes.pnlMeshSettings', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlMeshSettings',
    border  : false,
    layout  : 'hbox',
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
    initComponent: function(){
        var me = this;

        me.items =  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                layout  : 'anchor',
                autoScroll:true,
                frame   : true,
                fieldDefaults: {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    margin          : Rd.config.fieldMargin,
                    labelWidth      : Rd.config.labelWidth,
                    maxWidth        : Rd.config.maxWidth  
                },
                items       : [
                    
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'AP isolation',
                        name        : 'ap',
                        inputValue  : 'ap',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Bridge Loop Avoidance',
                        name        : 'bl',
                        inputValue  : 'bl',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Aggregation',
                        name        : 'ag',
                        inputValue  : 'ag',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Bonding',
                        name        : 'b',
                        inputValue  : 'b',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Fragmentation',
                        name        : 'f',
                        inputValue  : 'f',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'numberfield',
                        name        : 'it',
                        fieldLabel  : 'OGM interval (ms)',
                        value       : 1000,
                        maxValue    : 20000,
                        step        : 100,
                        minValue    : 1,
                        labelClsExtra: 'lblRdReq',
                        allowBlank  : false,
                        blankText   : i18n("sSupply_a_value"),
                    },
                    {
                        xtype       : 'numberfield',
                        name        : 'gatweway_switching',
                        fieldLabel  : 'Gateway switching',
                        value       : 20,
                        maxValue    : 255,
                        step        : 1,
                        minValue    : 1,
                        labelClsExtra: 'lblRdReq',
                        allowBlank  : false,
                        blankText   : i18n("sSupply_a_value"),
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
