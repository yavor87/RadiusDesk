Ext.define('Rd.view.accessProviders.gridAccessProviders' ,{
    extend      : 'Ext.grid.Panel',
    alias       : 'widget.gridAccessProviders',
    multiSelect : true,
    store       : 'sAccessProvidersGrid',
    stateful    : true,
    stateId     : 'StateGridAccessProviders',
    stateEvents : ['groupclick','columnhide'],
    border      : false,
    requires: [
                'Rd.view.components.ajaxToolbar'
    ],
    urlMenu     : '/cake2/rd_cake/access_providers/menu_for_grid.json',
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
            {xtype: 'rownumberer'},
            {
                text        : 'Owner',
                sortable    : true,
                flex        : 1,
                dataIndex   : 'owner',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}
            },
            {
                text        : 'Username',
                sortable    : true,
                flex        : 1,
                dataIndex   : 'username',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}
            },
            {
                text        : 'Name',
                dataIndex   : 'name',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}
            },
            {
                text        : 'Surname',
                dataIndex   : 'surname',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}
            },
            {
                text        : 'Phone',
                dataIndex   : 'phone',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}
            },
            {
                text        : 'email',
                flex        : 1,
                dataIndex   : 'email',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}
            },
            { 
                text        : 'Monitor',  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='monitor == true'><div class=\"hasRight\">Yes</div></tpl>",
                                "<tpl if='monitor == false'><div class=\"noRight\">No</div></tpl>"
                            ),
                dataIndex   : 'monitor',
                filter      : {type: 'boolean'}
            },
            { 
                text        : 'Active',  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='active == true'><div class=\"hasRight\">Yes</div></tpl>",
                                "<tpl if='active == false'><div class=\"noRight\">No</div></tpl>"
                            ),
                dataIndex   : 'active',
                filter      : { type: 'boolean'}
            },
             { 
                text    : 'Notes',
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">Existing Notes</div></tpl>"
                ),
                dataIndex: 'notes'
            }      
        ]; 

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg:i18n('sConnecting')+" ...."});

        me.callParent(arguments);
    }
});
