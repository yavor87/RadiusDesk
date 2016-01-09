
var tabbar = {
   id:"tabs",
   view:"tabbar", type:"bottom", multiview:true, options: [
	    { value: "<span class='webix_icon fa-plug'></span><span style='padding-left: 4px'>Connect</span>",          id: 'scrnHome' },
	    { value: "<span class='webix_icon fa-question-circle'></span><span style='padding-left: 4px'>Help</span>",  id: 'scrnHelp' },
	    { value: "<span class='webix_icon fa-camera'></span><span style='padding-left: 1px'>Gallery</span>",        id: 'scrnPhoto'},
	    { value: "<span class='webix_icon fa-info'></span><span style='padding-left: 1px'>About</span>",            id: 'scrnAbout'},
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
	    },
	    {
		    id  : 'scrnHelp',
		    css : 'scrnHelp',
		    cols: []
	    },
	    {
	     	id  : 'scrnPhoto',
	     	css : 'scrnPhoto',
		    cols: []
	    },
	    {
	     	id  : 'scrnAbout',
	     	css : 'scrnAbout',
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
