Ext.define('Rd.view.finPaypalTransactions.gridPaypalTransactions' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridPaypalTransactions',
    multiSelect: true,
    store : 'sFinPaypalTransactions',
    stateful: true,
    stateId: 'StateGridPaypalTransactions',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/profile_components/menu_for_grid.json',
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
            {xtype: 'rownumberer',stateId: 'StateGridPaypalTransactions1'}
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});
        
        me.callParent(arguments);
    }
});
