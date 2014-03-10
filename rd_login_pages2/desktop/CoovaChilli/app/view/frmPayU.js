Ext.define('CoovaChilli.view.frmPayU', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.frmPayU',
    border      : false,
    requires    : ['Ext.form.ComboBox','Ext.data.Store','Ext.Img','Ext.form.action.StandardSubmit'],
    layout: {
        type    : 'vbox',
        align   : 'center'
    },
    autoScroll  :true,
    fieldDefaults: {
        msgTarget       : 'under',
        labelClsExtra   : 'lblRd',
        labelAlign      : 'top',
        labelSeparator  : ''
    },
    //url: '/payu/payu-rpp-setTransaction-using-soap.php',
    url: '/cake2/rd_cake/financials/submit_transaction',
    standardSubmit: true,
    initComponent: function() {
        var me       = this;
        var i        = Ext.create('Ext.Img', {src: 'resources/images/big/payu_logo.png', itemId : 'payULogo'});
        me.items     = [i,{xtype : 'cmbVouchers'}];
        me.buttons   = [
            {
                itemId  : 'btnBuy',
                text    : "Buy now",
                scale   : 'large',
                glyph   : CoovaChilli.config.icnShop,
                formBind: true,
                margin  : '0 10 10 0'
            }
        ];
        me.callParent(arguments);
    }
});
