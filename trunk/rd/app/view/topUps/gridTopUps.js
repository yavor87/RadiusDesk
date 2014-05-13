Ext.define('Rd.view.topUps.gridTopUps' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridTopUps',
    multiSelect : true,
    store       : 'sTopUps',
    stateful    : true,
    stateId     : 'StateGridTopUps',
    stateEvents :['groupclick','columnhide'],
    border      : true,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    viewConfig: {
        loadMask    :true
    },
    urlMenu: '/cake2/rd_cake/top_ups/menu_for_grid.json',
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi' }
    ],
    initComponent: function(){
        var me      = this;
        var filters = {
            ftype   : 'filters',
            encode  : true, 
            local   : false
        };
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.features = [filters];
        me.columns  = [
            { xtype: 'rownumberer',stateId: 'StateGridTopUps1'},
            { 

                text        :'Owner', 
                dataIndex   : 'user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridTopUps2'
            },
            { 

                text        : 'Permanent user', 
                dataIndex   : 'permanent_user',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridTopUps3'
            },
            { 

                text        : 'TopUp ID', 
                dataIndex   : 'id',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridTopUps4'
            },
            { 
                text        : 'Data', 
                dataIndex   : 'data',   
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                renderer    : function(value){
                    return Ext.ux.bytesToHuman(value)              
                },
                stateId     : 'StateGridTopUps5'
            },
            { 
                text        : 'Time', 
                dataIndex   : 'time',   
                tdCls       : 'gridTree', 
                flex        : 1,
                filter      : {type: 'string'},
                renderer    : function(value){
                    return Ext.ux.secondsToHuman(value)              
                },
                stateId     : 'StateGridTopUps6'
            },
            { 

                text        : 'Days to use', 
                dataIndex   : 'days_to_use',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : true,
                filter      : {type: 'string'},
                stateId     : 'StateGridTopUps7'
            },
            { 

                text        : 'Comment', 
                dataIndex   : 'comment',          
                tdCls       : 'gridTree', 
                flex        : 1,
                hidden      : false,
                filter      : {type: 'string'},
                stateId     : 'StateGridTopUps8'
            },
            { 
                text        : 'Created',
                dataIndex   : 'created', 
                tdCls       : 'gridTree',
                hidden      : false, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridTopUps9'
            },
            { 
                text        : 'Modified',
                dataIndex   : 'modified', 
                tdCls       : 'gridTree',
                hidden      : true, 
                flex        : 1,
                xtype       : 'datecolumn',   
                format      :'Y-m-d H:i:s',
                filter      : {type: 'date',dateFormat: 'Y-m-d'},stateId: 'StateGridTopUps10'
            }
        ]; 
        me.callParent(arguments);
    }
});
