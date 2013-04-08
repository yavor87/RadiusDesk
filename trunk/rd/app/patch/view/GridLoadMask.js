Ext.define('Rd.patch.view.GridLoadMask', {
    override: 'Ext.view.AbstractView',
    onRender: function() {
        var me = this;   
        this.callOverridden(); 
        if (me.mask && Ext.isObject(me.store)) {
            me.setMaskBind(me.store);
        }
    }
});
