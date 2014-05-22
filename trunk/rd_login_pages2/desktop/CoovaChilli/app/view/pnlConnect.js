Ext.define('CoovaChilli.view.pnlConnect', {
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

        //If Click to connect
        var un_hidden = false;
        var pw_hidden = false;
        var rm_hidden = false;
        var un        = '';
        var pw        = '';
        if(me.clickToConnect){
            un_hidden = true;
            pw_hidden = true;
            rm_hidden = true;
            //FIXME this must be sourced from the dynamic login page info!
            un        = 'dvdwalt';
            pw        = 'dvdwalt';
        }

        me.items = [
            {
                xtype       : 'form',
                border      : false,
                layout      : 'anchor',
                height      : '100%',
                bodyPadding : 20,
                fieldDefaults: {
                    msgTarget   : 'under',
                    labelStyle  : 'font-weight: bold; color: #980820; font-size:120%;',
                    labelAlign  : 'top',
                    anchor      : '100%',
                    labelSeparator: '',
                    padding     : 20
                },
                defaultType: 'textfield',
                items: [
                    {
                        name        : "username",
                        fieldLabel  : 'Username',
                        itemId      : 'inpUsername',
                        allowBlank  : false,
                        blankText   : "Enter username",
                        hidden      : un_hidden,
                        value       : un
                    },
                    {
                        name        : "password",
                        fieldLabel  : 'Password',
                        itemId      : 'inpPassword',
                        inputType   : 'password',
                        allowBlank  : false,
                        blankText   : "Enter password",
                        hidden      : pw_hidden,
                        value       : pw
                    },
                    {
                        boxLabel  : 'Remember me',
                        name      : 'rememberMe',
                        inputValue: 'rememberMe',
                        labelAlign: 'right',
                        xtype     : 'checkbox',
                        itemId    : 'inpRememberMe',
                        padding   : '20 0 0 0',
                        hidden    : rm_hidden
                    },
                    {
                        xtype       : 'displayfield',
                        fieldLabel  : 'Terms & Conditions',
                        labelStyle  : 'font-weight: bold; color: blue; font-size:120%;',
                        fieldStyle  : 'color: #888282; font-style:italic; font-size:120%;',
                        value       : "<a href='"+me.jsonData.settings.t_c_url+"' target='_blank'>"+me.jsonData.settings.t_c_url+"</a>",
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
                    } 
                ],
                buttons : [
            '->',
            {
                text        : '<b>Connect</b>',
                action      : 'ok',
                type        : 'submit',
                itemId      : 'btnConnect',
                formBind    : true,
                scale       : 'large',
                glyph       : CoovaChilli.config.icnConnect
            }  
        ]
            }
        ];
        me.callParent(arguments);
    }
});
