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
            
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});     
        me.callParent(arguments);
    }
});
