Ext.define('Rd.view.meshes.cmbStaticExits', {
    extend          : 'Ext.form.ComboBox',
    alias           : 'widget.cmbStaticExits',
    fieldLabel      : 'Static exit points',
    labelSeparator  : '',
    queryMode       : 'local',
    valueField      : 'id',
    displayField    : 'name',
    allowBlank      : false,
    editable        : false,
    mode            : 'local',
    itemId          : 'static_exits',
    name            : 'static_exits',
    value           : 'dragino2',
    labelClsExtra   : 'lblRd',
    initComponent: function(){
        var me      = this;
        var s       = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : '/cake2/rd_cake/meshes/encryption_options.json',
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
