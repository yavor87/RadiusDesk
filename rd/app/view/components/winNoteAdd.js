Ext.define('Rd.view.components.winNoteAdd', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.winNoteAdd',
    closable    : true,
    draggable   : false,
    resizable   : false,
    title       : 'Add Note',
    width       : 350,
    height      : 350,
    plain       : true,
    border      : false,
    layout      : 'card',
    iconCls     : 'add',
    autoShow    : false,
    startScreen: 'scrnApTree', //Default start screen
    noteForId:  '', //Some attribute definitions
    noteForGrid:'',
    refreshGrid:'',
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnNote        = me.mkScrnNote();
        me.items = [
            scrnApTree,
            scrnNote
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

     //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){

        //A form which allows the user to select
        var pnlTree = Ext.create('Ext.tree.Panel',{
            itemId: 'scrnApTree',
            useArrows: true,
            store: 'sAccessProviders',
            rootVisible: true,
            rowLines: true,
            layout: 'fit',
            stripeRows: true,
            border: false,
            tbar: [
                { xtype: 'tbtext', text: 'Select the note\'s owner', cls: 'lblWizard' }
            ],
            columns: [
                {
                    xtype: 'treecolumn', //this is so we know which column will show the tree
                    text: 'Owner',
                    sortable: true,
                    flex: 1,
                    dataIndex: 'username',
                    tdCls: 'gridTree'
                }
            ],
            buttons: [
                    {
                        itemId: 'btnNoteTreeNext',
                        text: 'Next',
                        scale: 'large',
                        iconCls: 'b-next',
                        margin: '0 20 40 0'
                    }
                ]
        });
        return pnlTree;
    },

    //_______ The Note  _______
    mkScrnNote: function(){

        var me      = this;
        var buttons = [
                {
                    itemId  : 'btnNoteAddPrev',
                    text    : 'Prev',
                    scale   : 'large',
                    iconCls : 'b-prev',
                    margin  : '0 20 40 0'
                },
                {
                    itemId  : 'btnNoteAddNext',
                    text    : 'Next',
                    scale   : 'large',
                    iconCls : 'b-next',
                    formBind: true,
                    margin  : '0 20 40 0'
                }
        ];

        var frmNote = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnNote',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelClsExtra: 'lblRd',
                labelAlign: 'left',
                labelSeparator: '',
                margin: 15
            },
            defaultType: 'textfield',
            items:[
                {
                    itemId      : 'user_id',
                    xtype       : 'textfield',
                    name        : "user_id",
                    hidden      : true,
                    value       : me.user_id
                },
                {
                    itemId      : 'owner',
                    xtype       : 'displayfield',
                    fieldLabel  : 'Owner',
                    value       : me.owner,
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textareafield',
                    grow        : true,
                    name        : 'note',
                    fieldLabel  : 'Note',
                    anchor      : '100%',
                    allowBlank  :false,
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : 'Make available to sub-providers',
                    name        : 'available_to_siblings',
                    inputValue  : 'available_to_siblings',
                    itemId      : 'a_to_s',
                    checked     : false,
                    boxLabelCls : 'lblRdReq'
                    
                }
            ],
            buttons: buttons
        });
        return frmNote;
    }


});
