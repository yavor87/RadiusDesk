Ext.define('Rd.view.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.vp',
    requires:[
        'Ext.layout.container.Fit'
    ],
    layout: {
        type: 'fit'
    }
});

