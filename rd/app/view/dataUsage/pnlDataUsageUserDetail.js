Ext.define('Rd.view.dataUsage.pnlDataUsageUserDetail', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlDataUsageUserDetail',
    scrollable  : true,
    layout: {
        type    : 'vbox',
        align   : 'stretch'
    },
    border      : true,
    ui          : 'light',
    initComponent: function() {
        var me      = this;
        
        me.items = [
        
            {
                xtype   : 'progressbar',
                itemId  : 'pbData',
                text    : '<i class="fa  fa-database"></i> Data Usage',
                height  : 20,
                margin  : 5,
                cls     : 'wifired',
                value   : 1 
            },
            {
                xtype   : 'progressbar',
                itemId  : 'pbTime',
                text    : '<i class="fa fa-clock-o"></i> Time Usage',
                height  : 20,
                margin  : 5,
                width   : '100%',
                cls     : 'wifigreen',
                value   : 0.5
            },
            {
                xtype   : 'panel',
                height  : 150,
                tpl     : new Ext.XTemplate(
                    '<div class="divInfo">',   
                    '<tpl if="type==\'realm\'"><h2 style="color: #009933;"><i class="fa fa-dribbble"></i> {item_name}</h2></tpl>',
                    '<tpl if="type==\'user\'"><h2 style="color: #0066ff;"><i class="fa fa-user"></i> {item_name}</h2></tpl>',
                    '<h1 style="font-size:250%;">{data_total}</h1>',       
                    '<p style="color: #000000; font-size:110%;">',
                        'In: Bla<br>',
                        'Out: Bla',
                    '</p>',
                    '</div>'
                ),
                data: {
                   
                }
            } 
        ]; 
        
        me.callParent(arguments);
    }
});
