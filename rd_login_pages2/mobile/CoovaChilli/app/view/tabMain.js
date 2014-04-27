Ext.define('CoovaChilli.view.tabMain', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'CoovaChilli.view.frmConnect',
        'CoovaChilli.view.cntStatus',
        'CoovaChilli.view.cntNotHotspot',
        'CoovaChilli.view.cntPhotos',
        'CoovaChilli.view.cntAbout'
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

        config.items = [
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
                        scrollable  : true
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
            }, 
            {
                title   : 'Online shop',
                xtype   : 'container',
                iconCls : 'compose',
                layout  : 'hbox',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                }, 
                items: [
                    { xtype     : 'spacer', flex: 1 },
                    {
                   /*    html  : [
                                '<div class="rdWrapper">'+
                                "<h2>Your Payment gateway here!</h2>"+
                                "<div class='imgAbout'><img src='resources/images/paypal.png' /></div>"+
                                "<div class='rdDescription'>"+
                                "For custom payment gateway integration contact the developers of <b>RADIUSdesk</b><br>"+
                                "<a href='http://www.radiusdesk.com/getting_started/contact_us' target='_blank'>"+
                                "http://www.radiusdesk.com/getting_started/contact_us</a>"+
                                "</div></div>"
                        ], */
                        html    : [
                            '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">'+
                            '<input type="hidden" name="cmd" value="_s-xclick">',
                            '<input type="hidden" name="hosted_button_id" value="W6C72N2CRB748">'+
                            '<table>'+
                            '<tr><td><input type="hidden" name="on0" value="Options">Options</td></tr><tr><td><select name="os0">'+
                                '<option value="+ CoovaChilli">+ CoovaChilli $7.50 USD</option>'+
                                '<option value="+ OpenVPN">+ OpenVPN $8.00 USD</option>'+
                                '<option value="+ PPTP">+ PPTP $9.00 USD</option>'+
                            '</select> </td></tr>'+
                            '</table>'+
                            '<input type="hidden" name="currency_code" value="USD">'+
                            '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">'+
                           ' <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">'+
                        '</form>'
                        ],
                        xtype:  'container'
                    },
                    { xtype     : 'spacer', flex: 1 }
                ]
            }
        ];

        me.callParent([config]);
    }
});
