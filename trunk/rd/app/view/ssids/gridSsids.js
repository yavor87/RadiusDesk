Ext.define('Rd.view.ssids.gridSsids' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridSsids',
    multiSelect: true,
    store : 'sSids',
    stateful: true,
    stateId: 'StateGridSsids',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/ssids/menu_for_grid.json',
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
            {xtype: 'rownumberer',stateId: 'StateGridSsids1'},
            { text: i18n('sOwner'),        dataIndex: 'owner', tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridSsids2'},
            { text: i18n('sName'),         dataIndex: 'name',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridSsids3'},
            { 
                text:   i18n('sAvailable_to_sub_providers'),
                flex: 1,  
                xtype:  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            "<tpl if='available_to_siblings == true'><div class=\"hasRight\">"+i18n("sYes")+"</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"noRight\">"+i18n("sNo")+"</div></tpl>"
                        ),
                dataIndex: 'available_to_siblings',
                filter  : {
                    type: 'boolean'    
                },stateId: 'StateGridSsids4'
            },
			{ text: 'Extra name',  dataIndex: 'extra_name',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridSsids5'},
			{ text: 'Extra value', dataIndex: 'extra_value', tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridSsids6'}
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});
        
        me.callParent(arguments);
    }
});
