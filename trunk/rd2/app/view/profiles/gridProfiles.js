Ext.define('Rd.view.profiles.gridProfiles' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridProfiles',
    multiSelect: true,
    store : 'sProfiles',
    stateful: true,
    stateId: 'StateGridProfiles',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/profiles/menu_for_grid.json',
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
            {xtype: 'rownumberer',stateId: 'StateGridProfiles1'},
            { text: i18n('sOwner'),        dataIndex: 'owner', tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridProfiles2'},
            { text: i18n('sName'),         dataIndex: 'name',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridProfiles3'},
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
                },stateId: 'StateGridProfiles4'
            },
            { 
                text:   i18n('sProfile_components'),
                sortable: false,
                flex: 1,  
                xtype:  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            '<tpl if="Ext.isEmpty(profile_components)"><div"></div></tpl>', //Warn them when available to all
                            '<tpl for="profile_components">',     // interrogate the profile_components property within the data
                                "<div class=\"gridTag\">{groupname}({priority})</div>",
                            '</tpl>'
                        ),
                dataIndex: 'profile_components',stateId: 'StateGridProfiles5'
            },
            { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes',stateId: 'StateGridProfiles6'
            }      
        ];

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg: i18n('sConnecting')+" ...."});
        
        me.callParent(arguments);
    }
});
