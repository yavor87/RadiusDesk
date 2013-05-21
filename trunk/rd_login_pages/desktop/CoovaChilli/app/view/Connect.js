Ext.define('CoovaLogin.view.Connect', {
    extend: 'Ext.window.Window',
    alias : 'widget.connectW',
    closable: true,
    draggable: false,
    resizable: false,
    width: 320,
    height: 320,
    layout: 'fit',
    plain: true,
    border: false,
    title: 'Connect to Internet',
    iconCls: 'connect',
    requires: ['Ext.toolbar.TextItem'],
    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                border: false,
                layout: 'anchor',
                height: '100%',
                bodyPadding: 20,
               // bodyStyle: 'background-image:url(resources/images/bg/login.png);',
                fieldDefaults: {
                    msgTarget: 'under',
                    labelStyle: 'font-weight: bold; color: #980820; font-size:120%;',
                    labelAlign: 'top',
                    anchor: '100%',
                    labelSeparator: '',
                    padding: 20
                },
                defaultType: 'textfield',
                items: [
                    {
                        name : "username",
                        fieldLabel: 'Username',
                        itemId: 'inpUsername',
                        allowBlank:false,
                        blankText:"Enter username"
                    },
                    {
                        name : "password",
                        fieldLabel: 'Password',
                        itemId: 'inpPassword',
                        inputType: 'password',
                        allowBlank:false,
                        blankText:"Enter password"
                    },
                    {
                        boxLabel  : 'Remember me',
                        name      : 'rememberMe',
                        inputValue: 'rememberMe',
                        labelAlign: 'right',
                        xtype     : 'checkbox',
                        id        : 'inpRememberMe',
                        padding   : '20 0 0 0'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Error',
                        labelStyle: 'font-weight: bold; color: red; font-size:120%;',
                        fieldStyle: 'color: #888282; font-style:italic; font-size:120%;',
                        itemId: 'inpErrorDisplay',
                        name: 'home_score',
                        value: '',
                        hidden: true
                    }
                ],
                buttons : [
            '->',
            {
                text: '<b>Connect</b>',
                action: 'ok',
                type: 'submit',
                itemId: 'btnConnect',
                formBind: true,
                scale: 'large',
                iconCls: 'b-btn_connect'
            }  
        ]
            }
        ];
        this.callParent(arguments);
    }
});
