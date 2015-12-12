Ext.define('Rd.view.finMyGateTransactions.gridFinMyGateTokens' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridFinMyGateTokens',
    multiSelect	: true,
    store 		: 'sFinMyGateTokens',
    stateful	: true,
    stateId		: 'StateGridFinMyGateTokens',
    stateEvents	:['groupclick','columnhide'],
    border		: true,
    requires	: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig	: {
        loadMask:true
    },
    urlMenu		: '/cake2/rd_cake/fin_my_gate_tokens/menu_for_grid.json',
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
            { xtype: 'rownumberer',stateId: 'StateGridFinMyGateTokens1'},
			{ 

                text        : 'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens2'
            },
			{ 

                text        : 'Permanet User', 
                dataIndex   : 'permanent_user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens3'
            },
			{ 

                text        : 'Payment Plan', 
                dataIndex   : 'fin_payment_plan',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens4'
            },
			{ 

                text        : 'Client Pin', 
                dataIndex   : 'client_pin',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens5'
            },
			{ 

                text        : 'Client Uci', 
                dataIndex   : 'client_uci',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens6'
            },
			{ 

                text        : 'Client Uid', 
                dataIndex   : 'client_uid',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens7'
            },
			{ 

                text        : 'Override', 
                dataIndex   : 'override',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinMyGateTokens8'
            },
			{ 

                text        : 'Override Completed', 
				width   	: 140,
                dataIndex   : 'override_completed',          
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='override_completed == true'><div class=\"hasRight\">"+i18n("sYes")+"</div></tpl>",
                                "<tpl if='override_completed == false'><div class=\"noRight\">"+i18n("sNo")+"</div></tpl>"
                            ),
                filter      : { type: 'boolean'},stateId: 'StateGridFinMyGateTokens9'
            },
			{ 

                text        : 'Active', 
                dataIndex   : 'active',          
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='active == true'><div class=\"hasRight\">"+i18n("sYes")+"</div></tpl>",
                                "<tpl if='active == false'><div class=\"noRight\">"+i18n("sNo")+"</div></tpl>"
                            ),
                filter      : { type: 'boolean'},stateId: 'StateGridFinMyGateTokens10'
            },
			{ 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinMyGateTokens11'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinMyGateTokens12'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'StateGridFinMyGateTokens13'
            }  
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});     
        me.callParent(arguments);
    }
});
