Ext.define('Rd.view.components.cmbProfile', {
    extend: 'Ext.form.ComboBox',
    alias : 'widget.cmbProfile',
    fieldLabel: i18n('sProfile'),
    labelSeparator: '',
    store: 'sProfiles',
    forceSelection: true,
    queryMode: 'remote',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    allowBlank: false,
    mode: 'local',
    name: 'profile_id',
    labelClsExtra: 'lblRd',
    initComponent: function() {
        this.callParent(arguments);
    }
});
