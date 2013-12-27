Ext.define('Rd.view.meshes.winMeshAddEntry', {
    extend:     'Ext.window.Window',
    alias :     'widget.winMeshAddEntry',
    closable:   true,
    draggable:  true,
    resizable:  true,
    title:      'New mesh entry point',
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
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
        'Rd.view.meshes.cmbEncryptionOptions'
    ],
     initComponent: function() {
        var me = this;  
        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'fit',
            itemId:     'scrnData',
            autoScroll: true,
            fieldDefaults: {
                msgTarget   : 'under',
                labelClsExtra: 'lblRd',
                labelAlign  : 'left',
                labelSeparator: '',
                labelClsExtra: 'lblRd',
                labelWidth  : Rd.config.labelWidth,
                maxWidth    : Rd.config.maxWidth, 
                margin      : Rd.config.fieldMargin
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
            items:[
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
                            'title'     : 'Basic info',
                            'layout'    : 'anchor',
                            itemId      : 'tabRequired',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [
                                {
                                    itemId  : 'mesh_id',
                                    xtype   : 'textfield',
                                    name    : "mesh_id",
                                    hidden  : true,
                                    value   : me.meshId
                                }, 
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'SSID',
                                    name        : 'name',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Hidden',
                                    name        : 'hidden',
                                    inputValue  : 'hidden',
                                    checked     : false,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Client isolation',
                                    name        : 'isolate',
                                    inputValue  : 'isolate',
                                    checked     : false,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Apply to all nodes',
                                    name        : 'apply_to_all',
                                    inputValue  : 'apply_to_all',
                                    checked     : false,
                                    labelClsExtra: 'lblRdReq'
                                }
                            ]
                        },
                        { 
                            'title'     : 'Encryption',
                            'layout'    : 'anchor',
                            itemId      : 'tabContact',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [          
                                { 
                                    xtype           : 'cmbEncryptionOptions', 
                                    labelClsExtra   : 'lblRdReq',
                                    allowBlank      : false 
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'Key',
                                    name        : 'key',
                                    itemId      : 'key',
                                    allowBlank  : false,  
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    hidden      : true,
                                    disabled    : true
                                }, 
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'RADIUS server',
                                    name        : 'auth_server',
                                    itemId      : 'auth_server',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    hidden      : true,
                                    disabled    : true
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'Shared secret',
                                    name        : 'auth_secret',
                                    itemId      : 'auth_secret',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    hidden      : true,
                                    disabled    : true
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
