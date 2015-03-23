Ext.define('Mikrotik.view.pnlConnect', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.pnlConnect',
    layout: 'fit',
    border: false,
    requires: ['Ext.toolbar.TextItem'],
    initComponent: function() {

        var me = this;
        var t_c_hidden = true;
        if(me.jsonData.settings.t_c_check == true){
            t_c_hidden = false;
        }

        var buttons;

        if(me.jsonData.settings.connect_check == true){
            if(me.jsonData.settings.connect_only == true){
                buttons = [
                    '->',
                    {
                        text        : 'Free Access',
                        action      : 'ok',
                        type        : 'submit',
                        itemId      : 'btnClickToConnect',
                        scale       : 'large',
                        glyph       : Mikrotik.config.icnConnect
                    }
                ];

            }else{
                buttons = [
                    {
                        text        : 'Free Access',
                        action      : 'ok',
                        type        : 'submit',
                        itemId      : 'btnClickToConnect',
                        scale       : 'large',
                        glyph       : Mikrotik.config.icnConnect
                    },
                    '|',
                    {
                        text        : 'Connect',
                        action      : 'ok',
                        type        : 'submit',
                        itemId      : 'btnConnect',
                        formBind    : true,
                        scale       : 'large',
                        glyph       : Mikrotik.config.icnConnect
                    }  
                ];
            }
        }else{
            buttons = [
                '->',
                {
                    text        : 'Connect',
                    action      : 'ok',
                    type        : 'submit',
                    itemId      : 'btnConnect',
                    formBind    : true,
                    scale       : 'large',
                    glyph       : Mikrotik.config.icnConnect
                }  
            ];
        }

		var remember_me = {
		    boxLabel  : 'Remember me',
		    name      : 'rememberMe',
		    inputValue: 'rememberMe',
		    labelAlign: 'right',
		    xtype     : 'checkbox',
		    itemId    : 'inpRememberMe',
			baseBodyCls: 'frmField'
		};

		//Form items depends on what is specified with user_login_check and voucher_login_check
		var frm_items_bottom = [	
			{
				xtype		: 'button',
				text		: 'View Terms & Conditions',
				margin		: '10 0 0 0',
				href		: me.jsonData.settings.t_c_url,
				anchor		: '100%',
				hidden      : t_c_hidden
			},
            {
                boxLabel  : 'Accept T&C',
                name      : 'chkTcCheck',
                inputValue: 'chkTcCheck',
                labelAlign: 'right',
                xtype     : 'checkbox',
                itemId    : 'chkTcCheck',
                padding   : '0 0 0 0',
                hidden    : t_c_hidden
            },
            {
                xtype       : 'displayfield',
                fieldLabel  : 'Error',
                labelStyle  : 'font-weight: bold; color: red; font-size:120%;',
                fieldStyle  : 'color: #888282; font-style:italic; font-size:120%;',
                itemId      : 'inpErrorDisplay',
                value       : '',
                hidden      : true
            },
			{
				xtype       : 'button',
				text        : 'Remove me from realm',
				itemId      : 'btnRemoveMac',
				margin      : '5 5 5 5',
				scale       : 'medium',
				cls         : 'topButton',
				componentCls: 'ttt',
				glyph   	: Mikrotik.config.icnDelete,
				hidden  	: true
			}
		];

		if(me.jsonData.settings.register_users){
			frm_items_bottom = Ext.Array.merge(frm_items_bottom, [
				{
					xtype		: 'button',
					text		: 'Register as new user',
					margin		: '10 0 0 0',
					itemId		: 'btnNewUser',
					anchor		: '100%'
				}
			]);
		}

		if(me.jsonData.settings.lost_password){
			frm_items_bottom = Ext.Array.merge(frm_items_bottom, [
				{
					xtype		: 'button',
					text		: 'Lost password',
					margin		: '10 0 0 0',
					itemId		: 'btnLostPassword',
					anchor		: '100%'
				}
			]);
		}

		if(me.jsonData.settings.social_login.active){
			Ext.Array.forEach(me.jsonData.settings.social_login.items,function(item,index,allItems){
					var n = item.name;
					frm_items_bottom = Ext.Array.merge(frm_items_bottom, [
						{
							xtype		: 'button',
							text		: 'Login with '+n,
							textAlign	: 'left',
							margin		: '10 0 0 0',
							itemId		: n,
							anchor		: '100%',
							glyph		: Mikrotik['config']['icn'+n],
							type		: 'socialButton'
						}
					]);
				}
			);
		}


		//WIP
/*
		frm_items_bottom = Ext.Array.merge(frm_items_bottom, [
			{
				xtype		: 'button',
				text		: 'Pay with Credit Card',
				margin		: '10 0 0 0',
				itemId		: 'btnCreditCard',
				anchor		: '100%'
			}
		]);
*/
        //The default
		if(
			(me.jsonData.settings.voucher_login_check == false)&&
			(me.jsonData.settings.user_login_check == true)&&
			(me.jsonData.settings.connect_only == false)
		){
			var frm_items_top = [
				 {
				    name        : "username",
				    fieldLabel  : 'Username',
				    itemId      : 'inpUsername',
				    allowBlank  : false,
				    blankText   : "Enter username",
					xtype		: 'textfield',
					baseBodyCls : 'frmField'
				},
				{
				    name        : "password",
				    fieldLabel  : 'Password',
				    itemId      : 'inpPassword',
				    inputType   : 'password',
				    allowBlank  : false,
				    blankText   : "Enter password",
					xtype		: 'textfield',
					baseBodyCls : 'frmField'
				},
				remember_me
			];
		}

		if(
			(me.jsonData.settings.voucher_login_check == true)&&
			(me.jsonData.settings.user_login_check == false)&&
			(me.jsonData.settings.connect_only == false)
		){
			var frm_items_top = [
				{
				    name        : "voucher",
					fieldLabel  : 'Voucher',
				    itemId      : 'inpVoucher',
				    allowBlank  : false,
				    blankText   : "Enter voucher",
					xtype		: 'textfield',
					baseBodyCls : 'frmField'
				},
				remember_me
			];
		}

		if(
			(me.jsonData.settings.voucher_login_check == true)&&
			(me.jsonData.settings.user_login_check == true)&&
			(me.jsonData.settings.connect_only == false)
		){
			var frm_items_top = [
			{
					xtype       : 'tabpanel',
					height		: 190,
					plain		: true,
					items		: [
						{
							title	: 'User',
							layout  : 'anchor',
            				height  : '100%',
							itemId  : 'tabUser',
							items	: [
							    {
							        name        : "username",
							        fieldLabel  : 'Username',
							        itemId      : 'inpUsername',
							        allowBlank  : false,
							        blankText   : "Enter username",
									xtype		: 'textfield',
									baseBodyCls : 'frmField'
							    },
							    {
							        name        : "password",
							        fieldLabel  : 'Password',
							        itemId      : 'inpPassword',
							        inputType   : 'password',
							        allowBlank  : false,
							        blankText   : "Enter password",
									xtype		: 'textfield',
									baseBodyCls : 'frmField'
							    }
							]
						},
						{
							title	: 'Voucher',
							layout  : 'anchor',
            				height  : '100%',
							itemId  : 'tabVoucher',
							items	: [
								{
							        name        : "voucher",
							        fieldLabel  : 'Voucher',
							        itemId      : 'inpVoucher',
							        allowBlank  : false,
							        blankText   : "Enter voucher",
									xtype		: 'textfield',
									baseBodyCls : 'frmField'
							    }
							]
						}
					]
				},
				remember_me
			];
		}	

		var frm_items  = Ext.Array.merge(frm_items_top, frm_items_bottom);

        me.items = [
            {
                xtype       : 'form',
                border      : false,
                layout      : 'anchor',
                height      : '100%',
                bodyPadding : '0 20 10 20',
                fieldDefaults: {
                    msgTarget   : 'under',
                    labelStyle  : 'font-weight: bold; color: #980820; font-size:120%;',
                    labelAlign  : 'top',
                    anchor      : '100%',
                    labelSeparator: ''
                },
                defaultType	: 'textfield',
               	items		: frm_items,
                buttons 	: buttons
            }
        ];
        me.callParent(arguments);
    }
});
