Ext.define('CoovaChilli.view.Land' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.land',
    layout: {
        type    : 'vbox',
        align   : 'stretch'
    },
    border: false,
    margins: '0 0 0 0',
    requires: [
        'CoovaChilli.view.pnlConnect',
        'CoovaChilli.view.pnlStatus',
        'CoovaChilli.view.pnlNotHotspot',
        'Ext.XTemplate',
        'Ext.view.View',
        'Ext.data.Store',
        'CoovaChilli.view.pnlPhotos',
        'CoovaChilli.view.pnlAbout',
        'CoovaChilli.view.pnlPayPal',
        'CoovaChilli.view.pnlPayAd',
        'CoovaChilli.view.pnlPayU',
		'CoovaChilli.view.winNewUser',
		'CoovaChilli.view.winLostPassword'
    ],
    initComponent: function() { 
        var me      = this;
        //Help string
        var html_string = '';
        Ext.Array.forEach(me.jsonData.pages,function(item,index,arr){
            html_string =  html_string+"<h2>"+item.name+"</h2>"+item.content+"<br>";

        },me);

        me.items    = [
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
                        glyph               : CoovaChilli.config.icnConnect,
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
                        itemId              : 'tpnlOptions',
                        glyph               : CoovaChilli.config.icnOptions,
                        items               : [
                            {
                                title       : 'About',
                                glyph       : CoovaChilli.config.icnInfo,
                                xtype       : 'pnlAbout',
                                data        : me.jsonData.detail,
                                autoScroll  : true,
                                itemId      : 'pnlAbout'
                            },
                            {
                                title       : 'Help',
                                glyph       : CoovaChilli.config.icnHelp,
                                html        : html_string,
                                autoScroll  : true,
                                itemId      : 'pnlHelp'
                            }
                       /*     {
                                title       : 'Online Shop',
                                glyph       : CoovaChilli.config.icnShop,
                                itemId      : 'pnlShop',
                               // xtype       : 'pnlPayPal'
                                xtype       : 'pnlPayAd'
                               // xtype       : 'pnlPayU'
                            }*/
                        ]
                    }
                ]
            }
        ];
        me.callParent(); 
    }
});
