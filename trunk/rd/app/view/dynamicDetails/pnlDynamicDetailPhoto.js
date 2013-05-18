Ext.define('Rd.view.dynamicDetails.pnlDynamicDetailPhoto', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDynamicDetailPhoto',
    border  : false,
    layout  : 'hbox',
    bodyStyle: {backgroundColor : Rd.config.panelGrey },
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu: '/cake2/rd_cake/dynamic_details/menu_for_photos.json',
    initComponent: function(){
        var me = this;

        //Create the view for the wallpapers:
        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="thumb-wrap">',
                    '<img src="{img}" />',
                    '<br/><span>{file}</span>',
                '</div>',
            '</tpl>'
        );

        var v = Ext.create('Ext.view.View', {
            store: 'sWallpapers',
            tpl: imageTpl,
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images available'
        });

        me.items =  {
                xtype       : 'panel',
                frame       : false,
                height      : '100%', 
                width       :  550,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items       : v,
                autoScroll  : true,
                tbar        : Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu}),
                bbar: [
                    {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi'  }
                ]
        };
        me.callParent(arguments);
    }
});
