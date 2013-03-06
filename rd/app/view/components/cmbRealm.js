Ext.define('Rd.view.components.cmbRealm', {
    extend: 'Ext.form.ComboBox',
    alias : 'widget.cmbRealm',
    fieldLabel: i18n('sRealm'),
    labelSeparator: '',
    store: 'sRealms',
    forceSelection: true,
    queryMode: 'remote',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    allowBlank: false,
    mode: 'local',
    name: 'realm_id',
    labelClsExtra: 'lblRd',
    initComponent: function() {
        this.callParent(arguments);
    }
});
