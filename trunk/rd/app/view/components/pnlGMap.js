Ext.define('Rd.view.components.pnlGMap', {
    extend:'Ext.ux.GMapPanel',
    alias :'widget.pnlGMap',
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu:        '/cake2/rd_cake/nas/menu_for_maps.json',
    markers: [],
    infoWindows: [],
    store: undefined,
    initComponent: function(){

        var me      = this;
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});

        //create a blank info window
        me.infowindow = new google.maps.InfoWindow({
            content: document.createElement('div')
        });

        
        me.editwindow = new google.maps.InfoWindow({
        });
        me.editwindow.eventBound    = false;
        me.editwindow.contentAdded  = false;

        me.callParent(arguments);
    },
    addMarker: function(marker) {
        var me = this;
        marker = Ext.apply({
            map: me.gmap
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
    createMap: function() {
        var me = this;
        me.callParent(arguments);
        me.store.load(); 
    }

});

