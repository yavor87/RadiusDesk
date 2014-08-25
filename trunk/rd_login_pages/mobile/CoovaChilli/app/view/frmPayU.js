Ext.define('CoovaChilli.view.frmPayU', {
    extend: 'Ext.form.Panel',
    xtype: 'frmPayU',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'Ext.field.Text'
    ],
    standardSubmit  : true,
    config: {
        layout          : 'vbox',
        baseParams      : {
            pathname    : window.location.pathname,
            hostname    : window.location.hostname,
            protocol    : window.location.protocol
        },
        standardSubmit  : true,
        url             : '/cake2/rd_cake/fin_pay_u_transactions/submit_transaction',
        items           : [
        {
            xtype       : 'container',
            height      : 140,
            tpl         : Ext.create('Ext.XTemplate', [ 
                                '<h3>Last purchase</h3>'+
                                '<div><div class="item">Username</div><div class="value">{username}</div></div>',
                                '<div class="alternate"><div class="item">Password</div><div class="value">{password}</div></div>', 
                                '<div><div class="item">Profile</div><div class="value">{profile}</div></div>'  
                            ]),
            data        : {username: '',password: ''},
            cls         : 'lastPurchase',
            hidden      : true,
            itemId      : 'pnlPayUFeedback'
        },
        {
            xtype       : 'container',
            height      : 80,
            html        : [
                '<b>Could not retrieve your voucher detail</b><br>'+
                'This detail will also be emailed to you.<br>'+
                'Alternatively contact the helpdesk.<br>'
            ],
            cls         : 'lastPurchase',
            hidden      : true,
            itemId      : 'pnlPayUError'
        },
        {
            xtype       : 'fieldset',
            title       : 'Transaction detail',
            instructions: 'Scroll down to see all fields',
            defaults    : { 'labelWidth' : '35%'},
            scrollable  : true,
            flex        : 1,
            items: [
                {
                    xtype       : 'container',
                    html: [
                            '<div class="rdCenter">'+
                            '<img src="resources/images/payu.png">'+
                            '</div>'
                    ]
                },
                {
                    xtype   : 'textfield',
                    name    : 'firstName',
                    label   : 'First name',
                    itemId  : 'firstName',
                    required: true
                  
                },
                {
                    xtype   : 'textfield',
                    name    : 'lastName',
                    label   : 'Last name',
                    itemId  : 'lastName',
                    required: true
                  
                },
                {
                    xtype   : 'emailfield',
                    label   : 'e-mail',
                    name    : 'email',
                    itemId  : 'email',
                    required: true
                },
                {
                   xtype    : 'textfield',
                   component: {type: 'tel'},
                   name     : 'mobile',
                   itemId   : 'mobile',
                   label    : 'Mobile',
                   required : true
                }
            ]
            },
            {
                itemId  : 'lblPayUErrorDisplay',
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
                        itemId  : 'btnPayU'
                    },
                    { xtype     : 'spacer' }
                ]
       }]
    }
});
