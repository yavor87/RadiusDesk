Ext.define('CoovaLogin.view.NotHotspot', {
    extend: 'Ext.window.Window',
    alias : 'widget.notHotspotW',
    closable: false,
    draggable: false,
    resizable: false,
    width: 200,
    height: 100,
    plain: true,
    border: false,
    bodyPadding: 20,
    layout: 'fit',
    html: '<h1>Not a hotspot</h1>',
    initComponent: function() {
        this.callParent(arguments);
        
    }
});
