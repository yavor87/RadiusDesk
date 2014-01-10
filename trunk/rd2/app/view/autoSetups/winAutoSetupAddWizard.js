Ext.define('Rd.view.autoSetups.winAutoSetupAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winAutoSetupAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      "New Access Point auto setup",
    width:      450,
    height:     400,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    glyph: Rd.config.icnAdd,
    autoShow:   false,
    defaults: {
            border: false
    },
    no_tree: false, //If the user has no children we don't bother giving them a branchless tree
    user_id: '',
    owner: '',
    startScreen: 'scrnApTree', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnData      = me.mkScrnData();
        me.items = [
              scrnApTree,
              scrnData
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){
       var pnlTree = Ext.create('Rd.view.components.pnlAccessProvidersTree',{
            itemId: 'scrnApTree'
       });
       return pnlTree;
    },

    //_______ Data for Access Provider  _______
    mkScrnData: function(){
        var me      = this;
    
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
                    itemId: 'btnDataPrev',
                    text: i18n('sPrev'),
                    scale: 'large',
                    iconCls: 'b-prev',
                    glyph: Rd.config.icnBack,
                    margin: Rd.config.buttonMargin
                },
                {
                    itemId: 'save',
                    text: i18n('sOK'),
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    glyph: Rd.config.icnYes,
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
                            'title'     : i18n('sRequired_info'),
                            'layout'    : 'anchor',
                            itemId      : 'tabRequired',
                            defaults    : {
                                anchor: '100%'
                            },
                           items       : [
                                {
                                    itemId  : 'parent_id',
                                    xtype   : 'textfield',
                                    itemId  : 'user_id',
                                    name    : 'user_id',
                                    value   : me.user_id,
                                    hidden  : true
                                },   
                                {
                                    itemId      : 'owner',
                                    xtype       : 'displayfield',
                                    fieldLabel  : i18n('sOwner'),
                                    value       : me.owner,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sMAC_address'),
                                    name        : "name",
                                    allowBlank  : false,
                                    blankText   : i18n('sSupply_a_value'),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'MacAddress',
                                    fieldStyle  : 'text-transform:uppercase'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'DNS name',
                                    name        : "dns_name",
                                    allowBlank  : false,
                                    blankText   : i18n('sSupply_a_value'),
                                    labelClsExtra: 'lblRdReq'
                                }
                            ]
                        },
                        { 
                            'title'     : 'Network info',
                            'layout'    : 'anchor',
                            itemId      : 'tabNetwork',
                            autoScroll  : true,
                            defaults    : {
                                anchor: '100%'
                            },
                            items       : [
                                {
                                    itemId      : 'ip_address',
                                    xtype       : 'textfield',
                                    fieldLabel  : i18n('sIP_Address'),
                                    name        : 'ip_address',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
                                },
                                {
                                    itemId      : 'ip_mask',
                                    xtype       : 'textfield',
                                    fieldLabel  : 'Subnet mask',
                                    name        : 'ip_mask',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
                                },
                                {
                                    itemId      : 'ip_gateway',
                                    xtype       : 'textfield',
                                    fieldLabel  : 'Gateway',
                                    name        : 'ip_gateway',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
                                },
                                {
                                    itemId      : 'ip_dns_1',
                                    xtype       : 'textfield',
                                    fieldLabel  : 'DNS Server 1',
                                    name        : 'ip_dns_1',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
                                },
                                {
                                    itemId      : 'ip_dns_2',
                                    xtype       : 'textfield',
                                    fieldLabel  : 'DNS Server 2',
                                    name        : 'ip_dns_2',
                                    allowBlank  : true,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRd',
                                    vtype       : 'IPAddress'
                                }
                            ]
                        },
                        { 
                            'title'     : 'WiFi info',
                            'layout'    : 'anchor',
                            itemId      : 'tabWifi',
                            autoScroll  : true,
                            defaults    : {
                                anchor: '100%'
                            },
                            items       : [
                                {
                                    xtype           : 'displayfield',
                                    fieldLabel      : 'Radio Settings',
                                    labelClsExtra   : 'lblRdGrouping'
                                },
                                {
                                    xtype       : 'checkbox',      
                                    fieldLabel  : i18n('sActivate'),
                                    name        : 'wifi_active',
                                    inputValue  : 'active',
                                    checked     : true,
                                    labelClsExtra: 'lblRdReq'
                                }, 
                                {
                                    xtype: 'numberfield',
                                    anchor: '100%',
                                    name: 'channel',
                                    fieldLabel: 'Channel',
                                    allowBlank  : false,
                                    value: 6,
                                    maxValue: 14,
                                    minValue: 1,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'power',
                                    fieldLabel: 'Tx Power dBm',
                                    allowBlank  : false,
                                    value: 10,
                                    maxValue: 22,
                                    minValue: 1,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'distance',
                                    fieldLabel: 'Connect distance',
                                    allowBlank  : false,
                                    value: 30,
                                    maxValue: 200,
                                    minValue: 1,
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype           : 'displayfield',
                                    fieldLabel      : 'Secure SSID',
                                    labelClsExtra   : 'lblRdGrouping'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'SSID',
                                    name        : 'ssid_secure',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'RADIUS server',
                                    name        : 'radius',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'Shared secret',
                                    name        : 'secret',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype           : 'displayfield',
                                    fieldLabel      : 'Open SSID',
                                    labelClsExtra   : 'lblRdGrouping'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'SSID',
                                    name        : 'ssid_open',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq'
                                },
                                {
                                    xtype           : 'displayfield',
                                    fieldLabel      : 'Eduroam SSID',
                                    labelClsExtra   : 'lblRdGrouping'
                                },
                                {
                                    xtype           : 'checkbox',      
                                    fieldLabel      : 'Enable eduroam',
                                    name            : 'eduroam',
                                    inputValue      : 'active',
                                    checked         : false,
                                    labelClsExtra   : 'lblRdReq'
                                }
                            ]
                        },
                        { 
                            'title'     : 'OpenVPN info',
                            'layout'    : 'anchor',
                            itemId      : 'tabOpenVpn',
                            defaults    : {
                                anchor: '100%'
                            },
                            items       : [
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'VPN Server',
                                    name        : "vpn_server",
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
                                },
                                {
                                    xtype       : 'textfield',
                                    fieldLabel  : 'Tunnel IP',
                                    name        : "tunnel_ip",
                                    disabled    : true,
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value"),
                                    labelClsExtra: 'lblRdReq',
                                    vtype       : 'IPAddress'
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
