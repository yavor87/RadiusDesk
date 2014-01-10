Ext.define('Rd.view.autoSetups.pnlAutoSetupSettings', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlAutoSetupSettings',
    border  : false,
    am_id  : null,
    layout: 'hbox',
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
   
    initComponent: function(){
        var me = this;
        me.items =  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  450,
                layout  : 'fit',
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
                                'title'     : 'Network info',
                                'layout'    : 'anchor',
                                itemId      : 'tabNetwork',
                                autoScroll  : true,
                                defaults    : {
                                    anchor: '100%'
                                },
                                items       : [
                                    {
                                        xtype: 'textfield',
                                        name : "id",
                                        hidden: true,
                                        value : me.am_id
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
                                    },
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
                                        xtype       : 'checkbox',      
                                        fieldLabel  : 'Enable eduroam',
                                        name        : 'eduroam',
                                        inputValue  : 'active',
                                        checked     : false,
                                        labelClsExtra: 'lblRdReq'
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
                ],
                buttons: [
                    {
                        itemId: 'save',
                        formBind: true,
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        glyph: Rd.config.icnYes,
                        margin: Rd.config.buttonMargin
                    }
                ]
            };
        me.callParent(arguments);
    }
});
