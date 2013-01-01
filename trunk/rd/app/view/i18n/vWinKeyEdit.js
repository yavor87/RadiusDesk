Ext.define('Rd.view.i18n.vWinKeyEdit', {
    extend:     'Ext.window.Window',
    alias :     'widget.editKeyW',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Edit Key',
    width:      380,
    height:     380,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'edit',
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Rd.view.i18n.vCmbPhraseKeys'
    ],
     initComponent: function() {
        var me = this;
        var scrnEditKey  = me.mkScrnEditKey();
        var scrnEditKeyDo= me.mkScrnEditKeyDo();
        this.items = [
            scrnEditKey,
            scrnEditKeyDo
        ];
        this.callParent(arguments);
    },

    //____
    mkScrnEditKey: function(){
        //itemId's of interest
        //scrnEditKey  
        //btnEditKeyNext

        //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Select a key to edit",
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
                {
                   xtype: 'cmbPhraseKeys'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnEditKeyNext',
                        text:   'Next',
                        scale:  'large',
                        formBind:true,
                        margin: '0 20 40 0',
                        iconCls:'b-next'
                    }
                ]
        });

        //We pack the two and add a next button
        var pnl =  Ext.create('Ext.panel.Panel',{
            layout: 'vbox',
            border: false,
            itemId: 'scrnEditKey',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    },

    //____
    mkScrnEditKeyDo: function(){
        //itemId's of interest
        //scrnEditKeyDo 
        //btnEditKeyDoPrev      
        //btnEditKeyDoNext 

       //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Supply the following detail please",
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
                {
                    name: 'name',
                    id: 'name',
                    fieldLabel: 'Key name',
                    itemId: 'inpNewKey',
                    allowBlank: false,
                    emptyText: 'key name',
                    blankText:"Specify a valid name for the key",
                    textValid: true, 
                    validator: function(){
                        return this.textValid;  
                    }
                },
                {
                    xtype     : 'textareafield',
                    grow      : true,
                    name      : 'comment',
                    id        : 'comment',
                    fieldLabel: 'Comment',
                    anchor    : '100%'
                }
            ],
            buttons: [
                    {
                        itemId:     'btnEditKeyDoPrev',
                        text:       'Prev',
                        scale:      'large',
                        iconCls:    'b-prev',
                        margin:     '0 20 40 0'
                    },
                    {
                        itemId:     'btnEditKeyDoNext',
                        text:       'Next',
                        scale:      'large',
                        formBind:   true,
                        iconCls:    'b-next',
                        action:     'save',
                        margin:     '0 20 40 0'
                    }
                ]
        });

        //We pack the two and add a next button
        var pnl =  Ext.create('Ext.panel.Panel',{
            layout: 'vbox',
            border: false,
            itemId: 'scrnEditKeyDo',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    }
});
