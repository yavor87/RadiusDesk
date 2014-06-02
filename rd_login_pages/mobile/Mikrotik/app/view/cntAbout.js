Ext.define('Mikrotik.view.cntAbout', {
    extend: 'Ext.Container',
    xtype: 'cntAbout',
    requires: [
        'Ext.Label',
        'Ext.XTemplate'
    ],
    config: {
        cls: 'sessionClass'
    },
    constructor: function(config) {
        var me          = this;
        var scaler_url  = Mikrotik.config.Config.getUrlScaler();
        config.items    = [
            {
                xtype   :  'container',
                layout  : 'hbox',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                }, 
                items: [
                    { xtype     : 'spacer', flex: 1 },
                    {
                        itemId: 'cntSession',
                        tpl: [
                                '<div class="rdWrapper">',
                                '<div>',
                                '<h2>{name}</h2><img src="'+scaler_url+'?height=90&width=90&image={icon_file_name}">',
                                '</div>',
                                '<div class="alternate"><div class="item">Cell</div><div class="value">{cell}</div></div>',
                                '<div><div class="item">Phone</div><div class="value">{phone}</div></div>',
                                '<div class="alternate"><div class="item">Address</div><div class="value">{street_no} {street}</div></div>',
                                '<div><div class="item">Suburb</div><div class="value">{town_suburb}</div></div>',
                                '<div class="alternate"><div class="item">City</div><div class="value">{city}</div></div>',
                                '<div><div class="item">Country</div><div class="value">{country}</div></div>',
                                '<div class="alternate"><div class="item">Lon</div><div class="value">{lon}</div></div>',
                                '<div><div class="item">Lat</div><div class="value">{lat}</div></div>',
                                '<div class="alternate"><a href="mailto:{email}">{email}</a> </div>',
                                '<div"><a href="{url}">{url}</a></div>'
                        ],
                        data : config.jsonData.detail,
                        xtype:  'container'
                    },
                    { xtype     : 'spacer', flex: 1 }
                ]
            }
        ]; 
        me.callParent([config]); 
    }
});
