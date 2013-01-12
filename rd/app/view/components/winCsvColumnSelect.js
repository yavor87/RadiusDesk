Ext.define('Rd.view.components.winCsvColumnSelect', {
    extend: 'Ext.window.Window',
    alias : 'widget.winCsvColumnSelect',
    title : 'CSV export',
    layout: 'fit',
    autoShow: false,
    width:    350,
    height:   400,
    iconCls: 'list',
    columns: [],
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
                    { xtype: 'tbtext', text: 'Select columns to include in CSV list', cls: 'lblWizard' }
                ],
                items: [
                    {
                        xtype       : 'fieldcontainer',
                        fieldLabel  : 'Columns',
                        defaultType : 'checkboxfield',
                        items:      me.columns
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
