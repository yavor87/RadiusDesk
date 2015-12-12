Ext.define('Rd.view.finMyGateTransactions.gridFinMyGateTransactions' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridFinMyGateTransactions',
    multiSelect	: true,
    store 		: 'sFinMyGateTransactions',
    stateful	: true,
    stateId		: 'StateGridFinMyGateTransactions',
    stateEvents	:['groupclick','columnhide'],
    border		: true,
    requires	: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig	: {
        loadMask:true
    },
    urlMenu		: '/cake2/rd_cake/fin_my_gate_transactions/menu_for_grid.json',
    bbar		: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;
		me.bbar     =  [
            {
                xtype       : 'pagingtoolbar',
                store       : me.store,
                dock        : 'bottom',
                displayInfo : true
            }  
        ];

        var filters = {
            ftype   : 'filters',
            encode  : true, 
            local   : false
        };
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.features = [filters];

        me.columns  = [
            { xtype: 'rownumberer',stateId: 'StateGridFinMyGateTransactions1'},
			{ 

                text        : 'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions2'
            },
			{ 

                text        : 'Permanet user', 
                dataIndex   : 'permanent_user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions3'
            },
			{ 

                text        : 'Token', 
                dataIndex   : 'fin_my_gate_token',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions4'
            },
			{ 

                text        : 'Status', 
                dataIndex   : 'status',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions5'
            },
			{ 

                text        : 'Type', 
                dataIndex   : 'type',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions6'
            },
			{ 

                text        : 'Amount', 
                dataIndex   : 'amount',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions7'
            },
			{ 

                text        : 'Reference', 
                dataIndex   : 'my_gate_reference',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions8'
            },
			{ 

                text        : 'Message', 
                dataIndex   : 'message',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTransactions9'
            },
			{ 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinMyGateTransactions10'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinMyGateTransactions11'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'StateGridFinMyGateTransactions12'
            }  
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});     
        me.callParent(arguments);
    }
});
