Ext.define('Mikrotik.view.cntStatus', {
    extend: 'Ext.Container',
    xtype: 'cntStatus',
    requires: [
        'Ext.Label',
        'Ext.XTemplate'
    ],
    config: {
        layout: 'vbox',
        cls: 'sessionClass',
        items: [
            {
                xtype   :  'container',
                layout  : 'hbox',
                items: [
                    { xtype     : 'spacer', flex: 1 },
                    {
                        itemId: 'cntSession',
                        tpl: [
                                '<div class="rdWrapper">',
                                '<div><div class="item">Username</div><div class="value">{username}</div></div>',
                                '<div class="alternate"><div class="item">Session Time</div><div class="value">{uptime}</div></div>',
                                '<div><div class="item">Data in</div><div class="value">{bytes_in_nice}</div></div>',
                                '<div class="alternate"><div class="item">Data out</div><div class="value">{bytes_out_nice}</div></div>',
                                '</div>'
                        ],
                        data : {'username': '', 'uptime': 50,'bytes_in_nice': 100, 'bytes_out_nice' : 200 },
                        xtype:  'container'
                    },
                    { xtype     : 'spacer', flex: 1 }
                ],
                flex: 1
            },
            {
                xtype       : 'button',
                text        : 'Go onto Internet',
                ui          : 'confirm',
                itemId      : 'btnGoInternet'
            },
            {

                xtype       : 'container',
                layout      : 'hbox',
                items: [
                    { xtype     : 'spacer', flex: 1 },
                    {
                        html    : 'OR',
                        xtype   : 'label'
                    },
                    { xtype     : 'spacer', flex: 1 }
                ]
            },
            {
                xtype       : 'button',
                text        : 'Disconnect',
                ui          : 'decline',
                itemId      : 'btnDisconnect'
            },
            {
                itemId  : 'lblStatusTimer',
                xtype   : 'label',
                tpl     : 'Refresh in <span style="color:blue;">{sec}</span> seconds',
                data    : {'sec': 0},
                cls     : 'rdStatusTimer'
            } 
        ]           
    }
});
