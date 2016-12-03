Ext.define('Rd.view.dashboard.pnlDashboard', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDashboard',
    layout  : 'fit',
    dashboard_data  : undefined,
    initComponent: function () {
        var me = this;
      
        var username =  me.dashboard_data.user.username;
        me.dockedItems = [
            {
                xtype   : 'toolbar',
                dock    : 'bottom',
                ui      : 'footer', 
                items   : [
                    '<b><i class="fa fa-graduation-cap"></i> '+username+'</b>',
                    '->', 
                    '<b>RADIUSdesk</b> 2012-2016 GPL license'
                ]
            },
            {
                xtype   : 'toolbar',
                dock    : 'top',
                ui      : 'default', 
                items   : [              
                    '<h1>RADIUSdesk</h1>',
                    '->',
                    {
                    xtype   : 'button',
                    glyph   : Rd.config.icnMenu,
                    scale   : 'medium',
                    menu    : [
                            {   text:i18n('sLogout'),      glyph : Rd.config.icnPower,  itemId: 'mnuLogout'},'-',
                            {   text:i18n('sSettings'),    glyph : Rd.config.icnSpanner,itemId: 'mnuSettings'},
                            {   text:i18n('sPassword'),    glyph : Rd.config.icnLock,   itemId: 'mnuPassword'    }
                        ]  
                    } 
                ]
            }
        ];
        
        
        
        this.callParent();
    }
});


