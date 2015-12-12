Ext.define('Rd.view.finPaymentPlans.cmbPaymentPlanType', {
    extend			: 'Ext.form.ComboBox',
    alias 			: 'widget.cmbPaymentPlanType',
    fieldLabel		: 'Dialout code',
    labelSeparator	: '',
    forceSelection	: true,
    queryMode     	: 'local',
    displayField  	: 'text',
    valueField    	: 'id',
    typeAhead		: true,
    allowBlank		: false,
    mode			: 'local',
    name			: 'type',
    labelClsExtra	: 'lblRd',
	value			: "user",
    initComponent: function() {
        var me= this;
        var s = Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data : [
                {"id":"user",    "text": "User"},
                {"id":"voucher", "text": "Voucher"}
            ]
        });
        me.store = s;
        this.callParent(arguments);
    }
});
