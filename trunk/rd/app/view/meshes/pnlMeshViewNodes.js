Ext.define('Rd.view.meshes.pnlMeshViewNodes', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlMeshViewNodes',
    border  : false,
    bodyStyle: {backgroundColor : 'green' },
	//layout  : 'fit',
	//autoEl	: {html:'$0.00',width:90},
	meshId	: '',
	canvas_new: true,
	viewConfig: {
        loadMask:true
    },
    tbar: [
        { xtype: 'buttongroup', title: i18n('sAction'), items : [
            { xtype: 'splitbutton',  iconCls: 'b-reload',    glyph: Rd.config.icnReload ,scale: 'large', itemId: 'reload',   tooltip:    i18n('sReload'),
                menu: {
                    items: [
                        '<b class="menu-title">Reload every:</b>',
                        {'text': '30 seconds',  'itemId': 'mnuRefresh30s','group': 'refresh','checked': false },
                        {'text': '1 minute',    'itemId': 'mnuRefresh1m', 'group': 'refresh','checked': false },
                        {'text': '5 minutes',   'itemId': 'mnuRefresh5m', 'group': 'refresh','checked': false },
                        {'text':'Stop auto reload','itemId':'mnuRefreshCancel', 'group': 'refresh', 'checked':true}
                    ]
                }
            }
        ]}    
    ],
    initComponent: function(){
        var me 	= this;
		me.html	= "<div id='n_t_n_"+me.meshId+"' style='width:100%;height:100%;background-color:#aaf6be;'></div>";
		
		var gooi = "hom";

		me.listeners= {
			boxready: function(panel,width, height, eOpts){
				var me = this;
				console.log("Now "+width+" "+height+" End");
			},
		    afterrender: function(a,b,c){
				console.log("afterrender....");
				me.initCanvas();
				me.buffered = Ext.Function.createBuffered(function(){
					me.fd.computeIncremental({
						iter: 40,
						property: 'end',
						onStep: function(perc){
						  console.log(perc + '% loaded...');
						},
						onComplete: function(){
						  console.log('done');
						  me.fd.animate({
							modes: ['linear'],
							transition: $jit.Trans.Elastic.easeOut,
							duration: 2500
						  });
						}
					});
				},1000,me);
		    },
			afterlayout: function(a,b,c){
				console.log("afterlayout....");
				var me = this;
				var w  = me.getWidth();
				var h  = me.getHeight()-90; //90 is the space taken up by the top toolbar
				me.fd.canvas.resize(w,h);
				me.buffered();

		    },
			scope: me
		}
		me.callParent(arguments);
    },
	initCanvas: function(){
		var me = this;
		console.log("Init the canvas");
		var labelType, useGradients, nativeTextSupport, animate;

		(function() {
		  var ua = navigator.userAgent,
			  iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
			  typeOfCanvas = typeof HTMLCanvasElement,
			  nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
			  textSupport = nativeCanvasSupport 
				&& (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
		  //I'm setting this based on the fact that ExCanvas provides text support for IE
		  //and that as of today iPhone/iPad current text support is lame
		  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
		  nativeTextSupport = labelType == 'Native';
		  useGradients = nativeCanvasSupport;
		  animate = !(iStuff || !nativeCanvasSupport);
		})();


		var i  = 'n_t_n_'+me.meshId;
		// init ForceDirected
		var fd = new $jit.ForceDirected({
			Canvas: {
				height : 500,
        		width  : 200
			},
			//id of the visualization container
			injectInto: i,
			//Enable zooming and panning
			//by scrolling and DnD
			Navigation: {
			  enable: true,
			  //Enable panning events only if we're dragging the empty
			  //canvas (and not a node).
			  panning: 'avoid nodes',
			  zooming: 10 //zoom speed. higher is more sensible
			},
			// Change node and edge styles such as
			// color and width.
			// These properties are also set per node
			// with dollar prefixed data-properties in the
			// JSON structure.
			Node: {
			  overridable: true
			},
			Edge: {
			  overridable: true,
			  color: 'red',
			  lineWidth: 0.4
			},
			//Native canvas text styling
			Label: {
			  type	: labelType, //Native or HTML
			  size	: 15,
			  style	: 'bold',
			  color	: '#434446'
			},
			//Add Tips
			Tips: {
			  enable: true,
			  onShow: function(tip, node) {
				//count connections
				var count = 0;
				node.eachAdjacency(function() { count++; });
				//display node info in tooltip
				tip.innerHTML = "<div class='divTip'>"+
					"<div class='tip-title'>"+ node.name + "</div>"+
					"<label class='lblListS'>Time</label><label class='lblValueS'>"+node.data.attr+"</label>"+
                    "<div style='clear:both;'></div>"+
					"<label class='lblListS'>Connections</label><label class='lblValueS'>"+count+"</label>"+
                    "<div style='clear:both;'></div>"+
					"<label class='lblListS'>Time</label><label class='lblValueS'>"+node.data.attr+"</label>"+
                    "<div style='clear:both;'></div>"+
					"<label class='lblListS'>Connections</label><label class='lblValueS'>"+count+"</label>"+
                    "<div style='clear:both;'></div>"+
					"<label class='lblListS'>Time</label><label class='lblValueS'>"+node.data.attr+"</label>"+
                    "<div style='clear:both;'></div>"+
					"<label class='lblListS'>Connections</label><label class='lblValueS'>"+count+"</label>"+
                    "<div style='clear:both;'></div>"+
					"</div>";
			  }
			},
			// Add node events
			Events: {
			  enable: true,
			  type: 'Native',
			  //Change cursor style when hovering a node
			  onMouseEnter: function() {
				fd.canvas.getElement().style.cursor = 'move';
			  },
			  onMouseLeave: function() {
				fd.canvas.getElement().style.cursor = '';
			  },
			  //Update node positions when dragged
			  onDragMove: function(node, eventInfo, e) {
				  var pos = eventInfo.getPos();
				  node.pos.setc(pos.x, pos.y);
				  fd.plot();
			  },
			  //Implement the same handler for touchscreens
			  onTouchMove: function(node, eventInfo, e) {
				$jit.util.event.stop(e); //stop default touchmove event
				this.onDragMove(node, eventInfo, e);
			  },
			  //Add also a click handler to nodes
			  onClick: function(node) {
				  if(!node) return;
				  console.log(node);
				  node.data["$color"] = "#FF0000";
				  fd.plot();
			  }
			},
			//Number of iterations for the FD algorithm
			iterations			: 200,
			//Edge length
			levelDistance		: 130,
			// Add text to the labels. This method is only triggered
			// on label creation and only for DOM labels (not native canvas ones).
			onCreateLabel: function(domElement, node){
			  domElement.innerHTML 	= node.name;
			  var style 			= domElement.style;
			  style.fontSize 		= "1.8em";
			  style.color 			= "black";
			},
		});

						 var json = [
	// first node
    {
        id: "graphnode1",
        name: "OM2P-1 Study",
		
        data: {
            $color: "#117c25",
            $type: "circle",
            $dim: 20,
			'attr': 'once'
        },
		adjacencies: [
			{
				nodeTo: "graphnode3",
				data: {
					"$color"	: "green",
					"$lineWidth": 6,
					"$alpha"	: 0.5
				}
			},
			{
				nodeTo: "graphnode2",
				data: {
					"$color"	: "green",
					"$lineWidth": 3,
					"$alpha"	: 0.5
				}
			}
		]
    },
    // second node
    {
        data: {
            $color	: "#4bd765",
            $type	: "circle",
            $dim	: 10,
			'attr'	: 'twice'
        },
        id: "graphnode2",
        name: "OM2P-2 Flatlet"
    },
    // third node
    {
        data: {
            $color	: "#4bd765",
            $type	: "circle",
            $dim	: 10,
			'attr': 'three times'
        },
        id: "graphnode3",
        name: "Dragino-3 Lapa"
    },
	//New node
	{
        data: {
            $color	: "grey",
            $type	: "circle",
            $dim	: 10,
			'attr'	: 'twice'
        },
        id: "graphnode5",
        name: "New node"
    },
];

				fd.loadJSON(json);
	
		me.fd 			= fd;
	}
});
