Ext.define('Rd.view.i18n.gridJavascriptPhrases' ,{
    extend:'Ext.grid.Panel',
    alias : 'widget.gridJavascriptPhrases',
    'store' : 'sI18nJsPhrases',
    'stateful': true,
    'stateId': 'StateGridJavascriptPhrases',
    'stateEvents':['groupclick','columnhide'],
    viewConfig: {
        preserveScrollOnRefresh: true
    },
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
                        { text: i18n('sKey'),      iconCls: 'key16',       itemId: 'mnuNewKey'},
                        { text: i18n('sLanguage_of_country'), iconCls: 'language16',itemId: 'mnuLanguageNew'}   
                    ]
                }
            },  
            { xtype: 'splitbutton',     iconCls: 'b-delete',    scale: 'large', itemId: 'delete',   tooltip:    i18n('sDelete'),
                menu: {
                    items: [
                        { text: i18n('sKey'),       iconCls: 'key16',       itemId: 'mnuDelKey'},
                        { text: i18n('sCountry'),    iconCls: 'country16',   itemId: 'mnuDelCountry'},
                        { text: i18n('sLanguage'),   iconCls: 'language16',  itemId: 'mnuLanguageDel'}  
                    ]
                }
            },
            { xtype: 'splitbutton',     iconCls: 'b-edit',      scale: 'large', itemId: 'edit',     tooltip:    i18n('sEdit'),
                menu: {
                    items: [
                        { text: i18n('sKey'),       iconCls: 'key16',       itemId: 'mnuEditKey'},
                        { text: i18n('sCountry'),    iconCls: 'country16',   itemId: 'mnuCountryEdit'},
                        { text: i18n('sLanguage'),   iconCls: 'language16',  itemId: 'mnuLanguageEdit'},
                        { text: i18n('sCopy_phrases_from_language'), iconCls: 'copy16',  itemId: 'mnuLanguageCopy'} 
                    ]
                }
            }
        ]}
    ],
    bbar: [
        {   xtype: 'component', itemId: 'count',   tpl: i18n('sResult_count_{count}'),   style: 'margin-right:5px', cls: 'lblYfi'  }
    ]
});
