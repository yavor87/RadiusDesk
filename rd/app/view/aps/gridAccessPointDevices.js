Ext.define('Rd.view.aps.gridAccessPointDevices' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridAccessPointDevices',
    multiSelect: true,
    stateful: true,
    stateId: 'StateGAPD',
    stateEvents:['groupclick','columnhide'],
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask:true
    },
    urlMenu: '/cake2/rd_cake/ap_profiles/menu_for_devices_grid.json',
    plugins     : [
        'gridfilters',
        {
            ptype: 'rowexpander',
            rowBodyTpl : new Ext.XTemplate(
                '<div style="color: #3f3e3c;  background-color: #F5BD97; padding: 5px;">',
                '<b>Name:</b> {name}<br>',
                '</div>'
            )
        }
    ],
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create(Rd.store.sAps,{});
        me.store.getProxy().setExtraParam('ap_profile_id',me.apProfileId);
        me.store.load();

        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.bbar     =  [
            {
                 xtype       : 'pagingtoolbar',
                 store       : me.store,
                 dock        : 'bottom',
                 displayInfo : true
            }  
        ];
        me.columns  = [
            {xtype: 'rownumberer',stateId: 'StateGAPD1'},
            { text: i18n("sName"),              dataIndex: 'name',           tdCls: 'gridMain', flex: 1,stateId: 'StateGAPD2'},
            { text: i18n("sDescription"),       dataIndex: 'description',    tdCls: 'gridTree', flex: 1,stateId: 'StateGAPD3'},
            { text: i18n("sMAC_address"),       dataIndex: 'mac',            tdCls: 'gridTree', flex: 1,stateId: 'StateGAPD4'},
            { text: i18n("sHardware"),          dataIndex: 'hardware',       tdCls: 'gridTree', flex: 1,stateId: 'StateGAPD5'},
            { 

                text        : i18n("sLast_contact"), 
                dataIndex   : 'last_contact',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGAPD6'
            },
			{ 

                text        : i18n("sFrom_IP"), 
                dataIndex   : 'last_contact_from_ip',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,  
                filter		: {type: 'string'},stateId: 'StateGAPD7'
            }
        ];
        me.callParent(arguments);
    }
});
