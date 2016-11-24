Ext.define('Rd.controller.cDashboard', {
    extend: 'Ext.app.Controller',
    views: [
        'dashboard.pnlDashboard',
        'dashboard.tpDashboard'
    ],
    config: {
      
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
			    }
		    }
        );
    },
    actionIndex: function(){
        var me      = this;
        var dd      = me.application.getDesktopData();
        var user    = dd.user.username;
        var cls     = dd.user.cls;   
        //We first create a plain dashboard
        var pnlDash = me.getView('dashboard.pnlDashboard').create({});
        var tpDash  = me.getView('dashboard.tpDashboard').create({});
        var vp = me.getViewP();
        vp.removeAll(true);
        vp.add([pnlDash]);
        pnlDash.add([tpDash]);
    }
});
