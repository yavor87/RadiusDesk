Ext.define('Rd.patch.menu.Menu', {
    override: 'Ext.menu.Menu',
    onMouseLeave: function(ev) {
        var activeItem = this.activeItem,
            menu = activeItem && activeItem.menu,
            menuEl = menu && menu.getEl();

        if (Ext.isChrome && menuEl && menuEl.contains(ev.getRelatedTarget())) {
            return;
        }
        this.callParent([ev]);
    }
});
