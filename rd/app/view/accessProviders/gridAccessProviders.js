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
            {xtype: 'rownumberer', stateId: 'StateGridAccessProviders1'},
            {
                text        : i18n('sOwner'),
                sortable    : true,
                flex        : 1,
                dataIndex   : 'owner',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}, stateId: 'StateGridAccessProviders2'
            },
            {
                text        : i18n('sUsername'),
                sortable    : true,
                flex        : 1,
                dataIndex   : 'username',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}, stateId: 'StateGridAccessProviders3'
            },
            {
                text        : i18n('sName'),
                dataIndex   : 'name',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}, stateId: 'StateGridAccessProviders4'
            },
            {
                text        : i18n('sSurname'),
                dataIndex   : 'surname',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}, stateId: 'StateGridAccessProviders5'
            },
            {
                text        : i18n('sPhone'),
                dataIndex   : 'phone',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}, stateId: 'StateGridAccessProviders6'
            },
            {
                text        : i18n('s_email'),
                flex        : 1,
                dataIndex   : 'email',
                tdCls       : 'gridTree',
                filter      : {type: 'string'}, stateId: 'StateGridAccessProviders7'
            },
            { 
                text        : i18n('sMonitor'),  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='monitor == true'><div class=\"fieldGreen\">"+i18n("sYes")+"</div></tpl>",
                                "<tpl if='monitor == false'><div class=\"fieldRed\">"+i18n("sNo")+"</div></tpl>"
                            ),
                dataIndex   : 'monitor',
                filter      : {type: 'boolean'}, stateId: 'StateGridAccessProviders8'
            },
            { 
                text        : i18n('sActive'),  
                xtype       : 'templatecolumn', 
                tpl         : new Ext.XTemplate(
                                "<tpl if='active == true'><div class=\"fieldGreen\">"+i18n("sYes")+"</div></tpl>",
                                "<tpl if='active == false'><div class=\"fieldRed\">"+i18n("sNo")+"</div></tpl>"
                            ),
                dataIndex   : 'active',
                filter      : { type: 'boolean'}, stateId: 'StateGridAccessProviders9'
            },
             { 
                text    : i18n('sNotes'),
                sortable: false,
                width   : 130,
                xtype   : 'templatecolumn', 
                tpl     : new Ext.XTemplate(
                                "<tpl if='notes == true'><div class=\"note\">"+i18n("sExisting_Notes")+"</div></tpl>"
                ),
                dataIndex: 'notes', stateId: 'StateGridAccessProviders10'
            }      
        ]; 

        //Create a mask and assign is as a property to the window
        me.mask = new Ext.LoadMask(me, {msg:i18n('sConnecting')+" ...."});

        me.callParent(arguments);
    }
});
