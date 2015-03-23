Ext.define('Mikrotik.view.Land' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.land',
    layout: {
        type    : 'vbox',
        align   : 'stretch'
    },
    border: false,
    margins: '0 0 0 0',
    requires: [
        'Mikrotik.view.pnlConnect',
        'Mikrotik.view.pnlStatus',
        'Mikrotik.view.pnlNotHotspot',
        'Ext.XTemplate',
        'Ext.view.View',
        'Ext.data.Store',
        'Mikrotik.view.pnlPhotos',
        'Mikrotik.view.pnlAbout',
        'Mikrotik.view.pnlPayAd',
		'Mikrotik.view.winNewUser',
		'Mikrotik.view.winLostPassword',
		'Mikrotik.view.winCreditCard'
    ],
    initComponent: function() { 
        var me      = this;
        //Help string
        var html_string = '';
        Ext.Array.forEach(me.jsonData.pages,function(item,index,arr){
            html_string =  html_string+"<h2>"+item.name+"</h2>"+item.content+"<br>";

        },me);

        me.items    = [
/*
            {       
                height      : 90,
                bodyStyle   :{"background-color":"#2a2a2a"}, 
                layout  : {
                    type    : 'hbox',
                    pack    : 'center'
                }, 
                items   : { xtype: 'image', src: 'resources/images/logo.png', 'height': 90 } 
            },
*/

            {       
                height  : 75,
				cls		: 'pnlBanner', 
                layout  : {
                    type    : 'fit'
                }
            },
            {
                layout  : {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                flex    : 1,
                items   :   [
                    {
                        title               : 'Connecting', 
                        xtype               : 'panel',
                        width               : 300,
                        border              : true,
                        collapsible         : true,
                        collapseDirection   : 'left',
                        glyph               : Mikrotik.config.icnConnect,
                        items       :   [
                            {
                                xtype       : 'pnlConnect',
                                itemId      : 'pnlConnect',
                                hidden      : true,
                                jsonData    : me.jsonData
                            },
                            {   
                                xtype       : 'pnlStatus',
                                itemId      : 'pnlStatus',
                                hidden      : true,
								jsonData    : me.jsonData
                            },
                            {   
                                xtype       : 'pnlNotHotspot',
                                itemId      : 'pnlNotHotspot',
                                hidden      : true
                            }
                        ]
                    },
                    {
                        xtype               : 'panel',
                        flex                : 1,
                        border              : true,
                        xtype               : 'pnlPhotos',
                        layout              : {
                            type    : 'vbox',
                            align   : 'stretch'
                        },
                        jsonData            : me.jsonData
                    },
                    { 
                        title               : 'Options', 
                        xtype               : 'tabpanel',
                        //resizable           : true,
                        width               : 300,
                        collapsible         : true,
                        collapseDirection   : 'left',
                        border              : true,
                        glyph               : Mikrotik.config.icnOptions,
                        items               : [
                            {
                                title       : 'About',
                                glyph       : Mikrotik.config.icnInfo,
                                xtype       : 'pnlAbout',
                                data        : me.jsonData.detail,
                                autoScroll  : true
                            },
                            {
                                title       : 'Help',
                                glyph       : Mikrotik.config.icnHelp,
                                html        : html_string,
                                autoScroll  : true
                            }
                          /* ,{
                                title       : 'Online shop',
                                glyph       : Mikrotik.config.icnShop,
                                itemId      : 'pnlShop',
                                xtype       : 'pnlPayAd'
                            } */
                        ]
                    }
                ]
            }
        ];
        me.callParent(); 
    }
});
