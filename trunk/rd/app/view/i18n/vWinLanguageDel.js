Ext.define('Rd.view.i18n.vWinLanguageDel', {
    extend:     'Ext.window.Window',
    alias :     'widget.delLanguageW',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Delete language',
    width:      380,
    height:     300,
    plain:      true,
    border:     false,
    layout:     'vbox',
    bodyCls:    'bodyCls',
    iconCls:    'delete',
    requires: [
        'Rd.view.components.vCmbJustLanguages'
    ],
    items: [
        {   xtype: 'panel',
            border: false,
            baseCls: 'regMsg',
            html: "Select the language to delete. Make sure you know what you are doing",
            width: '100%'
        },
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
            items: [
                {   xtype: 'cmbJustLanguages', name: 'id'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnLanguageDelNext',
                        text: 'Next',
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0',
                        formBind: true
                    }
                ]
        }
    ],
    defaults: {
            border: false
    },   
    initComponent: function() {
        var me = this;
        this.callParent(arguments);
    }
});
