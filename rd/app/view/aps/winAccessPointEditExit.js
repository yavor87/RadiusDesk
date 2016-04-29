Ext.define('Rd.view.aps.winAccessPointEditExit', {
    extend:     'Ext.window.Window',
    alias :     'widget.winAccessPointEditExit',
    closable:   true,
    draggable:  true,
    resizable:  true,
    title:      'Access Point Exit',
    width:      530,
    height:     400,
    plain:      true,
    border:     false,
    layout:     'fit',
    iconCls:    'edit',
    glyph:      Rd.config.icnEdit,
    autoShow:   false,
    apProfileId:    '',
    exitId:     '',
    store:      undefined,
    defaults: {
            border: false
    },
    requires: [
        'Ext.tab.Panel',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.components.cmbDynamicDetail'
    ],
     initComponent: function() {
        var me = this;

        //Set the combo
        var cmbConnectWith = Ext.create('Rd.view.aps.cmbAccessPointEntryPoints',{
            labelClsExtra   : 'lblRdlReq'
        });

		var hide_cp = true;
		if(me.type == 'captive_portal'){
			hide_cp = false;
		}
 
        cmbConnectWith.getStore().getProxy().setExtraParam('ap_profile_id',me.apProfileId);
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
                labelWidth      : Rd.config.labelWidth,
                //maxWidth        : Rd.config.maxWidth, 
                margin          : Rd.config.fieldMargin
            },
            defaultType: 'textfield',
            buttons : [
                {
                    itemId  : 'save',
                    text    : i18n("sOK"),
                    scale   : 'large',
                    formBind: true,
                    glyph   : Rd.config.icnYes,
                    margin  : Rd.config.buttonMargin
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
                            'title'     : i18n("sCommon_settings"),
                            'layout'    : 'anchor',
                            itemId      : 'tabRequired',
                            defaults    : {
                                anchor: '100%'
                            },
                            autoScroll:true,
                            items       : [
                                {
                                    itemId  : 'ap_profile_id',
                                    xtype   : 'textfield',
                                    name    : "ap_profile_id",
                                    hidden  : true,
                                    value   : me.apProfileId
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
                                    xtype       : 'numberfield',
                                    name        : 'vlan',
                                    itemId      : 'vlan',
                                    fieldLabel  : i18n("sVLAN_number"),
                                    value       : 0,
                                    maxValue    : 4095,
                                    step        : 1,
                                    minValue    : 0,
                                    labelClsExtra: 'lblRdReq',
                                    allowBlank  : false,
                                    blankText   : i18n("sSupply_a_value")
                                },
                                cmbConnectWith,
                                {
                                    itemId      : 'chkNasClient',
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Auto-add NAS',
                                    name        : 'auto_nas',
                                    inputValue  : 'auto_nas',
                                    checked     : true,
                                    labelClsExtra: 'lblRd'
                                },
                                {
                                    itemId      : 'chkLoginPage',
                                    xtype       : 'checkbox',      
                                    fieldLabel  : 'Auto-add Login Page',
                                    name        : 'auto_login_page',
                                    inputValue  : 'auto_login_page',
                                    checked     : true,
                                    labelClsExtra: 'lblRd'
                                },
                                {
                                    itemId      : 'cmbDynamicDetail',
                                    xtype       : 'cmbDynamicDetail'
                                }
                            ]
                        },
                        //---- Captive Protal ----
                        { 
                            title       : i18n("sCaptive_Portal_settings"),
                            layout      : 'fit',
                            disabled    : true,
                            itemId      : 'tabCaptivePortal',
                            hidden		: hide_cp,
                            items       : [ 
                                {
                                    xtype   : 'tabpanel',
                                    layout  : 'fit',
                                    xtype   : 'tabpanel',
                                    margins : '0 0 0 0',
                                    plain   : true,
                                    tabPosition: 'top',
                                    border  : false,
                                    items   :  [
                                        {
                                            title       : i18n("sBasic"),
                                            layout      : 'anchor',
                                            defaults    : {
                                                anchor: '100%'
                                            },
                                            autoScroll:true,
                                            items       :[
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sRADIUS_server1"),
                                                    name        : 'radius_1',
                                                    allowBlank  : false,
                                                    blankText   : i18n("sSupply_a_value"),
                                                    labelClsExtra: 'lblRdReq'
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sRADIUS_server2"),
                                                    name        : 'radius_2',
                                                    allowBlank  : true,
                                                    labelClsExtra: 'lblRd'
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sRADIUS_secret"),
                                                    name        : 'radius_secret',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRdReq'
                                                },
                                                 {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sRADIUS_NASID"),
                                                    name        : 'radius_nasid',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRdReq'
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sUAM_URL"),
                                                    name        : 'uam_url',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRdReq',
                                                    value       : 'http://your_ip_here/cake2/rd_cake/dynamic_details/chilli_browser_detect/',
                                                    emptyText   : 'http://your_ip_here/cake2/rd_cake/dynamic_details/chilli_browser_detect/',
                                                    blankText   : 'Try http://your_ip_here/cake2/rd_cake/dynamic_details/chilli_browser_detect/'
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sUAM_Secret"),
                                                    name        : 'uam_secret',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRdReq'
                                                },
                                                {
                                                    xtype       : 'textareafield',
                                                    grow        : true,
                                                    fieldLabel  : i18n("sWalled_garden"),
                                                    name        : 'walled_garden',
                                                    anchor      : '100%',
                                                    allowBlank  : true,
                                                    labelClsExtra: 'lblRd'
                                                 },
                                                 {
                                                    xtype       : 'checkbox',      
                                                    fieldLabel  : i18n("sSwap_octets"),
                                                    name        : 'swap_octet',
                                                    inputValue  : 'swap_octet',
                                                    checked     : true,
                                                    labelClsExtra: 'lblRdReq'
                                                },
                                                {
                                                    xtype       : 'checkbox',      
                                                    fieldLabel  : i18n("sMAC_authentication"),
                                                    name        : 'mac_auth',
                                                    inputValue  : 'mac_auth',
                                                    checked     : true,
                                                    labelClsExtra: 'lblRdReq'
                                                }
                                            ]
                                        },
                                        {
                                            title       : i18n("sProxy"),
                                            itemId      : 'tabProxy',
                                            layout      : 'anchor',
                                            defaults    : {
                                                    anchor: '100%'
                                            },
                                            autoScroll:true,
                                            items       :[
                                                {
                                                    itemId      : 'chkProxyEnable',
                                                    xtype       : 'checkbox',      
                                                    fieldLabel  : i18n("sEnable"),
                                                    name        : 'proxy_enable',
                                                    inputValue  : 'proxy_enable',
                                                    checked     : false,
                                                    labelClsExtra: 'lblRdReq'
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sUpstream_proxy"),
                                                    name        : 'proxy_ip',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRdReq',
                                                    disabled    : true
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sUpstream_port"),
                                                    name        : 'proxy_port',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRdReq',
                                                    disabled    : true
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sAuth_name"),
                                                    name        : 'proxy_auth_username',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRd',
                                                    disabled    : true
                                                },
                                                {
                                                    xtype       : 'textfield',
                                                    fieldLabel  : i18n("sAuth_password"),
                                                    name        : 'proxy_auth_password',
                                                    allowBlank  : false,
                                                    labelClsExtra: 'lblRd',
                                                    disabled    : true
                                                }
                                            ]
                                        }, 
                                        {
                                            title       : i18n("sCoova_specific"),
                                            layout      : 'anchor',
                                            defaults    : {
                                                    anchor: '100%'
                                            },
                                            autoScroll:true,
                                            items       :[
                                                {
                                                    xtype       : 'textareafield',
                                                    grow        : true,
                                                    fieldLabel  : i18n("sOptional_config_items"),
                                                    name        : 'coova_optional',
                                                    anchor      : '100%',
                                                    allowBlank  : true,
                                                    labelClsExtra: 'lblRd'
                                                 }
                                            ]
                                        }
                                    ]
                                } 
                            ]
                        }
                        //--- End Captive Portal --- 
                    ]
                }
            ]
        });

        //Should we enable or disable the captive portal tab
        var tab_capt= frmData.down('#tabCaptivePortal');
        
        var a_nas   = frmData.down('#chkNasClient');
        var a_page  = frmData.down('#chkLoginPage');
        var cmb_page= frmData.down('cmbDynamicDetail');
        
        if(me.type == 'captive_portal'){
            tab_capt.setDisabled(false);
            a_nas.setVisible(true);
            a_nas.setDisabled(false);
            a_page.setVisible(true);
            a_page.setDisabled(false);
            cmb_page.setVisible(true);
            cmb_page.setDisabled(false);
              
        }else{
            tab_capt.setDisabled(true); 
            a_nas.setVisible(false);
            a_nas.setDisabled(true);
            a_page.setVisible(false);
            a_page.setDisabled(true);
            cmb_page.setVisible(false);
            cmb_page.setDisabled(true);
        }

        me.items = frmData;
        me.callParent(arguments);
    }
});
