function i18n(key) {
    return (Local.localizedStrings[key]);
}


var tb = {
    view    :"toolbar",
    padding :0, 
    height  :60,
    id      :"menuToolbar",
    elements:[
        { view:"button", id: 'btnHome',     type:"iconTop",    icon:"home",             label:i18n("sHome"),   width:100 },
        { view:"button", id: 'btnHelp',     type:"iconTop",    icon:'question-circle',  label:i18n("sHelp"),   width:100 },
        { view:"button", id: 'btnPhoto',    type:"iconTop",    icon:'camera',            label:i18n("sPhotos"), width:100 },
        { view:"button", id: 'btnAbout',    type:"iconTop",    icon:'info',             label:i18n("sAbout"),  width:100 },
        { },
        { 
            view    :"button", 
            id      : 'btnConnect',
            type    : "htmlbutton", 
            css     : "btnConnect", 
            label   : '<span class="webix_icon fa-plug"></span><span class="text"> '+i18n("sConnect")+'</span>', 
            width   :100
        }
    ]
};

var scroll = {
    view    :"scrollview", 
    id      :"scrollMain", 
    height  :700,
    scroll  :"y",
    scrollSpeed : "50000ms",
    body:{
        rows:[
             {
		        id  : 'scrnHome',
		        css : 'scrnHome',
		        cols: [{}]
	        },
	        {
		        id  : 'scrnHelp',
		        css : 'scrnHelp',
		        cols: [{}]
	        },
	        {
	         	id  : 'scrnPhoto',
	         	css : 'scrnPhoto',
		        cols: [{}]
	        },
	        {
	         	id  : 'scrnAbout',
	         	css : 'scrnAbout',
		        cols: [{}]
	        }
        ]
    }
};

var ui_scheme = {
    type    :"line",
    id      : 'layoutMain',
    rows    : [
            tb,
            scroll
    ]
};
