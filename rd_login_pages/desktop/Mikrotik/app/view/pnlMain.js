Ext.define('MikrotikLogin.view.pnlMain', {
    extend  : 'Ext.panel.Panel',
    requires: ['Ext.container.ButtonGroup', 'MikrotikLogin.view.pnlAboutMenu'],
    xtype   : 'pnlMain',
    layout: {
        type: 'fit'
    },
    id: 'MainPanel',
    tbar: [
        {
            xtype:'buttongroup',
            items: 
                {
                    html        : 'Click to connect',
                    cls         : 'topButton',             
                    iconCls     : 'b-connect',
                    tooltip     : 'Connect to the Internet',
                    scale       : 'large',
                    itemId      : 'connect'
                }
        },
        {
            xtype:'buttongroup',
            items: 
                {
                    html        : 'Help',
                    cls         : 'topButton',             
                    iconCls     : 'b-help',
                    tooltip     : 'Help',
                    scale       : 'large',
                    itemId      : 'help'
                }
        },
        '->',
        {
            xtype:'buttongroup',
            items: 
                {
                    text        : 'About',
                    cls         : 'topButton',             
                    iconCls     : 'b-info-top',
                    scale       : 'large',
                    itemId      : 'about',
                    menu: {
                            xtype   : 'menu',
                            border  : false,
                            plain   : true,
                            items   : {
                                xtype   : 'pnlAboutMenu',
                                border  : false
                            }
                        }
                }
        }
    ],
    bbar: [
        '->',
        {
            scale       : 'large',
            iconCls     : 'b-prev',
            disabled    : true,
            itemId      : 'btnPrev'
        }, 
        {
            scale       : 'large',
            iconCls     : 'b-next',
            disabled    : true,
            itemId      : 'btnNext'
        }, 
        {
            scale       : 'large',
            iconCls     : 'b-info',
            disabled    : true,
            itemId      : 'btnInfo'
        }
    ],
    initComponent: function() { 
        var me   = this;
        me.items = this.createItems(); 
        me.callParent(); 
    }, 
    createItems: function() {
        return Ext.create('Ext.Img', {src: Ext.BLANK_IMAGE_URL, itemId: 'bgImage'});
    }
});
