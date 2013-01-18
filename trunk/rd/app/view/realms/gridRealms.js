Ext.define('Rd.view.realms.gridRealms' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridRealms',
    store : 'sRealms',
    stateful: true,
    stateId: 'StateGridRealms',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu: '/cake2/rd_cake/realms/menu_for_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: 'Result count: {count}',   style: 'margin-right:5px', cls: 'lblYfi'  }
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
            {xtype: 'rownumberer'},
            { text: 'Owner',    dataIndex: 'owner',     tdCls: 'gridTree', flex: 1, filter: {type: 'string'}},
            { text: 'Name',     dataIndex: 'name',      tdCls: 'gridTree', flex: 1, filter: {type: 'string'}},
            { text: 'Phone',    dataIndex: 'phone',     tdCls: 'gridTree', flex: 1, filter: {type: 'string'},   hidden: true},
            { text: 'Fax',      dataIndex: 'fax',       tdCls: 'gridTree', flex: 1, filter: {type: 'string'},   hidden: true},
            { text: 'Cell',     dataIndex: 'cell',      tdCls: 'gridTree', flex: 1, filter: {type: 'string'},   hidden: true},
            { text: 'email',    dataIndex: 'email',     tdCls: 'gridTree', flex: 1, filter: {type: 'string'},   hidden: true},
            { text: 'Url',      dataIndex: 'url',       tdCls: 'gridTree', flex: 1, filter: {type: 'string'},   hidden: true},
            { 
                text:   'Available to sub-providers',
                flex: 1,  
                xtype:  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            "<tpl if='available_to_siblings == true'><div class=\"hasRight\">Yes</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"noRight\">No</div></tpl>"
                        ),
                dataIndex: 'available_to_siblings',
                    filter  : {
                        type: 'boolean'    
                }
            },
            { 
                text    : 'Notes',
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">Existing Notes</div></tpl>"
                ),
                dataIndex: 'notes'
            }
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});   

        me.callParent(arguments);
    }
});
