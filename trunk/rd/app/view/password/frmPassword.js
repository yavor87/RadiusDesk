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
        me.items    = [
            {
                xtype       : 'cmbPermanentUser',
                fieldLabel  : i18n('sUsername')
            },
            {
                xtype       : 'displayfield',
                value       : '(select user first)',
                fieldLabel  : 'Current Password',
                fieldCls    : 'green_round'
            },
            {
                xtype       : 'textfield',
                name        : 'password',
                fieldLabel  : 'New Password',
                allowBlank  : false,
                minLength   : 4
            }
        ];   
        me.callParent(arguments);
    }
});

