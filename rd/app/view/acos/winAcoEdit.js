Ext.define('Rd.view.acos.winAcoEdit', {
    extend: 'Ext.window.Window',
    alias : 'widget.winAcoEdit',
    title : 'Edit ACO object',
    closable    :  true,
    draggable   :  false,
    resizable   :  false,
    border      : false,
    layout      : 'fit',
    autoShow    : false,
    width       : 350,
    height      : 350,
    iconCls     : 'edit',
    initComponent: function() {
        var me = this;
        this.items = [
            {
                xtype: 'form',
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                defaults: {
                    anchor: '100%'
                },
                defaultType: 'textfield',
                items: [
                     {
                        xtype:  'hiddenfield',
                        name:   'parent_id',
                        hidden: true
                    },
                    {
                        xtype:  'hiddenfield',
                        name:   'id',
                        hidden: true
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Alias',
                        name        : "alias",
                        allowBlank  :false,
                        blankText   :"Enter Alias",
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype     : 'textareafield',
                        grow      : true,
                        name      : "comment",
                        fieldLabel: 'Optional Description'
                    }],
                buttons: [
                    {
                        itemId: 'save',
                        text: 'Save',
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
