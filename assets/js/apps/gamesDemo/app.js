define([ 'app', 'stache!apps/gamesDemo/main', 'stache!apps/gamesDemo/phaser', 'stache!apps/gamesDemo/breakout', 
         'stache!apps/gamesDemo/matter', 'stache!apps/gamesDemo/easystar',
         'stache!apps/gamesDemo/keydown',
         'keydrown',
         'css!apps/gamesDemo/style', 'css!apps/gamesDemo/easystar',
         'vendor/phaser', 'enchant', 'apps/gamesDemo/enchant/ui.enchant',
         'apps/gamesDemo/enchant/nineleap.enchant' ], function(App, viewTpl, 
        		 phaserTpl, breakoutTpl, matterTpl, easystarTpl, keydownTpl,
        		 kd) {
	App.module('gamesDemo', function(gamesDemo, App, Backbone, Marionette, $, _) {
		
		console.log(kd);
		enchant();
		enchant.Sound.enabledInMobileSafari = true;
		
		function loadScripts(scripts, complete) {
		    var loadScript = function( src ) {
		        var xmlhttp, next;
		        if (window.XMLHttpRequest)  {
		            xmlhttp = new XMLHttpRequest();
		        } else {
		            try {
		                 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		            } catch(e) {
		                return;
		            }
		        }
		        xmlhttp.onreadystatechange = function() {
		            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		                eval(xmlhttp.responseText);
		                next = scripts.shift();
		                if ( next ) {
		                    loadScript(next);
		                } else if ( typeof complete == 'function' ) {
		                    complete();
		                }
		            }
		        }
		        xmlhttp.open("GET", src , true);
		        xmlhttp.send();
		    };

		    loadScript( scripts.shift() );
		}

		gamesDemo.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				content : '#gamesDemo-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		gamesDemo.breakoutView = Marionette.Layout.extend({
			template : breakoutTpl,
			onShow: function(){
				require([ 'apps/gamesDemo/breakout' ], function(breakout){
					breakout()
				})

			}
		});
		
		gamesDemo.keydownView = Marionette.Layout.extend({
			template : keydownTpl,
			onShow: function(){
				kd.B.down(function () {
					  console.log('The "B" key is being held down!');
					});

					kd.B.up(function () {
					  console.log('The "B" key was released!');
					});

					kd.SPACE.press(function () {
					  console.log('The space bar was pressed!');
					});

					if (kd.LEFT.isDown()) {
					  console.log('The left arrow key is being held down!')
					}

			}
		});
		
		gamesDemo.matterView = Marionette.Layout.extend({
			template : matterTpl,
			onClose: function(){
				$('.dg.main').remove();
			},
			onShow: function(){
				require([ 'apps/gamesDemo/matter' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.easystarView = Marionette.Layout.extend({
			template : easystarTpl,
			onShow: function(){
				require([ 'apps/gamesDemo/easystar' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.melonView = Marionette.ItemView.extend({
			template: _.template('<div id="screen"></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/melon' ], function(run){
					run()
				})

			}
		});
		
		
		gamesDemo.cosmoView = Marionette.ItemView.extend({
			template: _.template('<div id="screen"></div>'),
			onShow: function(){
				require([ 'vendor/lychee/core' ], function(){
					require(['vendor/lychee/Builder'], function(){
						require(['vendor/lychee/Preloader'], function(){
							require(['vendor/lychee/platform/html/bootstrap'], function(){
								require(['vendor/lychee/platform/html/bootstrap.progress', 
        'css!vendor/lychee/platform/html/bootstrap.progress'], function(){
									require(['apps/gamesDemo/cosmo/Main', 'css!apps/gamesDemo/cosmo/Main'], function(){
										require(['apps/gamesDemo/cosmoDemo'], function(init){
											init()
										})
									})
								})
							})
						})
					})
				})

			}
		});
		
		gamesDemo.pixiView = Marionette.ItemView.extend({
			template: _.template('<div id="pixi-container"></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/pixi' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.flashView = Marionette.ItemView.extend({
			template: _.template('<div style="position: relative;"><div class="wrapper"></div><canvas id="particlescanvas" style="pointer-events:none;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/flashDemo' ], function(run){
					run()
				})
			},
			onClose: function(){
				$('body').off('touchmove.flashDemo mousemove.flashDemo');
			}
		});
		
		gamesDemo.spiderwebView = Marionette.ItemView.extend({
			template: _.template('<div><canvas id="spiderweb" style="width: 800px; height: 500px;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/spiderweb' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.spinningView = Marionette.ItemView.extend({
			template: _.template('<div><canvas id="spinning-shapes-canvas" style="width: 800px; height: 500px;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/spinning' ], function(SpinningShapesGame){
					new SpinningShapesGame();
				})

			}
		});
		
		gamesDemo.babylonView = Marionette.ItemView.extend({
			template: _.template('<div id="rootDiv"><canvas id="renderCanvas" style="width: 800px; height: 500px;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/babylon' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.enchantView = Marionette.ItemView.extend({
			template: _.template('<div id="enchant-stage" style="width: 1600px; height: 500px;"></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/enchant/run' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.babylonBasicView = Marionette.ItemView.extend({
			template: _.template('<div id="rootDiv"><canvas id="canvas" style="width: 800px; height: 500px;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/babylonBasic' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.babylonMaterialsView = Marionette.ItemView.extend({
			template: _.template('<div id="rootDiv"><canvas id="canvas" style="width: 800px; height: 500px;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/Materials' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.emitterView = Marionette.ItemView.extend({
			template: _.template('<div id="rootDiv"><canvas id="canvas" style="width: 800px; height: 500px;"></canvas></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/emitter' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.pongView = Marionette.ItemView.extend({
			template: _.template('<div id="pong-container"></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/pong' ], function(run){
					run()
				})

			}
		});
		
		gamesDemo.physicsView = Marionette.ItemView.extend({
			template: _.template('<div id="viewport"></div>'),
			onShow: function(){
				require([ 'apps/gamesDemo/physicsShowCase' ], function(run){
					run()
				})

			}
		});

		gamesDemo.phaserView = Marionette.ItemView.extend({
			template : phaserTpl,
			events: {
				'click #02_-_click_on_an_image': 'clickImage'
			},
			clickImage: function(){
				require([ 'apps/gamesDemo/basics' ], function(basics){
					basics()
				})
			},
			onShow : function() {

				require([ 'apps/gamesDemo/phaser-examples' ], function(loadExamples){
					loadExamples();
				})

			}
		});

		gamesDemo.mainView = new gamesDemo.MainView();

		gamesDemo.controller = {
			show : function() {
				App.navigate("gamesDemo");
				App.mainRegion.show(gamesDemo.mainView);
			},
			showPhaser : function() {
				gamesDemo.mainView.content.show(new gamesDemo.phaserView)
			},
			showbreakout: function(){
				gamesDemo.mainView.content.show(new gamesDemo.breakoutView)
			},
			showpixi: function(){
				gamesDemo.mainView.content.show(new gamesDemo.pixiView)
			},
			showpong: function(){
				gamesDemo.mainView.content.show(new gamesDemo.pongView)
			},
			showphysics: function(){
				gamesDemo.mainView.content.show(new gamesDemo.physicsView)
			},
			showspiderweb: function(){
				gamesDemo.mainView.content.show(new gamesDemo.spiderwebView)
			},
			showmelon: function(){
				gamesDemo.mainView.content.show(new gamesDemo.melonView)
			},
			showbabylon: function(){
				gamesDemo.mainView.content.show(new gamesDemo.babylonView)
			},
			showBabylonBasic: function(){
				gamesDemo.mainView.content.show(new gamesDemo.babylonBasicView)
			},
			showBabylonMaterials: function(){
				gamesDemo.mainView.content.show(new gamesDemo.babylonMaterialsView)
			},
			showEnchant: function(){
				gamesDemo.mainView.content.show(new gamesDemo.enchantView)
			},
			showmatter: function(){
				gamesDemo.mainView.content.show(new gamesDemo.matterView)
			},
			showEasystar: function(){
				gamesDemo.mainView.content.show(new gamesDemo.easystarView)
			},
			showspinning: function(){
				gamesDemo.mainView.content.show(new gamesDemo.spinningView)
			},
			showemitter: function(){
				gamesDemo.mainView.content.show(new gamesDemo.emitterView)
			},
			showkeydown: function(){
				gamesDemo.mainView.content.show(new gamesDemo.keydownView)
			},
			showflash: function(){
				gamesDemo.mainView.content.show(new gamesDemo.flashView)
			},
			showcosmo: function(){
				gamesDemo.mainView.content.show(new gamesDemo.cosmoView)
			}
		}

		App.on("gamesDemo:show", function() {
			gamesDemo.controller.show();
		});

		gamesDemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"gamesDemo" : "show",
				"gamesDemo/phaser" : "showPhaser",
				"gamesDemo/breakout" : "showbreakout",
				"gamesDemo/pixi" : "showpixi",
				"gamesDemo/pong" : "showpong",
				"gamesDemo/physics" : "showphysics",
				"gamesDemo/spiderweb" : "showspiderweb",
				"gamesDemo/melon" : "showmelon",
				"gamesDemo/babylon" : "showbabylon",
				"gamesDemo/babylonBasic" : "showBabylonBasic",
				"gamesDemo/babylonMaterials" : "showBabylonMaterials",
				"gamesDemo/enchant" : "showEnchant",
				"gamesDemo/matter/mixed" : "showmatter",
				"gamesDemo/easystar" : "showEasystar",
				"gamesDemo/spinning" : "showspinning",
				"gamesDemo/emitter" : "showemitter",
				"gamesDemo/keydown" : "showkeydown",
				"gamesDemo/flash" : "showflash",
				"gamesDemo/cosmo" : "showcosmo",
			}
		});

		App.addInitializer(function() {
			new gamesDemo.Router({
				controller : gamesDemo.controller
			});
		});
	});
	return App.gamesDemo.controller;
})