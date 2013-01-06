Ext.define('Rd.view.realms.gridNas' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridNas',
    store : 'sNas',
    stateful: true,
    stateId: 'StateGridNas',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu: '/cake2/rd_cake/nas/menu_for_grid.json',
    columns: [
        {xtype: 'rownumberer'},
        { text: 'IP Address',   dataIndex: 'nasname',      tdCls: 'gridTree', flex: 1},
        { text: 'Name',         dataIndex: 'shortname',    tdCls: 'gridTree', flex: 1},
        { text: 'Owner',        dataIndex: 'owner',        tdCls: 'gridTree', flex: 1},
        { 
            text:   'Available to sub-providers',
            flex: 1,  
            xtype:  'templatecolumn', 
            tpl:    new Ext.XTemplate(
                        "<tpl if='available_to_siblings == true'><div class=\"hasRight\">Yes</div></tpl>",
                        "<tpl if='available_to_siblings == false'><div class=\"noRight\">No</div></tpl>"
                    )
        },
        { 
            text:   'Realms',
            flex: 1,  
            xtype:  'templatecolumn', 
            tpl:    new Ext.XTemplate(
                        '<tpl if="Ext.isEmpty(realms)"><div class=\"gridRealm availAll\">Available to all!</div></tpl>', //Warn them when available to all
                        '<tpl for="realms">',     // interrogate the realms property within the data
                            "<tpl if='available_to_siblings == true'><div class=\"gridRealm hasRight\">{name}</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"gridRealm noRight\">{name}</div></tpl>",
                        '</tpl>'
                    )
        }     
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me  = this;
        me.tbar = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.callParent(arguments);
    }
});
