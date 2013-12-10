Ext.define('Rd.view.meshes.winMeshAddExit', {
    extend:     'Ext.window.Window',
    alias :     'widget.winMeshAddExit',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'New mesh exit point',
    width:      400,
    height:     400,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    autoShow:   false,
    defaults: {
            border: false
    },
    startScreen: 'scrnType', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio'
    ],
    initComponent: function() {
        var me              = this;
        var scrnType  = me.mkScrnType();
        me.items = [
            scrnType,
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnType: function(){

        var me      = this;
        var buttons = [
             
                {
                    itemId: 'btnTypeNext',
                    text: i18n('sNext'),
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];

        var frmType = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnType',
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget       : 'under',
                labelClsExtra   : 'lblRd',
                labelAlign      : 'top',
                labelSeparator  : '',
                margin          : '15 10 15 10'
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: 'Specify exit point type', cls: 'lblWizard' }
            ],
            items:[{
                xtype       : 'radiogroup',
                fieldLabel  : 'Exit point type',
                columns     : 1,
                vertical    : true,
                items: [
                    { boxLabel: 'Ethernet bridge',          name: 'exit_type', inputValue: 'bridge' },
                    { boxLabel: 'Tagged Ethernet bridge',   name: 'exit_type', inputValue: 'tagged_bridge'},
                    { boxLabel: 'NAT + DHCP',               name: 'exit_type', inputValue: 'nat' },
                    { boxLabel: 'Captive Portal',           name: 'exit_type', inputValue: 'captive_portal' }
                ]
            }],
            buttons: buttons
        });
        return frmType;
    }
});
