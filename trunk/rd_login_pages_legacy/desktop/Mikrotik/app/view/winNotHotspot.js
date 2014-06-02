Ext.define('MikrotikLogin.view.winNotHotspot', {
    extend: 'Ext.window.Window',
    alias : 'widget.winNotHotspot',
    closable: false,
    draggable: false,
    resizable: false,
    width: 400,
    height: 200,
    plain: true,
    border: false,
    bodyPadding: 10,
    layout: 'fit',
    html: '<h2>Not a hotspot</h2>',
    initComponent: function() {
        this.callParent(arguments);
        
    }
});
