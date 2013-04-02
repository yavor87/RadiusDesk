Ext.define('Rd.view.components.pnlGMap', {
    extend:'Ext.ux.GMapPanel',
    alias :'widget.pnlGMap',
    requires: [
        'Rd.view.components.ajaxToolbar',
        'Rd.view.components.cmpImg'
    ],
    urlMenu:        '/cake2/rd_cake/nas/menu_for_maps.json',
    markers     : [],
    infoWindows : [],
    infowindow  : undefined,
    editwindow  : undefined,
    addwindow   : undefined,
    shadow      : undefined,
    store       : undefined,
    initComponent: function(){

        var me      = this;
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});

        //Create a shadow item:
        me.shadow = new google.maps.MarkerImage('resources/images/map_markers/shadow.png', null, null, new google.maps.Point(10, 34));

        //___Info infowindow___
        var i_div =  document.createElement('div');
        i_div.id  = 'clean_I_Div';  
        i_div.className = i_div.className + "map_I_Div";
        var i_pnl;

        me.infowindow = new google.maps.InfoWindow({
            content: i_div
        });
        me.infoWindows.push(me.infowindow);

        google.maps.event.addListener(me.infowindow, 'domready', function(){
            console.log("info dom ready");
            var c= me.infowindow.getContent();     
            if (c.id == 'clean_I_Div'){ //Only load the first time!
                c.id = 'filled_I_Div';
                var tpl = new Ext.Template([
                   "<div class='divMapAction'>",
                        "<label class='lblMap'>"+i18n("sName")+"  </label><label class='lblRd'> {sortname}</label><br>",
                        "<label class='lblMap'>"+ i18n("sIP_Address")+"  </label><label class='lblRd'> {nasname}</label><br>",
                    "</div>"
                    ]
                );               
                var p = Ext.create('Ext.tab.Panel', {
                    itemId: 'pnlMapsInfo',
                    width: 300,
                    height: 200,
                    activeTab: 0,
                    items: [
                        {
                            title: 'Info',
                            itemId: 'tabMapInfo',
                            bodyPadding: 10,
                            tpl : tpl
                        },
                        {
                            title: 'Photo',
                            itemId: 'tabMapPhoto',
                            items: [
                                {'xtype' : 'cmpImg'}
                            ]
                        }
                    ],
                    renderTo : c
                });
            
            }else{

            }
        });

        //___Edit infowindow___
        var e_div =  document.createElement('div');
        e_div.id  = 'cleanDiv';  
        e_div.className = e_div.className + "mapDiv";
        var e_pnl;

        me.editwindow = new google.maps.InfoWindow({
            content: e_div
        });
        me.infoWindows.push(me.editwindow);

        google.maps.event.addListener(me.editwindow, 'domready', function(){
            var c= me.editwindow.getContent();     
            if (c.id == 'cleanDiv'){ //Only load the first time!
                c.id = 'filledDiv';
                var tpl = new Ext.Template([
                    "<div class='divMapAction'>",
                        "<label class='lblMap'>"+i18n("sNew_position")+"</label><br><br>",
                        "<label class='lblMap'>"+ i18n("sLatitude")+"  </label><label class='lblRd'> {lat}</label><br>",
                        "<label class='lblMap'>"+i18n("sLongitude")+"  </label><label class='lblRd'> {lng}</label><br>",
                    "</div>"
                    ]
                );
                e_pnl = Ext.create('Ext.panel.Panel', {
                    title: i18n("sAction_required"),
                    itemId: 'pnlMapsEdit',
                    height: 170,
                    tpl: tpl,
                    bbar: [
                        {
                            xtype   : 'button',
                            itemId  : 'save',
                            text    : i18n('sSave'),
                            scale   : 'large',
                            iconCls : 'b-save'
                        },
                        {
                            xtype   : 'button',
                            itemId  : 'cancel',
                            text    : i18n('sCancel'),
                            scale   : 'large',
                            iconCls : 'b-close'
                        },
                        {
                            xtype   : 'button',
                            itemId  : 'delete',
                            text    : i18n('sDelete'),
                            scale   : 'large',
                            iconCls : 'b-delete'
                        }  
                    ],
                    renderTo: c
                });
                e_pnl.update({"lng": me.new_lng,"lat": me.new_lat});

            /*
                var p = Ext.create('Ext.tab.Panel', {
                    width: 300,
                    height: 200,
                    activeTab: 0,
                    items: [
                        {
                            title: 'Tab 1',
                            bodyPadding: 10,
                            html : 'A simple tab'
                        },
                        {
                            title: 'Tab 2',
                            html : 'Another one'
                        }
                    ],
                    renderTo : c
                });
                p.render();
            */
            
            }else{
               e_pnl.update({"lng": me.new_lng,"lat": me.new_lat});
            }
        });

        //___Add infowindow___
        me.addwindow = new google.maps.InfoWindow({
            content: "<div class='lblRdReq'>"+
                        i18n("sAction_required")+
                     "</div><div class='lblRd'>"+
                        i18n("sDrag_and_drop_marker_to_required_position")+
                    "</div>"
        });
        me.infoWindows.push(me.addwindow);
        me.callParent(arguments);
    },
    addMarker: function(marker) {
        var me = this;
       
        marker = Ext.apply({
            map     : me.gmap,
            shadow  : me.shadow 
        }, marker);
        
        if (!marker.position) {
            marker.position = new google.maps.LatLng(marker.lat, marker.lng);
        }
        var o =  new google.maps.Marker(marker);
        Ext.Object.each(marker.listeners, function(name, fn){
            google.maps.event.addListener(o, name, fn);    
        });
        me.markers.push(o);
        return o;
    },
    clearMarkers: function(){
        var me = this;
        while(me.markers[0]){
            me.markers.pop().setMap(null);
        }
    },
/*
    showInfoWindow: function(infoW){
        var me = this;
        infoW = Ext.apply({ //Apply the map to it
            map: me.gmap
        }, infoW);

        if (!infoW.position) {
            infoW.position = new google.maps.LatLng(infoW.lat, infoW.lng);
        }

        var o =  new google.maps.InfoWindow(infoW);
        Ext.Object.each(infoW.listeners, function(name, fn){
            google.maps.event.addListener(o, name, fn);    
        });
        me.infoWindows.push(o);
        return o;
    },
*/
    createMap: function() {
        var me = this;
        me.callParent(arguments);
        me.store.load(); 
    }

});

