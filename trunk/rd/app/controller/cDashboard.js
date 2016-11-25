Ext.define('Rd.controller.cDashboard', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboard.pnlDashboard',
        'dashboard.tpDashboard',
        'dashboard.winPasswordChanger'
    ],
    config: {
        urlChangePassword           : '/cake2/rd_cake/desktop/change_password.json'
    },
    models: [
    
    ],
    requires: [
 
    ],
    stores: [
    
    ], 
    refs: [
        {   ref: 'viewP',           selector: 'viewP',          xtype: 'viewP',    autoCreate: true},
        {   ref: 'pnlDashboard',    selector: 'pnlDashboard',   xtype: 'pnlDashboard' }
    ],
    init: function() {
        var me      = this;
        if (me.inited) {
            return;
        }
        me.inited = true; 
        this.control(
            {
                'tpDashboard #cAccessProviders' : {
				    activate	: function(pnl){
				        me.application.runAction('cAccessProviders','Index',pnl);
				    }
			    },
			    'tpDashboard #cMeshes' : {
				    activate	: function(pnl){
				        me.application.runAction('cMeshes','Index',pnl);
				    }
			    },
			    'tpDashboard #cAccessPoints' : {
				    activate	: function(pnl){
				        me.application.runAction('cAccessPoints','Index',pnl);
				    }
			    },
			    'tpDashboard #cProfileComponents' : {
				    activate	: function(pnl){
				        me.application.runAction('cProfileComponents','Index',pnl);
				    }
			    },
			    'tpDashboard #cProfiles' : {
				    activate	: function(pnl){
				        me.application.runAction('cProfiles','Index',pnl);
				    }
			    },  
			    'tpDashboard #cActivityMonitor' : {
				    activate	: function(pnl){
				        me.application.runAction('cActivityMonitor','Index',pnl);
				    }
			    }, 
			    'tpDashboard #cPermanentUsers' : {
				    activate	: function(pnl){
				        me.application.runAction('cPermanentUsers','Index',pnl);
				    }
			    },
			    'tpDashboard #cVouchers' : {
				    activate	: function(pnl){
				        me.application.runAction('cVouchers','Index',pnl);
				    }
			    },
			    'tpDashboard #cDevices' : {
				    activate	: function(pnl){
				        me.application.runAction('cDevices','Index',pnl);
				    }
			    },
			    'tpDashboard #cTopUps' : {
				    activate	: function(pnl){
				        me.application.runAction('cTopUps','Index',pnl);
				    }
			    },
			    'tpDashboard #cRealms' : {
				    activate	: function(pnl){
				        me.application.runAction('cRealms','Index',pnl);
				    }
			    }, 
			    'tpDashboard #cDynamicClients' : {
				    activate	: function(pnl){
				        me.application.runAction('cDynamicClients','Index',pnl);
				    }
			    },
			    'tpDashboard #cNas' : {
				    activate	: function(pnl){
				        me.application.runAction('cNas','Index',pnl);
				    }
			    },
			    'tpDashboard #cTags' : {
				    activate	: function(pnl){
				        me.application.runAction('cTags','Index',pnl);
				    }
			    },
			    'tpDashboard #cSsids' : {
				    activate	: function(pnl){
				        me.application.runAction('cSsids','Index',pnl);
				    }
			    },
			    'tpDashboard #cDynamicDetails' : {
				    activate	: function(pnl){
				        me.application.runAction('cDynamicDetails','Index',pnl);
				    }
			    },
			    'tpDashboard #cOpenvpnServers' : {
				    activate	: function(pnl){
				        me.application.runAction('cOpenvpnServers','Index',pnl);
				    }
			    },
			    'tpDashboard #cIpPools' : {
				    activate	: function(pnl){
				        me.application.runAction('cIpPools','Index',pnl);
				    }
			    },
			    'tpDashboard #cAcos' : {
				    activate	: function(pnl){
				        me.application.runAction('cAcos','Index',pnl);
				    }
			    },
			    'tpDashboard #cLogViewer' : {
				    activate	: function(pnl){
				        me.application.runAction('cLogViewer','Index',pnl);
				    }
			    },
			    'tpDashboard #cDebug' : {
				    activate	: function(pnl){
				        me.application.runAction('cDebug','Index',pnl);
				    }
			    },
			    'pnlDashboard  #mnuLogout' : {
			        click   : me.onLogout
			    },
			    'pnlDashboard  #mnuPassword' : {
			        click   : me.onPassword
			    },
			        'winPasswordChanger #save': {
                    'click' : me.onChangePassword
                }
		    }
        );
    },
    actionIndex: function(){
        var me      = this;
        var dd      = me.application.getDashboardData();
        var user    = dd.user.username;
        var cls     = dd.user.cls;   
        //We first create a plain dashboard
        var pnlDash = me.getView('dashboard.pnlDashboard').create({});
        var tpDash  = me.getView('dashboard.tpDashboard').create({});
        var vp = me.getViewP();
        vp.removeAll(true);
        vp.add([pnlDash]);
        pnlDash.add([tpDash]);
    },
    onLogout: function(b){
        var me = this;
        b.up('panel').close();
        me.getViewP().removeAll(true);
        me.application.runAction('cLogin','Exit');
    },
    onPassword: function(b){
        var me = this;
        if(!Ext.WindowManager.get('winPasswordChangerId')){
            var w = Ext.widget('winPasswordChanger',{
                id  :'winPasswordChangerId'
            });
            w.show();        
        }
    },
    onChangePassword: function(button){
        var me      = this;
        var form    = button.up('form');
        var win     = button.up('window');

        form.submit({
            clientValidation: true,
            url: me.getUrlChangePassword(),
            success: function(form, action) {
                //Important to update the token for the next requests
                var token = action.result.data.token; 
                Ext.Ajax.setExtraParams({token : token});
                win.close();
                Ext.ux.Toaster.msg(
                    i18n('sItem_updated'),
                    i18n('sItem_updated_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    }
});
