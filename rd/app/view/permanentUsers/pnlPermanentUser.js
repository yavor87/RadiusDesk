Ext.define('Rd.view.permanentUsers.pnlPermanentUser', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlPermanentUser',
    border: false,
    ap_id: null,
    initComponent: function(){
        var me      = this;
        //Set default values for from and to:
        var dtFrom  = new Date();
        var dtTo    = new Date();

        me.items = [
        {   
            title:  i18n('sBasic_info'),
            layout: 'hbox',
            items:  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                layout  : 'anchor',
                autoScroll:true,
                frame   : true,
                defaults    : {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                items       : [               
                    {
                        xtype       : 'cmbRealm',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'cmbProfile',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq',
                        itemId      : 'profile'
                    },
                    {
                        xtype       : 'cmbCap',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq',
                        itemId      : 'cap',
                        hidden      : true,
                        value       : 'hard'
                    },
                    {
                        xtype       : 'checkbox',      
                        boxLabel    : i18n('sAlways_active'),
                        name        : 'always_active',
                        inputValue  : 'always_active',
                        itemId      : 'always_active',
                        checked     : true,
                        boxLabelCls : 'lblRdCheck'
                    },
                    {
                        xtype       : 'datefield',
                        fieldLabel  : i18n('sFrom'),
                        name        : 'from_date',
                        itemId      : 'from_date',
                        minValue    : new Date(),  // limited to the current date or after
                        hidden      : true,
                        disabled    : true,
                        value       : dtFrom
                    },
                    {
                        xtype       : 'datefield',
                        fieldLabel  : i18n('sTo'),
                        name        : 'to_date',
                        itemId      : 'to_date',
                        minValue    : new Date(),  // limited to the current date or after
                        hidden      : true,
                        disabled    : true,
                        value       : dtTo
                    }
                ],
                buttons: [
                    {
                        itemId: 'btnPuBasicSave',
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        margin: '0 20 40 0'
                    }
                ]
            }  
        },
        { 
            title   : i18n('sPersonal_info'),
            layout: 'hbox',
            items:  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                autoScroll:true,
                layout  : 'anchor',
                frame   : true,
                defaults    : {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                items       : [               
                    {
                        xtype       : 'textfield',
                        fieldLabel  : i18n('sName'),
                        name        : "name",
                        allowBlank  :true
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : i18n('sSurname'),
                        name        : "surname",
                        allowBlank  :true
                    },
                    { 
                        xtype       : 'cmbLanguages', 
                        width       : 350, 
                        fieldLabel  : i18n('sLanguage'),  
                        name        : 'language',
                        value       : me.selLanguage,
                        allowBlank  : false,
                        labelClsExtra: 'lblRd' 
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : i18n('sPhone'),
                        name        : "phone",
                        allowBlank  :true
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : i18n('s_email'),
                        name        : "email",
                        allowBlank  :true
                    },
                    {
                        xtype       : 'textareafield',
                        grow        : true,
                        name        : 'address',
                        fieldLabel  : i18n('sAddress'),
                        anchor      : '100%'
                    }
                ],
                buttons: [
                    {
                        itemId: 'btnPuPersonalSave',
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        margin: '0 20 40 0'
                    }
                ]
            }
        },
        { 
            title   :   i18n('sAuthentication_data'),
        },
        { 
            title   :   i18n('sAccounting_data'),
        }
    ]; 


        me.callParent(arguments);
    }
});
