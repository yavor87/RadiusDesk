Ext.define('Rd.view.finMyGateTransactions.gridFinMyGateTokenFailures' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridFinMyGateTokenFailures',
    multiSelect	: true,
    stateful	: true,
    stateId		: 'StateGridFinMyGateTokenFailures',
    stateEvents	:['groupclick','columnhide'],
    border		: true,
    viewConfig	: {
        loadMask:true
    },
	tbar: [
        
        { xtype: 'buttongroup', title: i18n('sAction'), items : [
            { xtype: 'button',  iconCls: 'b-reload',    glyph: Rd.config.icnReload ,scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},   
            { xtype: 'button',  iconCls: 'b-delete',    glyph: Rd.config.icnDelete, scale: 'large', itemId: 'delete',   tooltip:    i18n('sDelete')}
        ]}    
    ],
    initComponent: function(){
        var me      = this;

		//===== We rather include the model and store here and save a round trip

		 Ext.define('mFinMyGateTokenFailure', {
			 extend: 'Ext.data.Model',
			 fields: [
					{name: 'id',           			type: 'int'     },
					{name: 'user',         			type: 'string'  },
					{name: 'user_id',      			type: 'int'     },
					{name: 'permanent_user',        type: 'string'  },
					{name: 'permanent_user_id', 	type: 'int'     },
					{name: 'fin_payment_plan',      type: 'string'  },
					{name: 'fin_payment_plan_id', 	type: 'int'     },
					{name: 'error_code',         	type: 'string'  },
					{name: 'active',       			type: 'bool'    },       
					{name: 'created',      			type: 'date',       dateFormat: 'Y-m-d H:i:s'   },
					{name: 'modified',     			type: 'date',       dateFormat: 'Y-m-d H:i:s'   }
				]
		 });

		 var myStore = Ext.create('Ext.data.Store', {
			 model: 'mFinMyGateTokenFailure',
			 proxy: {
				type    	: 'ajax',
            	format  	: 'json',
            	batchActions: true, 
            	url     : '/cake2/rd_cake/fin_my_gate_tokens/index_failures.json',
            	reader: {
                	type			: 'json',
                	root			: 'items',
                	messageProperty	: 'message',
                	totalProperty	: 'totalCount' //Required for dynamic paging
            	},
            	simpleSortMode		: true //This will only sort on one column (sort) and a direction(dir) value ASC or DESC
			 },
			 autoLoad: true
		 });

		me.store 	= myStore;

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
        //me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.features = [filters];

        me.columns  = [
            { xtype: 'rownumberer',stateId: 'StateGridFinMyGateTokenF1'},
			{ 

                text        : 'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                width   	: 140,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokenF2'
            },
			{ 

                text        : 'Permanet User', 
                dataIndex   : 'permanent_user',          
                tdCls       : 'gridTree', 
                width   	: 140,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokenF3'
            },
			{ 

                text        : 'Payment Plan', 
                dataIndex   : 'fin_payment_plan',          
                tdCls       : 'gridTree', 
                width   	: 140,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokenF4'
            },
			{ 

                text        : 'Error detail', 
                dataIndex   : 'error_code',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokenF5'
            },
			{ 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : false, 
                width   	: 140,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinMyGateTokenF6'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                width   	: 140,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinMyGateTokenF7'
            }
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});     
        me.callParent(arguments);
    }
});
