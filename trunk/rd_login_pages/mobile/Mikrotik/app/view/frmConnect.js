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


		//Build the fieldset items
		var fs_items	= [{
                        xtype       : 'container',
                        tpl: [
                                '<div class="rdCenter">',
                                '<h2>{name}</h2><img src="'+scaler_url+'?height=90&width=90&image={icon_file_name}">',
                                '</div>'
                        ],
                        data : config.jsonData.detail
                    }];

	    if((config.jsonData.settings.voucher_login_check)&&
			(config.jsonData.settings.connect_only == false)
		){
			fs_items  = Ext.Array.merge(fs_items, [{
                xtype   	: 'textfield',
                name    	: 'name',
                placeHolder : 'Voucher',
                itemId  	: 'inpVoucher'
            }]);
		}

		if((config.jsonData.settings.voucher_login_check 	== true)&&
			(config.jsonData.settings.user_login_check 		== true)&&
			(config.jsonData.settings.connect_only == false)
		){
			fs_items  = Ext.Array.merge(fs_items, [{
				xtype	: 'label',
				html	: '-OR-',
				baseCls : 'lblSeperator'
			}]);
		}

		if((config.jsonData.settings.user_login_check == true)&&
			(config.jsonData.settings.connect_only == false)
		){
			fs_items  = Ext.Array.merge(fs_items, [{
                xtype   	: 'textfield',
                name    	: 'name',
                placeHolder : 'Username',
                itemId  	: 'inpUsername'
            },
            {
                xtype   	: 'passwordfield',
                name    	: 'password',
                placeHolder : 'Password',
                itemId  	: 'inpPassword'
            }]);
		}

		if(config.jsonData.settings.connect_only == false){
			fs_items  = Ext.Array.merge(fs_items, [{
		        xtype   	: 'checkboxfield',
		        name    	: 'remember_me',
		        label   	: 'Remember me',
				placeHolder : 'Remember me',
		        itemId  	: 'inpRememberMe'
		    }]);
		}

		if(config.jsonData.settings.t_c_check){
            fs_items  = Ext.Array.merge(fs_items, [{
		        xtype       : 'button',
		        text        : 'View Terms & Conditions',
				margin		: '10 0 0 0',
		        itemId      : 'btnViewTC'
		    },
            {
                label   	: 'Accept T&C',
                name    	: 'chkTcCheck',
                xtype   	: 'checkboxfield',
                itemId  	: 'chkTcCheck'
            }]);
        }

		//Social Login Buttons
		if((config.jsonData.settings.social_login.active)&&
			(config.jsonData.settings.connect_only == false)){

			Ext.Array.forEach(config.jsonData.settings.social_login.items,function(item,index,allItems){
					var n = item.name;
					fs_items = Ext.Array.merge(fs_items, [
						{
							xtype       : 'button',
							text		: 'Login with '+n,
							margin		: '10 0 0 0',
							itemId      : n,
							type		: 'socialButton'
						}
					]);
				}
			);
		}

        var fs = Ext.create('Ext.form.FieldSet',{
                title       : 'Credentials',
                instructions: 'Scroll down to see all fields',
                defaults    : { 'labelWidth' : '35%'},
                scrollable  : true,
                flex        : 1,
                items		: fs_items
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
