Ext.define('Rd.view.i18n.vWinCountryEdit', {
    extend:     'Ext.window.Window',
    alias :     'widget.vWinCountryEdit',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Edit Countries',
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
        'Rd.view.components.vCmbCountries'
    ],
     initComponent: function() {
        var me = this;
        var scrnCountryEdit  = me.mkScrnCountryEdit();
        var scrnCountryEditDo= me.mkScrnCountryEditDo();
        this.items = [
            scrnCountryEdit,
            scrnCountryEditDo
        ];
        this.callParent(arguments);
    },
    mkScrnCountryEdit: function(){
        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Select a country to edit",
            width: '100%'
        });
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
                   xtype: 'cmbCountries'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnCountryEditNext',
                        text:   'Next',
                        scale:  'large',
                        formBind:true,
                        margin: '0 20 40 0',
                        iconCls:'b-next'
                    }
                ]
        });
        var pnl =  Ext.create('Ext.panel.Panel',{
            layout: 'vbox',
            border: false,
            itemId: 'scrnCountryEdit',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    },
    mkScrnCountryEditDo: function(){

        var pnlMsg = Ext.create('Ext.container.Container',{
            border: false,
            baseCls: 'regMsg',
            html: "Supply the following detail please",
            width: '100%'
        });
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
                    fieldLabel: 'Country name',
                    itemId: 'inpNewCountry',
                    allowBlank: false,
                    emptyText: 'country name',
                    blankText:"Specify a valid name for the country"
                },
                {
                    name: 'iso_code',
                    fieldLabel: 'ISO code',
                    itemId: 'inpNewIso',
                    allowBlank: false,
                    emptyText: 'eg ZA or DE',
                    blankText:"Specify a valid iso country code",
                    maskRe : /[a-z]/i,
                    minLength : 2, 
                    maxLength : 2,
                    fieldStyle: 'text-transform:uppercase'
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
                        itemId:     'btnCountryEditDoPrev',
                        text:       'Prev',
                        scale:      'large',
                        iconCls:    'b-prev',
                        margin:     '0 20 40 0'
                    },
                    {
                        itemId:     'btnCountryEditDoNext',
                        text:       'Next',
                        scale:      'large',
                        formBind:   true,
                        iconCls:    'b-next',
                        action:     'save',
                        margin:     '0 20 40 0'
                    }
                ]
        });

        var pnl =  Ext.create('Ext.panel.Panel',{
            layout: 'vbox',
            border: false,
            itemId: 'scrnCountryEditDo',
            items: [
                pnlMsg,
                pnlFrm
            ] 
        });
        return pnl;
    }
});
