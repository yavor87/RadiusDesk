Ext.define('Rd.controller.cPassword', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('passwordWin');
        if(!win){
            win = desktop.createWindow({
                id          : 'passwordWin',
                title       : "Password manager",
                width       : 350,
                height      : 450,
                resizable   : false,
                iconCls     : 'rights',
                animCollapse: false,
                border      : false,
                constrainHeader:true,
                layout      : 'border',
                stateful    : true,
                stateId     : 'passwordWin',
                items       : [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading: "Password manager",
                        image:  'resources/images/48x48/key.png'
                    },
                    {
                        region  : 'center',
                        layout  : {
                            type    : 'hbox',
                            align   : 'stretch'
                        },
                        margins : '0 0 0 0',
                        border  : false,
                        items   : [ 
                            {
                                flex        : 1,
                                xtype       : 'frmPassword'
                            }
                        ]
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },

    views:  [
        'components.pnlBanner', 'password.frmPassword'
    ],
    stores: [],
    models: ['mPermanentUser'],
    selectedRecord: null,
    config: {
        urlGetPwd:              '/cake2/rd_cake/permanent_users/view_password.json',
        urlChangePassword:      '/cake2/rd_cake/permanent_users/change_password.json',
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
            'frmPassword cmbPermanentUser': {
                change:      me.userChanged
            },
            'frmPassword #save': {
                click:       me.changePasswordSubmit
            }
        });
    },
    userChanged: function(cmb){
        var me      = this;
        var value   = cmb.getValue();
        var form    = cmb.up('form');
        var label   = form.down('displayfield');
        Ext.Ajax.request({
            url: me.urlGetPwd,
            method: 'GET',
            params: {'user_id':value},
            success: function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    label.setValue(jsonData.value); 
                    Ext.ux.Toaster.msg(
                        "Fetched password",
                        "Password fetched for selected user",
                        Ext.ux.Constants.clsInfo,
                        Ext.ux.Constants.msgInfo
                    );
                }   
            },
            scope: me
        });
    },
    changePasswordSubmit: function(button){
        var me      = this;
        var form    = button.up('form');
        var cmb     = form.down("cmbPermanentUser");
        var extra_params        = {};
        extra_params['user_id'] = cmb.getValue();
        //Checks passed fine...      
        form.submit({
            clientValidation    : true,
            url                 : me.urlChangePassword,
            params              : extra_params,
            success             : function(form, action) {
                me.userChanged(cmb); //Force a reload of the new value
                Ext.ux.Toaster.msg(
                    i18n('sPassword_changed'),
                    i18n('sPassword_changed_fine'),
                    Ext.ux.Constants.clsInfo,
                    Ext.ux.Constants.msgInfo
                );
            },
            failure             : Ext.ux.formFail
        });
    }
});
