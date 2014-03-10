Ext.define('CoovaChilli.view.pnlConnect', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.pnlConnect',
    layout: 'fit',
    border: false,
    requires: ['Ext.toolbar.TextItem'],
    initComponent: function() {
        this.items = [
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
                        allowBlank  :false,
                        blankText   :"Enter username"
                    },
                    {
                        name        : "password",
                        fieldLabel  : 'Password',
                        itemId      : 'inpPassword',
                        inputType   : 'password',
                        allowBlank  :false,
                        blankText   :"Enter password"
                    },
                    {
                        boxLabel  : 'Remember me',
                        name      : 'rememberMe',
                        inputValue: 'rememberMe',
                        labelAlign: 'right',
                        xtype     : 'checkbox',
                        itemId    : 'inpRememberMe',
                        padding   : '20 0 0 0'
                    },
                    {
                        xtype       : 'displayfield',
                        fieldLabel  : 'Error',
                        labelStyle  : 'font-weight: bold; color: red; font-size:120%;',
                        fieldStyle  : 'color: #888282; font-style:italic; font-size:120%;',
                        itemId      : 'inpErrorDisplay',
                        name        : 'home_score',
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
        this.callParent(arguments);
    }
});
