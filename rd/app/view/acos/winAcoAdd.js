Ext.define('Rd.view.acos.winAcoAdd', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winAcoAdd',
    closable    :  true,
    draggable   :  false,
    resizable   :  false,
    border      : false,
    title       : 'Add ACO object',
    layout      : 'fit',
    autoShow    : false,
    width       : 350,
    height      : 350,
    iconCls     : 'add',
    parentId    : undefined,
    parentDisplay: undefined,
    initComponent: function() {

        var me  = this;
        me.items = [
            {
                xtype: 'form',
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        itemId  : 'parent_id',
                        xtype   : 'textfield',
                        name    : 'parent_id',
                        hidden  : true,
                        value   : me.parentId
                    },
                    {
                        xtype       : 'displayfield',
                        fieldLabel  : 'Parent node',
                        value       : me.parentDisplay,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Alias',
                        name        : "alias",
                        allowBlank  :false,
                        blankText   :"Enter Alias",
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype     : 'textareafield',
                        grow      : true,
                        name      : "comment",
                        fieldLabel: 'Optional Description'
                    }],
                 buttons : [
                    {
                        text    : 'Save',
                        scale   : 'large',
                        action  : 'save',
                        itemId  : 'save',
                        iconCls : 'b-next',
                        formBind: true,
                        margin  : '0 20 40 0'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
