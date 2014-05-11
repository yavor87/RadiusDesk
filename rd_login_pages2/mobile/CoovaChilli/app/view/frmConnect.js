Ext.define('CoovaChilli.view.frmConnect', {
    extend: 'Ext.form.Panel',
    xtype: 'frmConnect',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.field.Checkbox'
    ],
    config: {
        layout: 'vbox'
    },
    constructor: function(config) {
        var me          = this;
        var scaler_url = CoovaChilli.config.Config.getUrlScaler();

         var t_c_hidden = true;
        if(config.jsonData.detail.t_c_check == true){
            t_c_hidden = false;
        }

        //If Click to connect
        var un_hidden = false;
        var pw_hidden = false;
        var rm_hidden = false;
        var un        = '';
        var pw        = '';
        if(config.clickToConnect){
            un_hidden = true;
            pw_hidden = true;
            rm_hidden = true;
            //FIXME this must be sourced from the dynamic login page info!
            un        = 'dvdwalt';
            pw        = 'dvdwalt';
        } 


        var fs = Ext.create('Ext.form.FieldSet',{
                title       : 'Credentials',
                instructions: 'Scroll down to see all fields',
                defaults    : { 'labelWidth' : '35%'},
                scrollable  : true,
                flex        : 1,
                items: [
                    {
                        xtype       : 'container',
                        tpl: [
                                '<div class="rdCenter">',
                                '<h2>{name}</h2><img src="'+scaler_url+'?height=90&width=90&image={icon_file_name}">',
                                '</div>'
                        ],
                        data : config.jsonData.detail
                    },
                    {
                        xtype   : 'textfield',
                        name    : 'name',
                        label   : 'Username',
                        itemId  : 'inpUsername',
                        hidden  : un_hidden,
                        value   : un
                    },
                    {
                        xtype   : 'passwordfield',
                        name    : 'password',
                        label   : 'Password',
                        itemId  : 'inpPassword',
                        hidden  : pw_hidden,
                        value   : pw
                    },
                    {
                        xtype   : 'checkboxfield',
                        name    : 'remember_me',
                        label   : 'Remember me',
                        itemId  : 'inpRememberMe',
                        hidden  : rm_hidden
                    },
                    {
                        itemId  : 'lblTC',
                        xtype   : 'label',
                        html    : "<b>T&C:</b> <a href='"+config.jsonData.detail.t_c_url+"' target='_blank'>"+config.jsonData.detail.t_c_url+"</a>",
                        hidden  : t_c_hidden
                    },
                    {
                        label   : 'Accept T&C',
                        name    : 'chkTcCheck',
                        xtype   : 'checkboxfield',
                        itemId  : 'chkTcCheck',
                        hidden  : t_c_hidden
                    }
                    
                ]
        });

        config.items = [
            fs,
            {
                itemId  : 'lblInpErrorDisplay',
                xtype   : 'label',
                tpl     : '{msg}',
                cls     : 'rdErrorMsg',
                hidden  : true
            },  
            {
                xtype   : 'toolbar',
                ui      : 'light',
                docked  : 'bottom',
                items: [
                    { xtype     : 'spacer' },
                    {
                        text    : 'OK',
                        ui      : 'confirm',
                        iconCls : 'arrow_right',
                        itemId  : 'btnConnect'
                    },
                    { xtype     : 'spacer' }
                ]
            }];
        me.callParent([config]);
    }
});
