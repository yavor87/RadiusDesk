Ext.define('Rd.view.i18n.gridJavascriptPhrases' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridJavascriptPhrases',
    'store' : 'sI18nJsPhrases',
    'stateful': true,
    'stateId': 'StateGridJavascriptPhrases',
    'stateEvents':['groupclick','columnhide'],
    border: false,
    requires: ['Rd.view.components.vCmbLanguages'],
    columns: [
        {xtype: 'rownumberer'},
        { text: i18n('sKey'),       dataIndex: 'key',          tdCls: 'grdBold' },
        { text: i18n('sComment'),   dataIndex: 'comment',      tdCls: 'grdGrey'},
        { text: i18n('sEnglish_use_as_reference'),   dataIndex: 'english',      tdCls: 'grdItalic'},
        { text: i18n('sTranslated') ,dataIndex: 'translated',   tdCls: 'grdEditable', flex: 1, editor: { xtype: 'textfield',  allowBlank: false},
          renderer: function(value){
            if((value == "(modify me)")||(value == "(new addition)")){
                return "<span class='new'>"+value+"</span";
            }else{
                return value;
            }
         }
        }
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
            { xtype: 'button',          iconCls: 'b-reload',    scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload') },              
            { xtype: 'splitbutton',     iconCls: 'b-add',       scale: 'large', itemId: 'add',      tooltip:    i18n('sAdd'),
                menu: {
                    items: [
                        { text: 'Key',      iconCls: 'key16',       itemId: 'mnuNewKey'},
                        { text: 'Language of country', iconCls: 'language16',itemId: 'mnuLanguageNew'}   
                    ]
                }
            },  
            { xtype: 'splitbutton',     iconCls: 'b-delete',    scale: 'large', itemId: 'delete',   tooltip:    i18n('sDelete'),
                menu: {
                    items: [
                        { text: 'Key',      iconCls: 'key16',       itemId: 'mnuDelKey'},
                        { text: 'Country',  iconCls: 'country16',   itemId: 'mnuDelCountry'},
                        { text: 'Language', iconCls: 'language16',  itemId: 'mnuLanguageDel'}  
                    ]
                }
            },
            { xtype: 'splitbutton',     iconCls: 'b-edit',      scale: 'large', itemId: 'edit',     tooltip:    i18n('sEdit'),
                menu: {
                    items: [
                        { text: 'Key',      iconCls: 'key16',       itemId: 'mnuEditKey'},
                        { text: 'Country',  iconCls: 'country16',   itemId: 'mnuCountryEdit'},
                        { text: 'Language', iconCls: 'language16',  itemId: 'mnuLanguageEdit'},
                        { text: 'Copy phrases from language', iconCls: 'copy16',  itemId: 'mnuLanguageCopy'} 
                    ]
                }
            }
        ]}
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: 'Result count: {count}',   style: 'margin-right:5px', cls: 'lblYfi'  }
    ]
});
