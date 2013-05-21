Ext.define('CoovaLogin.view.Land' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.land',
    layout: 'fit',
    border: false,
    margins: '0 0 0 0',
    require: 'CoovaLogin.view.AboutMenu',
    initComponent: function() { 

        var me = this;
        var t = this.createTopToolbar();
        var b = this.createBottomToolbar();
        this.dockedItems = [t,b];
        this.items = this.createItems(); 
        this.callParent(); 
    }, 
 
    createItems: function() {
      //  return Ext.create('Ext.Img', {src: 'resources/images/1.jpg'})
        return Ext.create('Ext.Img', {src: Ext.BLANK_IMAGE_URL});

    },
    createTopToolbar: function(){

        var me = this;
        var a = Ext.create('CoovaLogin.view.AboutMenu',{'title': me.info.name,'data':me.info});
        return  Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            itemId: 'topToolbar',
            defaults: {
                    margin: 5,
                    padding: 5
            },
            items: [
            {
                html: 'Click to connect',
                cls: 'topButton',             
                iconCls: 'b-connect',
                tooltip: 'Connect to the Internet',
                scale: 'large',
                toggleGroup: 'actions',
                enableToggle: true,
                pressed: true,
                itemId: 'connect'
            }, 
            {
                html: 'Help',
                cls: 'topButton',             
                iconCls: 'b-help',
                tooltip: 'Help',
                scale: 'large',
                itemId: 'help'
            }, 
            '->',
            {
                text: 'About',
                cls: 'topButton',
                iconCls: 'b-info-top',  
                scale: 'large',
                itemId: 'about',
                menu: a
            }
    ]
});

    },
    createBottomToolbar: function(){

        return  Ext.create('Ext.toolbar.Toolbar', {
            dock: 'bottom',
            items: [
            '->',
            {
                scale: 'large',
                iconCls: 'b-prev',
                disabled: true,
                itemId: 'btnPrev'
            }, 
            {
                scale: 'large',
                iconCls: 'b-next',
                disabled: true,
                itemId: 'btnNext'
            }, 
            {
                scale: 'large',
                iconCls: 'b-info',
                disabled: true,
                itemId: 'btnInfo'
            }
        ]

    });
    }
});
