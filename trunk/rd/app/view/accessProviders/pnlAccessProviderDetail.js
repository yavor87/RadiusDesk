Ext.define('Rd.view.accessProviders.pnlAccessProviderDetail', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlAccessProviderDetail',
    border  : false,
    ap_id  : null,
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
                frame   : false,
                border  : false,
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
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        plain   : false,
                        tabPosition: 'bottom',
                        border  : false,
                        items   : [
                            { 
                                'title'     : i18n('sRequired_info'),
                                'layout'    : 'anchor',
                                defaults    : {
                                    anchor  : '100%'
                                },
                                autoScroll:true,
                                items: [
                                    {
                                        itemId  : 'parent_id',
                                        xtype   : 'textfield',
                                        name    : "parent_id",
                                        value   : me.user_id,
                                        hidden  : true
                                    },   
                                    {
                                        itemId      : 'owner',
                                        xtype       : 'displayfield',
                                        fieldLabel  : i18n('sOwner'),
                                        value       : me.owner,
                                        name        : 'owner',
                                        labelClsExtra: 'lblRdReq'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name : "id",
                                        hidden: true
                                    },
                                    {
                                        xtype       : 'textfield',
                                        fieldLabel  : i18n('sUsername'),
                                        name        : "username",
                                        allowBlank  :false,
                                        blankText   : i18n("sEnter_a_value"),
                                        labelClsExtra: 'lblRdReq'
                                    },
                                    { 
                                        xtype       : 'cmbLanguages', 
                                        width       : 350, 
                                        fieldLabel  : i18n('sLanguage'),  
                                        name        : 'language', 
                                        allowBlank  : false,
                                        labelClsExtra: 'lblRdReq' 
                                    },
                                    {
                                        xtype       : 'checkbox',      
                                        fieldLabel  : i18n('sActivate'),
                                        name        : 'active',
                                        inputValue  : 'active',
                                        checked     : true,
                                        cls         : 'lblRd'
                                    }
                                ]
                            },
                            { 
                                'title'     : i18n('sOptional_info'),
                                'layout'    : 'anchor',
                                defaults    : {
                                    anchor  : '100%'
                                },
                                autoScroll:true,
                                items: [
                                    {
                                        xtype       : 'textfield',
                                        fieldLabel  : i18n('sName'),
                                        name        : "name"
                                    },
                                    {
                                        xtype       : 'textfield',
                                        fieldLabel  : i18n('sSurname'),
                                        name        : "surname"
                                    },
                                    {
                                        xtype       : 'textfield',
                                        fieldLabel  : i18n('sPhone'),
                                        name        : "phone",
                                        vtype       : 'Numeric'
                                    },
                                    {
                                        xtype       : 'textfield',
                                        fieldLabel  : i18n('s_email'),
                                        name        : "email",
                                        vtype       : 'email'
                                    },
                                    {
                                        xtype     : 'textareafield',
                                        grow      : true,
                                        name      : 'address',
                                        fieldLabel: i18n('sAddress'),
                                        anchor    : '100%'
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
