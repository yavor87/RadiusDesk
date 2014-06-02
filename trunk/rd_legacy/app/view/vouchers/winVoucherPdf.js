Ext.define('Rd.view.permanentUsers.winVoucherPdf', {
    extend: 'Ext.window.Window',
    alias : 'widget.winVoucherPdf',
    title : i18n('sGenerate_pdf'),
    layout: 'fit',
    autoShow: false,
    width:    450,
    height:   300,
    iconCls: 'pdf',
    requires: [
        'Rd.view.vouchers.cmbPdfFormats',
        'Rd.view.components.vLanguagesCmb',
        'Rd.store.sPdfFormats',
        'Rd.model.mPdfFormat'
    ],
    initComponent: function() {
        var me = this;
        
        var controlls = [
            { 
                xtype           : 'cmbPdfFormats', 
                name            : 'language',
                labelClsExtra   : 'lblRdReq',
                allowBlank      : false, 
            },
            { 
                xtype           : 'cmbLanguages', 
                fieldLabel      : i18n('sLanguage'),  
                name            : 'language',
                allowBlank      : false,
                labelClsExtra   : 'lblRdReq',
                allowBlank      : false
            }
        ];

        if(me.selecteds == true){
            Ext.Array.push(controlls, {
                xtype           : 'checkbox',      
                fieldLabel      : i18n('sOnly_selected'),
                name            : 'selected_only',
                inputValue      : 'selected_only',
                checked         : true,
                labelClsExtra   : 'lblRd'
            });
        }


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
                    margin          : 15,
                    labelWidth      : 150
                },
                defaultType: 'textfield',
                tbar: [
                    { xtype: 'tbtext', text: i18n('sSupply_the_following'), cls: 'lblWizard' }
                ],
                items: controlls,
                buttons: [
                    {
                        itemId: 'save',
                        text: i18n('sOK'),
                        formBind: true,
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
