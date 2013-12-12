Ext.define('Rd.view.meshes.cmbMeshEntryPoints', {
    extend          : 'Ext.form.ComboBox',
    alias           : 'widget.cmbMeshEntryPoints',
    fieldLabel      : 'Connects with',
    labelSeparator  : '',
    store           : 'sMeshEntryPoints',
    queryMode       : 'local',
    valueField      : 'id',
    displayField    : 'name',
    editable        : false,
    mode            : 'local',
    itemId          : 'entry_points',
    name            : 'entry_points[]',
    multiSelect     : true,
    labelClsExtra   : 'lblRdReq',
    allowBlank      : true
});
