Ext.define('Rd.view.components.pnlUsageGraphs', {
    extend  : 'Ext.tab.Panel',
    alias   : 'widget.pnlUsageGraphs',
    margins : '0 0 0 0',
    plain   : true,
    border  : true,
    tabPosition: 'bottom',
    requires: [
        'Ext.chart.*'
    ],
    initComponent: function(){
        var me      = this;

        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['hour', 'data_in', 'data_out'],
            data: [
                    {hour: 0,  data_in: 0, data_out: 0 },
                    {hour: 1,  data_in: 34000000, data_out: 23890000 },
                    {hour: 2,  data_in: 56703000, data_out: 38900000 },
                    {hour: 3,  data_in: 0, data_out: 0 },
                    {hour: 4,  data_in: 38910000, data_out: 56070000 },
                    {hour: 5,  data_in: 34000000, data_out: 23890000 },
                    {hour: 6,  data_in: 56703000, data_out: 38900000 },
                    {hour: 7,  data_in: 42100000, data_out: 50410000 },
                    {hour: 8,  data_in: 3891, data_out: 560 },
                    {hour: 9,  data_in: 34000000, data_out: 23890000 },
                    {hour: 10, data_in: 56703000, data_out: 38900000 },
                    {hour: 11,  data_in: 34000000, data_out: 23890 },
                    {hour: 12,  data_in: 56703000, data_out: 38900000 },
                    {hour: 13,  data_in: 42100, data_out: 50410000 },
                    {hour: 14,  data_in: 38910000, data_out: 56070000 },
                    {hour: 15,  data_in: 34000000, data_out: 23890000 },
                    {hour: 16,  data_in: 56703000, data_out: 38900000 },
                    {hour: 17,  data_in: 42100000, data_out: 50410000 },
                    {hour: 18,  data_in: 38910000, data_out: 56070000 },
                    {hour: 19,  data_in: 34000000, data_out: 23890000 },
                    {hour: 20, data_in: 56703000, data_out: 38900000 },
                    {hour: 21, data_in: 42100000, data_out: 50410000 },
                    {hour: 22, data_in: 38910000, data_out: 56070000 },
                    {hour: 23, data_in: 42100000, data_out: 50410000 },
                    {hour: 24, data_in: 38910000, data_out: 56070000 },
                  ]
        });

        var chart = Ext.create('Ext.chart.Chart',{
            animate : true,
            shadow  : true,
            store   : store,
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['data_in', 'data_out'],
                title: false,
                grid: true,
                label: {
                    renderer: function(v) {
                        return String(v).replace(/(.)00000$/, '.$1M');
                    }
                }
            }, {
                type    : 'Category',
                position: 'bottom',
                fields  : ['hour'],
                title   : false
            }],
            series: [{
                type: 'column',
                axis: 'bottom',
                gutter: 80,
                xField: 'hour',
                yField: ['data_in', 'data_out'],
                stacked: true,
                tips: {
                    trackMouse: true,
                    width: 65,
                    height: 28,
                    renderer: function(storeItem, item) {
                        this.setTitle(String(item.value[1] / 1000000) + 'M');
                    }
                }
            }]
        });



        me.items    = [
            {   
                title   : "Daily",
                layout  : 'fit',
                tbar: [
                    { xtype: 'buttongroup', title: i18n('sAction'), items : [
                        { xtype: 'button',  iconCls: 'b-reload',    scale: 'large', itemId: 'reload-daily',   tooltip:    i18n('sReload')},
                        {
                            xtype       : 'datefield',
                            fieldLabel  : 'Day',
                            name        : 'day_start',
                            itemId      : 'day_start',
                            value       : new Date(),
                            labelClsExtra: 'lblRd',
                            labelAlign  : 'left',
                            labelSeparator: '',
                            labelWidth  : 50,
                            margin      : 15
                       }                
                    ]}
                ],
                items   : chart 
            },
            { 
                title   : "Weekly"
            },
            { 
                title   : "Monthly"
            }
        ];
        me.callParent(arguments);
    }
});
