Ext.define('Rd.store.sDesktopShortcuts', {
    extend: 'Ext.data.Store',
    model: 'Rd.model.mDesktopShortcut',
    data: [
                    { name: 'Vouchers',         iconCls: 'vouchers-shortcut',   controller: 'cDevices' },
                    { name: 'Permanent users',  iconCls: 'users-shortcut',      controller: 'cDevices' },
                    { name: 'BYOD Manager',     iconCls: 'byod-shortcut',       controller: 'cDevices' },
                    { name: 'Activity monitor', iconCls: 'activity-shortcut',   controller: 'cDevices' }
    ]
});
