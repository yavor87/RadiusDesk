Ext.define('CoovaLogin.view.AboutMenu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.aboutMenu',
    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],
    ariaRole: 'menu',
    iconCls: 'info',
    floating: true,
    shadow: true,
    width: 300,

    initComponent: function() {


        var me = this;// menu = me.menu;
        var tpl = Ext.create('Ext.XTemplate', [
                "<div class='divAbout'>"+
                "<div class='imgAbout'><img src='{icon_file_name}' height='42' /></div>\n"+
                "<div class='lblAbout'>Name</div>\n"+
                "<div class='lblInfo'>: {name}</div>"+
                "<div class='lblAbout'>Phone</div>\n"+
                "<div class='lblInfo'>: {phone}</div>"+
                "<div class='lblAbout'>Fax</div>\n"+
                "<div class='lblInfo'>: {fax}</div>"+
                "<div class='lblAbout'>Cell</div>\n"+
                "<div class='lblInfo'>: {cell}</div>"+
                "<div class='lblAbout'>email</div>\n"+
                "<div class='lblInfo'>: <a href='mailto:{email}'>{email}</a></div>\n"+
                "<div class='lblAbout'>URL</div>\n"+
                "<div class='lblInfo'>: <a href='{url}' target='_blank'>{url}</a></div>\n"+
                "<div class='lblAbout'>Street</div>\n"+
                "<div class='lblInfo'>: {street_no} {street}</div>\n"+
                "<div class='lblAbout'>Suburb</div>\n"+
                "<div class='lblInfo'>: {town_suburb}</div>\n"+
                "<div class='lblAbout'>City</div>\n"+
                "<div class='lblInfo'>: {city}</div>\n"+
                "<div class='lblAbout'>Lon</div>\n"+
                "<div class='lblInfo'>: {lon}</div>\n"+
                "<div class='lblAbout'>Lat</div>\n"+
                "<div class='lblInfo'>: {lat}</div>\n"+
                "</div>"
            ]);
        me.tpl = tpl;
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

