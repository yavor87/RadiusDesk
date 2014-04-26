Ext.define('Rd.view.finPaypalTransactions.gridPaypalTransactions' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridPaypalTransactions',
    multiSelect: true,
    store : 'sFinPaypalTransactions',
    stateful: true,
    stateId: 'StateGridPaypalTransactions',
    stateEvents:['groupclick','columnhide'],
    border: true,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/fin_paypal_transactions/menu_for_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;
        var filters = {
            ftype   : 'filters',
            encode  : true, 
            local   : false
        };
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.features = [filters];

        me.columns  = [
            { xtype: 'rownumberer',stateId: 'StateGridPaypalTransactions1'},
            { 

                text        :'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions2'
            },
            { 

                text        :'Voucher', 
                dataIndex   : 'voucher_name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions3'
            },
            { 

                text        :'Paypal ID', 
                dataIndex   : 'txn_id',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions4'
            },
            { 

                text        :'Business', 
                dataIndex   : 'business',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions5'
            },
            { 

                text        :'Option name', 
                dataIndex   : 'option_name1',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions6'
            },
            { 

                text        :'Option selection', 
                dataIndex   : 'option_selection1',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions7'
            },
            { 

                text        :'Item name', 
                dataIndex   : 'item_name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions8'
            },
            { 

                text        :'Item number', 
                dataIndex   : 'item_number',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions9'
            },
            { 

                text        :'First name', 
                dataIndex   : 'first_name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions10'
            },
            { 

                text        :'Last name', 
                dataIndex   : 'last_name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions11'
            },
            { 

                text        :'Payer email', 
                dataIndex   : 'payer_email',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions12'
            },
            { 

                text        :'Payer id', 
                dataIndex   : 'payer_id',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions13'
            },
            { 

                text        :'Payer status', 
                dataIndex   : 'payer_status',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions14'
            },
            { 

                text        :'Payment gross', 
                dataIndex   : 'payment_gross',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions15'
            },
            { 

                text        :'MC gross', 
                dataIndex   : 'mc_gross',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions16'
            },
            { 

                text        :'MC fee', 
                dataIndex   : 'mc_fee',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions17'
            },
            { 

                text        :'MC currency', 
                dataIndex   : 'mc_currency',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions18'
            },
            { 

                text        :'Payment date', 
                dataIndex   : 'payment_date',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions19'
            },
            { 

                text        :'Payment status', 
                dataIndex   : 'payment_status',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPaypalTransactions20'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'StateGridDevices21'
            }  
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});
        
        me.callParent(arguments);
    }
});
