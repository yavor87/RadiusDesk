Ext.define('Rd.view.i18n.winPhpCopy', {
    extend: 'Ext.window.Window',
    alias : 'widget.winPhpCopy',
    title : 'Copy from another language',
    layout: 'fit',
    autoShow: true,
    width: 300,
    iconCls: 'copy',
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
                    { xtype: 'cmbLanguages', width: 350, fieldLabel: 'Source',      itemId: 'source',       name: 'source', allowBlank: false },
                    { xtype: 'cmbLanguages', width: 350, fieldLabel: 'Destination', itemId: 'destination',  name: 'destination',allowBlank: false},
                    {
                        xtype     : 'checkbox',      
                        boxLabel  : 'Maintain existing translations',
                        name      : 'maintain_existing',
                        inputValue: 'remove',
                        checked   : true
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
