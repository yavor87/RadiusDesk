Ext.define('Rd.view.i18n.vWinLanguageEdit', {
    extend:     'Ext.window.Window',
    alias :     'widget.vWinLanguageEdit',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Edit Languages',
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
        'Rd.view.components.vCmbJustLanguages'
    ],
     initComponent: function() {
        var me = this;
        var scrnLanguageEdit  = me.mkScrnLanguageEdit();
        var scrnLanguageEditDo= me.mkScrnLanguageEditDo();
        this.items = [
            scrnLanguageEdit,
            scrnLanguageEditDo
        ];
        this.callParent(arguments);
    },

    //____
    mkScrnLanguageEdit: function(){
        //itemId's of interest
        //scrnLanguageEdit 
        //btnLanguageNextNext

        //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Select a language to edit",
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
                   xtype: 'cmbJustLanguages'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnLanguageEditNext',
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
            itemId: 'scrnLanguageEdit',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    },

    //____
    mkScrnLanguageEditDo: function(){
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
                    fieldLabel: 'Language name',
                    itemId: 'inpNewCountry',
                    allowBlank: false,
                    emptyText: 'language name',
                    blankText:"Specify a valid name for the language",
                    textValid: true, 
                    validator: function(){
                        return this.textValid;  
                    }
                },
                {
                    name: 'iso_code',
                    fieldLabel: 'ISO code',
                    itemId: 'inpNewIso',
                    allowBlank: false,
                    emptyText: 'eg pt or de',
                    blankText:"Specify a valid iso language code",
                    textValid: true,
                    maskRe : /[a-z]/i,
                    minLength : 2, 
                    maxLength : 2,
                    fieldStyle: 'text-transform:lowercase',
                    validator: function(){
                        return this.textValid;  
                    }
                }
            ],
            buttons: [
                    {
                        itemId:     'btnLanguageEditDoPrev',
                        text:       'Prev',
                        scale:      'large',
                        iconCls:    'b-prev',
                        margin:     '0 20 40 0'
                    },
                    {
                        itemId:     'btnLanguageEditDoNext',
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
            itemId: 'scrnLanguageEditDo',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    }
});
