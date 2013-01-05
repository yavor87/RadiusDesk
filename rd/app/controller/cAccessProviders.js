Ext.define('Rd.controller.cAccessProviders', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('accessProvidersWin');
        if(!win){
            win = desktop.createWindow({
                id: 'accessProvidersWin',
                title:'Access Providers',
                width:800,
                height:200,
                iconCls: 'key',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'accessProvidersWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:'Access Providers',
                        image:  'resources/images/48x48/key.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'tabpanel',
                        layout  : 'fit',
                        xtype   : 'tabpanel',
                        margins : '0 0 0 0',
                        border  : false,
                        items   : { 'title' : 'Access Providers','xtype':'treeAccessProviders'}   
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },
    views:  ['accessProviders.treeAccessProviders', 'accessProviders.pnlAccessProvider','accessProviders.frmDetail',
             'accessProviders.winDetail',           'accessProviders.treeApUserRights', 'accessProviders.gridRealms',   
            'components.pnlBanner'
            ],
    stores: ['sAccessProviders','sLanguages','sApRights'],
    models: ['mAccessProvider','mApUserRight','mApRealms'],
    selectedRecord: undefined,
    config: {
        urlAdd:   '/cake2/rd_cake/access_providers/add.json',
        urlEdit:   '/cake2/rd_cake/access_providers/edit.json'
    },
    refs: [
        { ref:    'treeAccessProviders',    selector:   'treeAccessProviders',  xtype:  '', autoCreate: true    },
        { ref: 'winAccessProviders',        selector:   '#accessProvidersWin'}
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            'treeAccessProviders #reload': {
                click:      me.reload
            },
            'treeAccessProviders #add': {
                click:      me.add
            },
            'treeAccessProviders #edit': {
                click:      me.edit
            },
            'treeAccessProviders #delete': {
                click:      me.del
            },
            '#accessProvidersWin treeAccessProviders'   : {
                itemclick:  me.gridClick
            },
            'winAccessProviderDetail #save': {
                click:      me.addSubmit
            },
            'treeAccessProviders #expand': {
                click:      me.expand
            },
            'treeAccessProviders #password': {
                click:      me.password
            },
            'pnlAccessProvider frmAccessProviderDetail #save': {
                click:      me.editSubmit
            },
            'pnlAccessProvider treeApUserRights #reload': {
                click:      me.apRightReload
            },
            'pnlAccessProvider treeApUserRights #expand': {
                click:      me.apRightExpand
            },
            'pnlAccessProvider treeApUserRights advCheckColumn': {
                checkchange: me.apRightChange
            },
            'pnlAccessProvider gridApRealms #reload': {
                click:      me.apRealmsReload
            },
        });;
    },
    reload: function(){
        var me =this;
        me.getStore('sAccessProviders').load();
    },
    add:    function(){
        var me = this;
        console.log("Add node");
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeAccessProviders().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node of the tree under which to add an item',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        'Limit the selection',
                        'Selection limited to one',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                var otherWarn = false;
                //Check if the owner = the person under which the new AP is added
                if(me.selectedRecord.getId() != '0'){
                    otherWarn = true;
                }

                if(otherWarn == true){
                    var parent = me.selectedRecord.get('username');
                    Ext.Msg.confirm('Confirm', 'The creator of the Access Provider will be '+parent, function(val){
                        if(val== 'yes'){
                            Ext.widget('winAccessProviderDetail',
                                { parent_name: me.selectedRecord.get('username'),parent_id: me.selectedRecord.getId() }
                            );
                        }
                    });  

                }else{          
                    Ext.widget('winAccessProviderDetail',
                        { parent_name: me.selectedRecord.get('username'),parent_id: me.selectedRecord.getId() }
                    );
                }
            }
        }  
    },
    addSubmit: function(button){
        var me       = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAdd,
            success: function(form, action) {
                win.close();
                me.getTreeAccessProviders().getStore().load();
                Ext.ux.Toaster.msg(
                    'New Access Provider Created',
                    'Access Provider created fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    edit:   function(){
        console.log("Edit node");
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeAccessProviders().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node to edit',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        'Limit the selection',
                        'Selection limited to one',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{

                //We are not suppose to edit the root node
                if(me.selectedRecord.getId() == 0){
                    Ext.ux.Toaster.msg(
                        'Root node selected',
                        'You can not edit the root node',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                    );

                }else{

                    //Check if the node is not already open; else open the node:
                    var tp          = me.getTreeAccessProviders().up('tabpanel');
                    var ap_id       = me.selectedRecord.getId();
                    var ap_tab_id   = 'apTab_'+ap_id;
                    var nt          = tp.down('#'+ap_tab_id);
                    if(nt){
                        tp.setActiveTab(ap_tab_id); //Set focus on  Tab
                        return;
                    }

                    var ap_tab_name = me.selectedRecord.get('username');
                    //Tab not there - add one
                    tp.add({ 
                        title :     ap_tab_name,
                        itemId:     ap_tab_id,
                        closable:   true,
                        iconCls:    'edit', 
                        layout:     'fit', 
                        items:      {'xtype' : 'pnlAccessProvider',ap_id: ap_id}
                    });
                    tp.setActiveTab(ap_tab_id); //Set focus on Add Tab
                    //Load the record:
                    var nt  = tp.down('#'+ap_tab_id);
                    var f   = nt.down('form');
                    f.loadRecord(me.selectedRecord);    //Load the record
                    //Get the parent node
                    me.selectedRecord.parentNode.get('username');
                    f.down("displayfield").setValue(me.selectedRecord.parentNode.get('username'));
                }  
            }
        }
    },
    editSubmit: function(button){
        console.log("Edit submit");
        var me      = this;
        var form    = button.up('form');
        form.submit({
            clientValidation: true,
            url: me.urlEdit,
            success: function(form, action) {
                me.getTreeAccessProviders().getStore().load();
                Ext.ux.Toaster.msg(
                    'Access Provider Updated',
                    'Access Provider updated fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    del:   function(){
        console.log("Delete node");
        var me      = this;     
        //Find out if there was something selected
        var sel_count = me.getTreeAccessProviders().getSelectionModel().getCount();
        if(me.getTreeAccessProviders().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node to delete',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
             if(sel_count > 1){
                Ext.ux.Toaster.msg(
                        'Limit the selection',
                        'Selection limited to one',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                );
            }else{
                if(!me.selectedRecord.isLeaf()){
                    Ext.ux.Toaster.msg(
                        'Access Provider has children',
                        'First delete all the children',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                    ); 
                }else{
                    me.delClear();
                }
            }
        }
    },
    delClear: function(){
        var me = this;
        Ext.Msg.confirm('Confirm', 'Are you sure you want to do that?', function(val){
            if(val== 'yes'){
                Ext.each(me.getTreeAccessProviders().getSelectionModel().getSelection(), function(item){
                    //console.log(item.getId());
                    item.remove(true);
                });
                me.getTreeAccessProviders().getStore().sync({
                    success: function(batch,options){
                        Ext.ux.Toaster.msg(
                            'Node Deleted',
                            'Deletion went fine',
                            Ext.ux.Constants.clsInfo,
                            Ext.ux.Constants.msgInfo
                        ); 
                        //Reload to sort out the leaf nodes
                        me.getTreeAccessProviders().getStore().load();
                    },
                    failure: function(batch,options){
                        Ext.ux.Toaster.msg(
                            'Problems deleting node',
                            'There were some problems experienced during the deleting of the node',
                            Ext.ux.Constants.clsWarn,
                            Ext.ux.Constants.msgWarn
                        );
                    }
                });

            }
        });
    },
    gridClick:  function(grid, record, item, index, event){
        var me = this;
        me.selectedRecord = record;
    },
    expand: function(){
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeAccessProviders().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node to expand',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            me.getTreeAccessProviders().expandNode(me.selectedRecord,true); 
        }
    },
    password: function(){
        console.log("Change password");
    },
    apRightReload: function(button){
        me = this;
        var tree = button.up('treeApUserRights');
        tree.getStore().load();
    },
    apRightExpand: function(button){
        me = this;
        var tree = button.up('treeApUserRights');
        var sel_count = tree.getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node to expand',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            var sr = tree.getSelectionModel().getLastSelected();
            tree.expandNode(sr,true); 
        }
    },
    apRightChange: function(i){
        var me      = this;
        var tree    = i.up('treeApUserRights');
        tree.getStore().sync({
            success: function(batch,options){
                Ext.ux.Toaster.msg(
                    'Right Changed',
                    'Right changed OK',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                ); 
            },
            failure: function(batch,options){
                Ext.ux.Toaster.msg(
                    'Problems changing right',
                    'There were some problems experienced during changing of the right',
                    Ext.ux.Constants.clsWarn,
                    Ext.ux.Constants.msgWarn
                );
            }
        });
    },
    apRealmsReload: function(button){
        var me = this;
        var grid = button.up('gridApRealms');
        grid.getStore().load();
    }
});
