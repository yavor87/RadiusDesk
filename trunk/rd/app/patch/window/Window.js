Ext.define('Rd.patch.window.Window', {
    require: ['Ext.window.Window'],
    override: 'Ext.window.Window',
    toFront: function() {
        var me = this;
        //get the window manager of this window, or Ext.WindowMgr if it doesn't have one
        var manager = (me.manager || Ext.WindowMgr);
        //get the window which is currently to front
        var activeWindow = manager.getActive(); 

        //only fire tofront and toback events if the current window was not already to front
        if (me != activeWindow){
            console.log(me.self.getName() + ' moved to front');
            me.fireEvent('toFront');
        }
        if (activeWindow){
            activeWindow.fireEvent('toback');
        }

        me.callParent();
    }
});
