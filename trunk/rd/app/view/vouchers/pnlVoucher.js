Ext.define('Rd.view.voucher.pnlVoucher', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pnlVoucher',
    border: false,
    v_id: null,
    v_name: null,
    v_record: null, //We will supply each instance with a reference to the selected record.
    initComponent: function(){
        var me      = this;
        //Set default values for from and to:
        var dtFrom  = new Date();
        var dtTo    = new Date();
        dtTo.setYear(dtTo.getFullYear() + 1);

        me.items = [
        {   
            title:  i18n('sBasic_info'),
            itemId : 'tabBasicInfo',
            layout: 'hbox',
            items:  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                layout  : 'anchor',
                autoScroll:true,
                frame   : true,
                defaults    : {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                items       : [               
                    {
                        xtype       : 'cmbRealm',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq'
                    },
                    {
                        xtype       : 'cmbProfile',
                        allowBlank  : false,
                        labelClsExtra: 'lblRdReq',
                        itemId      : 'profile'
                    }
                ],
                buttons: [
                    {
                        itemId: 'save',
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        margin: '0 20 40 0'
                    }
                ]
            }  
        },
        { 
            title   : i18n('sPrivate_attributes'),
            layout  : 'fit',
           // xtype   : 'gridUserPrivate',  
            username: me.v_name
        },
        { 
            title   : i18n('sTracking'),
            itemId: 'tabTracking',
            layout: 'hbox',
            items:  { 
                xtype   :  'form',
                height  : '100%', 
                width   :  400,
                autoScroll:true,
                layout  : 'anchor',
                frame   : true,
                defaults    : {
                    anchor: '100%'
                },
                fieldDefaults: {
                    msgTarget: 'under',
                    labelClsExtra: 'lblRd',
                    labelAlign: 'left',
                    labelSeparator: '',
                    margin: 15
                },
                items       : [
                    {
                        xtype       : 'checkbox',      
                        boxLabel    : i18n('sRADIUS_authentication'),
                        name        : 'track_auth',
                        inputValue  : 'track_auth',
                        checked     : true,
                        boxLabelCls : 'lblRdCheck'
                    },
                    {
                        xtype       : 'checkbox',      
                        boxLabel    : i18n('sRADIUS_accounting'),
                        name        : 'track_acct',
                        inputValue  : 'track_acct',
                        checked     : true,
                        boxLabelCls : 'lblRdCheck'
                    }                
                ],
                buttons: [
                    {
                        itemId: 'save',
                        text: i18n('sSave'),
                        scale: 'large',
                        iconCls: 'b-save',
                        margin: '0 20 40 0'
                    }
                ]
            }
        },
      /*  { 
            title   : i18n('sAuthentication_data'),
            layout  : 'fit',
            xtype   : 'gridUserRadpostauths',  
            username: me.v_name
        },
        { 
            title   : i18n('sAccounting_data'), 
            layout  : 'fit',
            xtype   : 'gridUserRadaccts',
            username: me.v_name
        }*/
        
    ]; 
        me.callParent(arguments);
    }
});
