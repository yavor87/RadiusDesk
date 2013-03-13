Ext.define('Rd.patch.form.SubmitFix', {
    override: 'Ext.ZIndexManager',
    register : function(comp) {
        var me = this,
            compAfterHide = comp.afterHide;
        
        if (comp.zIndexManager) {
            comp.zIndexManager.unregister(comp);
        }
        comp.zIndexManager = me;

        me.list[comp.id] = comp;
        me.zIndexStack.push(comp);
        
        // Hook into Component's afterHide processing
        comp.afterHide = function() {
            compAfterHide.apply(comp, arguments);
            me.onComponentHide(comp);
        };
    },

    /**
     * Unregisters a {@link Ext.Component} from this ZIndexManager. This should not
     * need to be called. Components are automatically unregistered upon destruction.
     * See {@link #register}.
     * @param {Ext.Component} comp The Component to unregister.
     */
    unregister : function(comp) {
        var me = this,
            list = me.list;
        
        delete comp.zIndexManager;
        if (list && list[comp.id]) {
            delete list[comp.id];
            
            // Relinquish control of Component's afterHide processing
            delete comp.afterHide;
            Ext.Array.remove(me.zIndexStack, comp);

            // Destruction requires that the topmost visible floater be activated. Same as hiding.
            me._activateLast();
        }
    }
});

//-- Vtypes ---->

Ext.apply(Ext.form.field.VTypes, {
    IPAddress:  function(v) {
        return (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/).test(v);
    },
    IPAddressText:  i18n('Example') + ': 192.168.1.1',
    IPAddressMask: /[\d\.]/i,
 
    MacAddress: function(v) {
        return (/^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/).test(v);
    },
    MacAddressMask: /[a-fA-F0-9:]/,
    MacAddressText: i18n('Example') + ': 01:23:45:67:89:ab',
 
    DnsName: function(v) {
        return (/^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/).test(v);
    },
    DnsNameText: i18n('This is not a valid DNS name')
});

