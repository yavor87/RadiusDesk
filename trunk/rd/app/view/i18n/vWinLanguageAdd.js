Ext.define('Rd.view.i18n.vWinLanguageAdd', {
    extend:     'Ext.window.Window',
    alias :     'widget.addLanguageW',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Add Language',
    width:      380,
    height:     380,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    defaults: {
            border: false
    },
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio',
        'Rd.view.components.vCmbCountries'
    ],
     initComponent: function() {
        var me = this;
        var scrnIntro       = me.mkScrnIntro();
        var scrnNewCountry  = me.mkScrnNewCountry();
        var scrnNewLanguage = me.mkScrnNewLanguage();
        this.items = [
            scrnIntro,
            scrnNewCountry,
            scrnNewLanguage
        ];
        this.callParent(arguments);
    },
    //____ INTRO SCREEN ____

    mkScrnIntro: function(){

        //There are four itemId's of interest
        //scrnIntro         -> The panel displaying the screen
        //btnIntroNext      -> We neet to determine which radio item was selected when this one is clicked
        //radioNewReg       -> New registration
        //radioPassword     -> Password retrieval

        //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Select an existing country to add a language to. Alternatively choose to create a new country.",
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
                {   xtype: 'cmbCountries'
                },
                {
                    xtype      : 'fieldcontainer',
                    defaultType: 'checkboxfield',
                    defaults: {
                        flex: 1
                    },
                    layout: 'vbox',
                    items: [
                        {
                            boxLabel  : 'Create new country',
                            name      : 'chkNewCountry',
                            inputValue: '1',
                            itemId    : 'chkNewCountry',
                            checked   : true
                        }
                    ]
                }
            ],
            buttons: [
                    {
                        itemId: 'btnIntroNext',
                        text: 'Next',
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0'
                    }
                ]
        });

        //We pack the two and add a next button
        var pnl =  Ext.create('Ext.panel.Panel',{
            layout: 'vbox',
            border: false,
            itemId: 'scrnIntro',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    },

    //______ 

    mkScrnNewCountry: function(){

        //There are four itemId's of interest
        //scrnNewCountry     -> The panel displaying the screen
        //btnNewCountryNext  -> Will be active when the correct email is supplied
        //btnNewCountryPrev  -> Go back to the Intro secreen

        //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Supply the following detail please",
            width: '100%'
        });

        //A form which allows the user supply their email address
        var pnlFrm = Ext.create('Ext.form.Panel',{
            border: false,
            layout: 'anchor',
            width: '100%',
            flex: 1,
            overflowY: 'auto',
            bodyPadding: 10,
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
                    fieldLabel: 'Country name',
                    itemId: 'inpNewCountry',
                    allowBlank: false,
                    emptyText: 'country name',
                    blankText:"Specify a valid name for the country",
                    textValid: true, //start with it as valid to allow the blankText to show
                    validator: function(){
                        return this.textValid;  //this.text.Valid will return either true or the error message which is supplied by the 'change' listener 
                    }
                },
                {
                    name: 'iso_code',
                    fieldLabel: 'ISO code',
                    itemId: 'inpNewIso',
                    allowBlank: false,
                    emptyText: 'eg US or ZA',
                    blankText:"Specify a valid iso country code",
                    maskRe : /[a-z]/i,
                    minLength : 2, 
                    maxLength : 2,
                    fieldStyle: 'text-transform:uppercase',
                    textValid: true, //start with it as valid to allow the blankText to show
                    validator: function(){
                        return this.textValid;  //this.text.Valid will return either true or the error message which is supplied by the 'change' listener 
                    }
                },
                {
                    xtype: 'filefield',
                    name: 'icon',
                    fieldLabel: 'Flag icon',
                    allowBlank: false,
                    buttonText: 'Select Icon...'
                }
            ],
            buttons: [
                     {
                        itemId:     'btnNewCountryPrev',
                        text:       'Prev',
                        scale:      'large',
                        iconCls:    'b-prev'
                    },
                     {
                        itemId:     'btnNewCountryNext',
                        text:       'Next',
                        formBind:   true,
                        scale:      'large',
                        iconCls:    'b-next'
                    }
                ]
        });

        //We pack the two and add a next button
        var pnl =  Ext.create('Ext.panel.Panel',{
            itemId: 'scrnNewCountry',
            layout: 'vbox',
            border: false,
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    },

     mkScrnNewLanguage: function(){

        //There are four itemId's of interest
        //scrnNewLanguage     -> The panel displaying the screen
        //btnNewLanguageNext  -> Will be active when the correct email is supplied
        //btnNewLanguagePrev  -> Go back to the Intro secreen

        //First a panel which we'll add the instructions to 
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Supply the following detail please",
            width: '100%'
        });

        //A form which allows the user supply their email address
        var pnlFrm = Ext.create('Ext.form.Panel',{
            border: false,
            layout: 'anchor',
            width: '100%',
            flex: 1,
            overflowY: 'auto',
            bodyPadding: 10,
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
                    maskRe : /[a-z]/i,
                    minLength : 2, 
                    maxLength : 2,
                    fieldStyle: 'text-transform:lowercase',
                    textValid: true, 
                    validator: function(){
                        return this.textValid;  
                    }
                }
            ],
            buttons: [
                     {
                        itemId:     'btnNewLanguagePrev',
                        text:       'Prev',
                        scale:      'large',
                        iconCls:    'b-prev'
                    },
                     {
                        itemId:     'btnNewLanguageNext',
                        text:       'Next',
                        formBind:   true,
                        scale:      'large',
                        iconCls:    'b-next'
                    }
                ]
        });
        //We pack the two and add a next button
        var pnl =  Ext.create('Ext.panel.Panel',{
            itemId: 'scrnNewLanguage',
            layout: 'vbox',
            border: false,
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    }
});
