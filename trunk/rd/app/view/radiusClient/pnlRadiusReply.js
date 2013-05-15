Ext.define('Rd.view.radiusClient.pnlRadiusReply', {
    extend      : 'Ext.form.Panel',
    alias       : 'widget.pnlRadiusReply',
    autoScroll  : true,
    autoCreate  : true,
    frame       : true,
    initComponent: function(){
        var me = this; 
        me.tpl =  new Ext.XTemplate(
        '<div class=\'blue_round\'>',
        '<h1>Request Attributes</h1>',
            '<ul>',   
                '<tpl for="send">',
                    '<li>{.}</li>',
                '</tpl>',
            '</ul>',
        '</div>',
        "<tpl if='failed'>",
            "<div class=\'red_round\'>",
        '<tpl else>',
            '<div class=\'green_round\'>',
        '</tpl>',
        '<h1>Reply Attributes</h1>',
            '<ul>',   
                '<tpl for="received">',
                    '<li>{.}</li>',
                '</tpl>',
            '</ul>',
         '</div>'
        );
        me.callParent(arguments);
    }
});

