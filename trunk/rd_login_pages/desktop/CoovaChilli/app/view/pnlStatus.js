Ext.define('CoovaChilli.view.pnlStatus', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlStatus',
    border      : false,
    inclUsage   : false, //Adjust this one to include or exclude Usage tab
    requires    : ['Ext.tab.Panel','Ext.tab.Bar','Ext.tab.Tab','Ext.ProgressBar'],
    layout: {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    initComponent: function() {

        var me 		= this;
        var pbWidth = 270;

		//If it is there check and show accordingly
		if(me.jsonData.settings.usage_show_check != undefined){
			me.inclUsage = me.jsonData.settings.usage_show_check;
		}

        //Usage section
            var tplTime = Ext.create('Ext.XTemplate', [ 
                '<div>Time</div><span class="st">Used </span>'+
                '<span class="dyn">{tUsed}</span>'+
                '<span class="st"> Available </span>'+
                '<span class="dyn">{tAvail}</span>'
            ]);
            var pTime   = Ext.create('Ext.panel.Panel', {
                itemId:     'pTime', 
                tpl:        tplTime, 
                border:     false, 
                bodyCls:    'usageClass', 
                data: {tUsed: 0,tAvail: 0} }
            );

            var pbTime  = Ext.create('Ext.ProgressBar', {itemId: 'pbTime',width: pbWidth, value: .0, text: '0%'});

            var tplData = Ext.create('Ext.XTemplate', [ 
                '<div>Data</div><span class="st">Used </span>'+
                '<span class="dyn">{dUsed}</span>'+
                '<span class="st"> Available </span>'+
                '<span class="dyn">{dAvail}</span>'
            ]);

            var pData   = Ext.create('Ext.panel.Panel', {
                itemId: 'pData',  
                tpl: tplData, 
                border: false, 
                bodyCls: 'usageClass',
                data: {dUsed: 0,dAvail: 0}  }
            );

            var pbData  = Ext.create('Ext.ProgressBar', {itemId: 'pbData', width: pbWidth, value: .0, text: '0%'});

        var tUsage = Ext.create('Ext.panel.Panel',{
            defaults	: {'margin':'10px'},
            items		:  [pTime,pbTime,pData,pbData],
            itemId		: 'usageTab', 
            title		:  'Usage',
			bbar		: [
                { 
                    xtype		: 'tbtext', 
                    itemId		: 'refreshUsageMessage', 
                    text		: 'Refreshing in .....'
                }
			]
        });


        //Session section
        var tSession = Ext.create('Ext.panel.Panel',{ 
            title: 'Session Detail',
            itemId: 'sessionTab',
            bodyCls: 'sessionClass',
            tpl: Ext.create('Ext.XTemplate', [
                '<div><div class="item">Idle Time</div><div class="value">{idletime}</div></div>'+
                '<div class="alternate"><div class="item">Session Time</div><div class="value">{sessiontime}</div></div>'+
                '<div><div class="item">Data in</div><div class="value">{data_in}</div></div>'+
                '<div class="alternate"><div class="item">Data out</div><div class="value">{data_out}</div></div>'+
                '<div><div class="item">Data total</div><div class="value">{data_total}</div></div>'
            ]),
			bbar: [
                { 
                    xtype		: 'tbtext', 
                    itemId		: 'refreshMessage', 
                    text		: 'Refreshing in .....'
                }
			]
        });

        if(me.inclUsage){
            var i = [tSession, tUsage];
        }else{
            var i = [tSession];
        }

        me.items = [     
        {
            xtype: 'tabpanel',
            activeTab: 0,
            plain: true,
            flex:1,
            items: i
        },
        {
            xtype       : 'button',
            text        : 'Go onto Internet',
            itemId      : 'btnGoInternet',
            margin      : '5 5 5 5',
            scale       : 'medium',
            cls         : 'topButton',
            componentCls: 'ttt'
        },
        {
            xtype       :  'component',
            html        :  '<div>OR</div>',
            baseCls     : 'cntrOR',
            cls         : 'cntrOR'
        },
        {
            xtype       : 'button',
            text        : 'Disconnect',
            itemId      : 'btnDisconnect',
            margin      : '5 5 5 5',
            scale       : 'medium',
            componentCls: 'ttt'
        }
        ];

        me.callParent(arguments);
    }
});
