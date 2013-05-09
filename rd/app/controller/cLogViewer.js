Ext.define('Rd.controller.cLogViewer', {
    extend: 'Ext.app.Controller',
    actionIndex: function(){

        var me = this;
        var desktop = this.application.getController('cDesktop');
        var win = desktop.getWindow('logViewerWin');
        if(!win){
            win = desktop.createWindow({
                id: 'logViewerWin',
                title:i18n('sLogfile_viewer'),
                width:800,
                height:400,
                iconCls: 'logfile_viewer',
                animCollapse:false,
                border:false,
                constrainHeader:true,
                layout: 'border',
                stateful: true,
                stateId: 'realmsWin',
                items: [
                    {
                        region: 'north',
                        xtype:  'pnlBanner',
                        heading:i18n('sLogfile_viewer'),
                        image:  'resources/images/48x48/logfile_viewer.png'
                    },
                    {
                        region  : 'center',
                        layout  : 'fit',
                        margins : '0 0 0 0',
                        border  : false,
                        xtype   : 'pnlViewFile' 
                    }
                ]
            });
        }
        desktop.restoreWindow(win);    
        return win;
    },
    views:  [
        'components.pnlBanner', 'logViewer.pnlViewFile'
    ],
    stores: [],
    models: [],
    lines:  0,
    socket: undefined,
    showFirstTime: undefined,
    showDiv: undefined,
    htmlToAdd: '',
    config: {
      //  urlAdd:             '/cake2/rd_cake/realms/add.json'
    },
    refs: [
         {  ref:    'file', selector:   'pnlViewFile'},
    ],
    init: function() {
        var me = this;
        if (me.inited) {
            return;
        }
        me.inited = true;
        me.control({
            'pnlViewFile #clear': {
                click:      me.clear
            },
            '#logViewerWin'     : {
                show:       me.onShow
            }  
        });
    },
    reload: function(){
        var me =this;
        me.getStore('sRealms').load();
    },
    clear: function(b){
        var me      = this;
        me.showDiv.innerHTML = '';
    },
    ioLoaded:   function(i){
        var me = this;
       // console.log("Socket IO Loaded...");

        //Connect to host
        me.socket = io.connect('http://localhost:8000');
        
        me.socket.on('connect', function() {
         //   console.log('Connected to:', me.socket);
        });

        //Event binding
        me.socket.on('message', function(m) {
            if(Ext.isString(m)){    //Only strings...
                var fb = i18n('sReceiving_new_logfile_data');
               // console.log(fb);
                me.getFile().down('#feedback').update({message: fb});
                var new_t = m.split("\n");
                var l = new_t.length-1;
                var last = false;
                new_t.forEach(function(element, index, array){
                    if(index == l){
                        last = true;
                    }
                    me.newText(element, last);
                });
            } 
        });
    },
    onShow: function(w){
        var me = this;
       // console.log("Window show");
        if(me.showFirstTime == undefined){
            me.showFirstTime = true;
            me.showDiv = me.getFile().body.dom;
            //Load the Socket library
            Ext.Loader.loadScript({
                url     : "http://127.0.0.1:8000/socket.io/socket.io.js",
                onLoad  : me.ioLoaded,
                scope   : me
            });
        }
    },
    newText: function(line,last){
        var me = this;
        var new_line = "<br />";
        if(last == true){
            new_line = "";
        }
        var items = line.split(": ");
        if(items.length >= 3){
            var d = "<span class='txtGrey'>"+items[0]+"</span> : ";
            var msg_type = items[1];

            var type_class = "txtGrey"; //default

            var info    = /Info/i;
            if(msg_type.search(info) != -1){
                type_class = "txtBlue";
            }

            var error   = /Error/i;
            if(msg_type.search(error) != -1){
                type_class = "txtRed";
            }
            var t = "<span class='"+type_class+"'>"+items[1]+"</span> : ";

            items.shift(); //Remove first two emements and print the rest...
            items.shift();
            var rest = items.toString();

            if(type_class == 'txtRed'){
                rest = "<span class='txtBold'>"+rest+"</span>";
            }
           // console.log(rest);
            me.htmlToAdd = me.htmlToAdd+d+t+rest+new_line;

        }else{
            me.htmlToAdd = me.htmlToAdd+line+new_line;
        }

        //Check if last then append the block and clear:
        if(last == true){
            me.showDiv.innerHTML    = me.showDiv.innerHTML+me.htmlToAdd;
            me.htmlToAdd            = '';
            me.getFile().body.scrollTo('top',99999, true);
            var fb                  = i18n('sAwaiting_new_logfile_data');
            me.getFile().down('#feedback').update({message: fb});
        }
        
    }
});
