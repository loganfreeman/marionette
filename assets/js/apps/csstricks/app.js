define([ 'app',
         'stache!apps/csstricks/main',
         'stache!apps/csstricks/iphone', 'stache!apps/csstricks/3dfaces', 'stache!apps/csstricks/padding', 'stache!apps/csstricks/aspect',
         'stache!apps/csstricks/hangout', 'stache!apps/csstricks/slidinglabel', 'stache!apps/csstricks/slider', 'stache!apps/csstricks/swivel',
         'stache!apps/csstricks/flex', 'stache!apps/csstricks/avatar', 'stache!apps/csstricks/treeview',
         'css!apps/csstricks/style', 'css!apps/csstricks/iphone', 'css!apps/csstricks/3dfaces', 'css!apps/csstricks/padding', 'css!apps/csstricks/aspect',
         'css!apps/csstricks/hangout', 'css!apps/csstricks/slider', 'css!apps/csstricks/swivel', 'css!apps/csstricks/flex',
         'vendor/jquery.slidinglabels', 'vendor/jquery.superLabels'
       ], function(App, viewTpl, iphoneTpl, tdfacesTpl, paddingTpl, aspectTpl, 
    		   hangoutTpl, slidinglabelTpl, sliderTpl, swivelTpl, flexTpl, avatarTpl, treeTpl) {
	App.module('csstricks', function(csstricks, App, Backbone, Marionette, $, _) {

		csstricks.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				content : '#csstricks-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		csstricks.iphoneView = Marionette.ItemView.extend({
			template : iphoneTpl,
		});
		
		csstricks.avatarView = Marionette.ItemView.extend({
			template : avatarTpl,
			onShow: function(){
				require(['apps/csstricks/avatar'], function(Avatar){
					Avatar.init();
				})
			}
		});
		
		csstricks.treeView = Marionette.ItemView.extend({
			template : treeTpl,
			onShow: function(){
				require(['apps/csstricks/treeview'], function(Tree){
					Tree.init();
				})
			}
		});
		
		csstricks.flexView = Marionette.ItemView.extend({
			template : flexTpl,
		});
		
		csstricks.sliderView = Marionette.ItemView.extend({
			template : sliderTpl,
			onShow: function(){
				require(['apps/csstricks/slider'], function(slider){
					slider.init();
				})
			}
		});
		
		csstricks.swivelView = Marionette.ItemView.extend({
			template : swivelTpl,
			onShow: function(){
				require(['apps/csstricks/swivel'], function(swivel){
					swivel();
				})
			}
		});
		
		csstricks.snakeView = Marionette.ItemView.extend({
			template : _.template('<canvas id="canvas" style="background: black;"></canvas>'),

			onShow: function(){
				var snake = {
						  
						  canvas: document.getElementById("canvas"),
						  ctx: document.getElementById("canvas").getContext('2d'),
						  
						  // how big the "squares" will be
						  xDis: 0,
						  yDis: 0,
						  
						  // where the square will be drawn
						  posX: 0,   
						  posY: 0,
						  
						  repeater: 0, // ID of requestAnimationFrame
						    
						  divisions: 30, // breaks frame into X × X squares

						  init: function() {
						    
						    // Set up "Two Dimensional" Array to remember what is on and off
						    this.memory = new Array(this.divisions-1);
						    for (var i = 0; i < (this.divisions+1); i++) {
						      this.memory[i] = new Array(this.divisions-1);
						    }
						 
						    // Size the canvas appropriately
						    var width = window.innerWidth;
						    var height = window.innerHeight;
						    snake.canvas.width = width;
						    snake.canvas.height = height;
						    
						    // Size of squares is canvas width broken into equal chunks
						    snake.xDis = width/snake.divisions;
						    snake.yDis = height/snake.divisions;
						                
						    // All pink, baby
						    this.ctx.fillStyle = "#EA80B0";
						  
						    // Random starting position
						    this.posX = Math.floor(Math.random() * this.divisions);
						    this.posY = Math.floor(Math.random() * this.divisions);
						    
						    // global
						    drawLoop = function() {
						      snake.repeater = requestAnimationFrame(drawLoop);
						      snake.oneMovement();
						    }
						    drawLoop();
						        
						  },
						  
						  drawSquare: function(x, y) {
						    // Actually draw it
						    snake.ctx.fillRect(x*this.xDis, y*this.yDis, this.xDis, this.yDis);
						    
						    // Record it in memory
						    snake.memory[x][y] = true;
						  },
						  
						  checkPossiblePositions: function() {
						  
						    var posToReturn = [];
						    
						    if (this.posX == 0) {
						      // can't go left
						    } else if (this.memory[this.posX-1][this.posY] == true) {
						      // left occupied
						    } else {
						      posToReturn.push("left");
						    }
						    
						    if (this.posX == this.divisions) {
						      // can't go right
						    } else if (this.memory[this.posX+1][this.posY] == true) {
						      // right occupied
						    } else {
						      posToReturn.push("right");
						    }
						    
						    if (this.posY == 0) {
						      // can't go up
						    } else if (this.memory[this.posX][this.posY-1] == true) {
						      // top occupied
						    } else {
						      posToReturn.push("up");
						    }
						    
						    if (this.posY == this.divisions) {
						      // can't go down
						    } else if (this.memory[this.posX][this.posY+1] == true) {
						      // bottom occupied
						    } else {
						      posToReturn.push("down");
						    }
						          
						    return posToReturn;
						    
						  },
						  
						  startNewRound: function() {
						    // Stop! 
						    cancelAnimationFrame(this.repeater);
						    
						    // Find new spot
						    var newSpot = this.findEmpty();
						            
						    if (newSpot == "nope") {
						      
						      // Absolutely done, start over.
						      
						      // clear canvas
						      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
						      
						      // start over
						      this.init();
						      
						    } else {
						      
						      // Start over from new position
						      this.posX = newSpot[0];
						      this.posY = newSpot[1];

						      // Actually restart      
						      drawLoop();
						      
						    }
						  },
						  
						  oneMovement: function() {
						    
						    this.drawSquare(this.posX, this.posY);
						        
						    var possiblePos = this.checkPossiblePositions();
						      
						    var numPossible = possiblePos.length;
						      
						    if (numPossible == 0) {
						      
						      this.startNewRound();
						      
						    } else {
						      
						      var randomDir = Math.floor(Math.random() * numPossible);
						      
						      if (possiblePos[randomDir] == "left") {
						        this.posX--; 
						      }
						      if (possiblePos[randomDir] == "right") {
						        this.posX++; 
						      }
						      if (possiblePos[randomDir] == "up") {
						        this.posY--; 
						      }
						      if (possiblePos[randomDir] == "down") {
						        this.posY++;
						      }
						      
						    }
						    
						  },
						  
						  findEmpty: function() {
						    
						    for (var x = 0; x < (this.divisions+1); x++) {
						      for (var y = 0; y < (this.divisions+1); y++) {      
						        if (!this.memory[x][y]) {
						           return [x, y]; 
						        }
						      }
						    } 
						    
						    return "nope";
						    
						  }
						 
						}

						// need this loop to make sure canvas sizes right on CodePen
						setTimeout(function() {
						  
						  snake.init();
						  
						}, 10);	  
						
			}
		});
		
		csstricks.slidinglabelView = Marionette.ItemView.extend({
			template : slidinglabelTpl,
			onShow: function(){
				// IE 10 == Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)

				var b = document.documentElement;
				b.setAttribute('data-useragent',  navigator.userAgent);
				b.setAttribute('data-platform', navigator.platform );

				$('#contact-form').slidinglabels({

					/* these are all optional */
			        className    : 'slider', // the class you're wrapping the label & input with -> default = slider
					topPosition  : '5px',  // how far down you want each label to start
					leftPosition : '5px',  // how far left you want each label to start
					axis         : 'x',    // can take 'x' or 'y' for slide direction
					speed        : 'fast'  // can take 'fast', 'slow', or a numeric value

				});
				$('#superLabel').superLabels({
					labelLeft:5,
					labelTop:5
				});
			}
		});
		
		csstricks.hangoutView = Marionette.ItemView.extend({
			template : hangoutTpl,
			onShow: function(){
				
			}
		});
		
		
		csstricks.aspectView = Marionette.ItemView.extend({
			template : aspectTpl,
			onShow: function(){
				
			}
		});
		
		csstricks.tdfacesView = Marionette.ItemView.extend({
			template : tdfacesTpl,
			onShow: function(){
				
			}
		});
		
		csstricks.paddingView = Marionette.ItemView.extend({
			template : paddingTpl,
			className : 'paddingbg',
			onShow: function(){
				$("#padding").on("click", function() {
					  $(".module").toggleClass("see-the-padding");
					});
			}
		});
		
		
		csstricks.svgView = Marionette.ItemView.extend({
			template : _.template('<div id="test"></div>'),
			onShow: function(){
				require(['apps/csstricks/texteffects'], function(draw){
					draw();
				})
			}
		});
		
		csstricks.mainView = new csstricks.MainView;


		csstricks.controller = {
			show : function() {
				App.navigate("csstricks");
				App.mainRegion.show(csstricks.mainView);
			},
			showiphone: function(){
				csstricks.mainView.content.show(new csstricks.iphoneView)
			},
			showsvg: function(){
				csstricks.mainView.content.show(new csstricks.svgView)
			},
			show3dfaces: function(){
				csstricks.mainView.content.show(new csstricks.tdfacesView)
			},
			showpadding: function(){
				csstricks.mainView.content.show(new csstricks.paddingView)
			},
			showaspect: function(){
				csstricks.mainView.content.show(new csstricks.aspectView)
			},
			showhangout: function(){
				csstricks.mainView.content.show(new csstricks.hangoutView)
			},
			showslidinglabel: function(){
				csstricks.mainView.content.show(new csstricks.slidinglabelView)
			},
			showsnake: function(){
				csstricks.mainView.content.show(new csstricks.snakeView)
			},
			showslider: function(){
				csstricks.mainView.content.show(new csstricks.sliderView)
			},
			showswivel: function(){
				csstricks.mainView.content.show(new csstricks.swivelView)
			},
			showflex: function(){
				csstricks.mainView.content.show(new csstricks.flexView)
			},
			showavatar: function(){
				csstricks.mainView.content.show(new csstricks.avatarView)
			},
			showtree: function(){
				csstricks.mainView.content.show(new csstricks.treeView)
			}
		}

		App.on("csstricks:show", function() {
			csstricks.controller.show();
		});

		csstricks.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"csstricks" : "show",
				'csstricks/iphone': 'showiphone',
				'csstricks/svg': 'showsvg',
				'csstricks/3dfaces': 'show3dfaces',
				'csstricks/padding': 'showpadding',
				'csstricks/aspect': 'showaspect',
				'csstricks/hangout': 'showhangout',
				'csstricks/slidinglabel': 'showslidinglabel',
				'csstricks/snake': 'showsnake',
				'csstricks/slider': 'showslider',
				'csstricks/swivel': 'showswivel',
				'csstricks/flex': 'showflex',
				'csstricks/avatar': 'showavatar',
				'csstricks/tree': 'showtree'
			}
		});

		App.addInitializer(function() {
			new csstricks.Router({
				controller : csstricks.controller
			});
		});
	});
	return App.csstricks.controller;
})