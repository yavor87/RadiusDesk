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
        var me= this;
        var s = Ext.create('Ext.data.Store', {
            model: 'Rd.model.mRealm',
            //To make it load AJAXly from the server specify the follown 3 attributes
            buffered: true,
            leadingBufferZone: 150, 
            pageSize: 50,
            //To force server side sorting:
            remoteSort: true,
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : '/cake2/rd_cake/realms/index.json',
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message',
                    totalProperty: 'totalCount' //Required for dynamic paging
                },
                api: {
                    destroy  : '/cake2/rd_cake/realms/delete.json'
                },
                simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
            },
            autoLoad: true
        });
        me.store = s;
        this.callParent(arguments);
    }
});
