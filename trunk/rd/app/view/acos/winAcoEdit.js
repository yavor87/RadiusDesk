Ext.define('Rd.view.acos.winAcoEdit', {
    extend: 'Ext.window.Window',
    alias : 'widget.winAcoEdit',
    title : 'Edit ACO object',
    layout: 'fit',
    autoShow: true,
    width: 300,
    iconCls: 'add',
    initComponent: function() {
        var me = this;
        this.items = [
            {
                xtype: 'form',
                border: false,
                layout: 'anchor',
                width: '100%',
                flex: 1,
                defaults: {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget: 'under',
                    labelStyle: 'font-weight: bold; color: #980820; font-size:120%;',
                    labelAlign: 'top',
                    labelSeparator: '',
                    margin: 15
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
                        xtype: 'textfield',
                        fieldLabel: 'Alias',
                        name : "alias",
                        allowBlank:false,
                        blankText:"Enter Alias"
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
                        text: 'Next',
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
