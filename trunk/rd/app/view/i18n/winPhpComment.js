Ext.define('Rd.view.i18n.winPhpComment', {
    extend: 'Ext.window.Window',
    alias : 'widget.winPhpComment',
    title : 'Add comment to msgid',
    layout: 'fit',
    autoShow: true,
    width: 300,
    iconCls: 'edit',
    msgid: '',
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
                        xtype:  'hiddenfield',
                        name:   'msgid',
                        value:  me.msgid,
                        hidden: true
                    },
                    {
                        xtype     : 'checkbox',      
                        boxLabel  : 'Remove existing comments',
                        name      : 'remove_existing',
                        inputValue: 'remove',
                        checked   : true
                    }, 
                    {
                        xtype     : 'textfield',
                        name      : "comment",
                        allowBlank:false,
                        blankText :"Enter Comment",
                        fieldLabel: 'Comment'
                    }],
                buttons: [
                    {
                        itemId: 'save',
                        text: 'OK',
                        scale: 'large',
                        iconCls: 'b-btn_ok',
                        formBind: true,
                        margin: '0 15 10 0'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
