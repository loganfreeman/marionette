define([ 'app', 'stache!apps/data/main', 
         'stache!apps/data/d3', 'stache!apps/data/bullet', 'stache!apps/data/calendar', 
         'stache!apps/data/cartogram', 'stache!apps/data/tree', 'stache!apps/data/chord', 'stache!apps/data/dendrogram', 'stache!apps/data/circlepacking',
         'stache!apps/data/population', 'stache!apps/data/treemap', 'stache!apps/data/tessellation',
         'stache!apps/data/rickshaw', 'stache!apps/data/slickgrid', 
         'stache!apps/data/sigma', 'stache!apps/data/flot', 'stache!apps/data/realtime',
         'stache!apps/data/morris', 'stache!apps/data/list', 'stache!apps/data/handsontable',
         'stache!apps/data/chart', 'stache!apps/data/nasdaq',
         'stache!apps/data/highcharts', 'stache!apps/data/peer', 'stache!apps/data/oboe',
         'stache!apps/data/dataTable', 'stache!apps/data/knwl',
         'stache!apps/data/flowchart', 'stache!apps/data/sink',
         'stache!apps/data/chartdemo', 'stache!apps/data/rchart',
         'stache!apps/data/cytoscape', 'stache!apps/data/atlas',
         'stache!apps/data/springy', 'stache!apps/data/zip',
         'stache!apps/data/usa', 'stache!apps/data/taffy', 'stache!apps/data/dimple',
         'stache!apps/data/xlsx', 'stache!apps/data/xls',
         'stache!apps/data/cloud', 'stache!apps/data/fuse',
         'stache!apps/data/tablecloth', 'stache!apps/data/treetable',
         'stache!apps/data/lscache', 'stache!apps/data/tablesort',
         'stache!apps/data/indexdb',
         'd3.v3', 'rickshaw', 'list', 'oboe', 'fuse',
         'css!apps/data/style', 'css!apps/data/bullet', 'css!apps/data/extensions' , 'css!apps/data/zip' , 
         'css!apps/data/style/atlas' , 'css!apps/data/indexdb' , 
         'slick.grid', 'sigma', 'jquery.flot', 'morris', 'jquery.handsontable', 'chart', 'dc', 'vendor/crossfilter', 'vendor/colorbrewer', 'highcharts',
         'peer', 
         'jquery.dataTables', 'knwl', 'jquery.jsPlumb', 'raphael', 
         'cytoscape', 'arbor', 'springy', 'zip', 'taffy', 'dimple.v2.0.1', 'd3.layout.cloud',
         'underscore.db', 'jquery.indexeddb', 'lokijs', 'vendor/z'
          ], function(App, viewTpl, 
        		 d3Tpl, bulletTpl, calendarTpl, cartogramTpl, treeTpl, chordTpl, dendrogramTpl, circlepackingTpl,populationTpl, treemapTpl, tessellationTpl,
        		 rickshawTpl, slickgridTpl, sigmaTpl, flotTpl, realtimeTpl, morrisTpl, listTpl, handsontableTpl, chartTpl, nasdaqTpl, highchartsTpl, peerTpl,
        		 oboeTpl, dataTableTpl, knwlTpl, flowchartTpl, sinkTpl, hierarchyTpl, rchartTpl,cytoscapeTpl, atlasTpl, springyTpl,
        		 zipTpl, usaTpl, taffyTpl, dimpleTpl, xlsxTpl, xlsTpl, cloudTpl, fuseTpl, tableTpl, treetableTpl, lscacheTpl, tablesortTpl,
        		 indexdbTpl,
        		 d3, Rickshaw, List, oboe, Fuse) {
	App.module('dataDemo', function(dataDemo, App, Backbone, Marionette, $, _) {
		window.d3 = d3;
		window.List = List;
		
		function run(id) {
			  var code = document.getElementById(id).value;
			  eval(code);
			}
		
		window['run'] = run;

		dataDemo.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				content : '#dataDemo-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		dataDemo.indexdbView = Marionette.Layout.extend({
			template : indexdbTpl,
			onShow: function(){
				require(['apps/data/indexdbrun'], function(runIndexDb){
					console.log(runIndexDb);
					runIndexDb()
				})
			}
		});
		
		dataDemo.tablesortView = Marionette.ItemView.extend({
			template : tablesortTpl,

			onShow: function(){
				require(['vendor/stupidtable'], function(){
					$("table").stupidtable();
				})
			},

		});
		
		function __z(){

			 if((i=($(this)[0].className=='z-pwd'))&&arguments[0].keyCode!=13)return;

			 a=$(this).parent();
			 Z=z.js(a.text(),$(this).val()||!1);


			 if(Z===!1){

			  if(!i){
			   a.append($('<input/>',{'title':'Enter password','type':'password',class:'z-pwd'}));
			   $(this).remove();a.children().last().focus();
			  }
			  else{
			   $(this).css({backgroundColor:'#f00'}).fadeTo(3e2,1,function(){$(this).css({backgroundColor:'#111'})});
			  }

			 return;

			}


			 Z&&a.html(Z);


			}
		

		
		dataDemo.lscacheView = Marionette.Layout.extend({
			template : lscacheTpl,
			events: {
				'click #runloki' : 'runloki'
			},
			onShow: function(){
				require(['vendor/lscache'], function(lscache){
					window['lscache'] = lscache;
				})
				
				//'auto-detection'
				$('article p:contains("\u200c")').append($('<button/>',{class:'z-btn',html:'Show'}));
				$('.z-btn').click(__z);$(document).on('keypress','.z-pwd',__z);
			},
			runloki: function(){
				require(['apps/data/lokirun'], function(){
					$('<textarea></textaread').appendTo($('#lokiconsole')).val('Load up the console and see it happen!')
					runExample()
				})
			}
		});
		
		dataDemo.treetableView = Marionette.Layout.extend({
			template : treetableTpl,
			onShow: function(){
				require(['vendor/jquery.treetable', 'css!vendor/css/jquery.treetable', 'css!vendor/css/jquery.treetable.theme.default'], function(){
					$("#example-advanced").treetable({ expandable: true });

					// Highlight selected row
					$("#example-advanced tbody").on("mousedown", "tr", function() {
					  $(".selected").not(this).removeClass("selected");
					  $(this).toggleClass("selected");
					});

					// Drag & Drop Example Code
					$("#example-advanced .file, #example-advanced .folder").draggable({
					  helper: "clone",
					  opacity: .75,
					  refreshPositions: true,
					  revert: "invalid",
					  revertDuration: 300,
					  scroll: true
					});

					$("#example-advanced .folder").each(function() {
					  $(this).parents("#example-advanced tr").droppable({
					    accept: ".file, .folder",
					    drop: function(e, ui) {
					      var droppedEl = ui.draggable.parents("tr");
					      $("#example-advanced").treetable("move", droppedEl.data("ttId"), $(this).data("ttId"));
					    },
					    hoverClass: "accept",
					    over: function(e, ui) {
					      var droppedEl = ui.draggable.parents("tr");
					      if(this != droppedEl[0] && !$(this).is(".expanded")) {
					        $("#example-advanced").treetable("expandNode", $(this).data("ttId"));
					      }
					    }
					  });
					});
				})
			}
		});
		
		dataDemo.tableView = Marionette.Layout.extend({
			template : tableTpl,
			onShow: function(){
				require(['vendor/jquery.metadata', 'vendor/jquery.tablecloth', 'vendor/jquery.tablesorter', 'css!vendor/css/bootstrap-tables',
				         'css!vendor/css/tablecloth'], function(){
					 $("table").tablecloth({
				          theme: "paper",
				          striped: true,
				          sortable: true,
				          condensed: true
				        });
				})
			}
		});
		
		dataDemo.fuseView = Marionette.Layout.extend({
			template : fuseTpl,
			onShow: function(){
				function start(books) {
				    var $inputSearch = $('#inputSearch'),
				        $result = $('#results'),

				        $authorCheckbox = $('#author'),
				        $titleCheckbox = $('#title'),
				        $caseCheckbox = $('#case'),

				        searchAuthors = false,
				        searchTitles = true,
				        isCaseSensitive = false,

				        fuse;

				    function search() {
				      var r = fuse.search($inputSearch.val());
				      $result.empty();
				      $.each(r, function() {
				        $result.append('<li class="result-item">' + this.title + ', <span>' + this.author + '</span></li>');
				      });
				    }

				    function createFuse() {
				      var keys = [];
				      if (searchAuthors) {
				        keys.push('author');
				      }
				      if (searchTitles) {
				        keys.push('title');
				      }
				      fuse = new Fuse(books, {
				        keys: keys,
				        caseSensitive: isCaseSensitive
				      });
				    }

				    function onAuthorCheckboxChanged() {
				      searchAuthors= $authorCheckbox.prop('checked');
				      createFuse();
				      search();
				    }

				    function onTitleCheckboxChanged() {
				      searchTitles = $titleCheckbox.prop('checked');
				      createFuse();
				      search();
				    }

				    function onCaseCheckboxChanged() {
				      isCaseSensitive = $caseCheckbox.prop('checked');
				      createFuse();
				      search();
				    }

				    $authorCheckbox.on('change', onAuthorCheckboxChanged);
				    $titleCheckbox.on('change', onTitleCheckboxChanged);
				    $caseCheckbox.on('change', onCaseCheckboxChanged);

				    $inputSearch.on('keyup', search);

				    createFuse();
				  }

				  $.getJSON('assets/js/apps/data/books.json', function(data) {
				     start(data);
				  });
			}
		});
		
		dataDemo.cloudView = Marionette.Layout.extend({
			template : cloudTpl,
			onShow: function(){
				  var fill = d3.scale.category20();

				  d3.layout.cloud().size([600, 600])
				      .words([
				        "Hello", "world", "normally", "you", "want", "more", "words",
				        "than", "this", 'manner', 'Alabaster', 'Ailurophile'].map(function(d) {
				        return {text: d, size: 10 + Math.random() * 90};
				      }))
				      .padding(5)
				      .rotate(function() { return ~~(Math.random() * 2) * 90; })
				      .font("Impact")
				      .fontSize(function(d) { return d.size; })
				      .on("end", draw)
				      .start();

				  function draw(words) {
				    d3.select("#cloud").append("svg")
				        .attr("width", 600)
				        .attr("height", 600)
				      .append("g")
				        .attr("transform", "translate(150,150)")
				      .selectAll("text")
				        .data(words)
				      .enter().append("text")
				        .style("font-size", function(d) { return d.size + "px"; })
				        .style("font-family", "Impact")
				        .style("fill", function(d, i) { return fill(i); })
				        .attr("text-anchor", "middle")
				        .attr("transform", function(d) {
				          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				        })
				        .text(function(d) { return d.text; });
				  }
			}
		});
		
		dataDemo.xlsxView = Marionette.Layout.extend({
			template : xlsxTpl,
			onShow: function(){
				require(['apps/data/xlsx'])
			}
		});
		
		dataDemo.xlsView = Marionette.Layout.extend({
			template : xlsTpl,
			onShow: function(){
				require(['apps/data/xls'])
			}
		});
		
		dataDemo.dimpleView = Marionette.Layout.extend({
			template : dimpleTpl,
			onShow: function(){
				require(['apps/data/dimple'])
			}
		});
		
		dataDemo.taffyView = Marionette.Layout.extend({
			template : taffyTpl,
			events: {
				'click #cities' : 'getCities'
			},
			ui: {
				content: '#taffyconsole'
			},
			onRender: function(){
				var cities = TAFFY([{name:"New York",state:"WA"},{name:"Las Vegas",state:"NV"},{name:"Boston",state:"MA"}]);
				
				cities.insert({name:"Portland",state:"OR"});
				
				this.cities = cities;
			},
			getCities : function(){
				var that = this;
				this.cities().limit(2).each(function (r) {
					var s = that.ui.content.val() + '\n' + r.name;
					that.ui.content.val(s)
				});
			}
		});
		
		dataDemo.usaView = Marionette.Layout.extend({
			template : usaTpl,
			onShow: function(){
				require(['apps/data/usamap'], function(){
					
				})
			}
		});
		
		dataDemo.zipView = Marionette.Layout.extend({
			template : zipTpl,
			onShow: function(){
				require(['apps/data/zip-demo'], function(){
					
				})
			}
		});
		
		dataDemo.springyView = Marionette.Layout.extend({
			template : springyTpl,
			onShow: function(){
				require(['apps/data/rconnection'], function(doit){
					doit();
				})
			}
		});
		
		dataDemo.atlasView = Marionette.Layout.extend({
			template : atlasTpl,
			onShow: function(){
				require(['apps/data/atlas'], function(Maps){
					var mcp = Maps("#maps")
				})
			}
		});
		
		dataDemo.cytoscapeView = Marionette.Layout.extend({
			template : cytoscapeTpl,
			onShow: function(){
				$('#cy').cytoscape({
					  layout: {
					    name: 'circle'
					  },
					  
					  style: cytoscape.stylesheet()
					    .selector('node')
					      .css({
					        'shape': 'data(faveShape)',
					        'width': 'mapData(weight, 40, 80, 20, 60)',
					        'content': 'data(name)',
					        'text-valign': 'center',
					        'text-outline-width': 2,
					        'text-outline-color': 'data(faveColor)',
					        'background-color': 'data(faveColor)',
					        'color': '#fff'
					      })
					    .selector(':selected')
					      .css({
					        'border-width': 3,
					        'border-color': '#333'
					      })
					    .selector('edge')
					      .css({
					        'width': 'mapData(strength, 70, 100, 2, 6)',
					        'target-arrow-shape': 'triangle',
					        'source-arrow-shape': 'circle',
					        'line-color': 'data(faveColor)',
					        'source-arrow-color': 'data(faveColor)',
					        'target-arrow-color': 'data(faveColor)'
					      })
					    .selector('edge.questionable')
					      .css({
					        'line-style': 'dotted',
					        'target-arrow-shape': 'diamond'
					      })
					    .selector('.faded')
					      .css({
					        'opacity': 0.25,
					        'text-opacity': 0
					      }),
					  
					  elements: {
					    nodes: [
					      { data: { id: 'j', name: 'Jerry', weight: 65, faveColor: '#6FB1FC', faveShape: 'triangle' } },
					      { data: { id: 'e', name: 'Elaine', weight: 45, faveColor: '#EDA1ED', faveShape: 'ellipse' } },
					      { data: { id: 'k', name: 'Kramer', weight: 75, faveColor: '#86B342', faveShape: 'octagon' } },
					      { data: { id: 'g', name: 'George', weight: 70, faveColor: '#F5A45D', faveShape: 'rectangle' } }
					    ],
					    edges: [
					      { data: { source: 'j', target: 'e', faveColor: '#6FB1FC', strength: 90 } },
					      { data: { source: 'j', target: 'k', faveColor: '#6FB1FC', strength: 70 } },
					      { data: { source: 'j', target: 'g', faveColor: '#6FB1FC', strength: 80 } },
					     
					      { data: { source: 'e', target: 'j', faveColor: '#EDA1ED', strength: 95 } },
					      { data: { source: 'e', target: 'k', faveColor: '#EDA1ED', strength: 60 }, classes: 'questionable' },
					      
					      { data: { source: 'k', target: 'j', faveColor: '#86B342', strength: 100 } },
					      { data: { source: 'k', target: 'e', faveColor: '#86B342', strength: 100 } },
					      { data: { source: 'k', target: 'g', faveColor: '#86B342', strength: 100 } },
					      
					      { data: { source: 'g', target: 'j', faveColor: '#F5A45D', strength: 90 } }
					    ]
					  },
					  
					  ready: function(){
					    window.cy = this;
					    
					    // giddy up
					  }
					});
			}
		});
		
		dataDemo.rchartView = Marionette.Layout.extend({
			template : rchartTpl,
			onRender: function(){
				this.$el.append("<div id='bar'></div>").append("<div id='line'></div>");
			},
			onShow: function(){
				require(['vendor/raphael/g.raphael', 'vendor/raphael/g.pie', 'vendor/raphael/g.line', 'vendor/raphael/g.bar' ], function(){
					var chart = new Raphael(document.getElementById('canvas_container'), 640, 480);
					chart.piechart(320, 240, 100, [55, 20, 13, 32, 5, 1, 2]);
					
					var line = new Raphael(document.getElementById('bar'), 640, 480);
					line.linechart(0, 0, 99, 99, [1,2,3,4,5], [[1,2,3,4,5], [1,3,9,16,25], [100,50,25,12,6]], {smooth: true, colors: ['#F00', '#0F0', '#FF0'], symbol: 'circle'});
				})
			}
		});
		
		dataDemo.hierarchyView = Marionette.Layout.extend({
			template : hierarchyTpl,
			onShow: function(){
				jsPlumb.ready(function() {			

					var color = "gray";

					var instance = jsPlumb.getInstance({
						// notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
						// than the curves on the first demo, which use the default curviness value.			
						Connector : [ "Bezier", { curviness:50 } ],
						DragOptions : { cursor: "pointer", zIndex:2000 },
						PaintStyle : { strokeStyle:color, lineWidth:2 },
						EndpointStyle : { radius:9, fillStyle:color },
						HoverPaintStyle : {strokeStyle:"#ec9f2e" },
						EndpointHoverStyle : {fillStyle:"#ec9f2e" },
						Container:"chart-demo"
					});
						
					// suspend drawing and initialise.
					instance.doWhileSuspended(function() {		
						// declare some common values:
						var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
							// use three-arg spec to create two different arrows with the common values:
							overlays = [
								[ "Arrow", { location:0.7 }, arrowCommon ],
								[ "Arrow", { location:0.3, direction:-1 }, arrowCommon ]
							];

						// add endpoints, giving them a UUID.
						// you DO NOT NEED to use this method. You can use your library's selector method.
						// the jsPlumb demos use it so that the code can be shared between all three libraries.
						var windows = jsPlumb.getSelector(".chart-demo .window");
						for (var i = 0; i < windows.length; i++) {
							instance.addEndpoint(windows[i], {
								uuid:windows[i].getAttribute("id") + "-bottom",
								anchor:"Bottom",
								maxConnections:-1
							});
							instance.addEndpoint(windows[i], {
								uuid:windows[i].getAttribute("id") + "-top",
								anchor:"Top",
								maxConnections:-1
							});
						}
					
						instance.connect({uuids:["chartWindow3-bottom", "chartWindow6-top" ], overlays:overlays, detachable:true, reattach:true});
						instance.connect({uuids:["chartWindow1-bottom", "chartWindow2-top" ], overlays:overlays});
						instance.connect({uuids:["chartWindow1-bottom", "chartWindow3-top" ], overlays:overlays});
						instance.connect({uuids:["chartWindow2-bottom", "chartWindow4-top" ], overlays:overlays});
						instance.connect({uuids:["chartWindow2-bottom", "chartWindow5-top" ], overlays:overlays});
								
						instance.draggable(windows);		
					});
				});
			}
		});
		
		dataDemo.sinkView = Marionette.Layout.extend({
			template : sinkTpl,
			onShow: function(){
				window.jsPlumbDemo = {
						
						init : function() {			
							
							jsPlumb.importDefaults({
								DragOptions : { cursor: "pointer", zIndex:2000 },
								HoverClass:"connector-hover"
							});
					
							var connectorStrokeColor = "rgba(50, 50, 200, 1)",
								connectorHighlightStrokeColor = "rgba(180, 180, 200, 1)",
								hoverPaintStyle = { strokeStyle:"#7ec3d9" };			// hover paint style is merged on normal style, so you 
							                                                        // don't necessarily need to specify a lineWidth			

							// 
							// connect window1 to window2 with a 13 px wide olive colored Bezier, from the BottomCenter of 
							// window1 to 3/4 of the way along the top edge of window2.  give the connection a 1px black outline,
							// and allow the endpoint styles to derive their color and outline from the connection.
							// label it "Connection One" with a label at 0.7 of the length of the connection, and put an arrow that has a 50px
							// wide tail at a point 0.2 of the length of the connection.  we use 'cssClass' and 'endpointClass' to assign
							// our own css classes, and the Label overlay has three css classes specified for it too.  we also give this
							// connection a 'hoverPaintStyle', which defines the appearance when the mouse is hovering over it. 
							//
							var connection1 = jsPlumb.connect({
								source:"window1", 
							   	target:"window2", 			   	
								connector:["Bezier", { curviness:70 }],
							   	cssClass:"c1",
							   	endpoint:"Blank",
							   	endpointClass:"c1Endpoint",													   
							   	anchors:["BottomCenter", [ 0.75, 0, 0, -1 ]], 
							   	paintStyle:{ 
									lineWidth:6,
									strokeStyle:"#a7b04b",
									outlineWidth:1,
									outlineColor:"#666"
								},
								endpointStyle:{ fillStyle:"#a7b04b" },
							   	hoverPaintStyle:hoverPaintStyle,			   
							   	overlays : [
									["Label", {													   					
										cssClass:"l1 component label",
										label : "Connection One", 
										location:0.7,
										id:"label",
										events:{
											"click":function(label, evt) {
												alert("clicked on label for connection " + label.component.id);
											}
										}
									}],
									["Arrow", {
										cssClass:"l1arrow",
										location:0.5, width:20,length:20,
										events:{
											"click":function(arrow, evt) {
												alert("clicked on arrow for connection " + arrow.component.id);
											}
										}
									}]
								]
							});            
								
								    
					        var w23Stroke = "rgb(189,11,11)"; 
					        var connection3 = jsPlumb.connect({
								source:"window2", 
								target:"window3", 
								paintStyle:{ 
									lineWidth:8,
									strokeStyle:w23Stroke,
									outlineColor:"#666",
									outlineWidth:1 
								},
								detachable:false,
								hoverPaintStyle:hoverPaintStyle, 
								anchors:[ [ 0.3 , 1, 0, 1 ], "TopCenter" ], 
								endpoint:"Rectangle", 
								endpointStyles:[
									{ gradient : { stops:[[0, w23Stroke], [1, "#558822"]] }},
									{ gradient : {stops:[[0, w23Stroke], [1, "#882255"]] }}
								]	
							});					
								
							var connection2 = jsPlumb.connect({
								source:'window3', target:'window4', 
								paintStyle:{ 
								   lineWidth:10,
								   strokeStyle:connectorStrokeColor,
								   outlineColor:"#666",
								   outlineWidth:1
								},
								hoverPaintStyle:hoverPaintStyle, 
								anchor:"AutoDefault",
								detachable:false,
								endpointStyle:{ 
									   gradient : { 
										   stops:[[0, connectorStrokeColor], [1, connectorHighlightStrokeColor]],
										   offset:17.5, 
										   innerRadius:15 
									   }, 
									   radius:35
								},				        					        			
								label : function(connection) { 
									var d = new Date();
									var fmt = function(n, m) { m = m || 10;  return (n < m ? new Array(("" + m).length - (""+n).length + 1).join("0") : "") + n; }; 
									return (fmt(d.getHours()) + ":" + fmt(d.getMinutes()) + ":" + fmt(d.getSeconds())+ "." + fmt(d.getMilliseconds(), 100)); 
								},
								labelStyle:{
									cssClass:"component label"
								}
						   });
					

				            //
				            //this connects window5 with window6 using a Flowchart connector that is painted green,
				            //with large Dot endpoints that are placed in the center of each element.  there is a
				            //label at the default location of 0.5, and the connection is marked as not being
				            //detachable.
							//
					        var conn4Color = "rgba(46,164,26,0.8)";
					        var connection4 = jsPlumb.connect({  
								source:'window5', 
								target:'window6', 
								connector:[ "Flowchart", { cornerRadius:10 } ],
								anchors:["Center", "Center"],  
								paintStyle:{ 
									lineWidth:9, 
									strokeStyle:conn4Color, 
									outlineColor:"#666",
									outlineWidth:2,
									joinstyle:"round"
								},
								hoverPaintStyle:hoverPaintStyle,
								detachable:false,
								endpointsOnTop:false, 
								endpointStyle:{ radius:65, fillStyle:conn4Color },
								labelStyle : { cssClass:"component label" },
								label : "big\nendpoints"
						    });
					
					        var connection5 = jsPlumb.connect({
								source:"window4", 
								target:"window5", 
								anchors:["BottomRight", "TopLeft"], 
								paintStyle:{ 
									lineWidth:7,
									strokeStyle:"rgb(131,8,135)",
//														outlineColor:"#666",
//										 				outlineWidth:1,
									dashstyle:"4 2",
									joinstyle:"miter"
								},
								hoverPaintStyle:hoverPaintStyle, 
								endpoint:["Image", {url:"assets/js/apps/data/endpointTest1.png"}], 
								connector:"Straight", 
								endpointsOnTop:true,
								overlays:[ ["Label", {
												cssClass:"component label",		    			        				 
												label : "4 - 5",
												location:0.3
											}],
											"Arrow"
											
								]
							});
													
							var stateMachineConnector = {				
								connector:"StateMachine",
								paintStyle:{lineWidth:3,strokeStyle:"#056"},
								hoverPaintStyle:{strokeStyle:"#dbe300"},
								endpoint:"Blank",
								anchor:"Continuous",
								overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
							};
							
							jsPlumb.connect({
								source:"window3",
								target:"window7"
							}, stateMachineConnector);
							
							jsPlumb.connect({
								source:"window7",
								target:"window3"
							}, stateMachineConnector);

							// jsplumb event handlers
					
							// double click on any connection 
							jsPlumb.bind("dblclick", function(connection, originalEvent) { alert("double click on connection from " + connection.sourceId + " to " + connection.targetId); });
							// single click on any endpoint
							jsPlumb.bind("endpointClick", function(endpoint, originalEvent) { alert("click on endpoint on element " + endpoint.elementId); });
							// context menu (right click) on any component.
							jsPlumb.bind("contextmenu", function(component, originalEvent) {
				                alert("context menu on component " + component.id);
				                originalEvent.preventDefault();
				                return false;
				            });
							
							// make all .window divs draggable. note that here i am just using a convenience method - getSelector -
							// that enables me to reuse this code across all three libraries. In your own usage of jsPlumb you can use
							// your library's selector method - "$" for jQuery, "$$" for MooTools, "Y.all" for YUI3.
							jsPlumb.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});    

						}
					};	

					window.jsPlumbDemo.loadTest = function(count) {
				            count = count || 10;
				            for (var i = 0; i < count; i++) {
				                    jsPlumb.reset();
				                    jsPlumbDemo.init();
				            }
				    };

					jsPlumb.ready(jsPlumbDemo.init);
			}
		});
		
		dataDemo.flowchartView = Marionette.Layout.extend({
			template : flowchartTpl,
			onShow: function(){
				jsPlumb.ready(function() {

					var instance = jsPlumb.getInstance({
						// default drag options
						DragOptions : { cursor: 'pointer', zIndex:2000 },
						// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
						// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
						ConnectionOverlays : [
							[ "Arrow", { location:1 } ],
							[ "Label", { 
								location:0.1,
								id:"label",
								cssClass:"aLabel"
							}]
						],
						Container:"flowchart-demo"
					});		

					// this is the paint style for the connecting lines..
					var connectorPaintStyle = {
						lineWidth:4,
						strokeStyle:"#61B7CF",
						joinstyle:"round",
						outlineColor:"white",
						outlineWidth:2
					},
					// .. and this is the hover style. 
					connectorHoverStyle = {
						lineWidth:4,
						strokeStyle:"#216477",
						outlineWidth:2,
						outlineColor:"white"
					},
					endpointHoverStyle = {
						fillStyle:"#216477",
						strokeStyle:"#216477"
					},
					// the definition of source endpoints (the small blue ones)
					sourceEndpoint = {
						endpoint:"Dot",
						paintStyle:{ 
							strokeStyle:"#7AB02C",
							fillStyle:"transparent",
							radius:7,
							lineWidth:3 
						},				
						isSource:true,
						connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],								                
						connectorStyle:connectorPaintStyle,
						hoverPaintStyle:endpointHoverStyle,
						connectorHoverStyle:connectorHoverStyle,
			            dragOptions:{},
			            overlays:[
			            	[ "Label", { 
			                	location:[0.5, 1.5], 
			                	label:"Drag",
			                	cssClass:"endpointSourceLabel" 
			                } ]
			            ]
					},		
					// the definition of target endpoints (will appear when the user drags a connection) 
					targetEndpoint = {
						endpoint:"Dot",					
						paintStyle:{ fillStyle:"#7AB02C",radius:11 },
						hoverPaintStyle:endpointHoverStyle,
						maxConnections:-1,
						dropOptions:{ hoverClass:"hover", activeClass:"active" },
						isTarget:true,			
			            overlays:[
			            	[ "Label", { location:[0.5, -0.5], label:"Drop", cssClass:"endpointTargetLabel" } ]
			            ]
					},			
					init = function(connection) {			
						connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
						connection.bind("editCompleted", function(o) {
							if (typeof console != "undefined")
								console.log("connection edited. path is now ", o.path);
						});
					};			

					var _addEndpoints = function(toId, sourceAnchors, targetAnchors) {
							for (var i = 0; i < sourceAnchors.length; i++) {
								var sourceUUID = toId + sourceAnchors[i];
								instance.addEndpoint("flowchart" + toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID });						
							}
							for (var j = 0; j < targetAnchors.length; j++) {
								var targetUUID = toId + targetAnchors[j];
								instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID });						
							}
						};

					// suspend drawing and initialise.
					instance.doWhileSuspended(function() {

						_addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);			
						_addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
						_addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
						_addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);
									
						// listen for new connections; initialise them the same way we initialise the connections at startup.
						instance.bind("connection", function(connInfo, originalEvent) { 
							init(connInfo.connection);
						});			
									
						// make all the window divs draggable						
						instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });		
						// THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector 
						// method, or document.querySelectorAll:
						//jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });
				        
						// connect a few up
						instance.connect({uuids:["Window2BottomCenter", "Window3TopCenter"], editable:true});
						instance.connect({uuids:["Window2LeftMiddle", "Window4LeftMiddle"], editable:true});
						instance.connect({uuids:["Window4TopCenter", "Window4RightMiddle"], editable:true});
						instance.connect({uuids:["Window3RightMiddle", "Window2RightMiddle"], editable:true});
						instance.connect({uuids:["Window4BottomCenter", "Window1TopCenter"], editable:true});
						instance.connect({uuids:["Window3BottomCenter", "Window1BottomCenter"], editable:true});
						//
				        
						//
						// listen for clicks on connections, and offer to delete connections on click.
						//
						instance.bind("click", function(conn, originalEvent) {
							if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
								jsPlumb.detach(conn); 
						});	
						
						instance.bind("connectionDrag", function(connection) {
							console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
						});		
						
						instance.bind("connectionDragStop", function(connection) {
							console.log("connection " + connection.id + " was dragged");
						});

						instance.bind("connectionMoved", function(params) {
							console.log("connection " + params.connection.id + " was moved");
						});
					});
					
				});
			}
		});
		
		dataDemo.knwlView = Marionette.Layout.extend({
			template : knwlTpl,
			onShow: function(){
				var x = new Knwl();
				window['scan'] = function() {
				    for (var i = 1; i <= 9; i++) {
				        document.getElementById('sectionContainer'+i).innerHTML = ""; // Reset the output tags
				    }
				    
				    var input = document.getElementById('input').value;
				    x.init(input); //initiate knwl on string
				    
				    
				    var phones = x.get('phones');
				    for (var i =0; i < phones.length; i++) {
				        document.getElementById('sectionContainer1').innerHTML+="<p class = 'sectionItem'>" + phones[i][0] + "</p>";
				    }
				    
				    var dates = x.get('dates');
				    for (var i = 0; i < dates.length; i++) {
				        document.getElementById('sectionContainer2').innerHTML+="<p class = 'sectionItem'>" + dates[i][0] + "/" + dates[i][1] + "/" + dates[i][2] + "</p>";
				    }
				    
				    var times = x.get('times');
				    for (var i = 0; i < times.length; i++) {
				        document.getElementById('sectionContainer3').innerHTML+="<p class = 'sectionItem'>" + times[i][0] + ":" + times[i][1] + " " + times[i][2] + "</p>";
				    }
				    
				    var links = x.get('links');
				    for (var i = 0; i < links.length; i++) {
				        console.log(links[i]);
				        document.getElementById('sectionContainer4').innerHTML+="<p class = 'sectionItem'><a href = '" + links[i][0] + "'>" + links[i][0] + "</a></p>";
				    }
				    
				    var emails = x.get('emails');
				    for (var i = 0; i < emails.length; i++) {
				        document.getElementById('sectionContainer5').innerHTML+="<p class = 'sectionItem'><a href = 'mailto:" + emails[i][0] + "'>" + emails[i][0] + "</a></p>";
				    }
				    var emotion = x.get('emotion');
				    document.getElementById('sectionContainer6').innerHTML+="<p class = 'sectionItem'>" + emotion + "</p>";
				    
				    var places = x.get('places');
				    for (var i = 0; i < places.length; i++) {
				        document.getElementById('sectionContainer7').innerHTML+="<p class = 'sectionItem'>" + places[i][0] + "</p>";
				    }

				    var hashtags = x.get('hashtags');
				    for (var i = 0; i < hashtags.length; i++) {
				        document.getElementById('sectionContainer8').innerHTML+="<p class = 'sectionItem'>" + hashtags[i][0] + "</p>";
				    }

				    var aliases = x.get('aliases');
				    for (var i = 0; i < aliases.length; i++) {
				        document.getElementById('sectionContainer9').innerHTML+="<p class = 'sectionItem'>" + aliases[i][0] + "</p>";
				    }
				    
				    
				}
			}
		});
		
		dataDemo.dataTableView = Marionette.Layout.extend({
			template : dataTableTpl,
			onShow: function(){
				$('#example').dataTable();
			}
		});
		
		dataDemo.oboeView = Marionette.Layout.extend({
			template : oboeTpl,
			events: {
				'click :submit' : 'getJson'
			},
			getJson: function(){
				var that = this;
				oboe('assets/js/apps/data/foods.json')
				   .node('foods.*', function( foodThing ){

				      // This callback will be called everytime a new object is
				      // found in the foods array.

				      console.log( 'Go eat some', foodThing.name);
				   })
				   .node('badThings.*', function( badThing ){

				      console.log( 'Stay away from', badThings.name);
				   })   
				   .done(function(things){

				      console.log(
				         'there are', things.foods.length, 'things to eat',
				         'and', things.nonFoods.length, 'to avoid'); 
				      that.$('textarea').val(['there are', things.foods.length, 'things to eat',
				         'and', things.nonFoods.length, 'to avoid'].join(' '));
				      
				   });
				
				oboe('assets/js/apps/data/foods.json')
				   .node('{name colour}', function( thing ) {   
				      // I'll be called for every object found that 
				      // has both a name and a colour   
				      console.log(thing.name, ' is ', thing.colour);
				      that.$('textarea').val([thing.name, ' is ', thing.colour].join(' ')); 
				   });
				
				oboe('assets/js/apps/data/foods.json').node('badThings.*', function( badThing ){

				      console.log( 'Stay away from', badThings.name);
				   })   
				   .done(function(things){

				      console.log(
				         'there are', things.foods.length, 'things to eat',
				         'and', things.nonFoods.length, 'to avoid'); 
				      that.$('textarea').val(['there are', things.foods.length, 'things to eat',
				         'and', things.nonFoods.length, 'to avoid'].join(' '));
				      
				   });
			},
			onShow: function(){
				
			}
		});
		
		var peer = new Peer({
			  // Set API key for cloud server (you don't need this if you're running your
			  // own.
			  key: 'x7fwx2kavpy6tj4i',

			  // Set highest debug level (log everything!).
			  debug: 3,

			  // Set a logging function:
			  logFunction: function() {
			    var copy = Array.prototype.slice.call(arguments).join(' ');
			    $('.log').append(copy + '<br>');
			  }
			});
			var connectedPeers = {};

			// Show this peer's ID.
			peer.on('open', function(id){
			  $('#pid').text(id);
			});

			// Await connections from others
			peer.on('connection', connect);

			// Handle a connection object.
			function connect(c) {
			  // Handle a chat connection.
			  if (c.label === 'chat') {
			    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
			    var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
			    var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
			    chatbox.append(header);
			    chatbox.append(messages);
			 
			    // Select connection handler.
			    chatbox.on('click', function() {
			      if ($(this).attr('class').indexOf('active') === -1) {
			        $(this).addClass('active');
			      } else {
			        $(this).removeClass('active');
			      }
			    });
			    $('.filler').hide();
			    $('#connections').append(chatbox);

			    c.on('data', function(data) {
			      messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data +
			        '</div>');
			        });
			        c.on('close', function() {
			          alert(c.peer + ' has left the chat.');
			          chatbox.remove();
			          if ($('.connection').length === 0) {
			            $('.filler').show();
			          }
			          delete connectedPeers[c.peer];
			        });
			  } else if (c.label === 'file') {
			    c.on('data', function(data) {
			      // If we're getting a file, create a URL for it.
			      if (data.constructor === ArrayBuffer) {
			        var dataView = new Uint8Array(data);
			        var dataBlob = new Blob([dataView]);
			        var url = window.URL.createObjectURL(dataBlob);
			        $('#' + c.peer).find('.messages').append('<div><span class="file">' +
			            c.peer + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
			      }
			    });
			  }
			  connectedPeers[c.peer] = 1;
			}
		
		dataDemo.peerView = Marionette.Layout.extend({
			template : peerTpl,
			onShow: function(){
				// hook up UI
				// Prepare file drop box.
				  var box = $('#box');
				  box.on('dragenter', doNothing);
				  box.on('dragover', doNothing);
				  box.on('drop', function(e){
				    e.originalEvent.preventDefault();
				    var file = e.originalEvent.dataTransfer.files[0];
				    eachActiveConnection(function(c, $c) {
				      if (c.label === 'file') {
				        c.send(file);
				        $c.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
				      }
				    });
				  });
				  function doNothing(e){
				    e.preventDefault();
				    e.stopPropagation();
				  }

				  // Connect to a peer
				  $('#connect').click(function() {
				    requestedPeer = $('#rid').val();
				    if (!connectedPeers[requestedPeer]) {
				      // Create 2 connections, one labelled chat and another labelled file.
				      var c = peer.connect(requestedPeer, {
				        label: 'chat',
				        serialization: 'none',
				        metadata: {message: 'hi i want to chat with you!'}
				      });
				      c.on('open', function() {
				        connect(c);
				      });
				      c.on('error', function(err) { alert(err); });
				      var f = peer.connect(requestedPeer, { label: 'file', reliable: true });
				      f.on('open', function() {
				        connect(f);
				      });
				      f.on('error', function(err) { alert(err); });
				    }
				    connectedPeers[requestedPeer] = 1;
				  });

				  // Close a connection.
				  $('#close').click(function() {
				    eachActiveConnection(function(c) {
				      c.close();
				    });
				  });

				  // Send a chat message to all active connections.
				  $('#send').submit(function(e) {
				    e.preventDefault();
				    // For each active connection, send the message.
				    var msg = $('#text').val();
				    eachActiveConnection(function(c, $c) {
				      if (c.label === 'chat') {
				        c.send(msg);
				        $c.find('.messages').append('<div><span class="you">You: </span>' + msg
				          + '</div>');
				      }
				    });
				    $('#text').val('');
				    $('#text').focus();
				  });

				  // Goes through each active peer and calls FN on its connections.
				  function eachActiveConnection(fn) {
				    var actives = $('.active');
				    var checkedIds = {};
				    actives.each(function() {
				      var peerId = $(this).attr('id');

				      if (!checkedIds[peerId]) {
				        var conns = peer.connections[peerId];
				        for (var i = 0, ii = conns.length; i < ii; i += 1) {
				          var conn = conns[i];
				          fn(conn, $(this));
				        }
				      }

				      checkedIds[peerId] = 1;
				    });
				  }

				  // Show browser version
				  $('#browsers').text(navigator.userAgent);
			}
		});
		
		dataDemo.highchartsView = Marionette.Layout.extend({
			template : highchartsTpl,
			onShow: function(){
				$('#highcharts').highcharts({
			        chart: {
			            type: 'bar'
			        },
			        title: {
			            text: 'Fruit Consumption'
			        },
			        xAxis: {
			            categories: ['Apples', 'Bananas', 'Oranges']
			        },
			        yAxis: {
			            title: {
			                text: 'Fruit eaten'
			            }
			        },
			        series: [{
			            name: 'Jane',
			            data: [1, 0, 4]
			        }, {
			            name: 'John',
			            data: [5, 7, 3]
			        }]
			    });
			}
		});
		
		dataDemo.nasdaqView = Marionette.Layout.extend({
			template : nasdaqTpl,
			onShow: function(){
				LazyLoad.js('assets/js/apps/data/stock.js', function(){
					
				})
			}
		});
		
		dataDemo.chartView = Marionette.Layout.extend({
			template : chartTpl,
			onShow: function(){
				var barChartData = {
						labels : ["January","February","March","April","May","June","July"],
						datasets : [
							{
								fillColor : "rgba(220,220,220,0.5)",
								strokeColor : "rgba(220,220,220,1)",
								data : [65,59,90,81,56,55,40]
							},
							{
								fillColor : "rgba(151,187,205,0.5)",
								strokeColor : "rgba(151,187,205,1)",
								data : [28,48,40,19,96,27,100]
							}
						]
						
					}

				var myLine = new Chart(document.getElementById("barchart").getContext("2d")).Bar(barChartData);
			}
		});
		
		dataDemo.handsontableView = Marionette.Layout.extend({
			template : handsontableTpl,
			onShow: function(){
				 var data = [
				              {id: 1, name: "Ted", isActive: true, color: "orange", date: "2008-01-01"},
				              {id: 2, name: "John", isActive: false, color: "black", date: null},
				              {id: 3, name: "Al", isActive: true, color: "red", date: null},
				              {id: 4, name: "Ben", isActive: false, color: "blue", date: null}
				            ];

				            var yellowRenderer = function (instance, td, row, col, prop, value, cellProperties) {
				              Handsontable.renderers.TextRenderer.apply(this, arguments);
				              $(td).css({
				                background: 'yellow'
				              });
				            };

				            var greenRenderer = function (instance, td, row, col, prop, value, cellProperties) {
				              Handsontable.renderers.TextRenderer.apply(this, arguments);
				              $(td).css({
				                background: 'green'
				              });
				            };

				            var $container = $("#example1");
				            $container.handsontable({
				              data: data,
				              startRows: 5,
				              colHeaders: true,
				              minSpareRows: 1,
				              columns: [
				                {data: "id", type: 'text'},
				                //'text' is default, you don't actually have to declare it
				                {data: "name", renderer: yellowRenderer},
				                //use default 'text' cell type but overwrite its renderer with yellowRenderer
				                {data: "isActive", type: 'checkbox'},
				                {data: "date", type: 'date'},
				                {data: "color",
				                  type: 'autocomplete',
				                  source: ["yellow", "red", "orange", "green", "blue", "gray", "black", "white"]
				                }
				              ],
				              cells: function (row, col, prop) {
				                if (row === 0 && col === 0) {
				                  this.renderer = greenRenderer;
				                }
				              }
				            });
			}
		});
		
		dataDemo.listView = Marionette.Layout.extend({
			template : listTpl,
			onShow: function(){
				require(['vendor/list.pagination.min'], function(ListPagination){
									var monkeyList = new List('test-list', {
					  valueNames: ['name'],
					  page: 3,
					  plugins: [ ListPagination({}) ] 
					});
				})
			}
		});
		
		
		dataDemo.morrisView = Marionette.Layout.extend({
			template : morrisTpl,
			onShow: function(){
				var decimal_data = [];
				for (var x = 0; x <= 360; x += 10) {
				  decimal_data.push({
				    x: x,
				    y: 1.5 + 1.5 * Math.sin(Math.PI * x / 180).toFixed(4)
				  });
				}
				window.m = Morris.Line({
				  element: 'morris-graph',
				  data: decimal_data,
				  xkey: 'x',
				  ykeys: ['y'],
				  labels: ['sin(x)'],
				  parseTime: false,
				  hoverCallback: function (index, options, default_content, row) {
				    return default_content.replace("sin(x)", "1.5 + 1.5 sin(" + row.x + ")");
				  },
				  xLabelMargin: 10,
				  integerYLabels: true
				});
			}
		});
		
		dataDemo.realtimeView = Marionette.Layout.extend({
			template : realtimeTpl,
			onClose: function(){
				this.stopped = true;
			},
			onShow: function(){
				var that = this;
				that.stopped = false;
				var data = [],
				totalPoints = 300;

			function getRandomData() {

					if (data.length > 0)
						data = data.slice(1);
	
					// Do a random walk
	
					while (data.length < totalPoints) {
	
						var prev = data.length > 0 ? data[data.length - 1] : 50,
							y = prev + Math.random() * 10 - 5;
	
						if (y < 0) {
							y = 0;
						} else if (y > 100) {
							y = 100;
						}
	
						data.push(y);
					}
	
					// Zip the generated y values with the x values
	
					var res = [];
					for (var i = 0; i < data.length; ++i) {
						res.push([i, data[i]])
					}
	
					return res;
				}
	
				// Set up the control widget
	
				var updateInterval = 30;
				$("#updateInterval").val(updateInterval).change(function () {
					var v = $(this).val();
					if (v && !isNaN(+v)) {
						updateInterval = +v;
						if (updateInterval < 1) {
							updateInterval = 1;
						} else if (updateInterval > 2000) {
							updateInterval = 2000;
						}
						$(this).val("" + updateInterval);
					}
				});
	
				var plot = $.plot("#placeholder", [ getRandomData() ], {
					series: {
						shadowSize: 0	// Drawing is faster without shadows
					},
					yaxis: {
						min: 0,
						max: 100
					},
					xaxis: {
						show: false
					}
				});
	
				function update() {
	
					plot.setData([getRandomData()]);
	
					// Since the axes don't change, we don't need to call plot.setupGrid()
	
					plot.draw();
					if(!that.stopped) setTimeout(update, updateInterval);
				}
	
				update();
			}
		});
		
		dataDemo.flotView = Marionette.Layout.extend({
			template : flotTpl,
			onShow: function(){
				var d1 = [];
				for (var i = 0; i < 14; i += 0.5) {
					d1.push([i, Math.sin(i)]);
				}

				var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

				var d3 = [];
				for (var i = 0; i < 14; i += 0.5) {
					d3.push([i, Math.cos(i)]);
				}

				var d4 = [];
				for (var i = 0; i < 14; i += 0.1) {
					d4.push([i, Math.sqrt(i * 10)]);
				}

				var d5 = [];
				for (var i = 0; i < 14; i += 0.5) {
					d5.push([i, Math.sqrt(i)]);
				}

				var d6 = [];
				for (var i = 0; i < 14; i += 0.5 + Math.random()) {
					d6.push([i, Math.sqrt(2*i + Math.sin(i) + 5)]);
				}

				$.plot("#placeholder", [{
					data: d1,
					lines: { show: true, fill: true }
				}, {
					data: d2,
					bars: { show: true }
				}, {
					data: d3,
					points: { show: true }
				}, {
					data: d4,
					lines: { show: true }
				}, {
					data: d5,
					lines: { show: true },
					points: { show: true }
				}, {
					data: d6,
					lines: { show: true, steps: true }
				}]);
			}
		});
		
		dataDemo.sigmaView = Marionette.Layout.extend({
			template : sigmaTpl,
			onShow: function(){
				var s,
			      c,
			      dom,
			      disc,
			      ground,
			      nId = 0,
			      eId = 0,
			      radius = 50,

			      mouseX,
			      mouseY,
			      spaceMode = false,
			      wheelRatio = 1.1,

			      nodeRadius = 10,
			      inertia = 0.8,
			      springForce = 0.01,
			      springLength = 50,
			      maxDisplacement = 15,
			      gravity = 1.5;




			  /**
			   * CUSTOM PHYSICS LAYOUT:
			   * **********************
			   */
			  sigma.classes.graph.addMethod('computePhysics', function() {
			    var i,
			        j,
			        l = this.nodesArray.length,

			        s,
			        t,
			        dX,
			        dY,
			        d,
			        v;

			    for (i = 0; i < l; i++) {
			      s = this.nodesArray[i];
			      s.dX *= inertia;
			      s.dY *= inertia;

			      s.dY += gravity;

			      for (j = i + 1; j < l; j++) {
			        t = this.nodesArray[j];

			        dX = s.x - t.x;
			        dY = s.y - t.y;
			        d = Math.sqrt(dX * dX + dY * dY);
			        v = ((d < 2 * nodeRadius) ? (2 * nodeRadius - d) / d / 2 : 0) -
			          ((this.allNeighborsIndex[s.id] || {})[t.id] ? springForce * (d - springLength) : 0);

			        t.dX -= v * dX;
			        t.dY -= v * dY;
			        s.dX += v * dX;
			        s.dY += v * dY;
			      }
			    }

			    for (i = 0; i < l; i++) {
			      s = this.nodesArray[i];
			      s.dX = Math.max(Math.min(s.dX, maxDisplacement), -maxDisplacement);
			      s.dY = Math.max(Math.min(s.dY, maxDisplacement), -maxDisplacement);
			      s.x += s.dX;
			      s.y += s.dY;

			      // Collision with the ground:
			      s.y = Math.min(-nodeRadius, s.y);
			    }
			  });




			  /**
			   * CUSTOM RENDERERS:
			   * *****************
			   */
			  sigma.canvas.edges.goo = function(e, s, t, ctx, settings) {
			    var color = e.color,
			        p = settings('prefix') || '',
			        edgeColor = settings('edgeColor'),
			        defaultNodeColor = settings('defaultNodeColor'),
			        defaultEdgeColor = settings('defaultEdgeColor'),
			        v,
			        d,
			        p1 = 5 / 6,
			        p2 = 1 / 6;

			    if (!color)
			      switch (edgeColor) {
			        case 'source':
			          color = s.color || defaultNodeColor;
			          break;
			        case 'target':
			          color = t.color || defaultNodeColor;
			          break;
			        default:
			          color = defaultEdgeColor;
			          break;
			      }

			    d = Math.sqrt(Math.pow(t[p + 'x'] - s[p + 'x'], 2) + Math.pow(t[p + 'y'] - s[p + 'y'], 2));
			    v = {
			      x: (t[p + 'x'] - s[p + 'x']) / d,
			      y: (t[p + 'y'] - s[p + 'y']) / d
			    };

			    ctx.fillStyle = color;
			    ctx.beginPath();
			    ctx.moveTo(
			      s[p + 'x'] + v.y * s[p + 'size'],
			      s[p + 'y'] - v.x * s[p + 'size']
			    );
			    ctx.bezierCurveTo(
			      s[p + 'x'] * p1 + t[p + 'x'] * p2 + v.y * e[p + 'size'],
			      s[p + 'y'] * p1 + t[p + 'y'] * p2 - v.x * e[p + 'size'],
			      t[p + 'x'] * p1 + s[p + 'x'] * p2 + v.y * e[p + 'size'],
			      t[p + 'y'] * p1 + s[p + 'y'] * p2 - v.x * e[p + 'size'],
			      t[p + 'x'] + v.y * t[p + 'size'],
			      t[p + 'y'] - v.x * t[p + 'size']
			    );
			    ctx.lineTo(
			      t[p + 'x'] - v.y * t[p + 'size'],
			      t[p + 'y'] + v.x * t[p + 'size']
			    );
			    ctx.bezierCurveTo(
			      t[p + 'x'] * p1 + s[p + 'x'] * p2 - v.y * e[p + 'size'],
			      t[p + 'y'] * p1 + s[p + 'y'] * p2 + v.x * e[p + 'size'],
			      s[p + 'x'] * p1 + t[p + 'x'] * p2 - v.y * e[p + 'size'],
			      s[p + 'y'] * p1 + t[p + 'y'] * p2 + v.x * e[p + 'size'],
			      s[p + 'x'] - v.y * s[p + 'size'],
			      s[p + 'y'] + v.x * s[p + 'size']
			    );
			    ctx.closePath();
			    ctx.fill();
			  };

			  sigma.canvas.nodes.goo = function(node, ctx, settings) {
			    var prefix = settings('prefix') || '';

			    ctx.fillStyle = node.color || settings('defaultNodeColor');
			    ctx.beginPath();
			    ctx.arc(
			      node[prefix + 'x'],
			      node[prefix + 'y'],
			      node[prefix + 'size'],
			      0,
			      Math.PI * 2,
			      true
			    );
			    ctx.closePath();
			    ctx.fill();

			    ctx.fillStyle = '#fff';
			    ctx.beginPath();
			    ctx.arc(
			      node[prefix + 'x'],
			      node[prefix + 'y'],
			      node[prefix + 'size'] * 0.5,
			      0,
			      Math.PI * 2,
			      true
			    );
			    ctx.closePath();
			    ctx.fill();
			  };




			  /**
			   * INITIALIZATION SCRIPT:
			   * **********************
			   */
			  s = new sigma({
			    renderer: {
			      container: document.getElementById('sigma-container'),
			      type: 'canvas'
			    },
			    settings: {
			      autoRescale: false,
			      mouseEnabled: false,
			      touchEnabled: false,
			      nodesPowRatio: 1,
			      edgesPowRatio: 1,
			      defaultEdgeColor: '#333',
			      defaultNodeColor: '#333',
			      edgeColor: 'default'
			    }
			  });
			  dom = document.querySelector('#sigma-container canvas:last-child');
			  disc = document.getElementById('disc');
			  ground = document.getElementById('ground');
			  c = s.camera;

			  // Initialize graph:
			  s.graph.read({
			    nodes: [
			      {
			        id: (++nId) + '',
			        size: nodeRadius,
			        x: 0,
			        y: -80,
			        dX: 0,
			        dY: 0,
			        type: 'goo'
			      },
			      {
			        id: (++nId) + '',
			        size: nodeRadius,
			        x: 10,
			        y: -100,
			        dX: 0,
			        dY: 0,
			        type: 'goo'
			      },
			      {
			        id: (++nId) + '',
			        size: nodeRadius,
			        x: 20,
			        y: -80,
			        dX: 0,
			        dY: 0,
			        type: 'goo'
			      }
			    ],
			    edges: [
			      {
			        id: (++eId) + '',
			        source: '1',
			        target: '2',
			        type: 'goo'
			      },
			      {
			        id: (++eId) + '',
			        source: '1',
			        target: '3',
			        type: 'goo'
			      },
			      {
			        id: (++eId) + '',
			        source: '2',
			        target: '3',
			        type: 'goo'
			      }
			    ]
			  });

			  function frame() {
			    s.graph.computePhysics();
			    s.refresh();

			    if (s.graph.nodes().length) {
			      var w = dom.offsetWidth,
			          h = dom.offsetHeight;

			      // The "rescale" middleware modifies the position of the nodes, but we
			      // need here the camera to deal with this. Here is the code:
			      var xMin = Infinity,
			          xMax = -Infinity,
			          yMin = Infinity,
			          yMax = -Infinity,
			          margin = 50,
			          scale;

			      s.graph.nodes().forEach(function(n) {
			        xMin = Math.min(n.x, xMin);
			        xMax = Math.max(n.x, xMax);
			        yMin = Math.min(n.y, yMin);
			        yMax = Math.max(n.y, yMax);
			      });

			      xMax += margin;
			      xMin -= margin;
			      yMax += margin;
			      yMin -= margin;

			      scale = Math.min(
			        w / Math.max(xMax - xMin, 1),
			        h / Math.max(yMax - yMin, 1)
			      );

			      c.goTo({
			        x: (xMin + xMax) / 2,
			        y: (yMin + yMax) / 2,
			        ratio: 1 / scale
			      });

			      ground.style.top =
			        Math.max(h / 2 - Math.min((yMin + yMax) / 2 * scale, h), 0) + 'px';
			      disc.style.borderRadius = radius * scale;
			      disc.style.width = 2 * radius * scale;
			      disc.style.height = 2 * radius * scale;
			      disc.style.top = mouseY - radius * scale;
			      disc.style.left = mouseX - radius * scale;
			      disc.style.backgroundColor = spaceMode ? '#f99' : '#9cf';

			    }

			    requestAnimationFrame(frame);
			  }

			  frame();




			  /**
			   * EVENTS BINDING:
			   * ***************
			   */
			  dom.addEventListener('click', function(e) {
			    // Find neighbors:
			    var x,
			        y,
			        p,
			        id,
			        neighbors;

			    x = sigma.utils.getX(e) - dom.offsetWidth / 2;
			    y = sigma.utils.getY(e) - dom.offsetHeight / 2;

			    p = c.cameraPosition(x, y);
			    x = p.x;
			    y = p.y;

			    neighbors = s.graph.nodes().filter(function(n) {
			      return (Math.sqrt(
			        Math.pow(n.x - x, 2) +
			        Math.pow(n.y - y, 2)
			      ) - n.size) < radius;
			    });

			    if (!spaceMode)
			      s.graph.addNode({
			        id: (id = (++nId) + ''),
			        size: nodeRadius,
			        x: x + Math.random() / 10,
			        y: y + Math.random() / 10,
			        dX: 0,
			        dY: 0,
			        type: 'goo'
			      });

			    neighbors.forEach(function(n) {
			      if (!spaceMode)
			        s.graph.addEdge({
			          id: (++eId) + '',
			          source: id,
			          target: n.id,
			          type: 'goo'
			        });
			      else
			        s.graph.dropNode(n.id);
			    });
			  }, false);
			  dom.addEventListener('mousemove', function(e) {
			    mouseX = sigma.utils.getX(e);
			    mouseY = sigma.utils.getY(e);
			  }, false);
			  dom.addEventListener('DOMMouseScroll', function(e) {
			    radius *= sigma.utils.getDelta(e) < 0 ? 1 / wheelRatio : wheelRatio;
			  }, false);
			  dom.addEventListener('mousewheel', function(e) {
			    radius *= sigma.utils.getDelta(e) < 0 ? 1 / wheelRatio : wheelRatio;
			  }, false);
			  document.addEventListener('keydown', function(e) {
			    spaceMode = (e.which == 32) ? true : spaceMode;
			  });
			  document.addEventListener('keyup', function(e) {
			    spaceMode = e.which == 32 ? false : spaceMode;
			  });
			}
		});
		
		dataDemo.slickgridView = Marionette.Layout.extend({
			template : slickgridTpl,
			onShow: function(){
				 var grid;
				  var data = [];
				  var options = {
				    editable: true,
				    enableCellNavigation: true,
				    asyncEditorLoading: false,
				    autoEdit: false
				  };
				  var columns = [];
				  require(['vendor/slickgrid/plugins/slick.checkboxselectcolumn',
				           'vendor/slickgrid/plugins/slick.rowselectionmodel',
				           'vendor/slickgrid/plugins/slick.cellselectionmodel',
				           'vendor/slickgrid/plugins/slick.cellcopymanager',
				           'vendor/slickgrid/plugins/slick.cellrangeselector',
				           'vendor/slickgrid/plugins/slick.cellrangedecorator',
				           'vendor/slickgrid/plugins/slick.autotooltips',
				           'vendor/slickgrid/controls/slick.columnpicker'], function(){
					  for (var i = 0; i < 100; i++) {
					      var d = (data[i] = {});
					      d[0] = "Row " + i;
					    }

					    var checkboxSelector = new Slick.CheckboxSelectColumn({
					      cssClass: "slick-cell-checkboxsel"
					    });

					    columns.push(checkboxSelector.getColumnDefinition());

					    for (var i = 0; i < 5; i++) {
					      columns.push({
					        id: i,
					        name: String.fromCharCode("A".charCodeAt(0) + i),
					        field: i,
					        width: 100,
					        editor: Slick.Editors.Text
					      });
					    }

					    grid = new Slick.Grid("#myGrid", data, columns, options);
					    grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
					    grid.registerPlugin(checkboxSelector);

					    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
				  })
			}
		});
		
		dataDemo.rickshawView = Marionette.Layout.extend({
			template : rickshawTpl,
			onClose: function(){
				if(this.updateInterval){
					clearInterval(this.updateInterval);
				}
				if(this.addAnnotationInterval){
					clearInterval(this.addAnnotationInterval);
				}
			},
			onShow: function(){
				
				var that = this;
				require(['apps/data/extensions'], function(RenderControls){
					console.log(RenderControls);
					
					// set up our data series with 150 random data points

					var seriesData = [ [], [], [], [], [], [], [], [], [] ];
					var random = new Rickshaw.Fixtures.RandomData(150);

					for (var i = 0; i < 150; i++) {
						random.addData(seriesData);
					}

					var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

					// instantiate our graph!

					var graph = new Rickshaw.Graph( {
						element: document.getElementById("chart"),
						width: 900,
						height: 500,
						renderer: 'area',
						stroke: true,
						preserve: true,
						series: [
							{
								color: palette.color(),
								data: seriesData[0],
								name: 'Moscow'
							}, {
								color: palette.color(),
								data: seriesData[1],
								name: 'Shanghai'
							}, {
								color: palette.color(),
								data: seriesData[2],
								name: 'Amsterdam'
							}, {
								color: palette.color(),
								data: seriesData[3],
								name: 'Paris'
							}, {
								color: palette.color(),
								data: seriesData[4],
								name: 'Tokyo'
							}, {
								color: palette.color(),
								data: seriesData[5],
								name: 'London'
							}, {
								color: palette.color(),
								data: seriesData[6],
								name: 'New York'
							}
						]
					} );

					graph.render();

					var preview = new Rickshaw.Graph.RangeSlider( {
						graph: graph,
						element: document.getElementById('preview'),
					} );

					var hoverDetail = new Rickshaw.Graph.HoverDetail( {
						graph: graph,
						xFormatter: function(x) {
							return new Date(x * 1000).toString();
						}
					} );

					var annotator = new Rickshaw.Graph.Annotate( {
						graph: graph,
						element: document.getElementById('timeline')
					} );

					var legend = new Rickshaw.Graph.Legend( {
						graph: graph,
						element: document.getElementById('legend')

					} );

					var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
						graph: graph,
						legend: legend
					} );

					var order = new Rickshaw.Graph.Behavior.Series.Order( {
						graph: graph,
						legend: legend
					} );

					var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
						graph: graph,
						legend: legend
					} );

					var smoother = new Rickshaw.Graph.Smoother( {
						graph: graph,
						element: document.querySelector('#smoother')
					} );

					var ticksTreatment = 'glow';

					var xAxis = new Rickshaw.Graph.Axis.Time( {
						graph: graph,
						ticksTreatment: ticksTreatment,
						timeFixture: new Rickshaw.Fixtures.Time.Local()
					} );

					xAxis.render();

					var yAxis = new Rickshaw.Graph.Axis.Y( {
						graph: graph,
						tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
						ticksTreatment: ticksTreatment
					} );

					yAxis.render();


					var controls = new RenderControls( {
						element: document.querySelector('form'),
						graph: graph
					} );

					// add some data every so often

					var messages = [
						"Changed home page welcome message",
						"Minified JS and CSS",
						"Changed button color from blue to green",
						"Refactored SQL query to use indexed columns",
						"Added additional logging for debugging",
						"Fixed typo",
						"Rewrite conditional logic for clarity",
						"Added documentation for new methods"
					];

					that.updateInterval = setInterval( function() {
						random.removeData(seriesData);
						random.addData(seriesData);
						graph.update();

					}, 3000 );

					function addAnnotation(force) {
						if (messages.length > 0 && (force || Math.random() >= 0.95)) {
							annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
							annotator.update();
						}
					}

					addAnnotation(true);
					setTimeout( function() { that.addAnnotationInterval = setInterval( addAnnotation, 6000 ) }, 6000 );

					var previewXAxis = new Rickshaw.Graph.Axis.Time({
						graph: preview.previews[0],
						timeFixture: new Rickshaw.Fixtures.Time.Local(),
						ticksTreatment: ticksTreatment
					});

					previewXAxis.render();
				})
			}
		});
		
		dataDemo.tessellationView = Marionette.Layout.extend({
			template : tessellationTpl,
			onShow: function(){
				var m = [20, 120, 20, 120],
			    w = 1280 - m[1] - m[3],
			    h = 800 - m[0] - m[2],
			    i = 0,
			    root;

			var tree = d3.layout.tree()
			    .size([h, w]);

			var diagonal = d3.svg.diagonal()
			    .projection(function(d) { return [d.y, d.x]; });

			var vis = d3.select("#tessellation").append("svg:svg")
			    .attr("width", w + m[1] + m[3])
			    .attr("height", h + m[0] + m[2])
			  .append("svg:g")
			    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			d3.json("assets/js/apps/data/flare.json", function(json) {
			  root = json;
			  root.x0 = h / 2;
			  root.y0 = 0;

			  function toggleAll(d) {
			    if (d.children) {
			      d.children.forEach(toggleAll);
			      toggle(d);
			    }
			  }

			  // Initialize the display to show a few nodes.
			  root.children.forEach(toggleAll);
			  toggle(root.children[1]);
			  toggle(root.children[1].children[2]);
			  toggle(root.children[9]);
			  toggle(root.children[9].children[0]);

			  update(root);
			});

			function update(source) {
			  var duration = d3.event && d3.event.altKey ? 5000 : 500;

			  // Compute the new tree layout.
			  var nodes = tree.nodes(root).reverse();

			  // Normalize for fixed-depth.
			  nodes.forEach(function(d) { d.y = d.depth * 180; });

			  // Update the nodes…
			  var node = vis.selectAll("g.node")
			      .data(nodes, function(d) { return d.id || (d.id = ++i); });

			  // Enter any new nodes at the parent's previous position.
			  var nodeEnter = node.enter().append("svg:g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			      .on("click", function(d) { toggle(d); update(d); });

			  nodeEnter.append("svg:circle")
			      .attr("r", 1e-6)
			      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeEnter.append("svg:text")
			      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
			      .attr("dy", ".35em")
			      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			      .text(function(d) { return d.name; })
			      .style("fill-opacity", 1e-6);

			  // Transition nodes to their new position.
			  var nodeUpdate = node.transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			  nodeUpdate.select("circle")
			      .attr("r", 4.5)
			      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			  nodeUpdate.select("text")
			      .style("fill-opacity", 1);

			  // Transition exiting nodes to the parent's new position.
			  var nodeExit = node.exit().transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			      .remove();

			  nodeExit.select("circle")
			      .attr("r", 1e-6);

			  nodeExit.select("text")
			      .style("fill-opacity", 1e-6);

			  // Update the links…
			  var link = vis.selectAll("path.link")
			      .data(tree.links(nodes), function(d) { return d.target.id; });

			  // Enter any new links at the parent's previous position.
			  link.enter().insert("svg:path", "g")
			      .attr("class", "link")
			      .attr("d", function(d) {
			        var o = {x: source.x0, y: source.y0};
			        return diagonal({source: o, target: o});
			      })
			    .transition()
			      .duration(duration)
			      .attr("d", diagonal);

			  // Transition links to their new position.
			  link.transition()
			      .duration(duration)
			      .attr("d", diagonal);

			  // Transition exiting nodes to the parent's new position.
			  link.exit().transition()
			      .duration(duration)
			      .attr("d", function(d) {
			        var o = {x: source.x, y: source.y};
			        return diagonal({source: o, target: o});
			      })
			      .remove();

			  // Stash the old positions for transition.
			  nodes.forEach(function(d) {
			    d.x0 = d.x;
			    d.y0 = d.y;
			  });
			}

			// Toggle children.
			function toggle(d) {
			  if (d.children) {
			    d._children = d.children;
			    d.children = null;
			  } else {
			    d.children = d._children;
			    d._children = null;
			  }
			}
			}
		});
		
		dataDemo.treemapView = Marionette.Layout.extend({
			template : treemapTpl,
			onShow: function(){
				var margin = {top: 40, right: 10, bottom: 10, left: 10},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			var color = d3.scale.category20c();

			var treemap = d3.layout.treemap()
			    .size([width, height])
			    .sticky(true)
			    .value(function(d) { return d.size; });

			var div = d3.select("#treemap").append("div")
			    .style("position", "relative")
			    .style("width", (width + margin.left + margin.right) + "px")
			    .style("height", (height + margin.top + margin.bottom) + "px")
			    .style("left", margin.left + "px")
			    .style("top", margin.top + "px");

			d3.json("assets/js/apps/data/flare.json", function(error, root) {
			  var node = div.datum(root).selectAll(".node")
			      .data(treemap.nodes)
			    .enter().append("div")
			      .attr("class", "node")
			      .call(position)
			      .style("background", function(d) { return d.children ? color(d.name) : null; })
			      .text(function(d) { return d.children ? null : d.name; });

			  d3.selectAll("input").on("change", function change() {
			    var value = this.value === "count"
			        ? function() { return 1; }
			        : function(d) { return d.size; };

			    node
			        .data(treemap.value(value).nodes)
			      .transition()
			        .duration(1500)
			        .call(position);
			  });
			});

			function position() {
			  this.style("left", function(d) { return d.x + "px"; })
			      .style("top", function(d) { return d.y + "px"; })
			      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
			}
			}
		});
		
		dataDemo.populationView = Marionette.Layout.extend({
			template : populationTpl,
			onShow: function(){
				var margin = {top: 20, right: 40, bottom: 30, left: 20},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom,
			    barWidth = Math.floor(width / 19) - 1;

			var x = d3.scale.linear()
			    .range([barWidth / 2, width - barWidth / 2]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("right")
			    .tickSize(-width)
			    .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

			// An SVG element with a bottom-right origin.
			var svg = d3.select("#d3-population").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// A sliding container to hold the bars by birthyear.
			var birthyears = svg.append("g")
			    .attr("class", "birthyears");

			// A label for the current year.
			var title = svg.append("text")
			    .attr("class", "title")
			    .attr("dy", ".71em")
			    .text(2000);

			d3.csv("assets/js/apps/data/population.csv", function(error, data) {

			  // Convert strings to numbers.
			  data.forEach(function(d) {
			    d.people = +d.people;
			    d.year = +d.year;
			    d.age = +d.age;
			  });

			  // Compute the extent of the data set in age and years.
			  var age1 = d3.max(data, function(d) { return d.age; }),
			      year0 = d3.min(data, function(d) { return d.year; }),
			      year1 = d3.max(data, function(d) { return d.year; }),
			      year = year1;

			  // Update the scale domains.
			  x.domain([year1 - age1, year1]);
			  y.domain([0, d3.max(data, function(d) { return d.people; })]);

			  // Produce a map from year and birthyear to [male, female].
			  data = d3.nest()
			      .key(function(d) { return d.year; })
			      .key(function(d) { return d.year - d.age; })
			      .rollup(function(v) { return v.map(function(d) { return d.people; }); })
			      .map(data);

			  // Add an axis to show the population values.
			  svg.append("g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(" + width + ",0)")
			      .call(yAxis)
			    .selectAll("g")
			    .filter(function(value) { return !value; })
			      .classed("zero", true);

			  // Add labeled rects for each birthyear (so that no enter or
				// exit is required).
			  var birthyear = birthyears.selectAll(".birthyear")
			      .data(d3.range(year0 - age1, year1 + 1, 5))
			    .enter().append("g")
			      .attr("class", "birthyear")
			      .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

			  birthyear.selectAll("rect")
			      .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
			    .enter().append("rect")
			      .attr("x", -barWidth / 2)
			      .attr("width", barWidth)
			      .attr("y", y)
			      .attr("height", function(value) { return height - y(value); });

			  // Add labels to show birthyear.
			  birthyear.append("text")
			      .attr("y", height - 4)
			      .text(function(birthyear) { return birthyear; });

			  // Add labels to show age (separate; not animated).
			  svg.selectAll(".age")
			      .data(d3.range(0, age1 + 1, 5))
			    .enter().append("text")
			      .attr("class", "age")
			      .attr("x", function(age) { return x(year - age); })
			      .attr("y", height + 4)
			      .attr("dy", ".71em")
			      .text(function(age) { return age; });

			  // Allow the arrow keys to change the displayed year.
			  window.focus();
			  d3.select(window).on("keydown", function() {
			    switch (d3.event.keyCode) {
			      case 37: year = Math.max(year0, year - 10); break;
			      case 39: year = Math.min(year1, year + 10); break;
			    }
			    update();
			  });

			  function update() {
			    if (!(year in data)) return;
			    title.text(year);

			    birthyears.transition()
			        .duration(750)
			        .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

			    birthyear.selectAll("rect")
			        .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
			      .transition()
			        .duration(750)
			        .attr("y", y)
			        .attr("height", function(value) { return height - y(value); });
			  }
			});
			}
		});
		
		dataDemo.circlepackingView = Marionette.Layout.extend({
			template : circlepackingTpl,
			onShow: function(){
				var diameter = 960,
			    format = d3.format(",d");

			var pack = d3.layout.pack()
			    .size([diameter - 4, diameter - 4])
			    .value(function(d) { return d.size; });

			var svg = d3.select("#circlepacking").append("svg")
			    .attr("width", diameter)
			    .attr("height", diameter)
			  .append("g")
			    .attr("transform", "translate(2,2)");

			d3.json("assets/js/apps/data/flare.json", function(error, root) {
			  var node = svg.datum(root).selectAll(".node")
			      .data(pack.nodes)
			    .enter().append("g")
			      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  node.append("title")
			      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

			  node.append("circle")
			      .attr("r", function(d) { return d.r; });

			  node.filter(function(d) { return !d.children; }).append("text")
			      .attr("dy", ".3em")
			      .style("text-anchor", "middle")
			      .text(function(d) { return d.name.substring(0, d.r / 3); });
			});

			d3.select(self.frameElement).style("height", diameter + "px");
			}
		});
		
		dataDemo.dendrogramView = Marionette.Layout.extend({
			template : dendrogramTpl,
			onShow: function(){
				var width = 960,
			    height = 2200;

			var cluster = d3.layout.cluster()
			    .size([height, width - 160]);

			var diagonal = d3.svg.diagonal()
			    .projection(function(d) { return [d.y, d.x]; });

			var svg = d3.select("#d3-dendrogram").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(40,0)");

			d3.json("assets/js/apps/data/flare.json", function(error, root) {
			  var nodes = cluster.nodes(root),
			      links = cluster.links(nodes);

			  var link = svg.selectAll(".link")
			      .data(links)
			    .enter().append("path")
			      .attr("class", "link")
			      .attr("d", diagonal);

			  var node = svg.selectAll(".node")
			      .data(nodes)
			    .enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

			  node.append("circle")
			      .attr("r", 4.5);

			  node.append("text")
			      .attr("dx", function(d) { return d.children ? -8 : 8; })
			      .attr("dy", 3)
			      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
			      .text(function(d) { return d.name; });
			});

			d3.select(self.frameElement).style("height", height + "px");
			}
		});
		
		dataDemo.chordView = Marionette.Layout.extend({
			template : chordTpl,
			onShow: function(){
				// From http://mkweb.bcgsc.ca/circos/guide/tables/
				var matrix = [
				  [11975,  5871, 8916, 2868],
				  [ 1951, 10048, 2060, 6171],
				  [ 8010, 16145, 8090, 8045],
				  [ 1013,   990,  940, 6907]
				];

				var chord = d3.layout.chord()
				    .padding(.05)
				    .sortSubgroups(d3.descending)
				    .matrix(matrix);

				var width = 960,
				    height = 500,
				    innerRadius = Math.min(width, height) * .41,
				    outerRadius = innerRadius * 1.1;

				var fill = d3.scale.ordinal()
				    .domain(d3.range(4))
				    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

				var svg = d3.select("#d3-chord").append("svg")
				    .attr("width", width)
				    .attr("height", height)
				  .append("g")
				    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				svg.append("g").selectAll("path")
				    .data(chord.groups)
				  .enter().append("path")
				    .style("fill", function(d) { return fill(d.index); })
				    .style("stroke", function(d) { return fill(d.index); })
				    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
				    .on("mouseover", fade(.1))
				    .on("mouseout", fade(1));

				var ticks = svg.append("g").selectAll("g")
				    .data(chord.groups)
				  .enter().append("g").selectAll("g")
				    .data(groupTicks)
				  .enter().append("g")
				    .attr("transform", function(d) {
				      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				          + "translate(" + outerRadius + ",0)";
				    });

				ticks.append("line")
				    .attr("x1", 1)
				    .attr("y1", 0)
				    .attr("x2", 5)
				    .attr("y2", 0)
				    .style("stroke", "#000");

				ticks.append("text")
				    .attr("x", 8)
				    .attr("dy", ".35em")
				    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
				    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
				    .text(function(d) { return d.label; });

				svg.append("g")
				    .attr("class", "chord")
				  .selectAll("path")
				    .data(chord.chords)
				  .enter().append("path")
				    .attr("d", d3.svg.chord().radius(innerRadius))
				    .style("fill", function(d) { return fill(d.target.index); })
				    .style("opacity", 1);

				// Returns an array of tick angles and labels, given a group.
				function groupTicks(d) {
				  var k = (d.endAngle - d.startAngle) / d.value;
				  return d3.range(0, d.value, 1000).map(function(v, i) {
				    return {
				      angle: v * k + d.startAngle,
				      label: i % 5 ? null : v / 1000 + "k"
				    };
				  });
				}

				// Returns an event handler for fading a given chord group.
				function fade(opacity) {
				  return function(g, i) {
				    svg.selectAll(".chord path")
				        .filter(function(d) { return d.source.index != i && d.target.index != i; })
				      .transition()
				        .style("opacity", opacity);
				  };
				}
			}
		});
		
		dataDemo.treeView = Marionette.Layout.extend({
			template : treeTpl,
			onShow: function(){
				/* D3 Tree */
				/* Copyright 2013 Peter Cook (@prcweb); Licensed MIT */

				// Tree configuration
				var branches = [];
				var seed = {i: 0, x: 420, y: 600, a: 0, l: 130, d:0}; // a =
																		// angle,
																		// l =
																		// length,
																		// d =
																		// depth
				var da = 0.5; // Angle delta
				var dl = 0.8; // Length delta (factor)
				var ar = 0.7; // Randomness
				var maxDepth = 10;


				// Tree creation functions
				function branch(b) {
					var end = endPt(b), daR, newB;

					branches.push(b);

					if (b.d === maxDepth)
						return;

					// Left branch
					daR = ar * Math.random() - ar * 0.5;
					newB = {
						i: branches.length,
						x: end.x,
						y: end.y,
						a: b.a - da + daR,
						l: b.l * dl,
						d: b.d + 1,
						parent: b.i
					};
					branch(newB);

					// Right branch
					daR = ar * Math.random() - ar * 0.5;
					newB = {
						i: branches.length,
						x: end.x, 
						y: end.y, 
						a: b.a + da + daR, 
						l: b.l * dl, 
						d: b.d + 1,
						parent: b.i
					};
					branch(newB);
				}

				function regenerate(initialise) {
					branches = [];
					branch(seed);
					initialise ? create() : update();
				}

				function endPt(b) {
					// Return endpoint of branch
					var x = b.x + b.l * Math.sin( b.a );
					var y = b.y - b.l * Math.cos( b.a );
					return {x: x, y: y};
				}


				// D3 functions
				function x1(d) {return d.x;}
				function y1(d) {return d.y;}
				function x2(d) {return endPt(d).x;}
				function y2(d) {return endPt(d).y;}
				function highlightParents(d) {
					var colour = d3.event.type === 'mouseover' ? 'green' : '#777';
					var depth = d.d;
					for(var i = 0; i <= depth; i++) {
						d3.select('#id-'+parseInt(d.i)).style('stroke', colour);
						d = branches[d.parent];
					}	
				}

				function create() {
					d3.select('svg.tree')
						.selectAll('line')
						.data(branches)
						.enter()
						.append('line')
						.attr('x1', x1)
						.attr('y1', y1)
						.attr('x2', x2)
						.attr('y2', y2)
						.style('stroke-width', function(d) {return parseInt(maxDepth + 1 - d.d) + 'px';})
						.attr('id', function(d) {return 'id-'+d.i;})
						.on('mouseover', highlightParents)
						.on('mouseout', highlightParents);
				}

				function update() {
					d3.select('svg')
						.selectAll('line')
						.data(branches)
						.transition()
						.attr('x1', x1)
						.attr('y1', y1)
						.attr('x2', x2)
						.attr('y2', y2);
				}

				d3.selectAll('.regenerate')
					.on('click', regenerate);

				regenerate(true);

			}
		});

		dataDemo.cartogramView = Marionette.Layout.extend({
			template : cartogramTpl,
			onShow : function() {

				require([ 'apps/data/topojson.v1.min' ], function(topojson) {
					// Ratio of Obese (BMI >= 30) in U.S. Adults, CDC 2008
					var valueById = [ NaN, .187, .198, NaN, .133, .175, .151, NaN, .100, .125, .171, NaN, .172, .133, NaN, .108, .142, .167, .201, .175, .159, .169, .177, .141, .163, .117, .182, .153, .195, .189, .134, .163, .133, .151, .145, .130, .139, .169, .164, .175, .135, .152, .169, NaN, .132, .167, .139, .184, .159, .140, .146, .157, NaN, .139, .183, .160, .143 ];

					var path = d3.geo.path();

					var svg = d3.select("#cartogram").append("svg").attr("width", 960).attr("height", 500);

					d3.json("assets/js/apps/data/us.json", function(error, us) {
						svg.append("path").datum(topojson.feature(us, us.objects.land)).attr("class", "land").attr("d", path);

						svg.selectAll(".state").data(topojson.feature(us, us.objects.states).features).enter().append("path").attr("class", "state").attr("d", path).attr("transform", function(d) {
							var centroid = path.centroid(d), x = centroid[0], y = centroid[1];
							return "translate(" + x + "," + y + ")" + "scale(" + Math.sqrt(valueById[d.id] * 5 || 0) + ")" + "translate(" + -x + "," + -y + ")";
						}).style("stroke-width", function(d) {
							return 1 / Math.sqrt(valueById[d.id] * 5 || 1);
						});
					});
				})

			}
		});

		dataDemo.calendarView = Marionette.Layout.extend({
			template : calendarTpl,
			onShow : function() {
				var width = 960, height = 136, cellSize = 17; // cell size

				var day = d3.time.format("%w"), week = d3.time.format("%U"), percent = d3.format(".1%"), format = d3.time.format("%Y-%m-%d");

				var color = d3.scale.quantize().domain([ -.05, .05 ]).range(d3.range(11).map(function(d) {
					return "q" + d + "-11";
				}));

				var svg = d3.select("#calendar").selectAll("svg").data(d3.range(1990, 2011)).enter().append("svg").attr("width", width).attr("height", height).attr("class", "RdYlGn").append("g").attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

				svg.append("text").attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)").style("text-anchor", "middle").text(function(d) {
					return d;
				});

				var rect = svg.selectAll(".day").data(function(d) {
					return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
				}).enter().append("rect").attr("class", "day").attr("width", cellSize).attr("height", cellSize).attr("x", function(d) {
					return week(d) * cellSize;
				}).attr("y", function(d) {
					return day(d) * cellSize;
				}).datum(format);

				rect.append("title").text(function(d) {
					return d;
				});

				svg.selectAll(".month").data(function(d) {
					return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
				}).enter().append("path").attr("class", "month").attr("d", monthPath);

				d3.csv("assets/js/apps/data/dji.csv", function(error, csv) {
					var data = d3.nest().key(function(d) {
						return d.Date;
					}).rollup(function(d) {
						return (d[0].Close - d[0].Open) / d[0].Open;
					}).map(csv);

					rect.filter(function(d) {
						return d in data;
					}).attr("class", function(d) {
						return "day " + color(data[d]);
					}).select("title").text(function(d) {
						return d + ": " + percent(data[d]);
					});
				});

				function monthPath(t0) {
					var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), d0 = +day(t0), w0 = +week(t0), d1 = +day(t1), w1 = +week(t1);
					return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize + "H" + w0 * cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0 + "H" + (w0 + 1) * cellSize + "Z";
				}

				d3.select(self.frameElement).style("height", "2910px");
			}
		});

		dataDemo.bulletView = Marionette.Layout.extend({
			template : bulletTpl,
			onShow : function() {
				require([ 'assets/js/apps/data/bullets.js' ], function() {
					var margin = {
						top : 5,
						right : 40,
						bottom : 20,
						left : 120
					}, width = 960 - margin.left - margin.right, height = 50 - margin.top - margin.bottom;

					var chart = d3.bullet().width(width).height(height);

					d3.json("assets/js/apps/data/bullets.json", function(error, data) {
						var svg = d3.select("#d3bullet").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(chart);

						var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

						title.append("text").attr("class", "title").text(function(d) {
							return d.title;
						});

						title.append("text").attr("class", "subtitle").attr("dy", "1em").text(function(d) {
							return d.subtitle;
						});

						d3.selectAll("button").on("click", function() {
							svg.datum(randomize).call(chart.duration(1000)); // TODO
							// automatic
							// transition
						});
					});

					function randomize(d) {
						if (!d.randomizer)
							d.randomizer = randomizer(d);
						d.ranges = d.ranges.map(d.randomizer);
						d.markers = d.markers.map(d.randomizer);
						d.measures = d.measures.map(d.randomizer);
						return d;
					}

					function randomizer(d) {
						var k = d3.max(d.ranges) * .2;
						return function(d) {
							return Math.max(0, d + k * (Math.random() - .5));
						};
					}
				})
			}
		});

		dataDemo.d3View = Marionette.Layout.extend({
			template : d3Tpl,
			onShow : function() {
				var diameter = 960, format = d3.format(",d"), color = d3.scale.category20c();

				var bubble = d3.layout.pack().sort(null).size([ diameter, diameter ]).padding(1.5);

				var svg = d3.select("#d3bubble").append("svg").attr("width", diameter).attr("height", diameter).attr("class", "bubble");

				d3.json("assets/js/apps/data/flare.json", function(error, root) {
					var node = svg.selectAll(".node").data(bubble.nodes(classes(root)).filter(function(d) {
						return !d.children;
					})).enter().append("g").attr("class", "node").attr("transform", function(d) {
						return "translate(" + d.x + "," + d.y + ")";
					});

					node.append("title").text(function(d) {
						return d.className + ": " + format(d.value);
					});

					node.append("circle").attr("r", function(d) {
						return d.r;
					}).style("fill", function(d) {
						return color(d.packageName);
					});

					node.append("text").attr("dy", ".3em").style("text-anchor", "middle").style('font', '10px sans-serif').text(function(d) {
						return d.className.substring(0, d.r / 3);
					});
				});

				// Returns a flattened hierarchy containing all leaf nodes under
				// the root.
				function classes(root) {
					var classes = [];

					function recurse(name, node) {
						if (node.children)
							node.children.forEach(function(child) {
								recurse(node.name, child);
							});
						else
							classes.push({
								packageName : name,
								className : node.name,
								value : node.size
							});
					}

					recurse(null, root);
					return {
						children : classes
					};
				}

				d3.select(self.frameElement).style("height", diameter + "px");
			}
		});

		var mainView = new dataDemo.MainView();

		dataDemo.controller = {
			show : function() {
				App.navigate("dataDemo");
				App.mainRegion.show(mainView);
			},
			showD3 : function() {
				mainView.content.show(new dataDemo.d3View)
			},
			showBullet : function() {
				mainView.content.show(new dataDemo.bulletView)
			},
			showCalendar : function() {
				mainView.content.show(new dataDemo.calendarView)
			},
			showcartogram : function() {
				mainView.content.show(new dataDemo.cartogramView)
			},
			showtree: function(){
				mainView.content.show(new dataDemo.treeView)
			},
			showChord: function(){
				mainView.content.show(new dataDemo.chordView)
			},
			showdendrogram: function(){
				mainView.content.show(new dataDemo.dendrogramView)
			},
			showcirclepacking: function(){
				mainView.content.show(new dataDemo.circlepackingView)
			},
			showpopulation: function(){
				mainView.content.show(new dataDemo.populationView)
			},
			showtreemap: function(){
				mainView.content.show(new dataDemo.treemapView)
			},
			showtessellation: function(){
				mainView.content.show(new dataDemo.tessellationView)
			},
			showrickshaw: function(){
				mainView.content.show(new dataDemo.rickshawView)
			},
			showslickgrid: function(){
				mainView.content.show(new dataDemo.slickgridView)
			},
			showsigma: function(){
				mainView.content.show(new dataDemo.sigmaView)
			},
			showflot: function(){
				mainView.content.show(new dataDemo.flotView)
			},
			showrealtime: function(){
				mainView.content.show(new dataDemo.realtimeView)
			},
			showMorris: function(){
				mainView.content.show(new dataDemo.morrisView)
			},
			showList: function(){
				mainView.content.show(new dataDemo.listView)
			},
			showhandsontable: function(){
				mainView.content.show(new dataDemo.handsontableView)
			},
			showchart: function(){
				mainView.content.show(new dataDemo.chartView)
			},
			shownasdaq: function(){
				mainView.content.show(new dataDemo.nasdaqView)
			},
			showhighcharts: function(){
				mainView.content.show(new dataDemo.highchartsView)
			},
			showpeer: function(){
				mainView.content.show(new dataDemo.peerView)
			},
			showoboe: function(){
				mainView.content.show(new dataDemo.oboeView)
			},
			showDataTable: function(){
				mainView.content.show(new dataDemo.dataTableView)
			},
			showknwl: function(){
				mainView.content.show(new dataDemo.knwlView)
			},
			showflowchart: function(){
				mainView.content.show(new dataDemo.flowchartView)
			},
			showsink: function(){
				mainView.content.show(new dataDemo.sinkView)
			},
			showhierarchy: function(){
				mainView.content.show(new dataDemo.hierarchyView)
			},
			showrchart: function(){
				mainView.content.show(new dataDemo.rchartView)
			},
			showcytoscape: function(){
				mainView.content.show(new dataDemo.cytoscapeView)
			},
			showatlas: function(){
				mainView.content.show(new dataDemo.atlasView)
			},
			showspringy: function(){
				mainView.content.show(new dataDemo.springyView)
			},
			showzip: function(){
				mainView.content.show(new dataDemo.zipView)
			},
			showusa: function(){
				mainView.content.show(new dataDemo.usaView)
			},
			showtaffy: function(){
				mainView.content.show(new dataDemo.taffyView)
			},
			showdimple: function(){
				mainView.content.show(new dataDemo.dimpleView)
			},
			showxlsx: function(){
				mainView.content.show(new dataDemo.xlsxView)
			},
			showxls: function(){
				mainView.content.show(new dataDemo.xlsView)
			},
			showcloud: function(){
				mainView.content.show(new dataDemo.cloudView)
			},
			showfuse: function(){
				mainView.content.show(new dataDemo.fuseView)
			},
			showtable: function(){
				mainView.content.show(new dataDemo.tableView)
			},
			showtreetable: function(){
				mainView.content.show(new dataDemo.treetableView)
			},
			showlscache: function(){
				mainView.content.show(new dataDemo.lscacheView)
			},
			showtablesort: function(){
				mainView.content.show(new dataDemo.tablesortView);
			},
			showindexdb: function(){
				mainView.content.show(new dataDemo.indexdbView);
			}
		}

		App.on("dataDemo:show", function() {
			dataDemo.controller.show();
		});

		dataDemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"dataDemo" : "show",
				"dataDemo/d3" : "showD3",
				"dataDemo/bullet" : "showBullet",
				"dataDemo/calendar" : "showCalendar",
				"dataDemo/cartogram" : "showcartogram",
				"dataDemo/tree" : "showtree",
				"dataDemo/chord" : "showChord",
				"dataDemo/dendrogram" : "showdendrogram",
				"dataDemo/circlepacking" : "showcirclepacking",
				"dataDemo/population" : "showpopulation",
				"dataDemo/treemap" : "showtreemap",
				"dataDemo/tessellation" : "showtessellation",
				"dataDemo/rickshaw" : "showrickshaw",
				"dataDemo/slickgrid" : "showslickgrid",
				"dataDemo/sigma" : "showsigma",
				"dataDemo/flot" : "showflot",
				"dataDemo/realtime" : "showrealtime",
				"dataDemo/morris" : "showMorris",
				"dataDemo/list" : "showList",
				"dataDemo/handsontable" : "showhandsontable",
				"dataDemo/chart" : "showchart",
				"dataDemo/nasdaq" : "shownasdaq",
				"dataDemo/highcharts" : "showhighcharts",
				"dataDemo/peer" : "showpeer",
				"dataDemo/oboe" : "showoboe",
				"dataDemo/dataTable" : "showDataTable",
				"dataDemo/knwl" : "showknwl",
				"dataDemo/flowchart" : "showflowchart",
				"dataDemo/sink" : "showsink",
				"dataDemo/hierarchy" : "showhierarchy",
				"dataDemo/rchart" : "showrchart",
				"dataDemo/cytoscape" : "showcytoscape",
				"dataDemo/atlas" : "showatlas",
				"dataDemo/springy" : "showspringy",
				"dataDemo/zip" : "showzip",
				"dataDemo/usa" : "showusa",
				"dataDemo/taffy" : "showtaffy",
				"dataDemo/dimple" : "showdimple",
				"dataDemo/xlsx" : "showxlsx",
				"dataDemo/xls" : "showxls",
				"dataDemo/cloud" : "showcloud",
				"dataDemo/fuse" : "showfuse",
				"dataDemo/table" : "showtable",
				"dataDemo/treetable" : "showtreetable",
				"dataDemo/lscache" : "showlscache",
				"dataDemo/tablesort" : "showtablesort",
				"dataDemo/indexdb" : "showindexdb"
			}
		});

		App.addInitializer(function() {
			new dataDemo.Router({
				controller : dataDemo.controller
			});
		});
	});
	return App.dataDemo.controller;
})