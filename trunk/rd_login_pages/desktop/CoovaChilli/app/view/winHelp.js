Ext.define('CoovaChilli.view.winHelp', {
    extend: 'Ext.window.Window',
    alias : 'widget.winHelp',
    title : 'Help',
    layout: 'fit',
    autoShow: false,
    autoScroll: true,
    width:    400,
    height:   300,
    iconCls: 'help',
    bodyCls: 'winHelp',
    initComponent: function() {
        var me      = this;
        this.callParent(arguments);
    }
});
