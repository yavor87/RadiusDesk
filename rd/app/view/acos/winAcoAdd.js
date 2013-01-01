Ext.define('Rd.view.acos.winAcoAdd', {
    extend: 'Ext.window.Window',
    alias : 'widget.winAcoAdd',
    title : 'Add ACO object',
    layout: 'fit',
    autoShow: true,
    width: 300,
    iconCls: 'add',
    parentId: undefined,
    parentDisplay: undefined,
    initComponent: function() {

        var me = this;

        this.items = [
            {
                xtype: 'form',
                items: [
                     {
                        xtype:  'hiddenfield',
                        name:   'parent_id',
                        value:  me.parentId
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Parent node',
                        value: me.parentDisplay
                    },
                    {
                        xtype: 'textfield',
                        margin: 5,
                        fieldLabel: 'Alias',
                        name : "alias",
                        allowBlank:false,
                        blankText:"Enter Alias"
                    },
                    {
                        xtype     : 'textareafield',
                        margin    : 5,
                        grow      : true,
                        name      : "comment",
                        fieldLabel: 'Optional Description'
                    }],
                 buttons : [
                        {
                            text: 'Save',
                            action: 'save',
                            itemId: 'save',
                            iconCls: 'save',
                            formBind: true
                        },
                        {
                            text: 'Cancel',
                            scope: this,
                            handler: this.close,
                            iconCls: 'cancel'
                        }
                    ]
            }
        ];

        this.callParent(arguments);
    }
});
