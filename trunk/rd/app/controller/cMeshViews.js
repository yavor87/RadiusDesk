Ext.define('Rd.controller.cMeshViews', {
    extend: 'Ext.app.Controller',
    views:  [
        'components.pnlBanner', 	'meshes.winMeshView', 		'meshes.gridMeshViewEntries',	
		'meshes.gridMeshViewNodes',	'meshes.pnlMeshViewNodes',	'meshes.gridMeshViewNodeNodes',
		'meshes.gridMeshViewNodeDetails',						'meshes.pnlMeshViewGMap'
    ],
    stores      : [

    ],
    models      : [

    ],
    config      : {  
        urlApChildCheck		: '/cake2/rd_cake/access_providers/child_check.json',
		urlMapPrefView		: '/cake2/rd_cake/meshes/map_pref_view.json',
    },
    refs: [
       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.control({
			//==== MESHdesk View related ====
            'winMeshView gridMeshViewEntries #reload' : {
                click: me.reloadViewEntry
            },
            'winMeshView gridMeshViewEntries button' : {
                toggle: me.viewEntryTimeToggle
            },
            'winMeshView gridMeshViewNodes #reload' : {
                click: me.reloadViewNode
            },
            'winMeshView gridMeshViewNodes button' : {
                toggle: me.viewNodeTimeToggle
            },
            'winMeshView #tabMeshViewEntries': {
                activate:       me.tabMeshViewEntriesActivate
            },
            'winMeshView #tabMeshViewNodes': {
                activate:       me.tabMeshViewNodesActivate
            },
			'winMeshView #tabMeshViewNodeNodes': {
                activate:       me.tabMeshViewNodeNodesActivate
            },
            'winMeshView gridMeshViewEntries #reload menuitem[group=refresh]'   : {
                click:      function(menu){
                    var me = this;
                    me.autoRefresh(menu,'entries');
                }
            },
            'winMeshView gridMeshViewNodes #reload menuitem[group=refresh]'   : {
                click:      function(menu){
                    me.autoRefresh(menu,'nodes');
                }
            },
			'winMeshView gridMeshViewNodeNodes #reload menuitem[group=refresh]'   : {
                click:      function(menu){
                    me.autoRefresh(menu,'node_nodes');
                }
            }, 
            'winMeshView': {
                beforeshow:      me.winViewClose,
                destroy   :      me.winViewClose
            },
			'winMeshView pnlMeshViewNodes':	{
				activate:		function(pnl){
					pnl.getData()
				}
			},
			'winMeshView pnlMeshViewNodes #reload':	{
				click:		function(button){
					var me 	= this;
					var pnl = button.up("pnlMeshViewNodes");
					pnl.getData()
				}
			},
			'winMeshView gridMeshViewNodeNodes #reload':	{
				click: me.reloadViewNodeNodes
			},
			'winMeshView gridMeshViewNodeNodes button' : {
                toggle: me.viewNodeNodesTimeToggle
            },
			'gridMeshViewNodeDetails #map' : {
                click: 	me.mapLoadApi
            },
        });
    },
    actionIndex: function(mesh_id,name){
        var me      = this;
		var id      = 'winMeshView'+mesh_id; 
        if(!me.application.runAction('cDesktop','AlreadyExist',id)){
            var w = Ext.widget('winMeshView',{id:id, name:name, stateId:id,title: 'MESHdesk view '+name, itemId: mesh_id});
            me.application.runAction('cDesktop','Add',w);      
        }
    },
	viewEntryTimeToggle: function(button,pressed){
        var me = this;
        if(pressed){
            me.reloadViewEntry(button);  
        }
    },
    reloadViewEntry: function(button){
        var me      = this;
        var win     = button.up("winMeshView");
        var entGrid = win.down("gridMeshViewEntries");
        var day     = entGrid.down('#day');
        var week    = entGrid.down('#week');
        var span    = 'hour';
        if(day.pressed){
            span='day';
        }
        if(week.pressed){
            span='week';
        }
        entGrid.getStore().getProxy().setExtraParam('timespan',span);
        entGrid.getStore().reload();
    },
    viewNodeTimeToggle: function(button,pressed){
        var me = this;
        if(pressed){
            me.reloadViewNode(button);  
        }
    },
    reloadViewNode: function(button){
        var me      = this;
        var win     = button.up("winMeshView");
        var entGrid = win.down("gridMeshViewNodes");
        var day     = entGrid.down('#day');
        var week    = entGrid.down('#week');
        var span    = 'hour';
        if(day.pressed){
            span='day';
        }
        if(week.pressed){
            span='week';
        }
        entGrid.getStore().getProxy().setExtraParam('timespan',span);
        entGrid.getStore().reload();
    },
	viewNodeNodesTimeToggle: function(button,pressed){
        var me = this;
        if(pressed){
            me.reloadViewNodeNodes(button);  
        }
    },
	reloadViewNodeNodes: function(button){
        var me      = this;
        var win     = button.up("winMeshView");
        var entGrid = win.down("gridMeshViewNodeNodes");
        var day     = entGrid.down('#day');
        var week    = entGrid.down('#week');
        var span    = 'hour';
        if(day.pressed){
            span='day';
        }
        if(week.pressed){
            span='week';
        }
        entGrid.getStore().getProxy().setExtraParam('timespan',span);
        entGrid.getStore().reload();
    },
    tabMeshViewNodesActivate: function(tab){
        var me = this;
        var b = tab.down('#reload');
        me.reloadViewNode(b);
    },
    tabMeshViewEntriesActivate: function(tab){
        var me = this;
        var b = tab.down('#reload');
        me.reloadViewEntry(b);
    },
	tabMeshViewNodeNodesActivate: function(tab){
        var me = this;
        var b = tab.down('#reload');
        me.reloadViewNodeNodes(b);
    },
    autoRefresh: function(menu_item,item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoRefresInterval);   //Always clear
        b.setIconCls('b-reload_time');
        b.setGlyph(Rd.config.icnTime);

        if(n == 'mnuRefreshCancel'){
            b.setGlyph(Rd.config.icnReload);
            b.setIconCls('b-reload');
            return;
        }
        
        if(n == 'mnuRefresh1m'){
           interval = 60000
        }

        if(n == 'mnuRefresh5m'){
           interval = 360000
        }
        me.autoRefresInterval = setInterval(function(){ 
            if(item == 'nodes'){
                me.reloadViewNode(b);
            }

			 if(item == 'node_nodes'){
                me.reloadViewNodeNodes(b);
            }  

            if(item == 'entries'){
                me.reloadViewEntry(b);
            }       
        },  interval);  

    },
    winViewClose:   function(){
        var me = this;
        if(me.autoRefresInterval != undefined){
            clearInterval(me.autoRefresInterval);   //Always clear
        }
    },
	//____ MAP ____
    mapLoadApi:   function(button){
        var me 	= this;
		Ext.ux.Toaster.msg(
	        'Loading Google Maps API',
	        'Please be patient....',
	        Ext.ux.Constants.clsInfo,
	        Ext.ux.Constants.msgInfo
	    );
	    Ext.Loader.loadScriptFile('https://www.google.com/jsapi',function(){
	        google.load("maps", "3", {
	            other_params	:"sensor=false",
	            callback 		: function(){
	            	// Google Maps are loaded. Place your code here
	                me.mapCreatePanel(button);
	        	}
	    	});
	    },Ext.emptyFn,null,false);
    },
    mapCreatePanel : function(button){
        var me = this
        var tp          = button.up('tabpanel');
        var map_tab_id  = 'mapTab';
        var nt          = tp.down('#'+map_tab_id);
        if(nt){
            tp.setActiveTab(map_tab_id); //Set focus on  Tab
            return;
        }

        var map_tab_name = i18n("sGoogle_Maps");
		var win 		= tp.up('winMeshView');
		var mesh_id		= win.getItemId();

        //We need to fetch the Preferences for this user's Google Maps map
        Ext.Ajax.request({
            url		: me.urlMapPrefView,
            method	: 'GET',
			params	: {
				mesh_id	: mesh_id
			},
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){     
                   	//console.log(jsonData);
					//___Build this tab based on the preferences returned___
                    tp.add({ 
                        title 		: map_tab_name,
                        itemId		: map_tab_id,
                        closable	: true,
                        glyph		: Rd.config.icnMap, 
                        layout		: 'fit', 
                        xtype		: 'pnlMeshViewGMap',
                        mapOptions	: {zoom: jsonData.data.zoom, mapTypeId: google.maps.MapTypeId[jsonData.data.type] },	//Required for map
                       	centerLatLng: {lat:jsonData.data.lat,lng:jsonData.data.lng},										//Required for map
                       	markers		: [],
						meshId		: mesh_id
                    });
                    tp.setActiveTab(map_tab_id); //Set focus on Add Tab
                    //____________________________________________________   
                }   
            },
			failure: function(batch,options){
                Ext.ux.Toaster.msg(
                    'Problems getting the map preferences',
                    'Map preferences could not be fetched',
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
            },
			scope: me
        });
    }
});
