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
        'CoovaChilli.view.pnlAbout'
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
                height      : 90,
                bodyStyle   :{"background-color":"#2a2a2a"}, 
                layout  : {
                    type    : 'hbox',
                    pack    : 'center'
                }, 
                items   : { xtype: 'image', src: 'resources/images/logo.png', 'height': 90 } 
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
                                hidden      : true
                            },
                            {   
                                xtype       : 'pnlStatus',
                                itemId      : 'pnlStatus',
                                hidden      : true
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
                        glyph               : CoovaChilli.config.icnOptions,
                        items               : [
                            {
                                title       : 'About',
                                glyph       : CoovaChilli.config.icnInfo,
                                xtype       : 'pnlAbout',
                                data        : me.jsonData.detail,
                                autoScroll  : true
                            },
                            {
                                title       : 'Help',
                                glyph       : CoovaChilli.config.icnHelp,
                                html        : html_string,
                                autoScroll  : true
                            },
                            {
                                title       : 'Online shop',
                                glyph       : CoovaChilli.config.icnShop,
                                html        : [
                                    "<div class='rdCenter'>",
                                    "<h2>Your Payment gateway here!</h2>",
                                    "<div class='imgAbout'><img src='resources/images/paypal.png' /></div>",
                                    "<div class='rdDescription'>",
                                    "For custom payment gateway integration contact the developers of <b>RADIUSdesk</b><br>",
                                    "<a href='http://www.radiusdesk.com/getting_started/contact_us' target='_blank'>",
                                    "http://www.radiusdesk.com/getting_started/contact_us</a>",
                                    "</div></div>"
                                ]
                            }

                        ]
                    }
                ]
            }
        ];
        me.callParent(); 
    }
});
