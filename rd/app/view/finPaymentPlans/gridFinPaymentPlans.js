Ext.define('Rd.view.finPaymentPlans.gridFinPaymentPlans' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridFinPaymentPlans',
    multiSelect	: true,
    store 		: 'sFinPaymentPlans',
    stateful	: true,
    stateId		: 'StateGridFinPaymentPlans',
    stateEvents	:['groupclick','columnhide'],
    border		: true,
    requires	: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig	: {
        loadMask:true
    },
    urlMenu		: '/cake2/rd_cake/fin_payment_plans/menu_for_grid.json',
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
            { xtype: 'rownumberer',stateId: 'StateGridFinPaymentPlans1'},
            { 

                text        : 'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans2'
            },
            { 

                text        : 'Name', 
                dataIndex   : 'name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans3'
            },
            { 

                text        : 'Description', 
                dataIndex   : 'description',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans4'
            },
			{ 

                text        : 'Profile', 
                dataIndex   : 'profile',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans4'
            },
            { 

                text        : 'Type', 
                dataIndex   : 'type',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans5'
            },
			{ 

                text        : 'Currency', 
                dataIndex   : 'currency_code',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans6'
            },
			{ 

                text        : 'Value', 
                dataIndex   : 'value',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans7'
            },
			{ 

                text        : 'Tax', 
                dataIndex   : 'tax',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'StateGridFinPaymentPlans8'
            },
			{ 
                text        : i18n('sActive'),  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='active == true'><div class=\"hasRight\">"+i18n("sYes")+"</div></tpl>",
                                "<tpl if='active == false'><div class=\"noRight\">"+i18n("sNo")+"</div></tpl>"
                            ),
                dataIndex   : 'active',
                filter      : { type: 'boolean'},stateId: 'StateGridFinPaymentPlans9'
            },
            { 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinPaymentPlans10'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      : 'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridFinPaymentPlans11'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'StateGridFinPaymentPlans12'
            }  
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});     
        me.callParent(arguments);
    }
});
