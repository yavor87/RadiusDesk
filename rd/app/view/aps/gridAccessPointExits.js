Ext.define('Rd.view.aps.gridAccessPointExits' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridAccessPointExits',
    multiSelect : true,
    stateful    : true,
    stateId     : 'StateGridAccessPointExitsId',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    requires    : [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig  : {
        loadMask:true
    },
    urlMenu     : '/cake2/rd_cake/ap_profiles/menu_for_exits_grid.json',
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create(Rd.store.sAccessPointExits,{});
        me.store.getProxy().setExtraParam('ap_profile_id',me.apProfileId);
        me.store.load();

        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        
        me.columns  = [
            {xtype: 'rownumberer',stateId: 'StateGridAccessPointExitsId1'},
            { text: i18n("sType"),                 dataIndex: 'type',          tdCls: 'gridMain', flex: 1,stateId: 'StateGridAccessPointExitsId2'},
            { 
                text    :   i18n("sConnects_with"),
                sortable: false,
                flex    : 1,  
                xtype   :  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            '<tpl if="Ext.isEmpty(connects_with)"><div class=\"gridRealm fieldRed\">'+i18n("sNo_one")+'</div></tpl>', //Warn them when available     to all
                            '<tpl for="connects_with">',     // interrogate the realms property within the data
                                "<tpl><div class=\"gridRealm fieldGreen\">{name}</div></tpl>",
                            '</tpl>'
                        ),
                dataIndex: 'connects_with',stateId: 'StateGridAccessPointExitsId3'
            }
        ];
        me.callParent(arguments);
    }
});
