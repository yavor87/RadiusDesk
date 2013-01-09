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
    urlConnTypes: '/cake2/rd_cake/nas/conn_types_available.json',
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
        var scrnOpenvpn     = me.mkScrnOpenvpn();
        var scrnDirect      = me.mkScrnDirect();
        var scrnRealmsForNasOwner = me.scrnRealmsForNasOwner();

        this.items = [
            scrnApTree,
            scrnConType,
            scrnOpenvpn,
            scrnDirect,
            scrnRealmsForNasOwner
        ]; 
        this.callParent(arguments);

        //Get the connection types:
        Ext.Ajax.request({
            url: me.urlConnTypes,
            method: 'GET',
            success: me.addConnTypes,
            scope: me
        });

    },

    addConnTypes: function(response){

        var me          = this;
        var jsonData    = Ext.JSON.decode(response.responseText);
        var rbgrp       = me.down('radiogroup');

        if(jsonData.success){
            Ext.Array.each(jsonData.items, function(i,j){
                if(j == 0){
                    rbgrp.add({ boxLabel: i.name, name: 'rb', inputValue: i.id, checked: true});
                }else{
                    rbgrp.add({ boxLabel: i.name, name: 'rb', inputValue: i.id});
                } 
            });
        }
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

        var me = this;

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
                margin: '15 10 15 10'
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
               // items: [
                  //  { boxLabel: 'Direct (fixed IP)',    name: 'rb', inputValue: 'direct', checked: true },
                 //   { boxLabel: 'OpenVPN',              name: 'rb', inputValue: 'openvpn'},
                  //  { boxLabel: 'PPTP',                 name: 'rb', inputValue: 'pptpd' },
                  //  { boxLabel: 'Dynamic client',       name: 'rb', inputValue: 'dynamic' }
               // ]
            }],
            buttons: [
                {
                    itemId: 'btnConTypePrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
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

    //______ OpenVPN username and optional password) _____
    mkScrnOpenvpn: function(){

        var frmOpenvpn = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnOpenvpn',
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
                { xtype: 'tbtext', text: 'Credentials for OpenVPN tunnel', cls: 'lblWizard' }
            ],
            items:[
                {
                    itemId      : 'vpn_username',
                    xtype       : 'textfield',
                    fieldLabel  : 'Username',
                    name        : 'vpn_username',
                    allowBlank  : false,
                    blankText   : 'Required OpenVPN username',
                    labelClsExtra: 'lblRdReq'
                },
                {
                    itemId      : 'vpn_password',
                    xtype       : 'textfield',
                    fieldLabel  : 'Password',
                    name        : 'vpn_password',
                    blankText   : 'Supply an optional password',
                    labelClsExtra: 'lblRd'
                } 
            ],
            buttons: [
                {
                    itemId: 'btnOpenvpnPrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'btnOpenvpnNext',
                    text: 'Next',
                    scale: 'large',
                    iconCls: 'b-next',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ]
        });
        return frmOpenvpn;
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
                    itemId  : 'connection_type',
                    name    : "connection_type",
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
                    itemId      : 'nasname',
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
                    name        : "secret",
                    allowBlank  : false,
                    blankText   : "Supply the shared secret",
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Make available to sub-providers',
                    name        : 'available_to_siblings',
                    inputValue  : 'available_to_siblings',
                    itemId      : 'a_to_s',
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
            tbar: [{xtype: 'checkboxfield',boxLabel  : 'Make available to any realm', boxLabelCls : 'lblRd',itemId: 'chkAvailForAll'}],
            buttons: [
                {
                    itemId: 'btnRealmsForNasOwnerPrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
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
