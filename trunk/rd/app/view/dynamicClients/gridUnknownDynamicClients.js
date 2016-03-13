Ext.define('Rd.view.dynamicClients.gridUnknownDynamicClients' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridUnknownDynamicClients',
    multiSelect	: true,
    stateful	: true,
    stateId		: 'StateGridUdc',
    stateEvents	:['groupclick','columnhide'],
    border		: false,
	store		: 'sUnknownDynamicClients',
    requires	: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig  : {
        loadMask    :true
    },
    urlMenu     : '/cake2/rd_cake/unknown_dynamic_clients/menu_for_grid.json',
    plugins     : 'gridfilters',  //*We specify this
    initComponent: function(){
        var me      = this;
        
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
 			{xtype: 'rownumberer',stateId: 'StateGridUdc1'},
            { 
				text		: i18n('sNAS-Identifier'),      
				dataIndex	: 'nasidentifier',     
				tdCls		: 'gridTree', 
				flex		: 1,
				filter		: {type: 'string'},
				stateId		: 'StateGridUdc2'
			},
			{ 
				text		: 'Called-Station-Id',      
				dataIndex	: 'calledstationid',     
				tdCls		: 'gridTree', 
				flex		: 1,
				filter		: {type: 'string'},
				stateId		: 'StateGridUdc3'
			},
			{ 
                text        : 'Last Contact',   
                dataIndex   : 'last_contact',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(v,metaData, record){
                    var last_contact_human     = record.get('last_contact_human');
                    return "<div class=\"fieldBlueWhite\">"+last_contact_human+"</div>";     
                },stateId: 'StateGridUdc4'
            },
			{ 

                text        : 'From IP', 
                dataIndex   : 'last_contact_ip',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false, 
                xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '<div class=\"fieldGreyWhite\">{last_contact_ip}</div>',
                    "<tpl if='Ext.isEmpty(city)'><tpl else>",
                        '<div><b>{city}</b>  ({postal_code})</div>',
                    "</tpl>",
                    "<tpl if='Ext.isEmpty(country_name)'><tpl else>",
                        '<div><b>{country_name}</b> ({country_code})</div>',
                    "</tpl>"   
                ), 
                filter		: {type: 'string'},stateId: 'StateGridUdc5'
            }
        ];
        me.callParent(arguments);
    }
});
