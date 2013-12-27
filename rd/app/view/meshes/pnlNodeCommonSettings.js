Ext.define('Rd.view.meshes.pnlNodeCommonSettings', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlNodeCommonSettings',
    border  : false,
    layout  : 'hbox',
    align   : 'stretch',
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
    initComponent: function(){
        var me = this;
        me.items =  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                layout  : 'anchor',
                autoScroll:true,
                frame   : true,
                fieldDefaults: {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    margin          : Rd.config.fieldMargin,
                    labelWidth      : Rd.config.labelWidth,
                    maxWidth        : Rd.config.maxWidth  
                },
                items       : [
                    
                    {
                        xtype       : 'checkbox',      
                        fieldLabel  : 'AP isolation',
                        name        : 'ap',
                        inputValue  : 'ap',
                        checked     : true,
                        labelClsExtra: 'lblRdReq'
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
                    }
                ]
            };
        me.callParent(arguments);
    }
});
