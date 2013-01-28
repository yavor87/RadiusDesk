Ext.define('Rd.view.nas.pnlNas', {
    extend  : 'Ext.tab.Panel',
    alias   : 'widget.pnlNas',
    border  : false,
    nas_id  : null,
    url     : null,
    initComponent: function(){
        var me = this;
        Ext.Ajax.request({
            url     : me.url+'?nas_id='+me.nas_id,
            method  : 'GET',
            success : me.buildPanel,
            scope   : me
        });
        me.callParent(arguments);
    },
    buildPanel: function(response){
        var me          = this;
        var items       = [];
        var jsonData    = Ext.JSON.decode(response.responseText);
        if(jsonData.success){
            me.add(jsonData.items); //Add the items
            me.setActiveTab(0);
            var form = me.down('frmNasBasic');
            form.loadRecord(me.record);    //Load the record
            var con_type = me.record.get('connection_type');
            if(con_type != 'direct'){
                form.down('#nasname').setDisabled(true);    //Anything not direct is not editable
            }

            //Configure the settings for the realms
            var gridR    = me.down('gridRealmsForNasOwner');
            gridR.getStore().getProxy().setExtraParam('nas_id',me.nas_id);
            gridR.getStore().getProxy().setExtraParam('owner_id',me.record.get('user_id'));
            gridR.getStore().getProxy().setExtraParam('available_to_siblings',me.record.get('available_to_siblings'));
            gridR.getStore().load();
        }
    }
});
