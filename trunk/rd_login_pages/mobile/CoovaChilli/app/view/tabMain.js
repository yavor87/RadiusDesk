Ext.define('CoovaChilli.view.tabMain', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'CoovaChilli.view.frmConnect',
        'CoovaChilli.view.cntStatus',
        'CoovaChilli.view.cntNotHotspot',
        'CoovaChilli.view.cntPhotos',
        'CoovaChilli.view.cntAbout',
        'CoovaChilli.view.cntPayAd',
        'CoovaChilli.view.cntPayPal',
        'CoovaChilli.view.frmPayU',
		'CoovaChilli.view.navNewUser',
		'CoovaChilli.view.navLostPassword'
    ],
    config: {
        tabBar : {
            docked  : 'top',
            centered: 'true',
            ui      : 'light'
        },
        listeners: {
                activate: function (panel) {                   
                    var inner = Ext.select('.x-tabbar-inner', panel.element.dom).first().dom;
                    inner.className = inner.className.replace('x-pack-start', 'x-pack-center');
                    var dom = Ext.select('.x-docked-top', panel.element.dom).first().dom;
                    dom.className = dom.className.replace('x-docked-top', 'x-docked-bottom');  
                }
        }
    },
    constructor: function(config) {
        var me          = this;
        var html_string = '';
        Ext.Array.forEach(config.jsonData.pages,function(item,index,arr){
            html_string =  html_string+"<h2>"+item.name+"</h2>"+item.content+"<br>";

        },me);

        var i = [
            {
                title       : 'Connect',
                iconCls     : 'star',
                layout      : 'fit',
                items       :   [
                    {
                        xtype       : 'frmConnect',
                        itemId      : 'frmConnect',
                        scrollable  : false,
                        itemId      : 'frmConnect',
                        hidden      : true,
                        jsonData    : config.jsonData
                    },
                    {   
                        xtype       : 'cntStatus',
                        itemId      : 'cntStatus',
                        hidden      : true,
                        scrollable  : true,
						jsonData    : config.jsonData
                    },
                    {   
                        xtype       : 'cntNotHotspot',
                        itemId      : 'cntNotHotspot',
                        hidden      : true
                    }
                ]    
            },
            {
                title   : 'Help',
                iconCls : 'locate',
                layout  : 'hbox',
                scrollable  : true,
                items   : [
                    { xtype     : 'spacer', flex: 1 },
                    {
                        xtype           : 'container',
                        cls             : 'rdHelp',
                        padding         : 20,
                        styleHtmlContent: true,
                        html            : html_string  
                    },
                    { xtype     : 'spacer', flex: 1 }
                ]
            },
          /*  {
                title       : 'Event App',
                iconCls     : 'home',
                cls         : 'lastPurchase',
                html        : [
                    '<h3>Visit the Event App now!</h3>'+
                    '<a href="http://show.rfid.com" target="_blank">show.rfid.com</a>'
                ]
            },*/
            {
                title       : 'Gallery',
                iconCls     : 'team',
                xtype       : 'cntPhotos',
                jsonData    : config.jsonData,
                itemId      : 'cntPhotos'
            },
            {
                title       : 'About',
                iconCls     : 'info',
                xtype       : 'cntAbout',
                jsonData    : config.jsonData,
                itemId      : 'cntAbout',
                layout      : 'fit',
                scrollable  : false         
            }/* 
            ,{
                title       : 'Online shop',
                xtype       : 'container',
                itemId      : 'cntShop',
                iconCls     : 'compose',
                layout      : 'hbox',
                scrollable: {
                    direction       : 'vertical',
                    directionLock   : true
                },
                items: [
                    { xtype : 'spacer', flex: 1 },
                    {
                    //xtype : 'cntPayPal'
                        xtype : config.paymentScreen
                    },
                    { xtype : 'spacer', flex: 1 }
                ]
            } */
          /* {
                title   : 'Online shop',
                itemId  : 'cntShop',
                iconCls : 'compose',
                layout      : 'fit',
                items: [
                   {
                        xtype       : 'cntPayAd',
                        itemId      : 'cntPayAd',
                        scrollable  : false
                   }
                ]
            }*/
        ];

		
		if(config.jsonData.settings.register_users){
			i = Ext.Array.merge(i, [
				{
					title		: 'New user',
					xtype		: 'navNewUser',
					iconCls     : 'add',
					itemId		: 'navNewUser'
				}
			]);
		}

		if(config.jsonData.settings.lost_password){
			i = Ext.Array.merge(i, [
				{
					title		: 'Lost password',
					xtype		: 'navLostPassword',
					iconCls     : 'reply',
					itemId		: 'navLostPassword'
				}
			]);
		}

        config.items = i;

        me.callParent([config]);
    }
});
