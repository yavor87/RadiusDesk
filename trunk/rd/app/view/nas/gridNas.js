Ext.define('Rd.view.realms.gridNas' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridNas',
    store : 'sNas',
    stateful: true,
    multiSelect: true,
    stateId: 'StateGridNas',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu: '/cake2/rd_cake/nas/menu_for_grid.json',
    columns: [
        {xtype: 'rownumberer'},
        { text: 'IP Address',   dataIndex: 'nasname',      tdCls: 'gridTree', flex: 1, filter: {type: 'string'}},
        { text: 'Name',         dataIndex: 'shortname',    tdCls: 'gridTree', flex: 1, filter: {type: 'string'}},
        { text: 'Owner',        dataIndex: 'owner',        tdCls: 'gridTree', flex: 1, filter: {type: 'string'}},
        { 
            text        : 'Connection type', 
            dataIndex   : 'connection_type',        
            tdCls       :  'gridTree', 
            flex        : 1,
            filter      : {
                            type: 'list',
                            phpMode: false,
                            // options will be used as data to implicitly creates an ArrayStore
                            options: ['direct', 'openvpn', 'pptp', 'dynamic']
                            }
        },
        { 
            text    : 'Available to sub-providers',
            flex    : 1,  
            xtype   : 'templatecolumn', 
            tpl     : new Ext.XTemplate(
                        "<tpl if='available_to_siblings == true'><div class=\"hasRight\">Yes</div></tpl>",
                        "<tpl if='available_to_siblings == false'><div class=\"noRight\">No</div></tpl>"
                    ),
            dataIndex: 'available_to_siblings',
            filter  : {
                        type: 'boolean'    
                      }
        },
        { 
            text:   'Realms',
            sortable: false,
            flex: 1,  
            xtype:  'templatecolumn', 
            tpl:    new Ext.XTemplate(
                        '<tpl if="Ext.isEmpty(realms)"><div class=\"gridRealm availAll\">Available to all!</div></tpl>', //Warn them when available to all
                        '<tpl for="realms">',     // interrogate the realms property within the data
                            "<tpl if='available_to_siblings == true'><div class=\"gridRealm hasRight\">{name}</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"gridRealm noRight\">{name}</div></tpl>",
                        '</tpl>'
                    ),
            dataIndex: 'realms',
            filter: {
                        type: 'list',
                        phpMode: false,
                        options: ['RootPublic', 'AP Public', 'pptp', 'dynamic']
                    }
        },  
        { 
            text:   'Tags',
            sortable: false,
            flex: 1,  
            xtype:  'templatecolumn', 
            tpl:    new Ext.XTemplate(
                        '<tpl if="Ext.isEmpty(tags)"><div"></div></tpl>', //Warn them when available to all
                        '<tpl for="tags">',     // interrogate the realms property within the data
                            "<tpl if='available_to_siblings == true'><div class=\"gridTag\">{name}</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"gridTag\">{name}</div></tpl>",
                        '</tpl>'
                    ),
            dataIndex: 'tags',
            filter: {
                        type: 'list',
                        phpMode: false,
                        options: ['Home', 'openvpn', 'pptp', 'dynamic']
                    }
        }      
    ],
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
        me.callParent(arguments);
    }
});
