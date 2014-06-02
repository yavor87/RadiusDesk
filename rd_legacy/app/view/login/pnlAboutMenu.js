Ext.define('Rd.view.login.pnlAboutMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pnlAboutMenu',
    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],
    ariaRole: 'menu',
    iconCls: 'infoWin',
    floating: true,
    shadow: true,
    width: 300,

    initComponent: function() {


        var me = this;// menu = me.menu;
        me.html =   "<div class='thumb-wrap'>"+
                        "<h1>"+i18n("sA_Modern_Webtop_front-end_to_FreeRADIUS")+"</h1>"+
                        "<div class='description'>"+
                            "<a href='http://sourceforge.net/projects/radiusdesk/' target='_blank'>http://sourceforge.net/projects/radiusdesk/</a>"
                        "</div>"+
                    "</div>";
        me.layout = 'fit';

        Ext.menu.Manager.register(me);
        me.callParent();
        me.on('deactivate', function () {
            me.hide();
        });
    },

    showBy: function(cmp, pos, off) {
        var me = this;

        if (me.floating && cmp) {
            me.layout.autoSize = true;
            me.show();

            // Component or Element
            cmp = cmp.el || cmp;

            // Convert absolute to floatParent-relative coordinates if necessary.
            var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
            if (me.floatParent) {
                var r = me.floatParent.getTargetEl().getViewRegion();
                xy[0] -= r.x;
                xy[1] -= r.y;
            }
            me.showAt(xy);
            me.doConstrain();
        }
        return me;
    }
}); // StartMenu

