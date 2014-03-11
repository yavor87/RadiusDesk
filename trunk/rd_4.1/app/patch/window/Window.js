/*
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
*/

/*
This fix was taken form this forum enty, but I had to make some modifications to get it working on the webtop though
http://www.sencha.com/forum/showthread.php?249459-4.1.3-Stateful-window-position-is-STILL-incorrect.
It is still not 100% to my comfort; but @ least much better dvdwalt
*/

Ext.define('Rd.patch.window.Window', {
    require: ['Ext.window.Window'],
    override: 'Ext.window.Window',
    getState: function() {
        var me = this,
        state = me.callSuper(arguments) || {},
        maximized = !!me.maximized,
        ghostBox = me.ghostBox,
        pos;
        state.maximized = maximized;

        if (maximized) {
            pos = me.restorePos;
        } else if (ghostBox) {
            // If we're animating a show, it will be from offscreen, so
            // grab the position from the final box
            pos = [ghostBox.x, ghostBox.y];


            // <WestyFix>
            var isContainedFloater = me.isContainedFloater(),
                floatParentBox;


            if (isContainedFloater) {
                floatParentBox = me.floatParent.getTargetEl().getViewRegion();
                pos[0] -= floatParentBox.left;
                pos[1] -= floatParentBox.top;
            }
            // </WestyFix>
        } else {
            // <WestyFix>
            pos = me.getPosition(true);
            // </WestyFix>

            //--Dirk-----
            if(pos[0]> 0){
                var now = new Date();
                now.setDate(now.getDate() + 100);
                Ext.util.Cookies.set(me.getId()+"_WinPosX", pos[0], now, "/", null, false); //Save the state when we can
                Ext.util.Cookies.set(me.getId()+"_WinPosY", pos[1], now, "/", null, false); //Save the state when we can
            }else{
               
                //Only if there were previously saved ones
                if (Ext.util.Cookies.get(me.getId()+"_WinPosX") != null){
                    pos[0] = parseInt(Ext.util.Cookies.get(me.getId()+"_WinPosX"));
                }else{
                    if(pos[0] < 0){ //The bug sets it to -1000; we set x and y here if that condition happen
                        pos[0] = 100;
                        pos[1] = 50;
                    }
                }

                if (Ext.util.Cookies.get(me.getId()+"_WinPosY") != null){
                    pos[1] = parseInt(Ext.util.Cookies.get(me.getId()+"_WinPosY"));
                }

            }
            //--End Dirk-- 

            if (window.console) {
                window.console.log('Non-ghostbox pos:' + pos[0] + ', ' + pos[1]);
            }
        }

        Ext.apply(state, {
            size: maximized ? me.restoreSize : me.getSize(),
            pos: pos
        });
        return state;
    }
});
