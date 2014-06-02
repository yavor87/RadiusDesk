Ext.define('CoovaChilli.view.cntNotHotspot', {
    extend: 'Ext.Container',
    xtype: 'cntNotHotspot',
    config: {
        layout: 'fit',
        items: [
            {
                html: 'Not a CoovaChilli Hotspot!',
                style: 'background-color: #aaf6be;'
            }
        ]
    }
});
