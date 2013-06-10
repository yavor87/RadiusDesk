Ext.define('Rd.view.i18n.gridPhpPhrases' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridPhpPhrases',
    'store' : 'sI18nPhpPhrases',
    'stateful': true,
    'stateId': 'StateGridPhpPhrases',
    'stateEvents':['groupclick','columnhide'],
    border: false,
    multiSelect: true,
    viewConfig: {
        preserveScrollOnRefresh: true
    },
    requires: ['Rd.view.components.vCmbLanguages'],
    columns: [
        {xtype: 'rownumberer'},
        { text: 'Comments', dataIndex: 'comment',   tdCls: 'grdGrey'},
        { text: 'Msgid',    dataIndex: 'msgid',     tdCls: 'grdBold' }, 
        { text: 'Msgstr',   dataIndex: 'msgstr',    tdCls: 'grdEditable', flex: 1, editor: { xtype: 'textfield',  allowBlank: true}}
    ],
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    tbar: [
        { xtype: 'buttongroup', title: i18n('sSelection'), height: 60, padding:4,items : [
            { xtype: 'cmbLanguages', width: 350 }
        ]},
        { xtype: 'buttongroup', title: i18n('sAction'), items : [
            { xtype: 'button',  iconCls: 'b-reload',    scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload')},              
            { xtype: 'button',  iconCls: 'b-add',       scale: 'large', itemId: 'add',      tooltip:    i18n('sAdd')   },
            { xtype: 'button',  iconCls: 'b-delete',    scale: 'large', itemId: 'delete',   tooltip:    i18n('sDelete')},
            { xtype: 'button',  iconCls: 'b-edit',      scale: 'large', itemId: 'edit',     tooltip:    i18n('sEdit')  }
        ]},
        { xtype: 'buttongroup', title: i18n('sPHP_Phrases'), items : [
            { xtype: 'button',  iconCls: 'b-copy',      scale: 'large', itemId: 'copy',     tooltip:    i18n('sCopy')},
            { xtype: 'button',  iconCls: 'b-meta_edit', scale: 'large', itemId: 'meta',     tooltip:    i18n('sEdit_meta_info')},
            { xtype: 'button',  iconCls: 'b-comment',   scale: 'large', itemId: 'comment',  tooltip:    i18n('sAdd_comment')}
        ]}
         
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',  tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi'  }
    ]
});
