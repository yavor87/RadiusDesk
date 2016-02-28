var tabbar = {
   id:"tabs",
   view:"tabbar", type:"bottom", multiview:true, options: [
	    { value: "<span class='webix_icon fa-user'></span><span style='padding-left: 4px'>Usage Check</span>",          id: 'scrnHome' }
    ],height:50
};

var data = {
    view        : "multiview",
    keepViews   :true,
    fitBiggest  : true,
    cells       :[
	    {
		    id  : 'scrnHome',
		    css : 'scrnHome',
		    cols: []
	    }
    ]
}

var ui_scheme = {
    type    :"line",
    width   :'100%',
    height  :'100%',
    rows    : [
            data,
            tabbar
    ]
};
