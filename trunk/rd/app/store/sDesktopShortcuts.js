Ext.define('Rd.store.sDesktopShortcuts', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mDesktopShortcut',
    data: [
                    { name: i18n('Vouchers'),         iconCls: 'vouchers-shortcut',   controller: 'cDevices' },
                    { name: i18n('Permanent users'),  iconCls: 'users-shortcut',      controller: 'cDevices' },
                    { name: i18n('BYOD Manager'),     iconCls: 'byod-shortcut',       controller: 'cDevices' },
                    { name: i18n('Activity monitor'), iconCls: 'activity-shortcut',   controller: 'cDevices' }
    ]
});
