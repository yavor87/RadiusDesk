Ext.define('Rd.view.dashboard.tpDashboard', {
    extend      : 'Ext.tab.Panel',
    alias       : 'widget.tpDashboard',
    layout      : 'fit',
    ui          : 'navigation',
    tabPosition : 'left',
    tabRotation : 0,
    defaults    : {
        textAlign   : 'left'
    },
    items: [
    {
        title   : 'Overview',
        glyph   : Rd.config.icnView,
        html    : "Home tab"
    }, 
    {
        title   : 'Admins',
        glyph   : Rd.config.icnAdmin,
        id      : 'cAccessProviders',
        layout  : 'fit'
        
    },
    {
        title   : 'Users',
        xtype   : 'tabpanel',
        glyph   : Rd.config.icnUser,
        layout  : 'fit',
        items   : [
            {
                title   : 'Who is online?',
                glyph   : Rd.config.icnActivity,
                id      : 'cActivityMonitor',
                layout  : 'fit'
            },
            {
                title   : 'Permanent Users',
                glyph   : Rd.config.icnUser,
                id      : 'cPermanentUsers',
                layout  : 'fit'
            },
            {
                title: 'Vouchers',
                glyph: Rd.config.icnVoucher,
                id      : 'cVouchers',
                layout  : 'fit'
            },
            {
                title: 'BYOD',
                glyph: Rd.config.icnDevice,
                id      : 'cDevices',
                layout  : 'fit'
            },
            {
                title   : 'Realms (Groups)',
                glyph   : Rd.config.icnRealm,
                id      : 'cRealms',
                layout  : 'fit'
            }
        ]
       
    }, 
    {
        title   : 'Profiles',
        glyph   : Rd.config.icnProfile,
        xtype   : 'tabpanel',
        layout  : 'fit',
        items   : [
            {
                title   : 'Profile Components',
                glyph   : Rd.config.icnComponent,
                id      : 'cProfileComponents',
                layout  : 'fit'
            },
            {
                title   : 'Profiles',
                glyph   : Rd.config.icnProfile,
                id      : 'cProfiles',
                layout  : 'fit'
            },
            
        ]
    }, 
    {
        title   : 'RADIUS',
        glyph   : Rd.config.icnRadius,
        xtype   : 'tabpanel',
        layout  : 'fit',
        items   : [
            {
                title   : 'Dynamic RADIUS Clients',
                glyph   : Rd.config.icnDynamicNas,
                id      : 'cDynamicClients',
                layout  : 'fit'
            },
            {
                title   : 'NAS Devices',
                glyph   : Rd.config.icnNas,
                id      : 'cNas',
                layout  : 'fit'
            },
            {
                title   : 'NAS Device Tags',
                glyph   : Rd.config.icnTag,
                id      : 'cTags',
                layout  : 'fit'
            }  
        ]
    }, 
    {
        title   : 'MESHdesk',
        glyph   : Rd.config.icnMesh,
        id      : 'cMeshes',
        layout  : 'fit'
    },
    {
        title   : 'APdesk',
        glyph   : Rd.config.icnCloud,
        id      : 'cAccessPoints',
        layout  : 'fit' 
    },
    {
        title   : 'Other',
        glyph   : Rd.config.icnGears,
        xtype   : 'tabpanel',
        layout  : 'fit',
        items   : [
            {
                title   : 'SSIDs',
                glyph   : Rd.config.icnSsid,
                id      : 'cSsids',
                layout  : 'fit'
            }
        ]
    }
    ], 
    initComponent: function () {
        var me = this;
        this.callParent();
    }
});


