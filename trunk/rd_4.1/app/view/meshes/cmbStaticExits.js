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
    name            : 'static_exits[]',
    value           : 0,
    labelClsExtra   : 'lblRd',
    meshId          : '' ,
    initComponent: function(){
        var me      = this;
        var s       = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                extraParams: { 'mesh_id' : me.meshId }, 
                url     : '/cake2/rd_cake/meshes/static_exit_options.json',
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
