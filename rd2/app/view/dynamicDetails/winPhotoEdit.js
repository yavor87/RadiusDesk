Ext.define('Rd.view.dynamicDetails.winPhotoEdit', {
    extend: 'Ext.window.Window',
    alias : 'widget.winPhotoEdit',
    title : i18n('sEdit_photo'),
    layout: 'fit',
    autoShow: false,
    width:    400,
    height:   300,
    iconCls: 'edit',
    dynamic_detail_id: undefined,
    data_view:  undefined,
    items:  {
        xtype   :  'form', 
        layout  : 'anchor',
        autoScroll:true,
        frame   : false,
        defaults    : {
            anchor: '100%'
        },
        fieldDefaults: {
            msgTarget: 'under',
            labelClsExtra: 'lblRd',
            labelAlign: 'left',
            labelSeparator: '',
            margin: Rd.config.fieldMargin,
            labelWidth: Rd.config.labelWidth
        },
        items       : [
            {
                xtype: 'textfield',
                name : "id",
                hidden: true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : i18n('sTitle'),
                name        : "title",
                labelClsExtra: 'lblRdReq',
                allowBlank  : false
            },
            {
                xtype       : 'textareafield',
                grow        : true,
                name        : 'description',
                fieldLabel  : i18n('sDescription'),
                anchor      : '100%',
                labelClsExtra: 'lblRdReq',
                allowBlank  : false
            },
            {
                xtype: 'filefield',
                itemId: 'form-file',
                emptyText: i18n('sSelect_an_image'),
                fieldLabel: i18n('sOptional_photo'),
                allowBlank  : true,
                labelClsExtra: 'lblRd',
                name: 'photo',
                buttonText: '',
                buttonConfig: {
                    iconCls: 'upload-icon'
                }
            }          
        ],
        buttons: [
            {
                itemId: 'save',
                formBind: true,
                text: i18n('sSave'),
                scale: 'large',
                iconCls: 'b-save',
                margin: Rd.config.buttonMargin
            },
            {
                itemId: 'cancel',
                text: i18n('sCancel'),
                scale: 'large',
                iconCls: 'b-close',
                margin: Rd.config.buttonMargin
            }
        ]
    },
    initComponent: function() {
        var me      = this;
        this.callParent(arguments);
    }
});
