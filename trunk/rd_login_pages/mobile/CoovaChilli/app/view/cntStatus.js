Ext.define('CoovaChilli.view.cntStatus', {
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
                                '<div><div class="item">Idle Time</div><div class="value">{idletime}</div></div>',
                                '<div class="alternate"><div class="item">Session Time</div><div class="value">{sessiontime}</div></div>',
                                '<div><div class="item">Data in</div><div class="value">{data_in}</div></div>',
                                '<div class="alternate"><div class="item">Data out</div><div class="value">{data_out}</div></div>',
                                '<div><div class="item">Data total</div><div class="value">{data_total}</div></div>',
                                '</div>' 
                        ],
                        data : {'idletime': 30, 'sessiontime': 50,'data_in': 100, 'data_out' : 200, 'data_total' : 300, 'sessiontime': 30},
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
