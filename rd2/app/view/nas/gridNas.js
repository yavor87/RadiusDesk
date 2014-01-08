Ext.define('Rd.view.nas.gridNas' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridNas',
    store : 'sNas',
    stateful: true,
    multiSelect: true,
    stateId: 'StateGridNas',
    stateEvents:['groupclick','columnhide'],
    viewConfig: {
        preserveScrollOnRefresh: true
    },
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu:        '/cake2/rd_cake/nas/menu_for_grid.json',
    urlTagFilter:   '/cake2/rd_cake/tags/index_for_filter.json',
    urlRealmFilter: '/cake2/rd_cake/realms/index_for_filter.json',
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

        //Unfortunately the ListMenu filter is still buggy when loading it from a store, so we have to give it a manual list taken form a store:
        //http://www.sencha.com/forum/showthread.php?132914-ux.grid.filter.ListFilter-doesn-t-fire-load-on-associated-Store
        //http://stackoverflow.com/questions/6004386/extjs-grid-filters-how-can-i-load-list-filter-options-from-external-json

        var sTags = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mGenericList',
            extend: 'Ext.data.Store',
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : me.urlTagFilter,
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message'
                }
            },
            autoLoad: true
        });

        var sRealms = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mGenericList',
            extend: 'Ext.data.Store',
            proxy: {
                type    : 'ajax',
                format  : 'json',
                batchActions: true, 
                url     : me.urlRealmFilter,
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message'
                }
            },
            autoLoad: true
        });
        
        me.columns = [
            {xtype: 'rownumberer' ,stateId: 'StateGridNas1'},
            { text: i18n('sOwner'),         dataIndex: 'owner',        tdCls: 'gridTree', flex: 1, filter: {type: 'string'},stateId: 'StateGridNas2'},
            { text: i18n('sIP_Address'),    dataIndex: 'nasname',      tdCls: 'gridTree', flex: 1, filter: {type: 'string'},stateId: 'StateGridNas3'},
            { text: i18n('sName'),          dataIndex: 'shortname',    tdCls: 'gridTree', flex: 1, filter: {type: 'string'},stateId: 'StateGridNas4'},
            { text: i18n('sNAS-Identifier'),dataIndex: 'nasidentifier',tdCls: 'gridTree', flex: 1, filter: {type: 'string'}, hidden: true,stateId: 'StateGridNas5'},
            { 
                text        : i18n('sConnection_type'), 
                dataIndex   : 'connection_type',        
                tdCls       :  'gridTree', 
                flex        : 1,
                filter      : {
                                type: 'list',
                                phpMode: false,
                                // options will be used as data to implicitly creates an ArrayStore
                                options: ['direct', 'openvpn', 'pptp', 'dynamic']
                                },stateId: 'StateGridNas6'
            },
            { 
                text    : i18n('sAvailable_to_sub_providers'),
                flex    : 1,  
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                            "<tpl if='available_to_siblings == true'><div class=\"hasRight\">"+i18n('sYes')+"</div></tpl>",
                            "<tpl if='available_to_siblings == false'><div class=\"noRight\">"+i18n('sNo')+"</div></tpl>"
                        ),
                dataIndex: 'available_to_siblings',
                filter  : {
                            type: 'boolean'    
                          },stateId: 'StateGridNas7'
            },
            { 
                text:   i18n('sRealms'),
                sortable: false,
                flex: 1,  
                xtype:  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            '<tpl if="Ext.isEmpty(realms)"><div class=\"gridRealm availAll\">Available to all!</div></tpl>', //Warn them when available     to all
                            '<tpl for="realms">',     // interrogate the realms property within the data
                                "<tpl if='available_to_siblings == true'><div class=\"gridRealm hasRight\">{name}</div></tpl>",
                                "<tpl if='available_to_siblings == false'><div class=\"gridRealm noRight\">{name}</div></tpl>",
                            '</tpl>'
                        ),
                dataIndex: 'realms',
                filter: {
                            type: 'list',
                            phpMode: false,
                            store: sRealms
                        },stateId: 'StateGridNas8'
            },  
            { 
                text:   i18n('sTags'),
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
                            store: sTags
                        },stateId: 'StateGridNas9'
            },
            { 
                text        : i18n("sStatus"),   
                dataIndex   : 'status',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(value,metaData, record){
                    if(value != 'unknown'){                    
                        var online      = record.get('status_time');
                        if(value == 'up'){
                            return "<div class=\"fieldGreen\">"+i18n("sUp")+" "+Ext.ux.secondsToHuman(online)+"</div>";
                        }
                        if(value == 'down'){
                            return "<div class=\"fieldRed\">"+i18n("sDown")+" "+Ext.ux.secondsToHuman(online)+"</div>";
                        }

                    }else{
                        return "<div class=\"fieldBlue\">"+i18n("sUnknown")+"</div>";
                    }              
                },stateId: 'StateGridNas10'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                            "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                        ),
                dataIndex: 'notes',stateId: 'StateGridNas11'
            }     
        ];

         //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});

        me.callParent(arguments);
    }
});
