Ext.define('Rd.view.components.cmbPermanentUser', {
    extend: 'Ext.form.ComboBox',
    alias : 'widget.cmbPermanentUser',
    fieldLabel: i18n('sOwner'),
    labelSeparator: '',
    store: 'sPermanentUsers',
    forceSelection: true,
    queryMode: 'remote',
    valueField: 'id',
    displayField: 'username',
    typeAhead: true,
    allowBlank: false,
    mode: 'local',
    name: 'user_id',
    labelClsExtra: 'lblRd',
    initComponent: function() {
        this.callParent(arguments);
    }
});
