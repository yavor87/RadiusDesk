Ext.define('Rd.controller.cMeshes', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me      = this;
        var desktop = this.application.getController('cDesktop');
        var win     = desktop.getWindow('meshWin');
        if(!win){
            win = desktop.createWindow({
                id      : 'meshWin',
                title   : 'MESHdesk overview',
                width   : 800,
                height  : 400,
                iconCls : 'mesh',
                animCollapse:false,
                border  :false,
                constrainHeader:true,
                layout  : 'border',
                stateful: true,
                stateId : 'meshWin',
                items: [
                    {
                        region  : 'north',
                        xtype   : 'pnlBanner',
                        heading : 'MESHdesk overview',
                        image   : 'resources/images/48x48/mesh.png'
                    },
                    {
                        region  : 'center',
                        layout  : 'fit',
                        xtype   : 'gridMeshes',
                        margins : '0 0 0 0',
                        border  : true
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner', 'meshes.gridMeshes', 'meshes.winMeshAddWizard'
    ],
    stores      : ['sMeshes',   'sAccessProvidersTree'],
    models      : ['mMesh',     'mAccessProviderTree' ],
    selectedRecord: null,
    config      : {
        urlAdd:             '/cake2/rd_cake/meshes/add.json',
        urlEdit:            '/cake2/rd_cake/meshes/edit.json',
        urlApChildCheck:    '/cake2/rd_cake/access_providers/child_check.json'
    },
    refs: [
        {  ref: 'grid',  selector:   'gridMeshes'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;

        me.getStore('sMeshes').addListener('load',me.onStoreMeshesLoaded, me);
        me.control({
            '#meshWin'    : {
                beforeshow:      me.winClose
            },
            '#meshWin'    : {
                destroy:      me.winClose
            },
            'gridMeshes #reload': {
                click:      me.reload
            },
            'gridMeshes #reload menuitem[group=refresh]'   : {
                click:      me.reloadOptionClick
            },  
            'gridMeshes #add'   : {
                click:      me.add
            },
            'gridMeshes #delete'   : {
               // click:      me.del
            },
            'gridMeshes #edit'   : {
                //click:      me.edit
            },
            'winMeshAddWizard #btnTreeNext' : {
                click:  me.btnTreeNext
            },
            'winMeshAddWizard #btnDataPrev' : {
                click:  me.btnDataPrev
            },
            'winMeshAddWizard #btnDataNext' : {
                click:  me.btnDataNext
            },  
        });
    },
    winClose:   function(){
        var me = this;
        if(me.autoReload != undefined){
            clearInterval(me.autoReload);   //Always clear
        }
    },
    reload: function(){
        var me =this;
        me.getStore('sMeshes').load();
    },
    reloadOptionClick: function(menu_item){
        var me      = this;
        var n       = menu_item.getItemId();
        var b       = menu_item.up('button'); 
        var interval= 30000; //default
        clearInterval(me.autoReload);   //Always clear
        b.setIconCls('b-reload_time');
        
        if(n == 'mnuRefreshCancel'){
            b.setIconCls('b-reload');
            return;
        }
        
        if(n == 'mnuRefresh1m'){
           interval = 60000
        }

        if(n == 'mnuRefresh5m'){
           interval = 360000
        }
        me.autoReload = setInterval(function(){        
            me.reload();
        },  interval);  
    },
    onStoreMeshesLoaded: function() {
        var me      = this;
        var count   = me.getStore('sTags').getTotalCount();
        me.getGrid().down('#count').update({count: count});
    },
    add: function(button){
        
        var me = this;
        //We need to do a check to determine if this user (be it admin or acess provider has the ability to add to children)
        //admin/root will always have, an AP must be checked if it is the parent to some sub-providers. If not we will 
        //simply show the nas connection typer selection 
        //if it does have, we will show the tree to select an access provider.
        Ext.Ajax.request({
            url: me.urlApChildCheck,
            method: 'GET',
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                        
                    if(jsonData.items.tree == true){
                        if(!me.application.runAction('cDesktop','AlreadyExist','winMeshAddWizardId')){
                            var w = Ext.widget('winMeshAddWizard',{id:'winMeshAddWizardId'});
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }else{
                        if(!me.application.runAction('cDesktop','AlreadyExist','winMeshAddWizardId')){
                            var w = Ext.widget('winMeshAddWizard',
                                {id:'winMeshAddWizardId',startScreen: 'scrnData',user_id:'0',owner: i18n('sLogged_in_user'), no_tree: true}
                            );
                            me.application.runAction('cDesktop','Add',w);         
                        }
                    }
                }   
            },
            scope: me
        });

    },
    btnTreeNext: function(button){
        var me = this;
        var tree = button.up('treepanel');
        //Get selection:
        var sr = tree.getSelectionModel().getLastSelected();
        if(sr){    
            var win = button.up('winMeshAddWizard');
            win.down('#owner').setValue(sr.get('username'));
            win.down('#user_id').setValue(sr.getId());
            win.getLayout().setActiveItem('scrnData');
        }else{
            Ext.ux.Toaster.msg(
                        i18n('sSelect_an_owner'),
                        i18n('sFirst_select_an_Access_Provider_who_will_be_the_owner'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }
    },
    btnDataPrev:  function(button){
        var me      = this;
        var win     = button.up('winMeshAddWizard');
        win.getLayout().setActiveItem('scrnApTree');
    },
    btnDataNext:  function(button){
        var me      = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            success: function(form, action) {
                win.close();
                me.getStore('sMeshes').load();
                Ext.ux.Toaster.msg(
                    i18n('sNew_item_created'),
                    i18n('sItem_created_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
});
