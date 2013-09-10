Ext.define('Rd.view.voucher.pnlVoucher', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlVoucher',
    border: false,
    v_id: null,
    v_name: null,
    record: null, //We will supply each instance with a reference to the selected record.
    initComponent: function(){
        var me      = this;
        //Set default values for from and to:
        var dtFrom  = new Date();
        var dtTo    = new Date();
        dtTo.setYear(dtTo.getFullYear() + 1);

        me.items = [
        {   
            title:  i18n('sBasic_info'),
            itemId : 'tabBasicInfo',
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
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    margin          : 15,
                    labelWidth      : 150
                },
                items       : [               
                    {
                        xtype       : 'cmbRealm',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq',
                        itemId      : 'realm'
                    },
                    {
                        xtype       : 'cmbProfile',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq',
                        itemId      : 'profile'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : i18n('sActivate_upon_first_login'),
                        name        : 'activate_on_login',
                        inputValue  : 'activate_on_login',
                        itemId      : 'activate_on_login',
                        checked     : false,
                        boxLabelCls : 'lblRdCheck'
                    },
                    {
                        xtype       : 'numberfield',
                        name        : 'days_valid',
                        fieldLabel  : i18n('sDays_available_after_first_login'),
                        value       : 1,
                        maxValue    : 90,
                        minValue    : 1,
                        itemId      : 'days_valid',
                        hidden      : true,
                        disabled    : true
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : i18n('sNever_expire'),
                        name        : 'never_expire',
                        inputValue  : 'never_expire',
                        itemId      : 'never_expire',
                        checked     : true,
                        boxLabelCls : 'lblRdCheck'
                    },
                    {
                        xtype       : 'datefield',
                        fieldLabel  : i18n('sExpire'),
                        name        : 'expire',
                        itemId      : 'expire',
                        minValue    : new Date(),  // limited to the current date or after
                        disabled    : true,
                        value       : dtTo
                    }
                ],
                buttons: [
                    {
                        itemId: 'save',
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        margin: '0 20 40 0'
                    }
                ]
            }  
        },
        { 
            title   : i18n('sPrivate_attributes'),
            layout  : 'fit',
            xtype   : 'gridVoucherPrivate',  
            username: me.v_name
        }, 
        { 
            title   : i18n('sAccounting_data'), 
            layout  : 'fit',
            xtype   : 'gridVoucherRadaccts',
            username: me.v_name
        },
        { 
                title   : 'Usage graphs', 
                layout  : 'fit',
                xtype   : 'tabpanel',
                itemId  : 'pnlUsageGraphs',
                margins : '0 0 0 0',
                plain   : true,
                border  : true,
                tabPosition: 'bottom',
                items   :   [
                    {
                        title   : "Daily",
                        itemId  : "daily",
                        xtype   : 'pnlUsageGraph',
                        span    : 'daily',
                        layout  : 'fit',
                        username: me.v_name,
                        type    : 'voucher'
                    },
                    {
                        title   : "Weekly",
                        itemId  : "weekly",
                        xtype   : 'pnlUsageGraph',
                        span    : 'weekly',
                        layout  : 'fit',
                        username: me.v_name,
                        type    : 'voucher'
                    },
                    {
                        title   : "Monthly",
                        itemId  : "monthly",
                        layout  : 'fit',
                        xtype   : 'pnlUsageGraph',
                        span    : 'monthly',
                        username: me.v_name,
                        type    : 'voucher'
                    }
                ]
            }
        
    ]; 
        me.callParent(arguments);
    }
});
