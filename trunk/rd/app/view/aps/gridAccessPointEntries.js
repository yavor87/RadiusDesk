Ext.define('Rd.view.aps.gridAccessPointEntries' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridAccessPointEntries',
    multiSelect : true,
    stateful    : true,
    stateId     : 'StateGridAccessPointEntries',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    requires    : [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig  : {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/ap_profiles/menu_for_entries_grid.json',
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create(Rd.store.sAccessPointEntries,{});
        me.store.getProxy().setExtraParam('ap_profile_id',me.apProfileId);
        me.store.load();
        
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        
        me.columns  = [
            {xtype: 'rownumberer', stateId: 'StateGridAccessPointEntries1'},
            { text: i18n("sSSID"),                 dataIndex: 'name',          tdCls: 'gridMain', flex: 1, stateId: 'StateGridAccessPointEntries2'},
            { 
                text        : i18n("sEncryption"),   
                dataIndex   : 'encryption',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(value,metaData, record){
                    if(value == 'none'){                    
                       return i18n("sNone")
                    }
                    if(value == 'wep'){
                        return i18n("sWEP")
                    } 
                    if(value == 'psk'){
                        return i18n("sWPA_Personal")
                    } 
                    if(value == 'psk2'){
                        return i18n("sWPA2_Personal")
                    } 
                    if(value == 'wpa'){
                        return i18n("sWPA_Enterprise")
                    } 
                    if(value == 'wpa2'){
                        return i18n("sWPA2_Enterprise")
                    }             
                }, stateId: 'StateGridAccessPointEntries3'
            },
            { text: i18n("sHidden"),               dataIndex: 'hidden',            tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries4'},
            { text: i18n("sClient_isolation"),     dataIndex: 'isolate',           tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries5'},
            { 
                text        : 'Frequency',   
                dataIndex   : 'frequency_band',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(value,metaData, record){
                    if(value == 'both'){                    
                       return '2.4G and 5G'
                    }
                    if(value == 'two'){
                        return '2.4G'
                    } 
                    if(value == 'five'){
                        return '5G'
                    } 
                           
                }, stateId: 'StateGridAccessPointEntries6'
            },
            { text: 'WPA Personal Key', hidden: true,dataIndex: 'key',          tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries7'},
            { text: 'RADIUS Server',    hidden: true,dataIndex: 'auth_server',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries8'},
            { text: 'RADIUS Secret',    hidden: true,dataIndex: 'auth_secret',  tdCls: 'gridTree', flex: 1, stateId: 'StateGridAccessPointEntries9'}
        ];
        me.callParent(arguments);
    }
});
