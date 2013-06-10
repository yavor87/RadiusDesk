Ext.define('Rd.view.components.advCheckColumn', {
    extend: 'Ext.ux.CheckColumn',
    alias: 'widget.advCheckColumn',

    /**
     * Only process events for checkboxes that do not have a "disabled" class
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        var enabled = Ext.query('[class*=disabled]', cell).length == 0,
            me = this;

        if (enabled) {
            me.callParent(arguments);
        }
    }
});
