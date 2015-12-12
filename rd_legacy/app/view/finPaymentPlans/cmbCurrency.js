Ext.define('Rd.view.finPaymentPlans.cmbCurrency', {
    extend          : 'Ext.form.ComboBox',
    alias           : 'widget.cmbCurrency',
    fieldLabel      : 'Currency',
    labelSeparator  : '',
    queryMode       : 'local',
    valueField      : 'id',
    displayField    : 'name',
    allowBlank      : false,
    editable        : false,
    mode            : 'local',
    itemId          : 'currency_code',
    name            : 'currency_code',
    value           : 'ZAR',
    labelClsExtra   : 'lblRd',
    initComponent: function(){
        var me      = this;
        var s       = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                    type    : 'ajax',
                    format  : 'json',
                    batchActions: true, 
                    url     : '/cake2/rd_cake/fin_payment_plans/currency_codes.json',
                    reader: {
                        type: 'json',
                        root: 'items',
                        messageProperty: 'message'
                    }
            },
            autoLoad: true
        });
        me.store = s;
        me.callParent(arguments);
    }
});
