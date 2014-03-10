Ext.define('CoovaChilli.view.Land' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.land',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    border: false,
    margins: '0 0 0 0',
    requires: ['CoovaChilli.view.pnlAboutMenu','CoovaChilli.view.pnlNotHotspot','CoovaChilli.view.frmPayU'],
    initComponent: function() { 
        var me      = this;
        var t       = me.createTopToolbar();
        var b       = me.createBottomToolbar();
        me.dockedItems = [t];
        var i       = Ext.create('Ext.Img', {src: Ext.BLANK_IMAGE_URL,itemId : 'slide'});
        me.items    = [
            { 
                title   : 'Connecting', 
                xtype   : 'panel',
                glyph   : CoovaChilli.config.icnConnect,
                width   : 300,
                border  : true,
                collapsible : true,
                collapseDirection: 'left',
                items   : [
                            {xtype : 'pnlNotHotspot', hidden: false},
                            {xtype : 'pnlConnect',    hidden: false},
                            {xtype : 'pnlStatus',     hidden: false}
                ]
            }, 
            {
                xtype       : 'panel', 
                items       : i,
                dockedItems : b,
                layout      : 'fit',
                flex        : 1,
                border      : true
            },
            { 
                title   : 'Online shop', 
                xtype   : 'panel',
                glyph   : CoovaChilli.config.icnShop,
                width   : 300,
                collapsible : true,
                collapseDirection: 'left',
                border  : true,
                items   : { xtype : 'frmPayU'}
            }
        ]
        me.callParent(); 
    },
    createTopToolbar: function(){

        var me = this;
        return  Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            itemId: 'topToolbar',
            defaults: {
                    margin: 5,
                    padding: 5
            },
            items: [
            {
                html: 'Help',
                cls: 'topButton',             
                iconCls: 'b-help',
                tooltip: 'Help',
                scale: 'large',
                itemId: 'help'
            }, 
            '->',
            {
                text: 'About',
                cls: 'topButton',
                iconCls: 'b-info-top',  
                scale: 'large',
                itemId: 'about',
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
    ]
});

    },
    createBottomToolbar: function(){

        return  Ext.create('Ext.toolbar.Toolbar', {
            dock: 'bottom',
            items: [
            '->',
            {
                scale: 'large',
                iconCls: 'b-prev',
                disabled: true,
                itemId: 'btnPrev'
            }, 
            {
                scale: 'large',
                iconCls: 'b-next',
                disabled: true,
                itemId: 'btnNext'
            }, 
            {
                scale: 'large',
                iconCls: 'b-info',
                disabled: true,
                itemId: 'btnInfo'
            }
        ]
    });
    }
});
