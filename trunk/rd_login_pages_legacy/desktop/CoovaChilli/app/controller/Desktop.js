Ext.define('CoovaLogin.controller.Desktop', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.data.JsonP'],
    views: [
        'Land',
        'winHelp'
    ],
    winHelp: undefined,
    refs: [
        { ref: 'vp',        selector: '',               xtype: 'vp',        autoCreate: true},
        { ref: 'land',      selector: '',               xtype: 'land'},   
        { ref: 'img',       selector: 'land > image',   xtype: ''}, //The background image
        { ref: 'infoButton',selector: '#btnInfo',       xtype: ''},
        { ref: 'nextButton',selector: '#btnNext',       xtype: ''},
        { ref: 'prevButton',selector: '#btnPrev',       xtype: ''},
        { ref: 'winHelp'   ,selector: 'winHelp'}
    ],
    info: undefined,    //realm info 
    photos: undefined,  //list of photos
    currentPhoto: undefined, //current photo index
    transitionTime: 2000,   //time for transitions between slides  
    init: function() {
        var me = this;
        //Connect some events
        me.control({
            'land > image': {
             //   render: me.onAfterImageRendered //We need to ensure there is no race condition for the wallpapers
            },
            'land #btnNext':    {
                click: me.onBtnNextClick
            },
            'land #btnPrev':    {
                click: me.onBtnPrevClick
            },
            'land #topToolbar .button': {
                click: me.onTopClick
            },
            'winHelp':  {
                destroy:    me.winHelpDestroy
            }
        });    
    },

    startUp: function(){
        var me = this;  
   
        Ext.Ajax.request({
            url     : me.application.config.urlRealmInfo+document.location.search,
            method  : 'GET',
            success : function(response){
                var jsonData    = Ext.JSON.decode(response.responseText);
                if(jsonData.success){
                    me.realmFetched(jsonData.data);
                }       
            },
            scope: me
        });

        //We hand controll over to the Connect controller to tell us if we are: A hotspot, connected, or not connected...
        me.application.getController('Connect').index(); //Hack not to show pop-up (use instead of index)
    },

    //____________________________ REALM DETAIL _______________________________
    realmFetched: function(data){   //Handler for Realm Info
        var me = this;
        //The data should contain the realm name which we will assign to me.application.realm.name
        me.info     = data.detail;
        me.photos   = data.photos;
        me.pages    = data.pages;
        var l   = me.getView('Land').create({'info' : data.detail});
        var vp  = me.getVp();
        vp.add([l]);

        if(me.photos.length > 0){
            me.getInfoButton().setDisabled(false); //Enable next button
            if(me.photos.length > 1){
                me.getNextButton().setDisabled(false); //Enable next button
            }
            
            me.currentPhoto = 0;
            this.setTooltip();
            var i = this.getImg();
            i.setSrc(me.application.config.urlBase+me.photos[me.currentPhoto].file_name); 
        } 

        //Check if we need to show Help Window
        if(me.application.showHelp){
             if (window.console) {
                    window.console.log("Start by showing help");
             }
            
            me.winHelpCreate();
        }
    },
    //____________________________ SLIDE SHOW _______________________________

    onBtnNextClick: function(b){    //Slide navigation
        this.currentPhoto = this.currentPhoto +1;
        this.setTooltip();
        this.changeImage(); 
    },
    onBtnPrevClick: function(b){    //Slide navigation
        this.currentPhoto = this.currentPhoto -1;
        this.setTooltip();
        this.changeImage();
    },
    setTooltip: function(){ //Slide show navigation
        var me = this;
        var title = me.photos[me.currentPhoto].title;
        var descr = me.photos[me.currentPhoto].description;
        this.getInfoButton().setTooltip("<h1>"+title+"</h1>"+descr);
    },
    changeImage: function(){ //Slide show navigation
        var me  = this;
        var i   = me.getImg();

        //Take care of the buttons
        if(me.currentPhoto >= (me.photos.length-1)){
            me.getNextButton().setDisabled(true);
        }else{
            me.getNextButton().setDisabled(false);
        }
 
        //Take care of the buttons
        if(me.currentPhoto == 0){
            me.getPrevButton().setDisabled(true);
        }else{
            me.getPrevButton().setDisabled(false);
        }
        //A little animation      
        i.getEl().fadeOut({ 
            duration: me.transitionTime,
            callback:   function(){
                i.setSrc(me.application.config.urlBase+me.photos[me.currentPhoto].file_name);
                i.getEl().fadeIn({duration: me.transitionTime});  
            }
        });
    },

    //This will call the various controllers's index actions....
    onTopClick: function(b){    //Top button has been clicked
        var me = this;
        var butId = b.getItemId();

        if(butId == 'about'){
            return;
        }
        if(butId == 'help'){
            me.winHelpCreate();
            return;
        }

        me.application.activeWindow.hide();

        if(butId == 'connect'){
            me.application.getController('Connect').index();
        }
        if(butId !== 'connect'){    //The connect does a JSON call which will cause a race condition
            me.application.activeWindow.show(); 
        }        
        //me.application.activeWindow.show();
    },
    winHelpCreate: function(){
        me              = this;
        var html_string = '';
        Ext.Array.forEach(me.pages,function(item,index,arr){
            html_string =  html_string+"<h2>"+item.name+"</h2>"+item.content+"<br>";

        },me);
        if(me.winHelp == undefined){
            me.winHelp = me.getView('winHelp').create({'html':html_string});
            me.winHelp.show();
        }else{
            me.winHelp.show();
        }
    },
    activateHelp: function(){
        me  = this;
        me.startWithHelp = true;
    },
    winHelpDestroy: function(w){
        var me = this;
        me.winHelp = undefined;
    }
});
