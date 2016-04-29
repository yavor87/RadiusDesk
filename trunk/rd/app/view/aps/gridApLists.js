Ext.define('Rd.view.aps.gridApLists' ,{
    extend		: 'Ext.grid.Panel',
    alias 		: 'widget.gridApLists',
    multiSelect	: true,
    stateful	: true,
    stateId		: 'StateGridApLists',
    stateEvents	: ['groupclick','columnhide'],
    store       : 'sApLists',
    border		: false,
    requires	: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig  : {
        loadMask:true
    },
    urlMenu     : '/cake2/rd_cake/ap_profiles/menu_for_aps_grid.json', 
    plugins     : [
        'gridfilters',
        {
            ptype: 'rowexpander',
            rowBodyTpl : new Ext.XTemplate(
                '<div style="color:grey;  background-color:white; padding:5px;">',
                '<img src="resources/images/MESHdesk/{hardware}.png" alt="{hardware}" height="72" style="float: left; padding-right: 20px;">',
                '<h2>{name}</h2>',
                '<span>{hw_human}</span>',
                '</div>',
                '<div class="sectionHeader">',
                    '<h2>DEVICE INFORMATION (for the past hour)</h2>',
                '</div>',
                "<div style='background-color:white; padding:5px;'>",
                   '<ul class="fa-ul">',    
                    "<tpl if='state == \"never\"'>",
                    "<li style='color:blue;'><i class='fa-li fa fa-question-circle'></i>Never connected before</li>",
                    "</tpl>",
                    "<tpl if='state == \"down\"'>",
                    "<li style='color:red;'><i class='fa-li fa  fa-exclamation-circle'></i>Offline (last check-in <b>{last_contact_human}</b> ago).</li>",
                    "</tpl>",
                    "<tpl if='state == \"up\"'>",
                    '<li style="color:green;"><i class="fa-li fa fa-check-circle"></i>Online (last check-in <b>{last_contact_human}</b> ago).</li>',
                    "</tpl>",
                    '<tpl for="ssids">',
                        '<li><i class="fa-li fa fa-wifi"></i><b>{name}</b> had <b>{users}</b> users.</li>',
                    '</tpl>',                  
  '<li><i class="fa-li fa fa-info-circle"></i>Public IP <b>{last_contact_from_ip}</b>.</li>',
  '<li><i class="fa-li fa fa-database"></i>Data usage <b>{data_past_hour}</b>.</li>',
  '<li><i class="fa-li fa fa-link"></i>Last connection from <b>{newest_station}</b> which was <b>{newest_time}</b> ({newest_vendor}).</li>',
'</ul>',
                "</div>"
            )
        }
    ],
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
            {xtype: 'rownumberer',stateId: 'StateGridApLists1'},
			{ 
                text        : i18n("sOwner"), 
                dataIndex   : 'owner', 
                tdCls       : 'gridTree', 
                flex        : 1,
                stateId     : 'StateGridApLists2', 
                sortable    : false,
                hidden      : true
            },
			{ text: 'Profile',  dataIndex: 'ap_profile',  tdCls: 'gridTree', flex: 1,filter: {type: 'string'},stateId: 'StateGridApLists3'},
            { text: i18n("sName"),  dataIndex: 'name',  tdCls: 'gridMain', flex: 1,filter: {type: 'string'},stateId: 'StateGridApLists4'},
            { 
				text		: i18n("sDescription"), 
				dataIndex	: 'description',  
				tdCls		: 'gridTree', 
				flex		: 1,
				filter		: {type: 'string'},
				stateId		: 'StateGridApLists5',
				hidden      : true
			},
            { 
				text		: i18n("sMAC_address"),      	
				dataIndex	: 'mac',          
				tdCls		: 'gridTree', 
				flex		: 1,
				filter		: {type: 'string'},
				stateId     : 'StateGridApLists6'
			},
            { 
				text		: i18n("sHardware"),      
				dataIndex	: 'hardware',     
				tdCls		: 'gridTree', 
				flex		: 1,
				filter		: {type: 'string'},
				stateId		: 'StateGridApLists7',
				hidden      : true
			},
			{ 
                text        : i18n("sLast_contact"),   
                dataIndex   : 'last_contact',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(v,metaData, record){
                    var value = record.get('state');
                    if(value != 'never'){                    
                        var last_contact_human     = record.get('last_contact_human');
                        if(value == 'up'){
                            return "<div class=\"fieldGreenWhite\">"+last_contact_human+"</div>";
                        }
                        if(value == 'down'){
                            return "<div class=\"fieldRedWhite\">"+last_contact_human+"</div>";
                        }

                    }else{
                        return "<div class=\"fieldBlue\">Never</div>";
                    }              
                },stateId: 'StateGridApLists8'
            },
            { 

                text        : i18n("sFrom_IP"), 
                dataIndex   : 'last_contact_from_ip',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,  
                filter		: {type: 'string'},stateId: 'StateGridApLists9',
                hidden      : true
            },
            { 
                text    : 'Last command',
                sortable: false,
                flex    : 1,  
                xtype   : 'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            "<tpl if='last_cmd_status == \"\"'><div class=\"fieldBlue\">(nothing)</div></tpl>", 
                            "<tpl if='last_cmd_status == \"awaiting\"'>",
                            "<div class=\"fieldBlue\"><span class=\"fa fa-clock-o fa-lg txtBlue\"><span>   {last_cmd}</div>",
                            "</tpl>",
                            "<tpl if='last_cmd_status == \"fetched\"'>",
                            "<div class=\"fieldGreen\"><span class=\"fa fa-check-circle fa-lg txtGreen\"><span>   {last_cmd}</div>",
                            "</tpl>"
                        ),
                stateId	: 'StateGridApLists9',
				hidden	: false
            }
        ];
        me.callParent(arguments);
    }
});
