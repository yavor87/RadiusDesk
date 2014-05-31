Ext.define('Mikrotik.view.cntPhotos', {
    extend: 'Ext.Container',
    xtype: 'cntPhotos',
    requires: [
        'Ext.XTemplate',
        'Ext.dataview.DataView',
        'Ext.data.Store',
        'Ext.carousel.Carousel',
        'Ext.XTemplate'
    ],
    config: {
        layout  : 'vbox',
        align   : 'center',
        pack    : 'center'
    },
    constructor: function(config) {
        var me          = this;
        var carousel    = Ext.create('Ext.Carousel', {itemId: 'crslPhoto',flex: 1 });
        var scaler_url  = Mikrotik.config.Config.getUrlScaler();

         var bigTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="rdCenter">',
                    '<h2>{title}</h2>',
                    '<span class="rdDescription">{description}</span>',
                    '<tpl if="Ext.isEmpty(url)">', //If the url is not empty add the link
                        '<div></div>',
                    '<tpl else>',
                        '<div><a href="{url}" target="_blank">{url}</a></div>',
                    '</tpl>',
                '</div>',
            '</tpl>'
        );
        
        Ext.Array.forEach(config.jsonData.photos,function(item,index,allItems){
            carousel.add(Ext.create('Ext.Panel', 
                {
                    layout: 'vbox',
                    itemId: item.id,
                    indexId: index,
                    items: [
                        {   
                            xtype   : 'container',
                            layout  : 'hbox',
                            items   : [
                                { xtype     : 'spacer', flex: 1 },
                                {
                                    xtype   : 'label',
                                    data    : {'title': item.title, 'msg' :item.description,'url': item.url},
                                    tpl     : bigTpl
                                },
                                { xtype     : 'spacer', flex: 1 }
                            ]
                        },
                        {
                            xtype   : 'img',
                            src     : item.file_name,
                            flex    : 1
                        }
                    ]
                })
            );
        },me);


        var thumb = Ext.create('Ext.DataView', {
            height: 100,
            scrollable: 'horizontal',
            itemId: 'datThumb',
            inline: {
                wrap: false
            },
            store: {
                fields  : ['id', 'title', 'description','file_name','url'],
                data    : config.jsonData.photos
            },
            itemTpl: '<tpl for="."><div class="rdThumb"><img src="'+scaler_url+'?height=90&width=90&image={file_name}"></div></tpl>'
        });

        config.items = [
            carousel,
            thumb
        ];
        me.callParent([config]);
    }
});
