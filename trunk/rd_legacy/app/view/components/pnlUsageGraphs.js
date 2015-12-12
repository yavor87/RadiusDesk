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
    type        : 'user',
    username    : false,  
    initComponent: function(){
        var me      = this;

        me.storeDaily = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mUserStatDaily',
            proxy: {
                type        : 'ajax',
                format      : 'json',
                extraParams : { 'username' : me.username, 'type' : me.type },
                url         : '/cake2/rd_cake/user_stats/index.json',
                reader      : {
                    type        : 'json',
                    root        : 'items',
                    messageProperty: 'message'
                }
            },
            autoLoad: false    
        });

        var chart = Ext.create('Ext.chart.Chart',{
            animate : true,
            shadow  : true,
            store   : me.storeDaily,
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
                itemId  : "daily",
                layout  : 'fit',
                tbar: [
                    { xtype: 'buttongroup', title: i18n('sAction'), items : [
                        { xtype: 'button',  iconCls: 'b-reload',  glyph   : Rd.config.icnReload,  scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},
                        {
                            xtype       : 'datefield',
                            fieldLabel  : 'Day',
                            name        : 'day',
                            itemId      : 'day',
                            value       : new Date(),
                            labelClsExtra: 'lblRd',
                            labelAlign  : 'left',
                            labelSeparator: '',
                            labelWidth  : 50,
                            margin      : 2
                       }                
                    ]}
                ],
                items   : chart 
            },
            { 
                title   : "Weekly",
                itemId  : "weekly"
            },
            { 
                title   : "Monthly",
                itemId  : "monthly"
            }
        ];
        me.callParent(arguments);
    }
});
