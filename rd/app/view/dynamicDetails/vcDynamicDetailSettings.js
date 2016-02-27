Ext.define('Rd.view.dynamicDetails.vcDynamicDetailSettings', {
    extend  : 'Ext.app.ViewController',
    alias   : 'controller.vcDynamicDetailSettings',
    init: function() {
    
    },  
    onCmbThemesChange: function(cmb){
        var me       = this;
        me.theme     = cmb.getValue();
        console.log("The Theme is now "+me.theme);
        var pnl = cmb.up('panel');
        if(me.theme == 'Custom'){
        
            pnl.down('#txtCoovaDesktopUrl').setDisabled(false);
            pnl.down('#txtCoovaDesktopUrl').setHidden(false);
            
            pnl.down('#txtCoovaMobileUrl').setDisabled(false);
            pnl.down('#txtCoovaMobileUrl').setHidden(false);
            
            pnl.down('#txtMikrotikDesktopUrl').setDisabled(false);
            pnl.down('#txtMikrotikDesktopUrl').setHidden(false);
            
            pnl.down('#txtMikrotikMobileUrl').setDisabled(false);
            pnl.down('#txtMikrotikMobileUrl').setHidden(false);
            
        }else{
            pnl.down('#txtCoovaDesktopUrl').setDisabled(true);
            pnl.down('#txtCoovaDesktopUrl').setHidden(true);
            
            pnl.down('#txtCoovaMobileUrl').setDisabled(true);
            pnl.down('#txtCoovaMobileUrl').setHidden(true);
            
            pnl.down('#txtMikrotikDesktopUrl').setDisabled(true);
            pnl.down('#txtMikrotikDesktopUrl').setHidden(true);
            
            pnl.down('#txtMikrotikMobileUrl').setDisabled(true);
            pnl.down('#txtMikrotikMobileUrl').setHidden(true);
            
        }
    }
});
