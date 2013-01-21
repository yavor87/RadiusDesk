Ext.define('Rd.view.realms.frmDetail', {
    extend: 'Ext.form.Panel',
    alias : 'widget.frmRealmDetail',
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
    defaultType: 'textfield',
    owner:      '',
    user_id:    '',
    no_tree:    false,
    initComponent: function() {
        var me = this;
        var buttons = [
                {
                    itemId: 'btnDetailPrev',
                    text: 'Prev',
                    scale: 'large',
                    iconCls: 'b-prev',
                    margin: '0 20 40 0'
                },
                {
                    itemId: 'save',
                    text: 'OK',
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];

        if(me.no_tree){
            buttons = [
                {
                    itemId: 'save',
                    text: 'OK',
                    scale: 'large',
                    iconCls: 'b-btn_ok',
                    formBind: true,
                    margin: '0 20 40 0'
                }
            ];
        }

        me.buttons = buttons;

        me.items = [
        {
            itemId  : 'user_id',
            xtype   : 'textfield',
            name    : "user_id",
            hidden  : true,
            value   : me.user_id
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
            value       : me.owner,
            labelClsExtra: 'lblRdReq'
        },
        {
            xtype       : 'textfield',
            fieldLabel  : 'Name',
            name        : "name",
            allowBlank  : false,
            blankText   : "Enter a name",
            labelClsExtra: 'lblRdReq'
        },
        {
            xtype       : 'checkbox',      
            boxLabel    : 'Make available to sub-providers',
            name        : 'available_to_siblings',
            inputValue  : 'available_to_siblings',
            checked     : false,
            boxLabelCls : 'lblRdReq'
        },
        {
            xtype:'fieldset',
            title: 'Optional Info',
            collapsible: true,
            border: false,
            collapsed: true,
            defaults: {
                anchor: '100%'
            },
            items: [
            {
                xtype       : 'displayfield',
                fieldLabel  : 'Contact detail',
                labelClsExtra: 'lblRdGrouping'
       
            },          
            {
                xtype       : 'textfield',
                fieldLabel  : 'Phone',
                name        : "phone",
                allowBlank  : true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Fax',
                name        : "fax",
                allowBlank  : true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Cell',
                name        : "cell",
                allowBlank  : true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'email',
                name        : "email",
                allowBlank  : true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'URL',
                name        : "url",
                allowBlank  : true
            },
            {
                xtype       : 'displayfield',
                fieldLabel  : 'Address',
                labelClsExtra: 'lblRdGrouping'
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Street Number',
                name        : "street_no",
                allowBlank  : true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Street',
                name        : "street",
                allowBlank  : true,
                margin: 15
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Town / Suburb',
                name        : "town_suburb",
                allowBlank  : true,
                margin: 15
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'City',
                name        : "city",
                allowBlank  : true
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Country',
                name        : "country",
                allowBlank  : true
            },
            {
                xtype       : 'displayfield',
                fieldLabel  : 'Location',
                labelClsExtra: 'lblRdGrouping'
            },
            {
                xtype       : 'textfield',
                fieldLabel  : 'Longitude',
                name        : "lon",
                allowBlank  : true
            },
            {   
                xtype       : 'textfield',
                fieldLabel  : 'Latitude',
                name        : "lat",
                allowBlank  : true
            },
        ]}
     
        ];
        this.callParent(arguments);
    }
});
