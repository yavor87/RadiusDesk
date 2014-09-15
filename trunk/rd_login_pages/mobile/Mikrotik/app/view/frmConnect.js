Ext.define('Mikrotik.view.frmConnect', {
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
        var scaler_url = Mikrotik.config.Config.getUrlScaler();

        var t_c_hidden = true;
        if(config.jsonData.settings.t_c_check == true){
            t_c_hidden = false;
        }

		//Some sane defaults
        var un_hidden = false;
        var pw_hidden = false;
        var rm_hidden = false;
		var v_hidden  = true;
		var or_hidden = true;

        if(config.jsonData.settings.connect_only == true){
            un_hidden = true;
            pw_hidden = true;
            rm_hidden = true;
			v_hidden  = true;
			or_hidden = true;
        }

        var buttons;

        if(config.jsonData.settings.connect_check == true){
            if(config.jsonData.settings.connect_only == true){
                buttons = [
                    { xtype     : 'spacer' },
                    {
                        text    : 'Free Access',
                        ui      : 'confirm',
                        iconCls : 'time',
                        itemId  : 'btnClickToConnect'
                    },
                    { xtype     : 'spacer' }
                ];

            }else{
                buttons = [ 
                    {
                        text    : 'Free Access',
                        ui      : 'confirm',
                        iconCls : 'time',
                        itemId  : 'btnClickToConnect'
                    },
                    { xtype     : 'spacer' },
                    {
                        text    : 'Connect',
                        ui      : 'confirm',
                        iconCls : 'arrow_right',
                        itemId  : 'btnConnect'
                    },
                    
                    { xtype     : 'spacer' }
                ];
            }
        }else{
            buttons = [
                    { xtype     : 'spacer' },
                    {
                        text    : 'Connect',
                        ui      : 'confirm',
                        iconCls : 'arrow_right',
                        itemId  : 'btnConnect'
                    },
                    {
                        text    : 'Remove me from realm',
                        itemId  : 'btnRemoveMac',
                        ui      : 'decline',
                        hidden  : true
                    },
                    { xtype     : 'spacer' }
                ];
        }

		//We need to turn the controlls on and off depending what is selected:		
		if(
			(config.jsonData.settings.voucher_login_check 	== false)&&
			(config.jsonData.settings.user_login_check 		== true)&&
			(config.jsonData.settings.connect_only 			== false)
		){
			un_hidden = false;
		    pw_hidden = false;
		    rm_hidden = false;
			v_hidden  = true;
			or_hidden = true;
		}

		if(
			(config.jsonData.settings.voucher_login_check 	== true)&&
			(config.jsonData.settings.user_login_check 		== false)&&
			(config.jsonData.settings.connect_only 			== false)
		){
			un_hidden = true;
		    pw_hidden = true;
		    rm_hidden = false;
			v_hidden  = false;
			or_hidden = true;
		}

		if(
			(config.jsonData.settings.voucher_login_check 	== true)&&
			(config.jsonData.settings.user_login_check 		== true)&&
			(config.jsonData.settings.connect_only 			== false)
		){
			un_hidden = false;
		    pw_hidden = false;
		    rm_hidden = false;
			v_hidden  = false;
			or_hidden = false;
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
                        label   : 'Voucher',
                        itemId  : 'inpVoucher',
                        hidden  : v_hidden,
                        disabled: v_hidden
                    },
					{
						xtype	: 'label',
						html	: '-OR-',
						baseCls : 'lblSeperator',
						hidden	: or_hidden 
					},
                    {
                        xtype   : 'textfield',
                        name    : 'name',
                        label   : 'Username',
                        itemId  : 'inpUsername',
                        hidden  : un_hidden,
                        disabled: un_hidden
                    },
                    {
                        xtype   : 'passwordfield',
                        name    : 'password',
                        label   : 'Password',
                        itemId  : 'inpPassword',
                        hidden  : pw_hidden,
                        disabled: pw_hidden
                    },
                    {
                        xtype   : 'checkboxfield',
                        name    : 'remember_me',
                        label   : 'Remember me',
                        itemId  : 'inpRememberMe',
                        hidden  : rm_hidden,
                        disabled: rm_hidden
                    },
                    {
				        xtype       : 'button',
				        text        : 'View Terms & Conditions',
						margin		: '10 0 0 0',
				        itemId      : 'btnViewTC',
						hidden		: t_c_hidden
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
                items   : buttons
            }];
        me.callParent([config]);

    }
});
