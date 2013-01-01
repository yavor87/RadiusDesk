Ext.define('Rd.view.i18n.vWinLanguageCopy', {
    extend:     'Ext.window.Window',
    alias :     'widget.vWinLanguageCopy',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Copy phrases from another language',
    width:      380,
    height:     380,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'copy',
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Rd.view.components.vCmbLanguages'
    ],
     initComponent: function() {
        var me = this;
        var scrnLanguageCopy  = me.mkScrnLanguageCopy();
        this.items = [
            scrnLanguageCopy
        ];
        this.callParent(arguments);
    },

    //____
    mkScrnLanguageCopy: function(){

        //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Choose an existing language to copy the phrases from",
            width: '100%'
        });

        //A form which allows the user to select
        var pnlFrm = Ext.create('Ext.form.Panel',{
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
                {xtype: 'cmbLanguages', 'fieldLabel' : 'Available languages', 'allowBlank': false }
            ],
            buttons: [
                    {
                        itemId: 'btnLanguageCopyNext',
                        text:   'Next',
                        scale:  'large',
                        formBind:true,
                        iconCls:'b-next'
                    }
                ]
        });

        //We pack the two and add a next button
        var pnl =  Ext.create('Ext.panel.Panel',{
            layout: 'vbox',
            border: false,
            itemId: 'scrnLanguageCopy',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    }
});
