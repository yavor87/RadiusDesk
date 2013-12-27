Ext.define('Rd.view.meshes.winMeshAddNode', {
    extend:     'Ext.window.Window',
    alias :     'widget.winMeshAddNode',
    closable:   true,
    draggable:  true,
    resizable:  true,
    title:      'New mesh node',
    width:      400,
    height:     400,
    plain:      true,
    border:     false,
    layout:     'fit',
    iconCls:    'add',
    autoShow:   false,
    mesh_id:    '',
    defaults: {
            border: false
    },
    requires: [
        'Ext.tab.Panel',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.meshes.cmbHardwareOptions',
        'Rd.store.sHardwareOptions',
        'Rd.model.mHardwareOption'
    ],
     initComponent: function() {
        var me = this;  
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
                    formBind: true,
                    margin: Rd.config.buttonMargin
                }
            ],
            items: [
                    {
                        itemId  : 'mesh_id',
                        xtype   : 'textfield',
                        name    : "mesh_id",
                        hidden  : true,
                        value   : me.meshId
                    }, 
                    {
                        xtype       : 'textfield',
                        fieldLabel  : i18n('sMAC_address'),
                        name        : "name",
                        allowBlank  : false,
                        blankText   : i18n('sSupply_a_value'),
                        labelClsExtra: 'lblRdReq',
                        vtype       : 'MacAddress',
                        fieldStyle  : 'text-transform:lowercase'
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
                        fieldLabel  : 'TX Power (%)'
                    },
                    {
                        xtype       : 'cmbStaticEntries'
                    },
                    {
                        xtype       : 'cmbStaticExits'
                    }
            ]
        });

        me.items = frmData;
        me.callParent(arguments);
    }
});
