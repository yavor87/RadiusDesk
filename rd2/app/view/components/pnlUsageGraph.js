Ext.define('Rd.view.components.pnlUsageGraph', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlUsageGraph',
    margins : '0 0 0 0',
    plain   : true,
    border  : true,
    tabPosition: 'bottom',
    requires: [
        'Ext.chart.*'
    ],
    tbar    : [
        { xtype: 'buttongroup', title: i18n('sAction'), items : [
            { xtype: 'button',  iconCls: 'b-reload', glyph   : Rd.config.icnReload,   scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},
            {
                xtype       : 'datefield',
                fieldLabel  : i18n('sDay'),
                name        : 'day',
                itemId      : 'day',
                value       : new Date(),
                format      : 'Y-m-d',
                labelClsExtra: 'lblRd',
                labelAlign  : 'left',
                labelSeparator: '',
                labelWidth  : 50,
                margin      : 2
            }]              
        },
        '->',
        {   xtype: 'component', itemId: 'totals',  tpl: i18n('tpl_In_{in}_Out_{out}_Total_{total}'),   style: 'margin-right:5px', cls: 'lblRd' }
    ],
    //The following attributes will influence the query for the stats

    type        : 'permanent', //Can be permanent, voucher, device, nas, realm
    span        : 'daily', //Can be daily weekly or monthly
    username    : false, //if device = mac; if nas = nas_id if realm = realm_id    
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create(Ext.data.Store,{
            model: 'Rd.model.mUserStat',
            proxy: {
                type        : 'ajax',
                format      : 'json',
                extraParams : { 'username' : me.username, 'type' : me.type, 'span' : me.span },
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
            store   : me.store,
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
                       // return String(v).replace(/(.)00000$/, '.$1M');
                        return Ext.ux.bytesToHuman(v);
                    }
                }
            }, {
                type    : 'Category',
                position: 'bottom',
                fields  : ['time_unit'],
                title   : false
            }],
            series: [{
                type: 'column',
                axis: 'bottom',
                gutter: 80,
                xField: 'time_unit',
                yField: ['data_in', 'data_out'],
                stacked: true,
                tips: {
                    trackMouse: true,
                    width: 65,
                    height: 28,
                    renderer: function(storeItem, item) {
                       // this.setTitle(String(item.value[1] / 1000000) + 'M');
                        this.setTitle(Ext.ux.bytesToHuman(item.value[1]));
                    }
                }
            }]
        });
        me.items = chart;
      
        me.callParent(arguments);
    }
});
