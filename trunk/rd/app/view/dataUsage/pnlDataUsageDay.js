Ext.define('Rd.view.dataUsage.pnlDataUsageDay', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlDataUsageDay',
    ui      : 'light',
    title   : "Today",
    height  : 800,
    margin  : 0,
    padding : 0,
    layout: {
        type    : 'vbox',
        align   : 'stretch'
    },
    initComponent: function() {
        var me      = this; 
        var m       = 5;
        var p       = 5;
        Ext.create('Ext.data.Store', {
            storeId : 'dayStore',
            fields  :[ 
                {name: 'id',            type: 'int'},
                {name: 'username',      type: 'string'},
                {name: 'data_in',       type: 'int'},
                {name: 'data_out',      type: 'int'},
                {name: 'data_total',    type: 'int'}
            ]
        });
        
        me.items = [
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items : [
                    {
                        xtype   : 'panel',
                        margin  : m,
                        padding : p,
                        flex    : 1,
                        bodyCls : 'subSubTab',
                        layout  : 'fit',
                        border  : false,
                        itemId  : 'dailyTotal',
                        tpl     : new Ext.XTemplate(
                            '<div class="divInfo">',   
                            '<tpl if="type==\'realm\'"><h2 style="color: #009933;"><i class="fa fa-dribbble"></i> {item_name}</h2></tpl>',
                            '<tpl if="type==\'user\'"><h2 style="color: #0066ff;"><i class="fa fa-user"></i> {item_name}</h2></tpl>',
                            '<h1 style="font-size:250%;">{data_total}</h1>',       
                            '<p style="color: #000000; font-size:110%;">',
                                'In: {data_in}<br>',
                                'Out: {data_out}',
                            '</p>',
                            '</div>'
                        ),
                        data    : {
                        }
                    },
                    {
                        xtype   : 'panel',
                        margin : m,
                        padding: p,
                        flex    : 1,
                        border  : true,
                        html    : 'placeholder'
                    },
                    
                    
                 /*   {
                        flex    : 1,
                        margin : m,
                        padding: p,
                        border  : true,
                        bbar    : ['->',{ 
                            xtype   : 'button',    
                            scale   : 'large',  
                            text    : 'See More..'
                        }],
                        xtype   : 'polar',
                        interactions: ['rotate', 'itemhighlight'],
                        store: {
                           fields: ['name', 'data1'],
                           data: [{
                               name: 'metric one',
                               data1: 14
                           }, {
                               name: 'metric two',
                               data1: 16
                           }, {
                               name: 'metric three',
                               data1: 14
                           }, {
                               name: 'metric four',
                               data1: 6
                           }, {
                               name: 'metric five',
                               data1: 36
                           }]
                        },
                        series: {
                           type: 'pie',
                           highlight: true,
                           angleField: 'data1',
                           label: {
                               field: 'name',
                               display: 'rotate'
                           },
                           donut: 20
                        }
                    },*/
                    {
                        xtype   : 'grid',
                        margin  : m,
                        padding : p,
                        ui      : 'light',
                        title   : 'Top 10 Users',
                        itemId  : 'gridTopTenDaily',
                        border  : true,       
                        store   : Ext.data.StoreManager.lookup('dayStore'),
                        emptyText: 'No Users for Today',
                        columns: [
                            { xtype: 'rownumberer'},
                            { text: 'Username',  dataIndex: 'username', flex: 1},
                            { text: 'Data In',   dataIndex: 'data_in',  hidden: true, renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            },
                            { text: 'Data Out',  dataIndex: 'data_out', hidden: true,renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            },
                            { text: 'Data Total',dataIndex: 'data_total',tdCls: 'gridMain',renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            }
                        ],
                        flex: 1
                    }
                ]
            },
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items   : [
                    {
                        xtype   : 'panel',
                        flex    : 2,
                        margin : m,
                        padding: p,
                        border  : false
                        
                    },
                    {
                        xtype   : 'grid',
                        margin  : m,
                        padding : p,
                        ui      : 'light',
                        title   : 'Active Sessions',
                        border  : true,       
                        store   : Ext.data.StoreManager.lookup('simpsonsStore'),
                        columns: [
                            { xtype: 'rownumberer'},
                            { text: 'Username',     dataIndex: 'username', tdCls: 'gridMain' },
                            { text: 'Data Total',   dataIndex: 'data_total' },
                            { text: 'Last Seen',    dataIndex: 'last_seen',flex: 1 }
                        ],
                        flex: 1
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});
