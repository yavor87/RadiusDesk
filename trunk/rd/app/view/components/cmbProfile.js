Ext.define('Rd.view.components.cmbProfile', {
    extend: 'Ext.form.ComboBox',
    alias : 'widget.cmbProfile',
    fieldLabel: i18n('sProfile'),
    labelSeparator: '',
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
        var me= this;
        var s = Ext.create('Ext.data.Store', {
        model: 'Rd.model.mProfile',
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
                url     : '/cake2/rd_cake/profiles/index.json',
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message',
                    totalProperty: 'totalCount' //Required for dynamic paging
                },
            
                simpleSortMode: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
            },
            autoLoad: false
        });
        me.store = s;
        this.callParent(arguments);
    }
});
