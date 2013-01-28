Ext.define('Rd.view.nas.frmNasBasic', {
    extend: 'Ext.form.Panel',
    alias : 'widget.frmNasBasic',
    border: false,
    layout: 'anchor',
    autoScroll:true,
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
    buttons: [
        {
            itemId  : 'save',
            text    : 'OK',
            scale   : 'large',
            iconCls : 'b-btn_ok',
            formBind: true,
            margin  : '0 20 40 0'
        }
    ],
    defaultType: 'textfield',
    marginSize: 5,
    initComponent: function() {

        var monitor_types = Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data : [
                {"id":"off",        "text":"Off"},
                {"id":"ping",       "text":"Ping"},
                {"id":"heartbeat",  "text":"Heartbeat"}
            ]
        });

        // Create the combo box, attached to the states data store
        var cmbMt = Ext.create('Ext.form.ComboBox', {
            fieldLabel      : 'Monitor method',
            store           : monitor_types ,
            itemId          : 'monitorType',
            name            : 'monitor',
            queryMode       : 'local',
            displayField    : 'text',
            valueField      : 'id'
        });

        var me = this;
        me.items = [
        {
            xtype:'fieldset',
            title: 'Required info',
            collapsible: false,
            border: true,
            collapsed: false,
            margin: me.marginSize,
            defaults: {
                anchor: '100%'
            },
            items: [
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
                }
            ]
        },
        {
            xtype:'fieldset',
            title: 'Optional info',
            collapsible: false,
            border: true,
            margin: me.marginSize,
            collapsed: false,
            defaults: {
                anchor: '100%'
            },
            items: [
                 {
                    itemId      : 'type',
                    xtype       : 'textfield',
                    fieldLabel  : 'Type',
                    name        : "type",
                    labelClsExtra: 'lblRd'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Ports',
                    name        : "ports",
                    labelClsExtra: 'lblRd'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Community',
                    name        : "community",
                    labelClsExtra: 'lblRd'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Server',
                    name        : "server",
                    labelClsExtra: 'lblRd'
                },
                {
                    xtype       : 'textareafield',
                    grow        : true,
                    name        : 'description',
                    fieldLabel  : 'Description',
                    anchor      : '100%',
                    labelClsExtra: 'lblRd'
                }
                
            ]
        },
        {
            xtype:'fieldset',
            title: 'Monitor settings',
            collapsible: false,
            border: true,
            margin: me.marginSize,
            collapsed: false,
            defaults: {
                anchor: '100%'
            },
            items: [
                cmbMt,
                {
                    xtype: 'numberfield',
                    anchor: '100%',
                    name: 'heartbeat_dead_after',
                    itemId: 'heartbeat_dead_after',
                    fieldLabel: 'Heartbeat is dead after',
                    value: 300,
                    maxValue: 21600,
                    minValue: 300,
                    hidden: true
                },
                {
                    xtype: 'numberfield',
                    anchor: '100%',
                    name: 'ping_interval',
                    itemId: 'ping_interval',
                    fieldLabel: 'Ping interval',
                    value: 300,
                    maxValue: 21600,
                    minValue: 300,
                    hidden: true
                }    
            ]
        },
        {
            xtype:'fieldset',
            title: 'Maps info',
            collapsible: false,
            border: true,
            margin: me.marginSize,
            collapsed: false,
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Longitude',
                    name        : "lon",
                    labelClsExtra: 'lblRd'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : 'Latitude',
                    name        : "lat",
                    labelClsExtra: 'lblRd'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Dispaly on public maps',
                    name        : 'on_public_maps',
                    inputValue  : 'on_public_maps',
                    checked     : false,
                    boxLabelCls : 'lblRd',
                    margin: me.marginSize
                }    
            ]
        },
        {
            xtype:'fieldset',
            title: 'Enhancements',
            collapsible: false,
            border: true,
            margin: me.marginSize,
            collapsed: false,
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Record authentication requests',
                    name        : 'record_auth',
                    inputValue  : 'record_auth',
                    checked     : false,
                    boxLabelCls : 'lblRd',
                    margin: me.marginSize,
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Auto-close stale sessions',
                    name        : 'session_auto_close',
                    inputValue  : 'session_auto_close',
                    checked     : false,
                    boxLabelCls : 'lblRd',
                    margin: me.marginSize,
                },
                {
                    xtype: 'numberfield',
                    anchor: '100%',
                    name: 'session_dead_time',
                    fieldLabel: 'Auto-close activation time',
                    value: 300,
                    maxValue: 21600,
                    minValue: 300,
                    hidden: false
                }  
            ]
        }

        ];
        this.callParent(arguments);
    }
});
