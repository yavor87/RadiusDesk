Ext.define('Rd.view.realms.winNasAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winNasAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      'Add NAS device',
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
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnConType     = me.mkScrnConType();
        var scrnDirect      = me.mkScrnDirect();
        var scrnRealmsForNasOwner = me.scrnRealmsForNasOwner();

        this.items = [
            scrnApTree,
            scrnConType,
            scrnDirect,
            scrnRealmsForNasOwner
        ]; 
        this.callParent(arguments);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){

        //A form which allows the user to select
        var pnlTree = Ext.create('Ext.tree.Panel',{
            itemId: 'scrnApTree',
            useArrows: true,
            store: 'sAccessProviders',
            rootVisible: true,
            rowLines: true,
            layout: 'fit',
            stripeRows: true,
            border: false,
            tbar: [
                { xtype: 'tbtext', text: 'Select the device owner', cls: 'lblWizard' }
            ],
            columns: [
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Owner',
                    sortable: true,
                    flex: 1,
                    dataIndex: 'username',
                    tdCls: 'gridTree'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnTreeNext',
                        text: 'Next',
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0'
                    }
                ]
        });
        return pnlTree;
    },
    //_______ Connetion Type selection _______
    mkScrnConType: function(){

        var frmConType = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnConType',
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
            tbar: [
                { xtype: 'tbtext', text: 'Choose a connection type', cls: 'lblWizard' }
            ],
            items:[{
                xtype: 'radiogroup',
                fieldLabel: 'Connection type',
                columns: 1,
                vertical: true,
                items: [
                    { boxLabel: 'Direct (fixed IP)',    name: 'rb', inputValue: 'direct', checked: true },
                    { boxLabel: 'OpenVPN',              name: 'rb', inputValue: 'openvpn'},
                    { boxLabel: 'PPTP',                 name: 'rb', inputValue: 'pptpd' },
                    { boxLabel: 'Dynamic client',       name: 'rb', inputValue: 'dynamic' }
                ]
            }],
            buttons: [
                {
                    itemId: 'btnConTypePrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
                    formBind: true,
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'btnConTypeNext',
                    text: 'Next',
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ]
        });
        return frmConType;
    },

    //_______ Direct connection  _______
    mkScrnDirect: function(){

        var frmDirect = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnDirect',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelClsExtra: 'lblRd',
                labelAlign: 'left',
                labelSeparator: '',
                margin: 15
            },
            defaultType: 'textfield',
            tbar: [
                { xtype: 'tbtext', text: 'Supply the following', cls: 'lblWizard' }
            ],
            items:[
                {
                    itemId  : 'user_id',
                    xtype   : 'textfield',
                    name    : "user_id",
                    hidden  : true
                },
                {
                    xtype   : 'textfield',
                    name    : "id",
                    hidden  : true
                }, 
                {
                    itemId      : 'owner',
                    xtype       : 'displayfield',
                    fieldLabel  : 'Owner',
                    value       : '',
                    labelClsExtra: 'lblRdReq'
                },
                {
                    itemId      : 'connectionType',
                    xtype       : 'displayfield',
                    fieldLabel  : 'Connection',
                    value       : '',
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'IP Address',
                    name        : "nasname",
                    allowBlank  : false,
                    blankText   : "Enter the IP Address of device",
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Name',
                    name        : "shortname",
                    allowBlank  : false,
                    blankText   : "Supply a descriptive name",
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Secret',
                    name        : "shortname",
                    allowBlank  : false,
                    blankText   : "Supply the shared secret",
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Make available to sub-providers',
                    name        : 'available_to_siblings',
                    inputValue  : 'available_to_siblings',
                    checked     : false,
                    boxLabelCls : 'lblRdReq'
                }
            ],
            buttons: [
                {
                    itemId: 'btnDirectPrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
                    formBind: true,
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'btnDirectNext',
                    text: 'Next',
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ]
        });
        return frmDirect;
    },

    //____ Grid with availabble realms
    scrnRealmsForNasOwner : function(){

        var me = this;
        var grid = Ext.create('Rd.view.nas.gridRealmsForNasOwner',{});
        var pnlRealmsForNasOwner = Ext.create('Ext.form.Panel',{   
            items: grid,
            layout:     'fit',
            itemId:     'scrnRealmsForNasOwner',
            tbar: [{xtype: 'checkboxfield',boxLabel  : 'Make available to any realm', boxLabelCls : 'lblRd'}],
            buttons: [
                {
                    itemId: 'btnRealmsForNasOwnerPrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
                    formBind: true,
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'btnRealmsForNasOwnerNext',
                    text: 'Next',
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ]
        });
        
        return pnlRealmsForNasOwner;
    }
    
    
});
