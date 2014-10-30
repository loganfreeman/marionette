define([ 'app', 'tpl!apps/interface/main.tpl' , 'interface', 'css!apps/interface/style'], function(App, viewTpl, Interface) {
	App.module('InterfaceMod', function(InterfaceMod, App, Backbone, Marionette, $, _) {

		InterfaceMod.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				var a = new Interface.Panel({ 
					  container:$("#pianoPanel") 
					});

					 var b = new Interface.Piano({ 
					  bounds:[0,0,1,.5],  
					  startletter : "C",
					   startoctave : 3,
					   endletter : "C",
					   endoctave : 5,
					   noteLabels:true,
					 });
					var c = new Interface.Piano({ 
					  bounds:[0,.5,1,.5],  
					  startletter : "F",
					   startoctave : 3,
					   endletter : "B",
					   endoctave : 4,
					  }); 

					a.background = 'black';
					a.add(b,c);
				// button panel
					var a = new Interface.Panel({ 
						  container:$("#buttonPanel") 
						});

						var b = new Interface.Button({ 
						  bounds:[.05,.05,.3,.9],  
						  label:'toggle'  
						});
						var c = new Interface.Button({ 
						  bounds:[.35,.05,.3,.9],
						  label:'momentary',
						  mode:'momentary'  
						});
						var d = new Interface.Button({ 
						  bounds:[.65,.05,.3,.9],
						  label:'contact',
						   mode:'contact'  
						});

						a.background = 'black';   
						a.add(b,c,d);
				// buttonV
						var a = new Interface.Panel({  background:"#000", container:$("#buttonVPanel") });
						var b0 = new Interface.ButtonV({
						  bounds:[.2,.15,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Top',
						  textLocation : {x:.5, y:.5},
						});
						var b1 = new Interface.ButtonV({
						  bounds:[.04,.25,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Top Left',
						  textLocation : {x:.5, y:.5},
						});
						var b2 = new Interface.ButtonV({
						  bounds:[.36,.25,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Top Right',
						  textLocation : {x:.5, y:.5},
						});
						var b3 = new Interface.ButtonV({
						  bounds:[.2,.35,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Middle',
						  textLocation : {x:.5, y:.5},
						});
						var b4 = new Interface.ButtonV({
						  bounds:[.04,.45,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Bottom Left',
						  textLocation : {x:.5, y:.5},
						});
						var b5 = new Interface.ButtonV({
						  bounds:[.36,.45,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Bottom Right',
						  textLocation : {x:.5, y:.5},
						});
						var b6 = new Interface.ButtonV({
						  bounds:[.2,.55,.2,.2], 
						  points: [{x:.2,y:0},{x:.8,y:0},{x:1,y:.5},{x:.8,y:1},{x:.2,y:1},{x:0,y:.5},{x:.2,y:0}],
						  mode:'toggle',
						  label:'Bottom',
						  textLocation : {x:.5, y:.5},
						});
						var c = new Interface.ButtonV({ 
						  bounds:[.6,.05,.35,.9], 
						  points: [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:0,y:.2},{x:.8,y:.2},{x:.8,y:.8},{x:.2,y:.8},{x:.2,y:.4},{x:.6,y:.4},
						          {x:.6,y:.5},{x:.3,y:.5},{x:.3,y:.5},{x:.3,y:.7},{x:.7,y:.7},{x:.7,y:.3},{x:.1,y:.3},{x:.1,y:.9},{x:.9,y:.9},{x:.9,y:.1},{x:0,y:.1},{x:0,y:0}],
						  mode:'momentary',
						  label:'Spiral',
						  textLocation : {x:.45, y:.45},
						});

						a.background = 'black';   
						a.add(b0,b1,b2,b3,b4,b5,b6,c);
						// slider
						var a = new Interface.Panel({ 
							  container:$("#sliderPanel") 
							});
							var b = new Interface.Slider({
							  label: 'vertical slider',  
							  bounds:[.05,.05,.3,.9] 
							});
							var c = new Interface.Slider({ 
							  bounds:[.4,.35,.55,.3], 
							  label: 'horizontal slider',  
							  isVertical:false, 
							  value:.5,
							});

							a.background = 'black';
							a.add(b,c);
					 //XY
							var a = new Interface.Panel({ 
								  container:$("#xyPanel") 
								});
								var xy = new Interface.XY({
								  childWidth: 25,
								  numChildren: 6,
								  background:"#111",
								  fill: "rgba(127,127,127,.2)",
								  bounds:[0,0,.6,1],
								  oninit: function() { this.rainbow() },  
								});
								xy.rainbow()
								var c = new Interface.Slider({ 
								  bounds:[.65,0,.15,1], 
								  min:.0, max:.25,
								  value:.125,
								  fill:'#333', background:'#111',
								  onvaluechange: function() { xy.friction = 1 - this.value; },
								  label:'friction',
								});
								var d = new Interface.Slider({ 
								  bounds:[.825,0,.15,1],
								  target:xy, key:'maxVelocity',
								  min:.5, max:20,
								  value:15,
								  fill:'#333', background:'#111',       
								  label:'velocity',
								});
								      
								a.background = 'black';
								a.add(xy, c, d);
				// knob
								var a = new Interface.Panel({ container:$("#knobPanel") });      
								var k1 = new Interface.Knob({ 
								  bounds:[.05,0,.25],
								  value:.25,
								  usesRotation:true,
								  centerZero: true,
								});
								var k2 = new Interface.Knob({ 
								  bounds:[.35,0,.25],
								  value:.75,
								  usesRotation:true,
								  centerZero: false,
								});
								var k3 = new Interface.Knob({ 
								  bounds:[.05,.5,.25],
								  value:.1,
								  usesRotation:false,
								  centerZero: true,
								});  
								var k4 = new Interface.Knob({ 
								  bounds:[.35,.5,.25],
								  value:.9,
								  usesRotation:false,
								  centerZero: false,
								});
								var m = new Interface.Label({ 
								  bounds:[.7,.2,.25,.5],
								  value:"uses rotation gesture",
								  hAlign:'right',
								});
								var n = new Interface.Label({ 
								  bounds:[.7, .7, .25, .5],
								  value:"uses vertical gesture",
								  hAlign:'right',
								});
								a.background = 'black';
								a.add(k1, k2, k3, k4, m, n);
				//crossfader
								var a = new Interface.Panel({ container:$("#crossfaderPanel") }); 
								var crossfaderLabel = new Interface.Label({ 
								  bounds:[.3,.2,.4,.2],
								  hAlign:'center',
								  value:0
								});     
								var crossfader = new Interface.Crossfader({
								  bounds:[.1,.35,.8,.3],
								  min:-1, max:1,
								  crossfaderWidth:30,
								  target: crossfaderLabel, key:'setValue',
								});
								      
								a.background = 'black';
								a.add(crossfaderLabel, crossfader);
				// range
								var a = new Interface.Panel({ container:$("#rangePanel") }); 
								var rangeLabel = new Interface.Label({ 
								  bounds:[.3,.2, .4, .2],
								  hAlign:'center',
								  value:0
								});     
								var range = new Interface.Range({
								  bounds:[.1,.35,.8,.3],
								  min:-1, max:1,
								  crossfaderWidth:30,
								  onvaluechange : function(min, max) { 
								    rangeLabel.setValue('min : ' + min + ', max : ' + max);
								  }
								});

								a.background = 'black';
								a.add(rangeLabel, range);
				// multiSlider
								var a = new Interface.Panel({ container:$("#multiSliderPanel") });            
								var multiSlider = new Interface.MultiSlider({ 
								  count:15,
								  bounds:[.05,.05,.9,.8],
								  onvaluechange : function(number, value) {
								    multiSliderLabel.setValue( 'num : ' + number + ' , value : ' + value);
								  }
								});

								var multiSliderLabel = new Interface.Label({ 
								  bounds:[.05, .9, .9, .1],
								  hAlign:"left",
								  value:" ",
								});

								a.background = 'black';
								a.add(multiSlider, multiSliderLabel);

								for(var i = 0; i < multiSlider.count; i++) {
								  //multiSlider.children[i].setValue( Math.random() );
								}
				// multiButton
								var a = new Interface.Panel({ container:("#multiButtonPanel") });
								var multiButton = new Interface.MultiButton({
								  row:4, columns:8,
								  bounds:[.05,.05,.9,.8],
								  onvaluechange : function(row, col, value) {
								    multiButtonLabel
								    .setValue( 'row : ' + row + ' , col : ' + col + ' , value : ' + value);
								  },
								});
								var multiButtonLabel = new Interface.Label({ 
								  bounds:[.05,.9, .9, .1],
								  hAlign:"left",
								  value:""
								});

								a.background = 'black';
								a.add(multiButton, multiButtonLabel);

								for(var i = 0; i < multiButton.count; i++) {
								  multiButton._values[i] = Math.random() > .5 ;
								}
								
					// textfield
								var a = new Interface.Panel({ container:$("#textFieldPanel") });
								var textField = new Interface.TextField({ 
								  bounds:[.05,.05,.5,.2],
								  onvaluechange : function(value, oldValue) {
								    textFieldLabel.setValue( "new value : " + value );
								  },
								  value: " TEST ",
								  fill:"#fff",
								});

								var textFieldLabel = new Interface.Label({ 
								  bounds:[.05,.5],
								  size: 20,
								  hAlign:"left",
								  value:"Enter something in the text field above and hit return"
								});
								      
								a.background = 'black';
								a.add(textField, textFieldLabel);
					// menu
								var a = new Interface.Panel({ container:$("#menuPanel") });
								var menu = new Interface.Menu({ 
								  bounds:[.25,.45,.5,.1],
								  stroke:"#666",
								  options:['red','green','blue','pink','purple'],
								  target: a, key:'background',
								});

								a.background = 'black';
								a.add(menu);
								
				// label
								var a = new Interface.Panel({ container:$("#labelPanel") });
								var label = new Interface.Label({
								  value:"center aligned",
								  size: 25,
								  bounds:[0, .15, 1, .1],
								});
								var label2 = new Interface.Label({
								  value:"left aligned",
								  hAlign:'left',
								  size: 25,
								  bounds:[.5,.25,.5,.1],
								});
								var label3 = new Interface.Label({
								  value:"right aligned",
								  hAlign:'right',
								  size: 25,
								  bounds:[0, .35, .5,.1],
								});
								var label4 = new Interface.Label({
								  value:'bold',
								  style:'bold',
								  size: 25,
								  bounds:[0,.45,1,.1],
								});
								var label5 = new Interface.Label({
								  value:'Times Italic Big',
								  style:'italic',
								  font:'Times',
								  size: 45,
								  bounds:[0,.55,1,.25],
								});

								a.background = 'black';
								a.add(label, label2, label3, label4, label5);
								// 
			}
		});

		InterfaceMod.controller = {
			show : function() {
				App.navigate("interface");
				App.mainRegion.show(new InterfaceMod.MainView());
			}
		}

		App.on("interface:show", function() {
			InterfaceMod.controller.show();
		});

		InterfaceMod.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"interface" : "show"
			}
		});

		InterfaceMod.addInitializer(function() {
			new InterfaceMod.Router({
				controller : InterfaceMod.controller
			});
		});
	});
	return App.InterfaceMod.controller;
})