define([ 'app',
         'stache!apps/box2d/main',
         'css!apps/box2d/style',
         'Box2D', 'stats', 'jquery.lightbox_me'], function(App, viewTpl) {
	App.module('box2dDemo', function(box2dDemo, App, Backbone, Marionette, $, _) {
		
		var animationHandle = null;
		function basic(){
			 window.requestAnimFrame = (function(){
		          return  window.requestAnimationFrame       || 
		                  window.webkitRequestAnimationFrame || 
		                  window.mozRequestAnimationFrame    || 
		                  window.oRequestAnimationFrame      || 
		                  window.msRequestAnimationFrame     || 
		                  function(/* function */ callback, /* DOMElement */ element){
		                    window.setTimeout(callback, 1000 / 60);
		                  };
		    })();
		    
		    var stats = new Stats();
		    document.body.appendChild(stats.domElement);
		    
		    var canvas = document.getElementById("c");
		    var ctx = canvas.getContext("2d");
		  
		    var world;
		  
		    function init() {
		       var   b2Vec2 = Box2D.Common.Math.b2Vec2
		        , b2BodyDef = Box2D.Dynamics.b2BodyDef
		        , b2Body = Box2D.Dynamics.b2Body
		        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
		        , b2Fixture = Box2D.Dynamics.b2Fixture
		        , b2World = Box2D.Dynamics.b2World
		        , b2MassData = Box2D.Collision.Shapes.b2MassData
		        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
		        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
		        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
		          ;
		     
		       world = new b2World(
		             new b2Vec2(0, 10)    //gravity
		          ,  true                 //allow sleep
		       );
		       
		       var SCALE = 30;
		     
		       var fixDef = new b2FixtureDef;
		       fixDef.density = 1.0;
		       fixDef.friction = 0.5;
		       fixDef.restitution = 0.2;
		     
		       var bodyDef = new b2BodyDef;
		     
		       //create ground
		       bodyDef.type = b2Body.b2_staticBody;
		       
		       // positions the center of the object (not upper left!)
		       bodyDef.position.x = canvas.width / 2 / SCALE;
		       bodyDef.position.y = (canvas.height / SCALE) - 1;
		       
		       fixDef.shape = new b2PolygonShape;
		       
		       // half width, half height. eg actual height here is 1 unit
		       fixDef.shape.SetAsBox((canvas.width / SCALE) / 2, 0.5 / 2);
		       world.CreateBody(bodyDef).CreateFixture(fixDef);
		     
		       //create dynamic circle object
		       bodyDef.type = b2Body.b2_dynamicBody;
		       fixDef.shape = new b2CircleShape(
		          Math.random() + 0.1 //radius
		       );
		       bodyDef.position.x = Math.random() * 25;
		       bodyDef.position.y = Math.random() * 10;
		       world.CreateBody(bodyDef).CreateFixture(fixDef);
		       
		       // create dynamic polygon object
		       bodyDef.type = b2Body.b2_dynamicBody;
		       fixDef.shape = new b2PolygonShape;
		       fixDef.shape.SetAsBox(
		             Math.random() + 0.1 //half width
		          ,  Math.random() + 0.1 //half height
		       );
		       bodyDef.position.x = Math.random() * 25;
		       bodyDef.position.y = Math.random() * 10;
		       world.CreateBody(bodyDef).CreateFixture(fixDef);
		     
		       //setup debug draw
		       var debugDraw = new b2DebugDraw();
		       debugDraw.SetSprite(document.getElementById("c").getContext("2d"));
		       debugDraw.SetDrawScale(SCALE);
		       debugDraw.SetFillAlpha(0.3);
		       debugDraw.SetLineThickness(1.0);
		       debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		       world.SetDebugDraw(debugDraw);
		     
		       // restart
		       setTimeout(init, 3000);
		    }; // init()
		  
		    function update() {
		       world.Step(
		             1 / 60   //frame-rate
		          ,  10       //velocity iterations
		          ,  10       //position iterations
		       );
		       world.DrawDebugData();
		       world.ClearForces();
		     
		       stats.update();
		       requestAnimFrame(update);
		    }; // update()
		  
		    init();
		    requestAnimFrame(update);
		}

		box2dDemo.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions: {
				content : '#box2dWrapper'
			},
			events: {
				'click li a' : 'showLightBox'
			},
			showLightBox: function(e){
				var role = $(e.target).data('role');



				//$('#box2dWrapper').lightbox_me();
				$('#box2dWrapper').css('display', 'block');
				$('#fade').css('display', 'block');
				$('#c').width($('#c').parent().innerWidth());
				$('#c').height($('#c').parent().innerHeight());

				
			}
		});

		box2dDemo.controller = {
			show : function() {
				App.navigate("box2dDemo");
				App.mainRegion.show(new box2dDemo.MainView());
			}
		}

		App.on("box2dDemo:show", function() {
			box2dDemo.controller.show();
		});

		box2dDemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"box2dDemo" : "show"
			}
		});

		App.addInitializer(function() {
			new box2dDemo.Router({
				controller : box2dDemo.controller
			});
		});
	});
	return App.box2dDemo.controller;
})