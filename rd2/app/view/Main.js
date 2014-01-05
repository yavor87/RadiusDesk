Ext.define('Rd.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border'
    ],
    
    xtype: 'app-main',

    layout: {
        type: 'border'
    },
    initComponent: function(){

        var me = this;
       

        
        var buttons = [];

        Ext.setGlyphFontFamily('Pictos');

        for (var i = 33;i < 37; i++) {
            buttons.push({
                text: i
                , scale: 'medium'
                , glyph: i
                // glyph: i + '@Pictos'  // alternate config if Ext.setGlyphFontFamily() was not set
            });
        }

         me.items = [{
            region: 'west',
            xtype: 'panel',
            title: 'west',
            width: 150
        },{
            region: 'center',
            xtype: 'tabpanel',
            items:[{
                title: 'Center Tab 1',
                glyph: 72,
                items: buttons
            }]
        }];



        me.callParent(arguments);
    }
});
