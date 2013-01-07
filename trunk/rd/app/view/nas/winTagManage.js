Ext.define('Rd.view.tags.winTagManage', {
    extend: 'Ext.window.Window',
    alias : 'widget.winTagManage',
    title : 'Add or remove tags',
    layout: 'fit',
    autoShow: false,
    width:    350,
    height:   300,
    iconCls: 'tags',

    initComponent: function() {
        var me = this;
        this.items = [
            {
                xtype: 'form',
                border:     false,
                layout:     'anchor',
                autoScroll: true,
                defaults: {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                defaultType: 'textfield',
                tbar: [
                    { xtype: 'tbtext', text: 'Select an action and a tag', cls: 'lblWizard' }
                ],
                items: [
                    {
                        xtype       : 'radiogroup',
                        fieldLabel  : 'Action',
                        columns: 1,
                        vertical: true,
                        items: [
                            { boxLabel: 'Add',      name: 'rb',     inputValue: 'add', checked: true },
                            { boxLabel: 'Remove',   name: 'rb',     inputValue: 'remove'}
                        ]
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: 'Tags',
                        store: 'sTags',
                        queryMode: 'local',
                        editable: false,
                        name: 'tag_id',
                        displayField: 'name',
                        valueField: 'id',
                    }
                ],
                buttons: [
                    {
                        itemId: 'save',
                        text: 'OK',
                        scale: 'large',
                        iconCls: 'b-next',
                        formBind: true,
                        margin: '0 20 40 0'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
