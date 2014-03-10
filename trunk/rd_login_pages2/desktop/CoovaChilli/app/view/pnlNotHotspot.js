Ext.define('CoovaChilli.view.pnlNotHotspot', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlNotHotspot',
    border      : false,
    bodyPadding : 20,
    layout      : 'fit',
    html        : '<h2>Not a hotspot</h2>',
    initComponent: function() {
        this.callParent(arguments);   
    }
});
