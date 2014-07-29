Ext.define('Rd.view.meshes.pnlMeshEditGMap', {
    extend:'Ext.ux.GMapPanel',
    alias :'widget.pnlMeshEditGMap',
    markers     : [],
    infoWindows : [],
    infowindow  : undefined,
    editwindow  : undefined,
    addwindow   : undefined,
    shadow      : undefined,
    store       : undefined,
    centerLatLng: undefined,
	meshId		: '',
	tbar: [
    	{ xtype: 'buttongroup', title: i18n('sAction'), items : [
		{xtype: 'button', iconCls: 'b-settings', glyph: Rd.config.icnConfigure, scale: 'large', itemId: 'preferences', tooltip: i18n('Preferences')},
        {xtype: 'button', iconCls: 'b-add',      glyph: Rd.config.icnAdd,       scale: 'large', itemId: 'add',         tooltip: i18n('Add')},
        {xtype: 'button', iconCls: 'b-delete',   glyph: Rd.config.icnDelete,    scale: 'large', itemId: 'delete',      tooltip: i18n('Delete')},
        {xtype: 'button', iconCls: 'b-edit',     glyph: Rd.config.icnEdit, 		scale: 'large', itemId: 'edit',        tooltip: i18n('Edit')}
        ]}    
    ],
    initComponent: function(){
        var me      = this;
        var cLat  	= me.centerLatLng.lat;
        var cLng  	= me.centerLatLng.lng;
        me.center 	= new google.maps.LatLng(cLat,cLng);
        //Create a shadow item:
        me.shadow = new google.maps.MarkerImage('resources/images/map_markers/shadow.png', null, null, new google.maps.Point(10, 34));
        me.callParent(arguments);

    }

});

