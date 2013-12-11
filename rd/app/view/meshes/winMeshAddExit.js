Ext.define('Rd.view.meshes.winMeshAddExit', {
    extend:     'Ext.window.Window',
    alias :     'widget.winMeshAddExit',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'New mesh exit point',
    width:      400,
    height:     500,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    autoShow:   false,
    store:      undefined,
    defaults: {
            border: false
    },
    startScreen: 'scrnType', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
        'Rd.view.meshes.cmbMeshEntryPoints'
    ],
    initComponent: function() {
        var me              = this;
        var scrnType  = me.mkScrnType();
        var scrnData  = me.mkScrnData();
        me.items = [
            scrnType,
            scrnData
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnType: function(){

        var me      = this;
        var buttons = [
             
                {
                    itemId: 'btnTypeNext',
                    text: i18n('sNext'),
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: Rd.config.buttonMargin
                }
            ];

        //See if the Ethernet bridge is already taken; if so we will not list it again
        var found_bridge = false;
        me.store.each(function(item, index, count){
            var type = item.get('type');
            if(type == 'bridge'){
                found_bridge = true;
                return false;
            }
        });

        //If the bridge is already defined; we will not list it again
        if(found_bridge == true){
            var radios = [
                        { boxLabel: 'Tagged Ethernet bridge',   name: 'exit_type', inputValue: 'tagged_bridge',checked: true},
                        { boxLabel: 'NAT + DHCP',               name: 'exit_type', inputValue: 'nat' },
                        { boxLabel: 'Captive Portal',           name: 'exit_type', inputValue: 'captive_portal' }
                    ];
        }else{
            var radios = [
                    { boxLabel: 'Ethernet bridge',          name: 'exit_type', inputValue: 'bridge',checked: true },
                    { boxLabel: 'Tagged Ethernet bridge',   name: 'exit_type', inputValue: 'tagged_bridge'},
                    { boxLabel: 'NAT + DHCP',               name: 'exit_type', inputValue: 'nat' },
                    { boxLabel: 'Captive Portal',           name: 'exit_type', inputValue: 'captive_portal' }
                ];
        }

        var frmType = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnType',
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'top',
                labelSeparator  : '',
                labelWidth      : Rd.config.labelWidth,
                maxWidth        : Rd.config.maxWidth, 
                margin          : Rd.config.fieldMargin
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: 'Specify exit point type', cls: 'lblWizard' }
            ],
            items:[{
                xtype       : 'radiogroup',
                fieldLabel  : 'Exit point type',
                columns     : 1,
                vertical    : true,
                items       : radios
            }],
            buttons: buttons
        });
        return frmType;
    },

    //_______ Data for mesh  _______
    mkScrnData: function(){

        var me      = this;

        //Set the combo
        var cmbConnectWith = Ext.create('Rd.view.meshes.cmbMeshEntryPoints',{
            labelClsExtra   : 'lblRdReq'
        });
 
        cmbConnectWith.getStore().getProxy().setExtraParam('mesh_id',me.meshId);
        cmbConnectWith.getStore().load();

        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'fit',
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
            defaultType         : 'textfield',
            buttons : [
                 {
                    itemId      : 'btnDataPrev',
                    text        : i18n('sPrev'),
                    scale       : 'large',
                    iconCls     : 'b-prev',
                    margin      : Rd.config.buttonMargin
                },
                {
                    itemId      : 'save',
                    text        : i18n('sOK'),
                    scale       : 'large',
                    iconCls     : 'b-btn_ok',
                    formBind    : true,
                    margin      : Rd.config.buttonMargin
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
        return frmData;
    }   


});
