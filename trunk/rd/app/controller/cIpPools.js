Ext.define('Rd.controller.cIpPools', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('iPPools');
        if(!win){
            win = desktop.createWindow({
                id          : 'iPPools',
                btnText     : 'IP Pools',
                width       :800,
                height      :400,
                glyph       : Rd.config.icnIP,
                animCollapse:false,
                border      :false,
                constrainHeader:true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'iPPools',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: 'IP Pools',
                        image:  'resources/images/48x48/ip_pools.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false,
						xtype   : 'gridIpPools'
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',			'iPPools.gridIpPools', 		'iPPools.winIpPoolsAddWizard'
    ],
    stores: ['sIpPools'	],
    models: ['mIpPool'	],
    selectedRecord: null,
    config: {
        urlExportCsv    : '/cake2/rd_cake/ip_pools/export_csv',
        urlAdd          : '/cake2/rd_cake/ip_pools/add.json',
        urlDelete       : '/cake2/rd_cake/top_ups/delete.json',
		urlEdit         : '/cake2/rd_cake/ip_pools/edit.json',
        urlView       	: '/cake2/rd_cake/top_ups/view.json'
    },
    refs: [
        {  ref: 'grid',  selector: 'gridIpPools'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sIpPools').addListener('load',me.onStoreIpPoolsLoaded, me);
        me.control({
            'gridIpPools #reload': {
                click:      me.reload
            },
            'gridIpPools #add': {
                click:      me.add
            } 
          /*  'gridIpPools #edit': {
                click:      me.edit
            }, 
            'gridIpPools #delete': {
                click:      me.del
            }, 
            'gridIpPools #csv'  : {
                click:      me.csvExport
            },
            'gridIpPools'   : {
                select:      me.select
            },
            'winIpPoolsAddWizard #btnTreeNext' : {
               // click:  me.btnTreeNext
            },
            'winIpPoolsAddWizard #btnDataPrev' : {
                //click:  me.btnDataPrev
            },
            'winIpPoolsAddWizard #btnDataNext' : {
                //click:  me.btnDataNext
            }*/
        });
    },
	reload: function(){
        var me =this;
        me.getGrid().getSelectionModel().deselectAll(true);
        me.getGrid().getStore().load();
    },
	onStoreIpPoolsLoaded: function() {
        var me      = this;
        var count   = me.getStore('sIpPools').getTotalCount();
        me.getGrid().down('#count').update({count: count});
    },
	add: function(button){
		var w = Ext.widget('winIpPoolsAddWizard',{id:'winIpPoolsAddWizardId'});
    	me.application.runAction('cDesktop','Add',w);
	}
});
