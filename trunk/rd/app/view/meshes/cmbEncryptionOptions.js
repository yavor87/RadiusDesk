Ext.define('Rd.view.meshes.cmbEncryptionOptions', {
    extend          : 'Ext.form.ComboBox',
    alias           : 'widget.cmbEncryptionOptions',
    fieldLabel      : 'Encryption',
    labelSeparator  : '',
    store           : 'sEncryptionOptions',
    queryMode       : 'local',
    valueField      : 'id',
    displayField    : 'name',
    allowBlank      : false,
    editable        : false,
    mode            : 'local',
    itemId          : 'encryption',
    name            : 'encryption',
    value           : 'none',
    labelClsExtra   : 'lblRd'
});
