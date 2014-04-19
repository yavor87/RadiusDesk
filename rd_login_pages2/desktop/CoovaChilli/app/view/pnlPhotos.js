
Ext.define('CoovaChilli.view.pnlPhotos', {
    extend: 'Ext.panel.Panel',
    xtype: 'pnlPhotos',
    requires: [
        'Ext.XTemplate',
        'Ext.view.View',
        'Ext.data.Store'
    ],
    initComponent: function() {
        var me          = this;
        var scaler_url  = '/cake2/rd_cake/webroot/files/image.php';

        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="rdThumb">',
                    '<img src="'+scaler_url+'?height=90&width=90&image={file_name}" />',
                '</div>',
            '</tpl>'
        );

        var thumb = Ext.create('Ext.view.View', {
            height      : 105,
            overflowX   : 'auto',
            itemId      : 'datThumb',
            itemSelector: 'div.rdThumb',
            bodyStyle   :{"background-color":"#2a2a2a"},
            emptyText   : 'No images available',
            store: {
                fields  : ['id', 'title', 'description','file_name'],
                data    : me.jsonData.photos
            },
            tpl         : imageTpl,
            listeners: {
                viewready: function(dv) {
                    dv.getSelectionModel().select(dv.store.getAt(0));
                }
            }
        });

        var title       = me.jsonData.photos[0].title;
        var description = me.jsonData.photos[0].description;
        var file_name   = me.jsonData.photos[0].file_name;

        var image = Ext.create('Ext.Img', {
            src     : file_name,
            itemId  : 'imgPhoto',
            flex    : 1,
            listeners: {

                render: function (me) {
                    me.el.on({
                        load: function (evt, ele, opts) {
                              me.setLoading(true);
                        }
                   });
                },

                afterrender: function (me) {
                    me.el.on({
                        load: function (evt, ele, opts) {
                            me.setLoading(false);
                        }
                    });
                }
            }
        });
   

        me.items = [
            {
                xtype   : 'panel',
                itemId  : 'pnlPhotoHeading',
                data    : {title: title, description :description, file_name:file_name},
                tpl     : '<div class="rdCenter"><h2>{title}</h2><div class="rdDescription">{description}</div></div>'
            },
            image,
            thumb,
            
        ];
        this.callParent(arguments);
    }
});
