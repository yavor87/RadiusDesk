Ext.define('CoovaChilli.view.cmbVouchers', {
    extend      : 'Ext.form.ComboBox',
    alias       : 'widget.cmbVouchers',
    valueField  : 'id',
   // margin      : 20,
    msgTarget   : 'under',
    labelStyle  : 'font-weight: bold; color: #980820; font-size:120%;',
    labelSeparator: '',
   // width       : 240,
    allowBlank  : false,
    blankText   : 'Choose a voucher first',
    fieldLabel  : 'Voucher',
    forceSelection: true,
    queryMode     : 'local',
    displayField  : 'name',
    typeAhead   : true,
    mode        : 'local',
    name        : 'voucher',
    store       : 'sPrices',
    tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item ccBorder">',
                        '<div class="ccName">{name}</div>',
                        '<div class="ccAmount">{currency} {price}</div>',
                    '</div>',
                '</tpl>'
            ),
    // template for the content inside text field
    displayTpl: Ext.create('Ext.XTemplate',
          '<tpl for=".">',
                '{name} ({currency} {price})',
        '</tpl>'
    ),
    initComponent: function() {
      /* var me= this;
       var s = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'price','currency'],
            data : [
                {"id"   :"data_175m", "name":"175MB",  'price':'50', 'currency':'Rand'},
                {"id"   :"data_500m", "name":"500Meg", 'price':'70', 'currency':'Rand'},
                {"id"   :"data_1g",   "name":"1Gig",   'price':'100','currency':'Rand'},
                {"id"   :"data_2g",   "name":"2Gig",   'price':'150','currency':'Rand'}
            ]
        });
        me.store = s;*/
        this.callParent(arguments);
    }
});
