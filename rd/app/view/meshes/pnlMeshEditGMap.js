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
	mapPanel	: '',
	tbar: [
    	{ xtype: 'buttongroup', title: i18n('sAction'), items : [
		{xtype: 'button', iconCls: 'b-settings', glyph: Rd.config.icnConfigure, scale: 'large', itemId: 'preferences', tooltip: i18n('sPreferences')},
        {xtype: 'button', iconCls: 'b-add',      glyph: Rd.config.icnAdd,       scale: 'large', itemId: 'add',         tooltip: i18n('sAdd')},
        {xtype: 'button', iconCls: 'b-delete',   glyph: Rd.config.icnDelete,    scale: 'large', itemId: 'delete',      tooltip: i18n('sDelete')},
        {xtype: 'button', iconCls: 'b-edit',     glyph: Rd.config.icnEdit, 		scale: 'large', itemId: 'edit',        tooltip: i18n('sEdit')}
        ]}    
    ],
    initComponent: function(){
        var me      = this;
        var cLat  	= me.centerLatLng.lat;
        var cLng  	= me.centerLatLng.lng;

		//This is required for the map even the most basic map!
        me.center 	= new google.maps.LatLng(cLat,cLng);

        //Create a shadow item:
        me.shadow = new google.maps.MarkerImage('resources/images/map_markers/shadow.png', null, null, new google.maps.Point(10, 34));

		//___Edit infowindow___
        var e_div =  document.createElement('div');
        e_div.status  = 'cleanDiv';  
        e_div.className = e_div.className + "mapDiv";
        var e_pnl;

        me.editwindow = new google.maps.InfoWindow({
            content: e_div
        });
        me.infoWindows.push(me.editwindow);

        google.maps.event.addListener(me.editwindow, 'domready', function(){
            var c= me.editwindow.getContent();   
			console.log(c.status);  
            if (c.status == 'cleanDiv'){ //Only load the first time!
                c.status = 'filledDiv';
				console.log(c.status); 
                var tpl = new Ext.Template([
                    "<div class='divMapAction'>",
                        "<label class='lblMap'>"+i18n("sNew_position")+"</label>",
						"<div style='clear:both;'></div>",
                        "<label class='lblMap'>"+ i18n("sLatitude")+"  </label><label class='lblValue'> {lat}</label>",
						"<div style='clear:both;'></div>",
                        "<label class='lblMap'>"+i18n("sLongitude")+"  </label><label class='lblValue'> {lng}</label>",
						"<div style='clear:both;'></div>",
                    "</div>"
                    ]
                );
                e_pnl = Ext.create('Ext.panel.Panel', {
                    title	: i18n("sAction_required"),
                    itemId	: 'pnlMapsEdit',
                    height	: 150,
                    tpl		: tpl,
                    bbar	: [
                        {
                            xtype   : 'button',
                            itemId  : 'save',
                            text    : i18n('sSave'),
                            scale   : 'large',
                            glyph   : Rd.config.icnYes
                        },
                        {
                            xtype   : 'button',
                            itemId  : 'cancel',
                            text    : i18n('sCancel'),
                            scale   : 'large',
                            glyph   : Rd.config.icnClose
                        },
                        {
                            xtype   : 'button',
                            itemId  : 'delete',
                            text    : i18n('sDelete'),
                            scale   : 'large',
                            glyph   : Rd.config.icnDelete
                        }  
                    ],
                    renderTo: c
                });
                e_pnl.update({"lng": me.new_lng,"lat": me.new_lat});
            
            }else{
               e_pnl.update({"lng": me.new_lng,"lat": me.new_lat});
            }
        });



		//___Add infowindow___
        me.addwindow = new google.maps.InfoWindow({
            content: "<div style='padding:5px;margin:5px; height:100px; width:200px;'><div class='lblRdReq'>"+
                        i18n("sAction_required")+
                     "</div><div class='lblRd'>"+
                        "Drag and drop marker to required position"+
                    "</div></div>"
        });
        me.infoWindows.push(me.addwindow);

        me.callParent(arguments);
    }

});

