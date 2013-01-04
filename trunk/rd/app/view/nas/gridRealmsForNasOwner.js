Ext.define('Rd.view.nas.gridRealmsForNasOwner' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridRealmsForNasOwner',
    border: false,
    requires:   ['Rd.view.components.advCheckColumn'],
    owner_id:  44,
    available_to_siblings: false,
    columns: [
        {xtype: 'rownumberer'},
        { text: 'Name',    dataIndex: 'name',      tdCls: 'gridTree', flex: 1},
        {
            xtype: 'advCheckColumn',
            text: 'Include',
            dataIndex: 'include',
            renderer: function(value, meta, record) {
                var cssPrefix = Ext.baseCSSPrefix,
                cls = [cssPrefix + 'grid-checkheader'],
                disabled = false;
                if (value && disabled) {
                    cls.push(cssPrefix + 'grid-checkheader-checked-disabled');
                } else if (value) {
                    cls.push(cssPrefix + 'grid-checkheader-checked');
                } else if (disabled) {
                    cls.push(cssPrefix + 'grid-checkheader-disabled');
                }
                return '<div class="' + cls.join(' ') + '">&#160;</div>';
            }
        }
    ],
    tbar: [ 
        { xtype: 'button',  iconCls: 'b-reload',    scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},'->',  
        { xtype: 'tbtext', text: 'Select one or more realms', cls: 'lblWizard' },
             
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: 'Result count: {count}',   style: 'margin-right:5px', cls: 'lblYfi'  }
    ],
    initComponent: function(){

        //We have to create this treeview's own store since it is unique to the AP
        var me = this;

        //Create a store specific to this Owner
        me.store = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mRealmForNasOwner',
            proxy: {
                type: 'ajax',
                format  : 'json',
                batchActions: true, 
                'url'   : '/cake2/rd_cake/realms/list_realms_for_nas_owner.json',
                extraParams: { 'owner_id' : me.owner_id, 'available_to_siblings': me.available_to_siblings },
                reader: {
                    type: 'json',
                    root: 'items',
                    messageProperty: 'message'
                },
                api: {
                  //  read    : '/cake2/rd_cake/realms/index_ap.json',
                  //  update  : '/cake2/rd_cake/realms/edit_ap.json'
                }
            },
            listeners: {
                load: function(store, records, successful) {
                    if(!successful){
                        Ext.ux.Toaster.msg(
                            'Error encountered',
                            store.getProxy().getReader().rawData.message.message,
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                        //console.log(store.getProxy().getReader().rawData.message.message);
                    }  
                },
                update: function(store, records, success, options) {
                    store.sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                'Updated right',
                                'Right has been updated',
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );   
                        },
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                'Problems updating the right',
                                'Right could not be updated',
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                        }
                    });
                },
                scope: this
            },
            autoLoad: true    
        });
        me.callParent(arguments);
    }
});
