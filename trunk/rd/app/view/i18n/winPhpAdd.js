Ext.define('Rd.view.i18n.winPhpAdd', {
    extend: 'Ext.window.Window',
    alias : 'widget.winPhpAdd',
    title : 'Add Msgid',
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
                    labelClsExtra: 'lblRd',
                    labelAlign: 'top',
                    labelSeparator: '',
                    margin: 15
                },
                defaultType: 'textfield',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Msgid',
                        name : "msgid",
                        allowBlank:false,
                        blankText:"Enter Message ID"
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Msgstr',
                        name : "msgstr",
                        allowBlank:true
                    },
                    {
                        xtype     : 'textfield',
                        name      : "comment",
                        fieldLabel: 'Optional Comment'
                    }],
                buttons: [
                    {
                        itemId: 'save',
                        text: 'OK',
                        scale: 'large',
                        iconCls: 'b-btn_ok',
                        formBind: true,
                        margin: '0 20 40 0'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
