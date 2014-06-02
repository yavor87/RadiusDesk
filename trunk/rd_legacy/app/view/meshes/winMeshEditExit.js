Ext.define('Rd.view.meshes.winMeshEditExit', {
    extend:     'Ext.window.Window',
    alias :     'widget.winMeshEditExit',
    closable:   true,
    draggable:  true,
    resizable:  true,
    title:      'Edit mesh exit point',
    width:      400,
    height:     500,
    plain:      true,
    border:     false,
    layout:     'fit',
    iconCls:    'edit',
    autoShow:   false,
    meshId:    '',
    exitId:     '',
    store:      undefined,
    defaults: {
            border: false
    },
    requires: [
        'Ext.tab.Panel',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.meshes.cmbEncryptionOptions',
        'Rd.store.sEncryptionOptions',
        'Rd.model.mEncryptionOption'
    ],
     initComponent: function() {
        var me = this;

        //Set the combo
        var cmbConnectWith = Ext.create('Rd.view.meshes.cmbMeshEntryPoints',{
            labelClsExtra   : 'lblRdReq'
        });
 
        cmbConnectWith.getStore().getProxy().setExtraParam('mesh_id',me.meshId);
        cmbConnectWith.getStore().getProxy().setExtraParam('exit_id',me.exitId);
        cmbConnectWith.getStore().load();
 
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
                            'title'     : 'Common settings',
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
                                    itemId  : 'type',
                                    xtype   : 'textfield',
                                    name    : 'type',
                                    hidden  : true
                                }, 
                                {
                                    itemId  : 'id',
                                    xtype   : 'textfield',
                                    name    : 'id',
                                    hidden  : true
                                }, 
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sName'),
                                    name        : 'name',
                                    allowBlank  : false,
                                    blankText   : i18n('sSupply_a_value'),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Auto-detect',
                                    name        : 'auto_detect',
                                    inputValue  : 'auto_detect',
                                    checked     : true,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'numberfield',
                                    name        : 'vlan',
                                    itemId      : 'vlan',
                                    fieldLabel  : 'VLAN number',
                                    value       : 0,
                                    maxValue    : 4095,
                                    step        : 1,
                                    minValue    : 0,
                                    labelClsExtra: 'lblRdReq',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                },
                                cmbConnectWith
                            ]
                        },
                        { 
                            title       : 'Captive Portal settings',
                            layout      : 'anchor',
                            disabled    : true,
                            itemId      : 'tabCaptivePortal',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [         
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'RADIUS server1',
                                    name        : 'radius_1',
                                    allowBlank  : false,
                                    blankText   : i18n('sSupply_a_value'),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'RADIUS server2',
                                    name        : 'radius_2',
                                    allowBlank  : true,
                                    labelClsExtra: 'lblRd'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'RADIUS secret',
                                    name        : 'radius_secret',
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'RADIUS NASID',
                                    name        : 'radius_nasid',
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'UAM URL',
                                    name        : 'uam_url',
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'UAM Secret',
                                    name        : 'uam_secret',
                                    allowBlank  : false,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textareafield',
                                    grow        : true,
                                    fieldLabel  : 'Walled garden',
                                    name        : 'walled_garden',
                                    anchor      : '100%',
                                    allowBlank  : true,
                                    labelClsExtra: 'lblRd'
                                 },
                                 {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Swap octets',
                                    name        : 'swap_octet',
                                    inputValue  : 'swap_octet',
                                    checked     : true,
                                    labelClsExtra: 'lblRdReq'
                                } 
                            ]
                        } 
                    ]
                }
            ]
        });

        //Should we enable or disable the captive portal tab
        var tab_capt= frmData.down('#tabCaptivePortal');
        if(me.type == 'captive_portal'){
            tab_capt.setDisabled(false);
        }else{
            tab_capt.setDisabled(true); 
        }

        me.items = frmData;
        me.callParent(arguments);
    }
});
