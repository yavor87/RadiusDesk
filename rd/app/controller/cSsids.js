Ext.define('Rd.controller.cSsids', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('sSidsWin');
        if(!win){
            win = desktop.createWindow({
                id          : 'sSidsWin',
                btnText     : 'SSIDs manager',
                width       :800,
                height      :400,
                glyph       : Rd.config.icnWifi,
                animCollapse:false,
                border      :false,
                constrainHeader:true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'sSidsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: 'SSIDs manager',
                        image:  'resources/images/48x48/ssids.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner'
    ],
    stores: [],
    models: [],
    selectedRecord: null,
    config: {
        urlApChildCheck : '/cake2/rd_cake/access_providers/child_check.json',
        urlExportCsv    : '/cake2/rd_cake/top_ups/export_csv',
        urlAdd          : '/cake2/rd_cake/top_ups/add.json',
        urlDelete       : '/cake2/rd_cake/top_ups/delete.json'
    },
    refs: [
        //{  ref: 'grid',  selector: 'gridTopUps'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
/*
        me.getStore('sTopUps').addListener('load',me.onStoreTopUpsLoaded, me);
        me.control({
            '#topUpsWin'    : {
                beforeshow  : me.winClose,
                destroy     : me.winClose
            },
            'gridTopUps #reload': {
                click:      me.reload
            },
            'gridTopUps #reload menuitem[group=refresh]' : {
                click:      me.reloadOptionClick
            }, 
            'gridTopUps #add': {
                click:      me.add
            }, 
            'gridTopUps #edit': {
                click:      me.edit
            }, 
            'gridTopUps #delete': {
                click:      me.del
            }, 
            'gridTopUps #csv'  : {
                click:      me.csvExport
            },
            'gridTopUps'   : {
                select:      me.select
            },
            'winTopUpAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winTopUpAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winTopUpAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },
            'winTopUpAddWizard #cmbType' : {
                change:  me.cmbTopUpTypeChanged
            },
        });
*/
    }
});
