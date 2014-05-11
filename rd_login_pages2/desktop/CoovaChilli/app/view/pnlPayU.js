Ext.define('CoovaChilli.view.pnlPayU', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.pnlPayU',
    layout: {
        type    : 'vbox',
        align   : 'center',
        pack    : 'center'
    },
    border: false,
    requires    : ['Ext.Img','Ext.form.action.StandardSubmit','CoovaChilli.view.cmbVouchers'],
    initComponent: function() {
        me          = this;

        var img     = Ext.create('Ext.Img', {
                padding     : 10,
                margin      : 10,
                src         : 'resources/images/payu.png'  
        });
        var tplVoucher = Ext.create('Ext.XTemplate', [ 
            '<h3>Last purchase</h3>'+
            '<div><div class="item">Username</div><div class="value">{username}</div></div>',
            '<div class="alternate"><div class="item">Password</div><div class="value">{password}</div></div>', 
            '<div><div class="item">Profile</div><div class="value">{profile}</div></div>'
          //  '<div class="alternate"><div class="item">Valid for</div><div class="value">{value}</div></div>'   
        ]);

        me.items    = [
            {
                height      : 140,
                width       : 280,
                tpl         : tplVoucher,
                data        : {username: 'UN Placeholder',password: 'PW Placeholder'},
                bodyCls     : 'lastPurchase',
                hidden      : true,
                itemId      : 'pnlPayUFeedback'
            },
            {
                height      : 80,
                html        : [
                    '<b>Could not retrieve your voucher detail</b><br>',
                    'This detail will also be emailed to you.<br>',
                    'Alternatively contact the helpdesk.<br>'
                ],
                bodyCls     : 'lastPurchase',
                hidden      : true,
                itemId      : 'pnlPayUError'
            },
            img,
            {
               // bodyStyle   :{"background-color":"blue"},
                flex        : 1,
                xtype       : 'form',
                itemId      : 'frmPayU',
                margin      : 5,
                fieldDefaults: {
                    msgTarget       : 'under',
                    labelClsExtra   : 'lblRd',
                    labelAlign      : 'left',
                    labelSeparator  : '',
                    labelStyle      : 'font-weight: bold; color: #495982;',
                    padding         : 10,
                    width           : 280
                },
                standardSubmit  : true,
               // url             : '/cake2/rd_cake/fin_pay_u_transactions/get_transaction',
                url     : '/cake2/rd_cake/fin_pay_u_transactions/submit_transaction',
                items       :   [  
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'First name',
                        name        : "firstName",
                        allowBlank  : false,
                        value       : ''
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Last name',
                        name        : "lastName",
                        allowBlank  : false,
                        value       : ''
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'e-mail',
                        name        : "email",
                        allowBlank  : false,
                        vtype       : 'email',
                        value       : ''
                    },
                    {
                        xtype       : 'textfield',
                        fieldLabel  : 'Mobile',
                        name        : "mobile",
                        allowBlank  : false,
                        maskRe      : /[0-9.]/,
                        value       : ''
                    },
                    {
                        xtype   : 'cmbVouchers'
                    }
                ],
                buttons : [
                    {
                        itemId  : 'btnBuy',
                        text    : "Buy now",
                        scale   : 'large',
                        glyph   : CoovaChilli.config.icnShop,
                        formBind: true,
                        margin  : '0 10 10 0'
                    }
                ]
            }  
        ];
        me.callParent(arguments);
    }
});
