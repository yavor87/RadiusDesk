Ext.define('Rd.view.finPayUTransactions.gridPayUTransactions' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridPayUTransactions',
    multiSelect: true,
    store : 'sFinPayUTransactions',
    stateful: true,
    stateId: 'StateGridPayUTransactions',
    stateEvents:['groupclick','columnhide'],
    border: true,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/fin_pay_u_transactions/menu_for_grid.json',
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
            { xtype: 'rownumberer',stateId: 'StateGridPayUTransactions1'},
            { 

                text        :'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions2'
            },
            { 

                text        :'Voucher', 
                dataIndex   : 'voucher_name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions3'
            },
            { 

                text        :'Merchant Reference', 
                dataIndex   : 'merchantReference',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions4'
            },
            { 

                text        :'PayU Reference', 
                dataIndex   : 'payUReference',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions5'
            },
            { 

                text        :'Transaction Type', 
                dataIndex   : 'TransactionType',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions6'
            },
            { 

                text        :'Transaction State', 
                dataIndex   : 'TransactionState',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions7'
            },
            { 

                text        :'Result Code', 
                dataIndex   : 'ResultCode',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions8'
            },
            { 

                text        : 'Result Message', 
                dataIndex   : 'ResultMessage',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions9'
            },
            { 

                text        :'Display Message', 
                dataIndex   : 'DisplayMessage',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions10'
            },
            { 

                text        :'Merch User Id', 
                dataIndex   : 'merchUserId',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions11'
            },
            { 

                text        : 'First Name', 
                dataIndex   : 'firstName',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions12'
            },
            { 

                text        : 'Last Name', 
                dataIndex   : 'lastName',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions13'
            },
            { 

                text        :'E-mail', 
                dataIndex   : 'email',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions14'
            },
            { 

                text        :'Mobile', 
                dataIndex   : 'mobile',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions15'
            },
            { 

                text        :'Regional Id', 
                dataIndex   : 'regionalId',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions16'
            },
            { 

                text        :'Amount', 
                dataIndex   : 'amountInCents',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                renderer: function(value){
                    return Ext.ux.centsToHuman(value)              
                },
                stateId     : 'StateGridPayUTransactions17'
            },
            { 

                text        :'description', 
                dataIndex   : 'description',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridPayUTransactions18'
            },
            { 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridPayUTransactions19'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridPayUTransactions20'
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
