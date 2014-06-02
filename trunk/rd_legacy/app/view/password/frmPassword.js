Ext.define('Rd.view.password.frmPassword', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.frmPassword',
    autoScroll  : true,
    autoCreate  : true,
    frame       : true,
    fieldDefaults: {
        msgTarget       : 'under',
        labelClsExtra   : 'lblRd',
        labelAlign      : 'left',
        labelSeparator  : '',
        margin          : Rd.config.fieldMargin,
        labelWidth      : Rd.config.labelWidth,
        maxWidth        : Rd.config.maxWidth  
    },
    requires: [
        'Rd.view.components.cmbPermanentUser'
    ],
    buttons: [
        {
            itemId  : 'save',
            formBind: true,
            text    : i18n('sOK'),
            scale   : 'large',
            iconCls : 'b-btn_ok',
            margin  : Rd.config.buttonMargin
        }
    ],
    initComponent: function(){
        var me      = this;

        //Set default values for from and to:
        var dtFrom  = new Date();
        var dtTo    = new Date();
        dtTo.setDate(dtTo.getDate() + 7); //Expire by defaul 7 days later
 
        me.items    = [
            
            {
                xtype       : 'cmbPermanentUser',
                fieldLabel  : i18n('sUsername')
            },
            {
                xtype       : 'displayfield',
                value       : '(select user first)',
                fieldLabel  : 'Current password',
                fieldCls    : 'green_round',
                itemId          : 'currentPwd'
            },
            {
                xtype       : 'textfield',
                name        : 'password',
                fieldLabel  : 'New password',
                allowBlank  : false,
                minLength   : 4
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
                xtype: 'datefield',
                fieldLabel: i18n('sFrom'),
                name: 'from_date',
                itemId      : 'from_date',
                minValue: new Date(),  // limited to the current date or after
                hidden      : true,
                disabled    : true,
                value       : dtFrom
            },
            {
                xtype: 'datefield',
                fieldLabel: i18n('sTo'),
                name: 'to_date',
                itemId      : 'to_date',
                minValue: new Date(),  // limited to the current date or after
                hidden      : true,
                disabled    : true,
                value       : dtTo
            }
        ];   
        me.callParent(arguments);
    }
});

