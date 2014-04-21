Ext.define('Mikrotik.view.pnlNotHotspot', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.pnlNotHotspot',
    border      : false,
    bodyPadding : 20,
    layout      : 'fit',
    html        : [
        "<div class='rdCenter'>",
        "<h2>Not a hotspot!</h2>",
        "<div class='rdDescription'>",
        "This panel will dispaly a login form when you are connecting from a <b>Mikrotik</b> Captive portal",
        "</div></div>"
    ],
    initComponent: function() {
        this.callParent(arguments);   
    }
});
