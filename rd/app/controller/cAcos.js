Ext.define('Rd.controller.cAcos', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('acosWin');
        if(!win){
            win = desktop.createWindow({
                id: 'acosWin',
                title:'Rights manager',
                width:800,
                height:400,
                iconCls: 'rights',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'fit',
                stateful: true,
                stateId: 'acosWin',
                items: [{
                    'xtype': 'tabpanel',
                    layout: 'fit',
                    items: [
                        { 'title' : 'Access Controll Objects','xtype':'treeAco'},
                        { 'title' : 'Access Provider Rights','xtype':'treeApRights'},  
                        { 'title' : 'Permanent User Rights'},
                    ]
                }]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },
    views:  ['acos.treeAco','acos.winAcoAdd','acos.winAcoEdit','acos.treeApRights'],
    stores: ['sAcos','sApRights'],
    models: ['mAco','mApRight'],
    acoSelectedRecord: undefined,
    apRightsSelectedRecord: undefined,
    config: {
        urlAcosRightsAdd:   '/cake2/rd_cake/acos_rights/add.json',
        urlAcosRightEdit:   '/cake2/rd_cake/acos_rights/edit.json'
    },
    refs: [
         {  ref:    'treeAco',      selector:   'treeAco'},
         {  ref:    'treeApRights', selector:   'treeApRights'} 
    ],
    init: function() {
        me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            'treeAco #reload': {
                click:      me.acoReload
            },
            'treeAco #add': {
                click:      me.acoAdd
            },
            'treeAco #edit': {
                click:      me.acoEdit
            },
            'treeAco #delete': {
                click:      me.acoDelete
            },
            'treeAco #expand': {
                click:      me.acoExpand
            },
            'winAcoAdd #save':{
                click:      me.acoAddSubmit
            },
            'winAcoEdit #save':{
                click:      me.acoEditSubmit
            },
            '#acosWin treeAco'   : {
                itemclick:  me.acoGridClick
            },
            'treeApRights advCheckColumn': {
                checkchange: me.apRightChange
            },
            '#acosWin treeApRights'   : {
                itemclick:  me.apRightsGridClick
            },
            'treeApRights #reload': {
                click:      me.apRightsReload
            },
            'treeApRights #expand': {
                click:      me.apRightsExpand
            }
        });;
    },
    acoReload: function(){
        var me =this;
        me.getStore('sAcos').load();
    },
    acoAdd:    function(){
        var me = this;
        console.log("Add node");
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeAco().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node of the tree under which to add an ACO entry',
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

                console.log(me.acoSelectedRecord.getId());
                var parent_id = me.acoSelectedRecord.getId();
                var alias     = me.acoSelectedRecord.get('alias');
                Ext.widget('winAcoAdd',{'parentId': parent_id,'parentDisplay': alias});

            }
        }
        
    },
    acoAddSubmit: function(button){
        var me       = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAcosRightsAdd,
            success: function(form, action) {
                win.close();
                me.getTreeAco().getStore().load();
                Ext.ux.Toaster.msg(
                    'Node added',
                    'New Node added fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    acoEdit:   function(){
        console.log("Edit node");
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeAco().getSelectionModel().getCount();
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
                if(me.acoSelectedRecord.getId() == 0){
                    Ext.ux.Toaster.msg(
                        'Root node selected',
                        'You can not edit the root node',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
                    );

                }else{
                    var w_edit = Ext.widget('winAcoEdit',{});
                    w_edit.down('form').loadRecord(me.acoSelectedRecord);
                    //Set the parent ID
                    w_edit.down('hiddenfield[name="parent_id"]').setValue(me.acoSelectedRecord.parentNode.getId());
                }  
            }
        }
    },
    acoEditSubmit: function(button){
        var me       = this;
        var win     = button.up('window');
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlAcosRightEdit,
            success: function(form, action) {
                win.close();
                me.getTreeAco().getStore().load();
                Ext.ux.Toaster.msg(
                    'Item updated',
                    'Item updated fine',
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },


    acoDelete:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getTreeAco().getSelectionModel().getCount() == 0){
            Ext.Msg.alert('Select please', 'Select a node to delete');
        }else{
            Ext.Msg.confirm('Confirm', 'Are you sure you want to do that?', function(val){
                if(val== 'yes'){

                    Ext.each(me.getTreeAco().getSelectionModel().getSelection(), function(item){
                            //console.log(item.getId());
                            item.remove(true);
                    });
                    me.getTreeAco().getStore().sync({
                        success: function(batch,options){
                            Ext.ux.Toaster.msg(
                                'Node Deleted',
                                'Deletion went fine',
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            ); 
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
        }
    },
    acoGridClick:  function(grid, record, item, index, event){
        var me = this;
        me.acoSelectedRecord = record;
    },
    acoExpand: function(){
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeAco().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node to expand',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            me.getTreeAco().expandNode(me.acoSelectedRecord,true); 
        }
    },

    apRightChange: function(){
        var me = this;
        me.getTreeApRights().getStore().sync({
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
    apRightsGridClick:  function(grid, record, item, index, event){
        var me = this;
        me.apRightsSelectedRecord = record;
    },
    apRightsReload: function(){
        var me =this;
        me.getStore('sApRights').load();
    },
    apRightsExpand: function(){
        var me = this;
        //See if there are anything selected... if not, inform the user
        var sel_count = me.getTreeApRights().getSelectionModel().getCount();
        if(sel_count == 0){
            Ext.ux.Toaster.msg(
                        'Select a node',
                        'First select a node to expand',
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            me.getTreeApRights().expandNode(me.apRightsSelectedRecord,true); 
        }
    }

});
