Ext.define('Rd.view.dynamicDetails.pnlDynamicDetailPhoto', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDynamicDetailPhoto',
    border  : false,
    frame   : false,
    layout: {
        type    : 'hbox',         
        align   : 'stretch'
    },
    store   : undefined,
    dynamic_detail_id: null,
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu: '/cake3/rd_cake/dynamic-details/menu-for-photos.json',
    urlShufflePhoto: '/cake3/rd_cake/dynamic-details/shuffle-photo.json',
    initComponent: function(){
        var me = this;

        //Create the view for the wallpapers:
        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="thumb-wrap">',
                    '<div>',
                        '<div><h1>{title}</h1></div>',
                            '<img src="{img}" />',
                        '<div class="description">{description}</div>',
                        '<tpl if="Ext.isEmpty(url)">', //If the url is not empty add the link
                            '<div></div>',
                        '<tpl else>',
                            '<div><a href="{url}" target="_blank">{url}</a></div>',
                        '</tpl>',
                    '</div>',
                '</div>',
            '</tpl>'
        );

        me.store = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mDynamicPhoto',
            proxy: {
                type        :'ajax',
                url         : '/cake3/rd_cake/dynamic-details/index-photo.json',
                extraParams : { 'dynamic_detail_id' : me.dynamic_detail_id},
                batchActions: true,
                format      : 'json',
                reader      : {
                    keepRawData : true,
                    type        : 'json',
                    rootProperty: 'items'
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
                    }else{
                        var count       = me.down('dataview').getStore().getTotalCount();
                        me.down('#count').update({count: count}); 
                    }   
                },
                scope: this
            }
        });

        var v = Ext.create('Ext.view.View', {
            store       : me.store,
            multiSelect : true,
            tpl         : imageTpl,
            itemSelector: 'div.thumb-wrap',
            emptyText   : i18n('sNo_images_available'),
            listeners: {
                render: function(view) {
                    var me = this;  
                    me.dragZone = new Ext.view.DragZone({
		                view    : view,
		                ddGroup : 'dynPhotos',
		                dragText: '<span class="txtBlue"><i class="fa  fa-lightbulb-o"></i> <b>Drag & Drop</b> to rearrange items</span>'
	                });
	                
	                me.dopZone = new Ext.view.DropZone({
		                view: view,
		                ddGroup: 'dynPhotos',
		                handleNodeDrop : function(data, record, position) {   
			                var view = this.view,
				                store = view.getStore(),
				                index, records, i, len;
			                if (data.copy) {
				                records = data.records;
				                data.records = [];
				                for (i = 0, len = records.length; i < len; i++) {
					                data.records.push(records[i].copy(records[i].getId()));
				                }
			                } else {
				                data.view.store.remove(data.records, data.view === view);
			                }
			                index = store.indexOf(record);
			                if (position !== 'before') {
				                index++;
			                }
			                  
			                store.insert(index, data.records);
			                view.getSelectionModel().select(data.records);
			                me.commitShuffle(store);    
		                }
	                });       
                },
                scope: me
            }
        });
    
        me.items =  {
                xtype       : 'panel',
                frame       : false,
                height      : '100%', 
                width       :  550,
                itemId      : 'pnlForPhotoView',
                layout: {
                   type: 'vbox',
                   align: 'stretch'
                },
                items       : v,
                autoScroll  : true,
                tbar        : Ext.create('Rd.view.components.ajaxToolbar',{
                    url         : me.urlMenu, 
                    extra_text  : '<span class="txtBlue"><i class="fa  fa-lightbulb-o"></i> <b>Drag & Drop</b> to rearrange items</span>'
                }),
                bbar: [
                    {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi'  }
                ]
        };
         
        me.callParent(arguments);
    },
    commitShuffle: function(store){
        var me      = this;
        var list    = [];
        store.each(function(item){
            var id = item.getId();
            Ext.Array.push(list,{'id' : id});
        });
        Ext.Ajax.request({
            url     : me.urlShufflePhoto,
            method  : 'POST',          
            jsonData: list,
            params  : { 'dynamic_detail_id' : me.dynamic_detail_id},
            success : function(batch,options){
                Ext.ux.Toaster.msg(
                    "Updating Photo Position",
                    "Updating Photo Position Completed",
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
               store.reload(); //Reload from server
            },                                    
            failure: function(batch,options){
                Ext.ux.Toaster.msg(
                    "Problems Updating Photo Position",
                    "Problems Updating Photo Position",
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
               store.reload(); //Reload from server
            }
        });     
    } 
});
