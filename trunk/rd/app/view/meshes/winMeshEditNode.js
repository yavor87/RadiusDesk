Ext.define('Rd.view.meshes.winMeshEditNode', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winMeshEditNode',
    closable    : true,
    draggable   : true,
    resizable   : true,
    title       : 'Edit mesh node',
    width       : 400,
    height      : 400,
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
        'Rd.view.meshes.cmbHardwareOptions'
    ],
     initComponent: function() {
        var me 		= this; 
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
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
        });

        me.items = frmData;
        me.callParent(arguments);
    }
});
