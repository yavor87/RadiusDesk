Ext.define('Rd.view.finAuthorizeNetTransactions.gridAuthorizeNetTransactions' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridAuthorizeNetTransactions',
    multiSelect	: true,
    store 		: 'sFinAuthorizeNetTransactions',
    stateful	: true,
    stateId		: 'StateGridAuthorizeNetTransactions',
    stateEvents	:['groupclick','columnhide'],
    border		: true,
    requires	: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig	: {
        loadMask:true
    },
    urlMenu		: '/cake2/rd_cake/fin_authorize_net_transactions/menu_for_grid.json',
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
            { xtype: 'rownumberer',stateId: 'SGANT1'},
            { 

                text        :'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'SGANT2'
            },
            { 

                text        :'Voucher', 
                dataIndex   : 'voucher_name',          
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT3'
            },
            { 

                text        : 'Description', 
                dataIndex   : 'description',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT4'
            },

/*Start Transaction Specifics */
			{ 

                text        : 'Transaction id', 
                dataIndex   : 'x_trans_id',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANTa'
            },
			{ 

                text        : 'Response code', 
                dataIndex   : 'x_response_code',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT5'
            },
			{ 

                text        : 'Card type', 
                dataIndex   : 'x_card_type',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT6'
            },
			{ 

                text        : 'Account number', 
                dataIndex   : 'x_account_number',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT7'
            },
			{ 

                text        : 'First name', 
                dataIndex   : 'x_first_name',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT8'
            },
			{ 

                text        : 'Last name', 
                dataIndex   : 'x_last_name',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT9'
            },
			{ 

                text        : 'Company', 
                dataIndex   : 'x_company',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT10'
            },
			{ 

                text        : 'Address', 
                dataIndex   : 'x_address',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT11'
            },
			{ 

                text        : 'City', 
                dataIndex   : 'x_city',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT12'
            },
			{ 

                text        : 'State', 
                dataIndex   : 'x_state',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT13'
            },
			{ 

                text        : 'Country', 
                dataIndex   : 'x_country',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT14'
            },
			{ 

                text        : 'Phone', 
                dataIndex   : 'x_phone',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT15'
            },
			{ 

                text        : 'email', 
                dataIndex   : 'x_email',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT16'
            },
			{ 

                text        : 'Amount', 
                dataIndex   : 'x_amount',          
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT17'
            },
			{ 

                text        : 'Catalog link id', 
                dataIndex   : 'x_catalog_link_id',          
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                filter      : {type: 'string'},
                stateId     : 'SGANT18'
            },
/*End Transaction Specifics */

            { 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'SGANT19'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'SGANT20'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'SGANT21'
            }  
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});     
        me.callParent(arguments);
    }
});
