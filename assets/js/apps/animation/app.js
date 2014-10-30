define([ 'app', 'stache!apps/animation/main', 'stache!apps/animation/jsMovieclip', 'stache!apps/animation/multiple', 'stache!apps/animation/control', 
         'stache!apps/animation/gfx', 
         'stache!apps/animation/rekapi', 
         'stache!apps/animation/ios', 
         'stache!apps/animation/lazylinepainter', 
         'stache!apps/animation/morpheus',
         'stache!apps/animation/flippant',
         'stache!apps/animation/sprite',
         'stache!apps/animation/collision',
         'stache!apps/animation/anima',
         'stache!apps/animation/animo',
         'stache!apps/animation/tweenjs',
         'stache!apps/animation/slidr',
         'shifty',
         'rekapi',
         'morpheus',
         'flippant', 'anima', 'slidr',
         'css!apps/animation/slidr',
         'css!apps/animation/tweenjs',
         'css!apps/animation/anima',
         'css!apps/animation/sprite',
         'css!apps/animation/flippant',
         'css!apps/animation/morpheus',
         'css!apps/animation/rekapi',
         'css!apps/animation/ios',
         'css!apps/animation/style', 
         'less!apps/animation/gfx', 
         'css!apps/animation/jsMovieclip', 
         'jquery.jsMovieclip', 'jsMoviceclip', 'gfx', 'jquery.lazylinepainter','animo','tweenjs', 'easeljs-NEXT'
         
         ], function(App, viewTpl, jsMovieclipTpl, multipleTpl, controlTpl, gfxTpl, 
        		 rekapiTpl, iosTpl, lazylinepainterTpl, morpheusTpl, flippantTpl, spriteTpl,collisionTpl,
        		 animaTpl, animoTpl,tweenjsTpl,slidrTpl,
        		 Tweenable, Rekapi, morpheus, flippant, anima, slidr) {
	App.module('animation', function(animation, App, Backbone, Marionette, $, _) {
		
		console.log(slidr);
		
		var easings = {
				  easeOut: function (t) {
				    return Math.sin(t * Math.PI / 2);
				  }

				  , easeOutStrong: function (t) {
				    return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
				  }

				  , easeIn: function (t) {
				    return t * t;
				  }

				  , easeInStrong: function (t) {
				    return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
				  }

				  , easeOutBounce: function(pos) {
				    if ((pos) < (1/2.75)) {
				      return (7.5625*pos*pos);
				    } else if (pos < (2/2.75)) {
				      return (7.5625*(pos-=(1.5/2.75))*pos + .75);
				    } else if (pos < (2.5/2.75)) {
				      return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
				    } else {
				      return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
				    }
				  }

				  , easeInBack: function(pos){
				    var s = 1.70158;
				    return (pos)*pos*((s+1)*pos - s);
				  }

				  , easeOutBack: function(pos){
				    var s = 1.70158;
				    return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
				  }

				  , bounce: function (t) {
				    if (t < (1 / 2.75)) {
				      return 7.5625 * t * t;
				    }
				    if (t < (2 / 2.75)) {
				      return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
				    }
				    if (t < (2.5 / 2.75)) {
				      return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
				    }
				    return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
				  }

				  , bouncePast: function (pos) {
				    if (pos < (1 / 2.75)) {
				      return (7.5625 * pos * pos);
				    } else if (pos < (2 / 2.75)) {
				      return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
				    } else if (pos < (2.5 / 2.75)) {
				      return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
				    } else {
				      return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
				    }
				  }

				  , swingTo: function(pos) {
				    var s = 1.70158;
				    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
				  }

				  , swingFrom: function (pos) {
				    var s = 1.70158;
				    return pos * pos * ((s + 1) * pos - s);
				  }

				  , elastic: function(pos) {
				    return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
				  }

				  , spring: function(pos) {
				    return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
				  }

				  , blink: function(pos, blinks) {
				    return Math.round(pos*(blinks||5)) % 2;
				  }

				  , pulse: function(pos, pulses) {
				    return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
				  }

				  , wobble: function(pos) {
				    return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
				  }

				  , sinusoidal: function(pos) {
				    return (-Math.cos(pos*Math.PI)/2) + 0.5;
				  }

				  , flicker: function(pos) {
				    var pos = pos + (Math.random()-0.5)/5;
				    return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
				  }

				  , mirror: function(pos) {
				    if (pos < 0.5)
				    return easings.sinusoidal(pos*2);
				    else
				    return easings.sinusoidal(1-(pos-0.5)*2);
				  }

				};
		
		//console.log(Tweenable);
		
		//console.log(Rekapi);
		
		//console.log(morpheus);
		
		//console.log(flippant);
		
		var svgData = { 
				"demo" :
				{ 
					"strokepath" :
					[ 
						{   "path": "M7.603,5.5 c0,0,10.298,24.07,33.517,24.07c23.221,0,33.519-24.07,33.519-24.07s9.142,24.07,33.513,24.07c24.372,0,33.515-24.07,33.515-24.07 s10.858,24.07,33.518,24.07S208.703,5.5,208.703,5.5s9.717,24.07,33.521,24.07c23.801,0,33.518-24.07,33.518-24.07 s13.828,24.07,33.524,24.07c19.698,0,33.524-24.07,33.524-24.07",
							"duration": 1500,
							"strokeColor": '#c07775',
							"strokeWidth": 8 
							},
						{   "path": "M120,139.129 c0,0-8.708-34.233-42.483-34.236c-28.724-0.001-42.493,34.23-42.493,34.23",
							"duration":300
							},
						{   "path": "M313.5,137.138 c0,0-12.209-32.137-39.746-32.138C246.216,104.999,234,137.132,234,137.132",
							"duration":300
							},
						{   "path": "M80.246,193.604 c0,0,21.399,74.387,93.074,74.387c76.026,0,93.095-74.387,93.095-74.387",
							"duration":500
							}
					],  
					"dimensions" : { "width": 349, "height":277 }
				}
			}

		animation.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				content : '#animation-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		animation.slidrView = Marionette.Layout.extend({
			template : slidrTpl,
			onShow: function(){
				slidr.create('slidr-img', {
					  after: function(e) { console.log('in: ' + e.in.slidr); },
					  before: function(e) { console.log('out: ' + e.out.slidr); },
					  breadcrumbs: true,
					  controls: 'corner',
					  direction: 'vertical',
					  fade: false,
					  keyboard: true,
					  overflow: true,
					  pause: false,
					  theme: '#222',
					  timing: { 'cube': '0.5s ease-in' },
					  touch: true,
					  transition: 'cube'
					}).start();
			}
		});
		
		animation.tweenjsView = Marionette.Layout.extend({
			template : tweenjsTpl,
			onShow: function(){
				$('#header').hide();
				function rx(){ return Math.random()*940+10; }
				function ry(){ return Math.random()*380+10; }
				function rc(){return Math.round(Math.random()*0xED+0x12).toString(16); }
				createjs.MotionGuidePlugin.install(createjs.Tween);

				var canvas = document.getElementById("testCanvas");
				var stage = new createjs.Stage(canvas);
				stage.autoClear = true;

				var ball;
				var count = 1000;

				while(count--){
					ball = new createjs.Shape();
					ball.graphics.ss(1,'round','round').s(('#000000')).f("#"+rc()+rc()+rc()).dc(0,0,5).ef().es();
					var path = [rx(),ry(),rx(),ry(),rx(),ry()];
					createjs.Tween.get(ball, {loop:true})
						.to({guide:{path:path, start:0, end:1}}, 5000)
						.wait(Math.random()*4000)
						.to({guide:{path:path, start:1, end:0}}, 5000);
					stage.addChild(ball);
				}

				createjs.Ticker.addEventListener("tick", stage);
			}
		});
		
		animation.animoView = Marionette.Layout.extend({
			template : animoTpl,
			events: {
				'click #magic': 'doMagic'
			},
			doMagic: function(){
				// I made a function that ran through the "fading out" animations, then called a function that handles the "fading in"
				// Fading out
				
				function doMagicIn(){
					// Fading in
					$('#demo-a').animo({animation: "fadeInLeft", duration: 0.5}, function() {
						$('#demo-n').animo({animation: "fadeInUp", duration: 0.5}, function() {
							$('#demo-i').animo({animation: "fadeInDown", duration: 0.5}, function() {
								$('#demo-m').animo({animation: "fadeInLeft", duration: 0.5}, function() {
									$('#demo-o').animo({animation: "fadeInRight", duration: 0.5});
								});
							});
						});
					});
				}
				$('#demo-a').animo({animation: "fadeOutLeft", duration: 0.5, keep: true}, function() {
					$('#demo-n').animo({animation: "fadeOutUp", duration: 0.5, keep: true}, function() {
						$('#demo-i').animo({animation: "fadeOutDown", duration: 0.5, keep: true}, function() {
							$('#demo-m').animo({animation: "fadeOutLeft", duration: 0.5, keep: true}, function() {
								$('#demo-o').animo({animation: "fadeOutRight", duration: 0.5, keep: true}, doMagicIn()); // function to fade them back in
							});
						});
					});
				});
			},
			onShow: function(){

				this.doMagic();

			}
		});
		
		animation.animaView = Marionette.Layout.extend({
			template : animaTpl,
			onShow: function(){
				 var world = anima.world(),
		            item = world.add(document.querySelector('.ball'))

			    item.animate({
			        name: 'bounce',
			        duration: 1100
			    }).infinite()
			}
		});
		
		  function __scene11() {
		        var director = new CAAT.Foundation.Director().initialize(800, 500, 'experiment-canvas');
		        var packedCircleScene = new Circles.PackedCircleScene();
		        packedCircleScene.initDirector(director);

		        __scene10_text(director, packedCircleScene.scene);

		        CAAT.loop(60);
		    }

		    function __scene10_text(director, scene) {
		        var gradient = director.ctx.createLinearGradient(0, 0, 0, 50);
		        gradient.addColorStop(0, 'orange');
		        gradient.addColorStop(0.5, 'red');
		        gradient.addColorStop(1, '#3f00ff');

		        var cc = new CAAT.Foundation.ActorContainer().
		                setBounds(450, 30, 150, 100).
		                enableEvents(false).
		                addBehavior(
		                new CAAT.Behavior.RotateBehavior().
		                        setCycle(true).
		                        setFrameTime(0, 4000).
		                        setValues(-Math.PI / 8, Math.PI / 8, .50, 0).
		                        setInterpolator(
		                        new CAAT.Behavior.Interpolator().createExponentialInOutInterpolator(3, true)
		                )
		        );
		        scene.addChild(cc);

		        var text = new CAAT.Foundation.UI.TextActor().
		                setTextAlign("center").
		                setFont("50px sans-serif").
		                setText("PackedCircle").
		                setTextFillStyle(gradient).
		                setOutline(true).
		                cacheAsBitmap();
		        cc.addChild(text.setLocation(cc.width / 2, 0));

		        var text2 = new CAAT.TextActor().
		                setTextAlign("center").
		                setFont("30px sans-serif").
		                setText("Collision demo").
		                calcTextSize(director).
		                setTextFillStyle(gradient).
		                setOutline(true).
		                cacheAsBitmap();
		        cc.addChild(text2.setLocation(cc.width / 2, 50));
		    }
		
		animation.collisionView = Marionette.Layout.extend({
			template : collisionTpl,
			onShow: function(){
				require(['vendor/CAAT/Core/ModuleManager'], function(){
					  CAAT.ModuleManager.
		                baseURL("assets/js/vendor/CAAT/").
		                setModulePath("CAAT.Core", "Core").
		                setModulePath("CAAT.Math", "Math").
		                setModulePath("CAAT.Behavior", "Behavior").
		                setModulePath("CAAT.Foundation", "Foundation").
		                setModulePath("CAAT.Event", "Event").
		                setModulePath("CAAT.PathUtil", "PathUtil").
		                setModulePath("CAAT.Module", "Modules").
		                setModulePath("CAAT.Module.Preloader", "Modules/Image/Preloader").
		                setModulePath("CAAT.WebGL", "WebGL").

		                setModulePath("Circles", "../../apps/animation").

		            // get modules, and solve their dependencies.
		                bring(
		                [
		                    "CAAT.Foundation.Director",
		                    "CAAT.Foundation.Actor",
		                    "CAAT.Foundation.ActorContainer",
		                    "CAAT.Foundation.UI.TextActor",
		                    "CAAT.Behavior.Interpolator",
		                    "CAAT.Behavior.RotateBehavior",
		                    "CAAT.Behavior.AlphaBehavior",
		                    "CAAT.Behavior.ScaleBehavior",
		                    "CAAT.Module.CircleManager.PackedCircle",
		                    "CAAT.Module.CircleManager.PackedCircleManager",
		                    "Circles.PackedCircleScene"
		                ]).

		            // this function will be firer every time all dependencies have been solved.
		            // if you call again bring, this function could be fired again.
		                onReady(__scene11);
				})
			}
		});
		
		
		function __scene1() {

			CAAT.DEBUG = 1;

			var actor = null;

			CAAT.Foundation.Actor.extend({
				paint : function(director, time) {
					CAAT.Dude.superclass.paint.call(this, director, time);

					if (actor === this) {
						var ctx = director.ctx;
						ctx.strokeStyle = '#aaa';
						ctx.strokeRect(0, 0, this.width, this.height);
					}
				},
				mouseEnter : function(e) {
					CAAT.setCursor("pointer");
				},
				mouseExit : function(e) {
					CAAT.setCursor("default");
				},
				mouseUp : function(e) {
					actor = this;
				}
			}, null, "CAAT.Dude");

			new CAAT.Module.Preloader.Preloader().addElement("dude", "assets/js/apps/animation/dude.png").load(function(images) {
				var director = new CAAT.Foundation.Director().initialize(800, 500, 'experiment-canvas');
				var scene = director.createScene();

				var dw = director.width;
				var dh = director.height;

				var reset = function(spriteImage, time) {
					spriteImage.playAnimation("stand");
				};

				var si = new CAAT.Foundation.SpriteImage().initialize(images[0].image, 21, 7).addAnimation("stand", [ 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144 ], 100).addAnimation("fall", [ 0, 1, 2, 3, 4, 5, 6, 7 ], 100, reset).addAnimation("wall_ud", [ 74, 75, 76, 77, 78, 79, 80, 81 ], 100).addAnimation("wall_lr", [ 82, 83, 84, 85, 86, 87, 88, 89 ], 100).addAnimation("tidy", [ 42, 43, 44, 45, 46, 47, 48, 49, 50 ], 100, reset).addAnimation("die", [ 68, 69, 70, 71, 72, 73 ], 100, reset).addAnimation("jump", [ 95, 94, 93, 92, 91, 90 ], 100, reset).addAnimation("run_b", [ 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122 ], 30).addAnimation("run_f", [ 122, 121, 120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96 ], 30).addAnimation("sad", [ 26, 27, 28, 29, 30, 31, 32, 33 ], 100);

				var actors = [];
				for ( var i = 0; i < 3; i++) {
					for ( var j = 0; j < 3; j++) {
						var a = new CAAT.Dude().setBackgroundImage(si).setLocation(j * si.getWidth(), i * si.getHeight());

						actors.push(a);
						a.playAnimation("fall");
						scene.addChild(a);
						a.mouseUp = function(e) {
							actor = e.source;
						}
					}
				}

				actor = actors[0];

				var keys = [ 0, 0, 0, 0 ];
				var index = 0;

				for ( var animation in si.animationsMap) {
					var ta = new CAAT.Foundation.UI.TextActor().setFont("25px arial").setTextFillStyle('black').setFillStyle("#ddd").setText(animation).setTextAlign("center").setTextBaseline("middle").setBounds(director.width - 60, 30 + index * 35, 100, 30);

					(function(ta, animation) {
						ta.mouseUp = function() {
							actor.playAnimation(animation);
						};
						ta.mouseEnter = function() {
							CAAT.setCursor("pointer");
						}
						ta.mouseExit = function() {
							CAAT.setCursor("default");
						}
					})(ta, animation);

					scene.addChild(ta);
					index++;
				}

				CAAT.registerKeyListener(function kl(keyEvent) {

					if (keyEvent.getKeyCode() === CAAT.Keys.UP) {
						keyEvent.preventDefault();
						keys[2] = (keyEvent.getAction() === 'up') ? 0 : 1;
						if (keys[2]) {
							actor.playAnimation("wall_ud");
						} else {
							actor.playAnimation("stand");
						}
					}
					if (keyEvent.getKeyCode() === CAAT.Keys.DOWN) {
						keyEvent.preventDefault();
						keys[3] = (keyEvent.getAction() === 'up') ? 0 : 1;
						if (keys[3]) {
							actor.playAnimation("wall_ud");
						} else {
							actor.playAnimation("stand");
						}
					}
					if (keyEvent.getKeyCode() === CAAT.Keys.LEFT) {
						keyEvent.preventDefault();
						keys[0] = (keyEvent.getAction() === 'up') ? 0 : 1;
						actor.setImageTransformation(CAAT.Foundation.SpriteImage.TR_FLIP_HORIZONTAL);
						if (keys[0]) {
							actor.playAnimation("run_f");
						} else {
							actor.playAnimation("stand");
						}
					}
					if (keyEvent.getKeyCode() === CAAT.Keys.RIGHT) {
						keyEvent.preventDefault();
						keys[1] = (keyEvent.getAction() === 'up') ? 0 : 1;
						actor.setImageTransformation(CAAT.Foundation.SpriteImage.TR_NONE);
						if (keys[1]) {
							actor.playAnimation("run_f");
						} else {
							actor.playAnimation("stand");
						}
					}

				});

				CAAT.loop(60);
			});
		}
		
		animation.spriteView = Marionette.Layout.extend({
			template : spriteTpl,
			onShow: function(){
				require(['vendor/CAAT/Core/ModuleManager'], function(){
					console.log(CAAT);
					  CAAT.ModuleManager.

	                    debug(true).

	                    baseURL("assets/js/vendor/CAAT/").

	                    setModulePath("CAAT.Core",              "Core").
	                    setModulePath("CAAT.Math",              "Math").
	                    setModulePath("CAAT.Behavior",          "Behavior").
	                    setModulePath("CAAT.Foundation",        "Foundation").
	                    setModulePath("CAAT.Event",             "Event").
	                    setModulePath("CAAT.PathUtil",          "PathUtil").
	                    setModulePath("CAAT.Module",            "Modules").
	                    setModulePath("CAAT.Module.Preloader",  "Modules/Image/Preloader").
	                    setModulePath("CAAT.WebGL",             "WebGL").

	                // get modules, and solve their dependencies.
	                    bring(
	                    [
	                        "CAAT.Foundation.Director",
	                        "CAAT.Foundation.Actor",
	                        "CAAT.Foundation.UI.TextActor",
	                        "CAAT.Foundation.ActorContainer",
	                        "CAAT.Module.Preloader.Preloader"
	                    ]).

	                // this function will be firer every time all dependencies have been solved.
	                // if you call again bring, this function could be fired again.
	                    onReady( __scene1 );
				})
			}
		});
		
		animation.flippantView = Marionette.Layout.extend({
			template : flippantTpl,
			events: {
				'click': 'click'
			},
			click: function(e){
				if (e.target.classList.contains('btnflip')) {
					e.preventDefault();
					var flipper = e.target.parentNode.parentNode;
					var back;
					var input = '<p><input type="text" value="' + flipper.querySelector('h2').innerText + '"></p>';
					var textarea = '<textarea style="width:100%; max-width:32em; height:12em;">' + flipper.querySelector('p').innerText + '</textarea><br><button class="btn">Update</button>'

					if (e.target.classList.contains('card')) {
						back = flippant.flip(flipper, "<p>It's a card!</p>" + input + textarea)
					} else {
						back = flippant.flip(flipper, "<p>It's a modal!</p>" + input + textarea, 'modal')
					}

					back.addEventListener('click', function(e) {
						if (e.target.classList.contains('btn')) {
							flipper.querySelector('h2').innerText = back.querySelector('input').value
							flipper.querySelector('p').innerText = back.querySelector('textarea').value
							$( back).trigger( "close" );
						}
					})
				}
			}
		});
		
		animation.morpheusView = Marionette.Layout.extend({
			template : morpheusTpl,
			events: {
				'click #go-ex1': 'ex1go',
				'click #go-ex3': 'ex3go',
				'click #go-ex2': 'ex2go',
				'click #go-ex4': 'ex4go',
				'click #go-ex5': 'ex5go'
			},
			ex1go: function(){
				$('#go-ex1').attr("disabled","disabled");
				$('#ex1').css('left', 0);
				morpheus($('#ex1').get(0), {
					left : 400,
					complete : function() {
						$('#go-ex1').removeAttr('disabled');
					}
				})
			},
			ex4go: function(){
				$('#go-ex4').attr("disabled","disabled");
					$('#ex4').css('fontSize', '1.2em');
				morpheus($('#ex4').get(0), {
					fontSize : '+=3.1em',
					easing : easings.spring,
					complete : function() {
						$('#go-ex4').removeAttr('disabled');
					}
				})
			},
			ex5go: function(){
				$('#go-ex5').attr("disabled","disabled");
				$('#ex5').css('left', 0);
				morpheus($('#ex5').get(0), {
					duration : 2000,
					easing : easings.easeIn,
					left : 400,
					bezier : [ [ 150, 300 ], [ 300, -300 ] ],
					complete : function() {
						$('#go-ex5').removeAttr('disabled');
					}
				})
			},
			ex3go: function(){
				$('#go-ex3').attr("disabled","disabled");
					$('#ex3').css('backgroundColor', '#f00');
				morpheus($('#ex3').get(0), {
					backgroundColor : '#00f',
					duration : 2000,
					complete : function() {
						$('#go-ex3').removeAttr('disabled');
					}
				})
			},
			ex2go: function(){
				$('#go-ex2').attr("disabled","disabled");
				$('#ex2').css('left', 0);
				$('#ex2').css('backgroundColor', '#f00');
				$('#ex2').css('width', '20px');
				morpheus($('#ex2').get(0), {
					left : 400,
					width : '+=20',
					backgroundColor : '#00f',
					easing : easings.bounce,
					complete : function() {
						$('#go-ex2').removeAttr('disabled');
					}
				})
			}
		});
		
		animation.lazylinepainterView = Marionette.Layout.extend({
			template : lazylinepainterTpl,
			onShow: function(){
				$('#demo').lazylinepainter({
					'svgData' : svgData,
					'strokeWidth':7,  
					'strokeColor':'#dc908e',
					'onComplete' : function(){
						$(this).animate({'marginTop':60},500);
						}	
				}
			) 

			// Paint your Lazy Line, that easy!
			$('#demo').lazylinepainter('paint');
			}
		});
		
		animation.iosView = Marionette.Layout.extend({
			template : iosTpl,
			onShow: function(){
				  function toArray (arrayLike) {
					    return Array.prototype.slice.call(arrayLike);
					  }


					  /**
					   * @param {number} topRange
					   * @return {number}
					   */
					  function randomInt (topRange) {
					    return parseInt(Math.random() * topRange, 10);
					  }

					  /**
					   * @return {string}
					   */
					  function getRandomColor () {
					    return ['rgb('
					        ,randomInt(255), ','
					        ,randomInt(255), ','
					        ,randomInt(255), ')'].join('');
					  }

					  var rekapi = new Rekapi(document.body);
					  var lis = $('ul.icons > li').toArray();

					  lis.forEach(function (li, i) {
					    var durationVariance = Math.random() * 250;
					    var actor = rekapi.addActor({ context: li });
					    actor
					      .keyframe(0, {
					        transform: 'translateZ(1000px) rotateY(0deg)'
					        ,background: 'rgb(0,0,0)'
					        ,opacity: 0
					      }).keyframe(1000 + durationVariance, {
					        transform: 'translateZ(0px) rotateY(0deg)'
					        ,opacity: 1
					      }, 'bouncePast')
					      .wait(1500)
					      .keyframe(2500, {
					        background: getRandomColor()
					      }, 'easeOutCubic')
					      .wait(3250)
					      .keyframe(4000, {
					        transform: 'translateZ(0px) rotateY(' + (i === 5 ? 720 : 0) + 'deg)'
					        ,opacity: 1
					      }, 'easeOutCubic')
					      .wait(4500)
					      .keyframe(4950 + (25 * i), {
					        transform: 'translateZ(1000px) rotateY(' + (i === 5 ? 720 : 0) + 'deg)'
					        ,opacity: 0
					      }, 'swingFrom');
					  });

					  rekapi.play();
			}
		});
		
		animation.rekapiView = Marionette.Layout.extend({
			template : rekapiTpl,
			onShow: function(){
				  function makeBubble () {
				      return new Rekapi.Actor({
				        'render': function (canvas_context, state) {
				          canvas_context.beginPath();
				          canvas_context.arc(
				            state.x || 0,
				            state.y || 0,
				            Math.abs(state.radius || 50),
				            0,
				            Math.PI*2,
				            true);
				          canvas_context.closePath();

				          var rad = Math.abs(state.radius)
				          ,startX = state.x - (rad * .2)
				          ,startY = state.y - (rad * .2)
				          ,startRad = rad * .3
				          ,endX = state.x
				          ,endY = state.y
				          ,endRad = rad * 2
				          ,grad = canvas_context.createRadialGradient(startX, startY,
				              startRad, endX, endY, endRad);

				          var bgColor = Tweenable.interpolate({color: state.color},
				              {color: 'rgb(0,0,0)'}, 0.3, 'linear').color;

				          grad.addColorStop(0, state.color);
				          grad.addColorStop(1, bgColor);
				          canvas_context.fillStyle = grad;
				          canvas_context.fill();
				        }
				      });
				    }

				    function getBubbleX () {
				      return Math.random() * rekapi.renderer.width();
				    }

				    function getBubbleY () {
				      return Math.random() * rekapi.renderer.height();
				    }

				    function getSize () {
				      return 7 + (Math.random() * 25);
				    }

				    function getColor () {
				      return'rgb('
				        + parseInt(Math.random() * 255, 10) + ','
				        + parseInt(Math.random() * 255, 10) + ','
				        + parseInt(Math.random() * 255, 10) + ')';
				    }

				    function getRandomEasing () {
				      var keys = ['bouncePast', 'easeInOutBack', 'swingFromTo']

				      return keys[parseInt(Math.random() * keys.length, 10)];
				    }

				    function generateRandomFrame (actor, time) {
				      actor.keyframe(time += 2250, {
				        'x': getBubbleX()
				        ,'y': getBubbleY()
				        ,'radius': getSize()
				      }, {
				        'x': getRandomEasing()
				        ,'y': getRandomEasing()
				        ,'radius': getRandomEasing()
				      }).wait(time += 1000);

				      // TODO:  The fact that this returns an integer makes no
				      // sense, clean this up.
				      return time;
				    }

				    function generateKeyframes (bubbles) {
				      var i, j
				          ,time = 0;

				      for (i = 0; i < 30; i++) {
				        time = 0;
				        bubbles[i] = makeBubble();
				        rekapi.addActor(bubbles[i]);

				        bubbles[i].keyframe(time, {
				          'x': rekapi.renderer.width() / 2
				          ,'y': rekapi.renderer.height() + 50
				          ,'radius': 0
				          ,'color': getColor()
				        }, {
				          'x': getRandomEasing()
				          ,'y': getRandomEasing()
				          ,'radius': getRandomEasing()
				        });

				        for (j = 0; j < 3; j++) {
				          time = generateRandomFrame(bubbles[i], time);
				        }

				        bubbles[i].copyKeyframe(time += 1500, 0);
				      }
				    }

				    function mungeKeyframes (bubbles) {
				      _.each(bubbles, function (bubble) {
				        var trackNames = bubble.getTrackNames();

				        _.each(trackNames, function (trackName) {
				          var i
				              ,keyProp
				              ,newMillisecond
				              ,randomNumber
				              ,track = bubble.getPropertiesInTrack(trackName)
				              ,trackLength = track.length;

				          for (i = 1; i < trackLength - 1; i++) {
				            keyProp = bubble.getKeyframeProperty(trackName, track[i].millisecond);
				            randomNumber = (Math.random() * 1000) - 50;
				            newMillisecond = keyProp.millisecond + randomNumber;
				            bubble.modifyKeyframeProperty(trackName, track[i].millisecond, {
				              'millisecond': newMillisecond
				            });
				          }
				        });
				      });
				    }

				    function generateSequence() {
				      _.each(bubbles, function (bubble) {
				        bubble.removeAllKeyframes();
				        rekapi.removeActor(bubble)
				      });

				      bubbles = [];
				      generateKeyframes(bubbles);
				      mungeKeyframes(bubbles);
				      rekapi.play(1);
				    }

				    var context = document.querySelector('#bubble').getContext('2d')
				        ,rekapi = new Rekapi(context)
				        ,bubbles = [];

				    rekapi.renderer.height(500);
				    rekapi.renderer.width(500);

				    rekapi.on('animationComplete', generateSequence)

				    rekapi.renderer.setOrderFunction(function (actor) {
				      return actor.get().radius;
				    });

				    generateSequence();
			}
		});

		animation.multipleView = Marionette.ItemView.extend({
			template : multipleTpl,
			onShow : function() {
				var wrapper = $('.wrapper').get(0);
				var mcs = new JSMovieclip(wrapper.getElementsByTagName('li'), {
					width : 103,
					direction : 'h',
					frames_number : 17,
					framerate : 24
				}).play(true);

				document.body.onclick = function() {
					mcs.toggle(true)
				}
				
				this.movie = mcs;
			},
			onClose: function(){
				this.movie.stop();
			}
		})

		animation.gfxView = Marionette.ItemView.extend({
			template : gfxTpl,
			onShow : function() {
				
				$('#animation-container').on('click', 'div.panelView', function(e){
					$(e.target).remove()
					$('#panelsView').show()
				})

				$(".col div").click(function() {
					var view;
					$("#panelsView").hide();
					view = $("<div />").addClass("panelView").appendTo("#animation-container");
					view.css({
						background : $(this).css('backgroundColor'),
						height: '800px'
					});
					view.queueNext(function() {
						return view.transform({
							rotateY : "-40deg",
							translateZ : "-1000px",
							scale : ".2",
							opacity : "0.6"
						});
					});
					view.gfx({
						rotateY : "0deg",
						translateZ : "0px",
						scale : "1",
						opacity : "1"
					});
				});

				var header = $("#panelsView header");
				header.queueNext(function() {
					return header.transform({
						opacity : "0.1",
						translate3d : "150px,0,0"
					});
				});
				header.gfx({
					opacity : "1",
					translate3d : "0,0,0"
				}, {
					duration : "600"
				});

				$(".sections .col").transform({
					translate3d : "150px,0,0"
				});
				$(".sections .col").each(function() {
					var element;
					element = $(this);
					$(".sections").delay(100).queueNext(function() {
						element.gfx({
							translate3d : "0,0,0",
							opacity : "1"
						});
					});
				});

			}

		})

		animation.controlView = Marionette.ItemView.extend({
			template : controlTpl,
			onShow : function() {

				var mc, btn, eventStop = null;
				// stop callback
				eventStop = function() {
					document.getElementById('frame').value = mc.currentFrame();
					btn.gotoAndStop(1);
				};

				// btn movieclip
				btn = new JSMovieclip(document.getElementById('toggle'), {
					width : 50,
					frames_number : 2,
					direction : 'h'
				}).gotoAndStop(2);

				// animation movieclip
				mc = new JSMovieclip(document.getElementById('noe'), {
					width : 160,
					frames_number : 100,
					framerate : 25,
					direction : 'h',
					stopCallback : eventStop
				}).play(true);

				// event handler
				document.getElementById('invert').onchange = function() {
					mc.changeWay(this.checked ? -1 : 1, true);
				}
				document.getElementById('boucle').onchange = function() {
					mc.loop = this.checked;
				}
				document.getElementById('frame').onblur = function() {
					mc.gotoAndStop(this.value || 0);
				}
				document.getElementById('toggle').onclick = function() {
					mc.toggle(mc.loop);
					mc.playing && btn.gotoAndStop(2);
				}
			}
		})

		animation.jsMovieclipView = Marionette.ItemView.extend({
			template : jsMovieclipTpl,

			onShow : function() {
				var time = 0, timeNext = 0, eventStop = function() { // stop
																		// callback
					$('#squirrel').stop();
					if (mc.currentFrame() <= 18) {
						mc.loopBetween(18, 24).play();
						var date = new Date();
						time = date.getTime();
					}
				};

				$('#squirrel').JSMovieclip({
					width : 333,
					direction : 'h',
					frames_number : 26,
					framerate : 26,
					stopCallback : eventStop
				});

				var mc = $('#squirrel').data('JSMovieclip');
				mc.loopBetween(1, 17).play(true);

				$('#squirrel').hover(function() {
					mc.loop = false;
				}, function() {
					mc.loopBetween(1, 17).play(true)
					var le = window.innerWidth + 70;
					anime(timeNext - time, le);
				});

				loop();

				function loop() {
					// $('#squirrel').css('left', -350);
					var le = window.innerWidth + 70;
					anime(le * 15, le);
				}

				function anime(t, left) {
					var date = new Date();
					timeNext = date.getTime() + t;
					$('#squirrel').animate({
						'left' : left
					}, t, 'linear', loop);
				}
			}
		});

		animation.mainView = new animation.MainView();

		animation.controller = {
			show : function() {
				App.navigate("animation");
				App.mainRegion.show(animation.mainView);
			},
			showMovieclip : function() {
				animation.mainView.content.show(new animation.jsMovieclipView())
			},
			showMultiple : function() {
				animation.m, animation.mainView.content.show(new animation.multipleView())
			},
			showControl : function() {
				animation.mainView.content.show(new animation.controlView())
			},
			showGfx : function() {
				animation.mainView.content.show(new animation.gfxView())
			},
			showrekapi: function(){
				animation.mainView.content.show(new animation.rekapiView())
			},
			showios: function(){
				animation.mainView.content.show(new animation.iosView())
			},
			showlazylinepainter: function(){
				animation.mainView.content.show(new animation.lazylinepainterView())
			},
			showmorpheus: function(){
				animation.mainView.content.show(new animation.morpheusView())
			},
			showflippant: function(){
				animation.mainView.content.show(new animation.flippantView())
			},
			showSprite: function(){
				animation.mainView.content.show(new animation.spriteView())
			},
			showCollision: function(){
				animation.mainView.content.show(new animation.collisionView())
			},
			showAnima: function(){
				animation.mainView.content.show(new animation.animaView())
			},
			showAnimo: function(){
				animation.mainView.content.show(new animation.animoView())
			},
			showTweenjs: function(){
				animation.mainView.content.show(new animation.tweenjsView())
			},
			showSlidr: function(){
				animation.mainView.content.show(new animation.slidrView())
			}
		}

		App.on("animation:show", function() {
			animation.controller.show();
		});

		animation.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"animation" : "show",
				'animation/jsMovieclip' : 'showMovieclip',
				'animation/multiple' : 'showMultiple',
				'animation/control' : 'showControl',
				'animation/gfx' : 'showGfx',
				'animation/rekapi' : 'showrekapi',
				'animation/ios' : 'showios',
				'animation/lazylinepainter' : 'showlazylinepainter',
				'animation/morpheus' : 'showmorpheus',
				'animation/flippant' : 'showflippant',
				'animation/sprite' : 'showSprite',
				'animation/collision' : 'showCollision',
				'animation/anima' : 'showAnima',
				'animation/animo' : 'showAnimo',
				'animation/tweenjs' : 'showTweenjs',
			}
		});

		App.addInitializer(function() {
			new animation.Router({
				controller : animation.controller
			});
		});
	});
	return App.animation.controller;
})