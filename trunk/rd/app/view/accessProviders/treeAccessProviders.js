//FIXME: https://gist.github.com/1789536
//Add a search filter for the tree grid


Ext.define('Rd.view.accessProviders.treeAccessProviders' ,{
    extend:'Ext.tree.Panel',
    useArrows: true,
    alias : 'widget.treeAccessProviders',
    store: 'sAccessProviders',
    rootVisible: true,
    rowLines: true,
    stripeRows: true,
    border: false,
    requires: [
        'Rd.view.components.ajaxToolbar'
    ],
    urlMenu: '/cake2/rd_cake/access_providers/menu_for_tree.json',
    'stateful': true,
    'stateId': 'StateTreeAccessProviders',
    'stateEvents':['columnhide'],
    columns: [
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Access Provider hierarchy',
            sortable: true,
            flex: 1,
            dataIndex: 'username',
            tdCls: 'gridTree'
        },
        {
            text: 'Name',
            dataIndex: 'name',
            tdCls: 'gridTree'
        },
        {
            text: 'Surname',
            dataIndex: 'surname',
            tdCls: 'gridTree'
        },
        {
            text: 'Phone',
            dataIndex: 'phone',
            tdCls: 'gridTree'
        },
        {
            text: 'email',
            flex: 1,
            dataIndex: 'email',
            tdCls: 'gridTree'
        },

        { 
            text:   'Monitor',  
            xtype:  'templatecolumn', 
            tpl:    new Ext.XTemplate(
                        "<tpl if='monitor == true'><div class=\"hasRight\">Yes</div></tpl>",
                        "<tpl if='monitor == false'><div class=\"noRight\">No</div></tpl>"
                    )
        },
        { 
            text:   'Active',  
            xtype:  'templatecolumn', 
            tpl:    new Ext.XTemplate(
                        "<tpl if='active == true'><div class=\"hasRight\">Yes</div></tpl>",
                        "<tpl if='active == false'><div class=\"noRight\">No</div></tpl>"
                    )
        }

    ],
    initComponent: function(){
        var me  = this;
        me.tbar = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        me.callParent(arguments);
    }
});
