Ext.define('MikrotikLogin.view.winStatus', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winStatus',
    closable    : true,
    draggable   : false,
    resizable   : false,
    width       : 350,
    height      : 350,
    plain       : true,
    border      : false,
    iconCls     : 'connect',
    title       : 'Connected',
    inclUsage   : false, //Adjust this one to include or exclude Usage tab
    requires    : ['Ext.tab.Panel','Ext.tab.Bar','Ext.tab.Tab','Ext.ProgressBar'],
    bodyStyle   : 'padding: 4px;',
    layout: {
        type    : 'vbox',
        align   : 'stretch',
        pack    : 'start'
    },
    initComponent: function() {

        var me = this;
        var pbWidth = 370;

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
            defaults: {'margin':'10px'},
            items:  [pTime,pbTime,pData,pbData],
            itemId: 'usageTab', 
            title:  'Usage'
        });


        //Session section
        var tSession = Ext.create('Ext.panel.Panel',{ 
            title: 'Session Detail',
            itemId: 'sessionTab',
            bodyCls: 'sessionClass',
            defaults: {'margin':'10px'},
            tpl: Ext.create('Ext.XTemplate', [
                '<div><div class="item">Username</div><div class="value">{username}</div></div>'+
                '<div class="alternate"><div class="item">Session Time</div><div class="value">{uptime}</div></div>'+
                '<div><div class="item">Data in</div><div class="value">{bytes_in_nice}</div></div>'+
                '<div class="alternate"><div class="item">Data out</div><div class="value">{bytes_out_nice}</div></div>'
            ]) 
        });

        if(this.inclUsage){
            var i = [tUsage, tSession];
        }else{
            var i = [tSession];
        }

        this.items = [     
        {
            xtype       : 'tabpanel',
            activeTab   : 0,
            plain       : true,
            flex        :1,
            items       : i,
            frame       : true
        },
        {
            xtype       : 'button',
            text        : 'Go onto Internet',
            margin      : '5 0 5 0',
            href        : "http://google.com",
            hrefTarget  : "_blank",
            scale       : 'medium',
            cls         : 'topButton'
        },
        {
            xtype       :  'component',
            html        :   '<div>OR</div>',
            baseCls     : 'cntrOR',
            cls         : 'cntrOR'
        },
        {
            xtype       : 'button',
            text        : 'Disconnect',
            itemId      : 'btnDisconnect',
            margin      : '5 0 5 0',
            scale       : 'medium',
            cls         : 'topButton'
        }
        ];

        this. bbar = [
                { 
                    xtype   : 'tbtext', 
                    itemId  : 'refreshMessage', 
                    text    : 'Refreshing in .....'
                }
        ];

        this.callParent(arguments);
    }
});
