
Ext.define('Mikrotik.view.pnlPhotos', {
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
                fields  : ['id', 'title', 'description','file_name','url'],
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
        var url         = me.jsonData.photos[0].url;

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

        var bigTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="rdCenter">',
                    '<h2>{title}</h2>',
                    '<div class="rdDescription">{description}</div>',
                    '<tpl if="Ext.isEmpty(url)">', //If the url is not empty add the link
                        '<div></div>',
                    '<tpl else>',
                        '<div><a href="{url}" target="_blank">{url}</a></div>',
                    '</tpl>',
                '</div>',
            '</tpl>'
        );
   

        me.items = [
            {
                xtype   : 'panel',
                itemId  : 'pnlPhotoHeading',
                data    : {title: title, description :description, file_name:file_name,url:url},
                tpl     : bigTpl
            },
            image,
            thumb       
        ];
        this.callParent(arguments);
    }
});
