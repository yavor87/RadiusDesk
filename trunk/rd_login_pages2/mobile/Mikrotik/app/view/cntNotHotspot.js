Ext.define('Mikrotik.view.cntNotHotspot', {
    extend: 'Ext.Container',
    xtype: 'cntNotHotspot',
    config: {
        layout: 'fit',
        items: [
            {
                html: 'Not a Mikrotik Hotspot!',
                style: 'background-color: #aaf6be;'
            }
        ]
    }
});
