Ext.define('Rd.view.dynamicDetails.pnlDynamicDetailSettings', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDynamicDetailSettings',
    border  : false,
    dynamic_detail_id: null,
    layout  : 'hbox',
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
    initComponent: function(){
        var me = this;

        me.items =  { 
                xtype       :  'form',
                height      : '100%', 
                width       :  450,
                layout      : 'anchor',
                defaults    : {
                    anchor: '100%'
                },
                autoScroll  :true,
                frame       : true,
                fieldDefaults: {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    margin          : Rd.config.fieldMargin,
                    labelWidth      : 200,
                    maxWidth        : Rd.config.maxWidth  
                },
                items       : [
                    {
                        xtype       : 'textfield',
                        name        : "id",
                        hidden      : true
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Agree to T&C',
                        itemId      : 'chkTc',
                        name        : 't_c_check',
                        inputValue  : 't_c_check',
                        checked     : false,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'T&C URL',
                        itemId      : 'txtTcUrl',
                        name        : "t_c_url",
                        disabled    : true,
                        allowBlank  : false,
                        vtype       : 'url'
                    },       
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Redirect after connect',
                        itemId      : 'chkRedirect',
                        name        : 'redirect_check',
                        inputValue  : 'redirect_check',
                        checked     : false,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Redirect to URL',
                        itemId      : 'txtRedirectUrl',
                        name        : "redirect_url",
                        disabled    : true,
                        allowBlank  : false,
                        vtype       : 'url'
                    },
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'Slideshow',
                        itemId      : 'chkSlideshow',
                        name        : 'slideshow_check',
                        inputValue  : 'slideshow_check',
                        checked     : false,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'numberfield',
                        name        : 'seconds_per_slide',
                        fieldLabel  : 'Seconds per slide',
                        itemId      : 'nrSecondsPerSlide',
                        value       : 30,
                        maxValue    : 300,
                        minValue    : 10,
                        disabled    : true
                    }
                ],
                buttons: [
                    {
                        itemId  : 'save',
                        formBind: true,
                        text    : i18n('sSave'),
                        scale   : 'large',
                        glyph   : Rd.config.icnYes,
                        margin  : Rd.config.buttonMargin
                    }
                ]
            };
        me.callParent(arguments);
    }
});
