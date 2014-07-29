Ext.define('Rd.controller.cMeshViews', {
    extend: 'Ext.app.Controller',
    views:  [
        'components.pnlBanner', 	'meshes.winMeshView', 	'meshes.gridMeshViewEntries',	
		'meshes.gridMeshViewNodes',	'meshes.pnlMeshViewNodes'
    ],
    stores      : [

    ],
    models      : [

    ],
    config      : {  
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json',
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
			}  
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
    }
});
