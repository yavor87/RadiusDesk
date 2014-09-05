Ext.define('Mikrotik.view.cntStatus', {
    extend: 'Ext.Container',
    xtype: 'cntStatus',
    requires: [
        'Ext.Label',
        'Ext.XTemplate'
    ],
    config: {
        layout	: 'vbox',
        cls		: 'sessionClass'
	},
	inclUsage	: false,
	constructor	: function(config) {
        var me 			= this;
		if(config.jsonData.settings.usage_show_check != undefined){
			me.inclUsage = config.jsonData.settings.usage_show_check;
		}

		var stats =  {
			xtype 	: 'container',
			layout 	: 'hbox',
			items	: [
				{ xtype : 'spacer', flex: 1 },
				{
					itemId: 'cntSession',
					tpl: [
                        '<div class="rdWrapper">',
                        '<div><div class="item">Username</div><div class="value">{username}</div></div>',
                        '<div class="alternate"><div class="item">Session Time</div><div class="value">{uptime}</div></div>',
                        '<div><div class="item">Data in</div><div class="value">{bytes_in_nice}</div></div>',
                        '<div class="alternate"><div class="item">Data out</div><div class="value">{bytes_out_nice}</div></div>',
                        '</div>'
                    ],
                    data : {'username': '', 'uptime': 50,'bytes_in_nice': 100, 'bytes_out_nice' : 200 },
					xtype: 'container'
				},
				{ xtype : 'spacer', flex: 1 }
			],
			flex	: 1
		};

		if(me.inclUsage == true){

			stats = {
				xtype			: 'tabpanel',
				tabBarPosition	: 'top',
				itemId			: 'tpStatus',
				ui				: 'neutral',
				defaults		: {
					styleHtmlContent	: true
				},
				tabBar			: {
				    layout: {
				        type: 'hbox',
				        align: 'center',
				        pack: 'center'
				    }
				},
				items: [
					{
						title	: 'Session',
						xtype   : 'container',
						itemId	: 'sessionTab',
            			layout  : 'hbox',
						items	: [
							{ xtype     : 'spacer', flex: 1 },
				            {
				                itemId: 'cntSession',
				                tpl: [
				                        '<div class="rdWrapper">',
				                        '<div><div class="item">Username</div><div class="value">{username}</div></div>',
				                        '<div class="alternate"><div class="item">Session Time</div><div class="value">{uptime}</div></div>',
				                        '<div><div class="item">Data in</div><div class="value">{bytes_in_nice}</div></div>',
				                        '<div class="alternate"><div class="item">Data out</div><div class="value">{bytes_out_nice}</div></div>',
				                        '</div>'
				                ],
				                data : {'username': '', 'uptime': 50,'bytes_in_nice': 100, 'bytes_out_nice' : 200 },
				                xtype:  'container'
				            },
				            { xtype     : 'spacer', flex: 1 }
						],
						flex: 1
					},
					{
						title	: 'Usage',
						itemId	: 'usageTab',
						xtype	: 'container',
						layout  : 'hbox',
						items	: [
							{ xtype     : 'spacer', flex: 1 },
				            {
				                itemId: 'cntUsage',
				                tpl: [
				                        '<div class="rdWrapper">',
				                        '<div><div class="item">Data used</div><div class="value">{data_used}</div></div>',
				                        '<div class="alternate"><div class="item">Data available</div><div class="value">{data_avail}</div></div>',
				                        '<div><div class="item">Time used</div><div class="value">{time_used}</div></div>',
				                        '<div class="alternate"><div class="item">Time available</div><div class="value">{time_avail}</div></div>',
				                        '</div>' 
				                ],
				                data : {'data_used': 'N/A','data_avail': 'N/A', 'time_used' : 'N/A', 'time_avail': 'N/A'},
				                xtype:  'container'
				            },
				            { xtype     : 'spacer', flex: 1 }
						],
						flex: 1
					}
				],
				flex		: 1
            };
		}

        config.items	= [
            stats,
            {
                xtype       : 'button',
                text        : 'Go onto Internet',
                ui          : 'confirm',
                itemId      : 'btnGoInternet'
            },
            {

                xtype       : 'container',
                layout      : 'hbox',
                items: [
                    { xtype     : 'spacer', flex: 1 },
                    {
                        html    : 'OR',
                        xtype   : 'label'
                    },
                    { xtype     : 'spacer', flex: 1 }
                ]
            },
            {
                xtype       : 'button',
                text        : 'Disconnect',
                ui          : 'decline',
                itemId      : 'btnDisconnect'
            },
			{
				itemId  : 'lblStatusTimer',
				xtype   : 'label',
				tpl     : 'Refresh in <span style="color:blue;">{sec}</span> seconds',
				data    : {'sec': 0},
				cls     : 'rdStatusTimer'
			}, 
			{
				itemId  : 'lblUsageTimer',
				xtype   : 'label',
				tpl     : 'Refresh in <span style="color:blue;">{sec}</span> seconds',
				data    : {'sec': 0},
				cls     : 'rdStatusTimer',
				hidden	: true
			}   
        ];
		me.callParent([config]);           
    }
});
