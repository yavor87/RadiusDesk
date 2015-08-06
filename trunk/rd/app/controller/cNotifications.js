Ext.define('Rd.controller.cNotifications', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('notificationWin');
        if(!win){
            win = desktop.createWindow({
                id          : 'notificationWin',
                btnText     : 'Notifications manager',
                width       :800,
                height      :400,
                glyph       : Rd.config.icnNotify,
                animCollapse:false,
                border      :false,
                constrainHeader:true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'notificationWin',
                items: [
                    {
                        region  : 'north',
                        xtype   : 'pnlBanner',
                        heading : 'Notifications manager',
                        image   : 'resources/images/48x48/ssids.png'
                    },
                    {
                        region  : 'center',
                        xtype   : 'panel',
                        layout  : 'fit',
                        border  : false,
                        items   : [{
                            xtype   : 'tabpanel',
                            layout  : 'fit',
                            margins : '0 0 0 0',
                            border  : true,
                            plain   : true,
                            items   : [
								{ title : 'Permanent Users','glyph': Rd.config.icnUser, xtype: 'gridPermanentUserNotifications'},
								{ title : 'NAS devices',    'glyph': Rd.config.icnNas},
								{ title : 'Meshes',         'glyph': Rd.config.icnMesh}
                        ]}]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner',  	'notifications.gridPermanentUserNotifications',
        'notifications.winPermanentUserNotificationAdd',
        'notifications.winPermanentUserNotificationEdit',
        'components.cmbPermanentUser'
    ],
    stores: ['sPermanentUserNotifications', 'sPermanentUsers'],
    models: ['mPermanentUserNotification',  'mPermanentUser'],
    config: {
        urlPunAdd       : '/cake2/rd_cake/permanent_user_notifications/add.json',
        urlPunDelete    : '/cake2/rd_cake/permanent_user_notifications/delete.json',
		urlPunEdit      : '/cake2/rd_cake/permanent_user_notifications/edit.json'
    },
    refs: [
        {  ref: 'gridPun',  selector: 'gridPermanentUserNotifications'}       
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            'gridPermanentUserNotifications #reload': {
                click:      me.reloadPun
            }, 
            'gridPermanentUserNotifications #add'   : {
                click:      me.addPun
            },
            'gridPermanentUserNotifications #delete'	: {
                click:      me.delPun
            },
            'gridPermanentUserNotifications #edit'   : {
                click:      me.editPun
            },
            'winPermanentUserNotificationAdd cmbNotifyMethod': {
                change: me.cmbNotifyMethodChange
            },
            'winPermanentUserNotificationAdd cmbNotifyType': {
                change: me.cmbNotifyTypeChange
            },
			'winPermanentUserNotificationAdd #save' : {
                click:      me.btnPunAddSave
            },
            'winPermanentUserNotificationEdit cmbNotifyMethod': {
                change: me.cmbNotifyMethodChange
            },
            'winPermanentUserNotificationEdit cmbNotifyType': {
                change: me.cmbNotifyTypeChange
            },
			'winPermanentUserNotificationEdit #save': {
                click:      me.btnPunEditSave
            },
            'winPermanentUserNotificationEdit cmbPermanentUser' : {
                render:  me.renderEventPermanentUser
            },
            'winPermanentUserNotificationEdit': {
                beforeshow:      me.loadPunRecord
            },
        });
    },
	reloadPun: function(){
        var me = this;
        me.getGridPun().getSelectionModel().deselectAll(true);
        me.getGridPun().getStore().load();
    },
    addPun: function(button){      
        var me = this;
        if(!me.application.runAction('cDesktop','AlreadyExist','winPermanentUserNotificationAddId')){
            var w = Ext.widget('winPermanentUserNotificationAdd',{id:'winPermanentUserNotificationAddId'});
            me.application.runAction('cDesktop','Add',w);       
        }
    },
    delPun:   function(){
        var me      = this;     
        //Find out if there was something selected
        if(me.getGridPun().getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_delete'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
            Ext.MessageBox.confirm(i18n('sConfirm'), i18n('sAre_you_sure_you_want_to_do_that_qm'), function(val){
                if(val== 'yes'){
                    var selected    = me.getGridPun().getSelectionModel().getSelection();
                    var list        = [];
                    Ext.Array.forEach(selected,function(item){
                        var id = item.getId();
                        Ext.Array.push(list,{'id' : id});
                    });
                    Ext.Ajax.request({
                        url: me.urlPunDelete,
                        method: 'POST',          
                        jsonData: list,
                        success: function(batch,options){console.log('success');
                            Ext.ux.Toaster.msg(
                                i18n('sItem_deleted'),
                                i18n('sItem_deleted_fine'),
                                Ext.ux.Constants.clsInfo,
                                Ext.ux.Constants.msgInfo
                            );
                            me.reloadPun(); //Reload from server
                        },                                    
                        failure: function(batch,options){
                            Ext.ux.Toaster.msg(
                                i18n('sProblems_deleting_item'),
                                batch.proxy.getReader().rawData.message.message,
                                Ext.ux.Constants.clsWarn,
                                Ext.ux.Constants.msgWarn
                            );
                            me.reloadPun(); //Reload from server
                        }
                    });

                }
            });
        }
    },
    editPun: function(button){
        var me      = this;
        var grid    = button.up('grid');
        //Find out if there was something selected
        if(grid.getSelectionModel().getCount() == 0){
             Ext.ux.Toaster.msg(
                        i18n('sSelect_an_item'),
                        i18n('sFirst_select_an_item_to_edit'),
                        Ext.ux.Constants.clsWarn,
                        Ext.ux.Constants.msgWarn
            );
        }else{
			var sr      =  me.getGridPun().getSelectionModel().getLastSelected();
            if(!me.application.runAction('cDesktop','AlreadyExist','winPermanentUserNotificationEditId')){
                var w = Ext.widget('winPermanentUserNotificationEdit',{id:'winPermanentUserNotificationEditId',record: sr});
                me.application.runAction('cDesktop','Add',w);       
            }    
        }
    },
    btnPunAddSave:  function(button){
        var me      = this;
        var win     = button.up("winPermanentUserNotificationAdd");
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlPunAdd,
            success: function(form, action) {
                win.close();
                me.reloadPun(); //Reload from server
                Ext.ux.Toaster.msg(
                    i18n('sItem_added'),
                    i18n('sItem_added_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
	btnPunEditSave:  function(button){
        var me      = this;
        var win     = button.up("winPermanentUserNotificationEdit");
        var form    = win.down('form');
        form.submit({
            clientValidation: true,
            url: me.urlPunEdit,
            success: function(form, action) {
                win.close();
                me.reloadPun(); //Reload from server
                Ext.ux.Toaster.msg(
                    i18n('sItem_updated'),
                    i18n('sItem_updated_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure: Ext.ux.formFail
        });
    },
    cmbNotifyMethodChange: function(cmb){
        var me      = this;
        var form    = cmb.up('form');
        var a1      = form.down('#address_1');
        var a2      = form.down('#address_2'); 
        var val     = cmb.getValue();
        if(val == 'email'){
            a1.setFieldLabel('Primary email');
            a2.setFieldLabel('Optional email');
        }else{
            a1.setFieldLabel('Primary cell');
            a2.setFieldLabel('Optional cell');
        }
    },
    cmbNotifyTypeChange: function(cmb){
        var me      = this;
        var form    = cmb.up('form');
        var p      = form.down('#start');
        var i      = form.down('#increment'); 
        var val     = cmb.getValue();
        if(val == 'usage'){
            p.setVisible(true);
            p.setDisabled(false); 
            i.setVisible(true);
            i.setDisabled(false);   
        }else{
            p.setVisible(false);
            p.setDisabled(true); 
            i.setVisible(false);
            i.setDisabled(true); 
        }
    },
    renderEventPermanentUser: function(cmb){
        var me      = this;
        var w       = cmb.up('winPermanentUserNotificationEdit');
        if(w.record != undefined){
            var un      = w.record.get('username');
            var u_id    = w.record.get('permanent_user_id');
            var rec     = Ext.create('Rd.model.mPermanentUser', {username: un, id: u_id});
            cmb.getStore().loadData([rec],false);
            cmb.setValue(u_id);
        }
    },
    loadPunRecord: function(w){
        var me = this;
        var f = w.down('form');
        f.loadRecord(w.record);
    }
});
