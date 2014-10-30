define([ 'app',
         'stache!apps/graphics/main',
         'stache!apps/graphics/ascii',
         'stache!apps/graphics/buffergeometry',
         'stache!apps/graphics/magnific-popup',
         'stache!apps/graphics/shine',
         'stache!apps/graphics/fabric',
         'stache!apps/graphics/solar',
         'stache!apps/graphics/drawing',
         'stache!apps/graphics/particles',
         'stache!apps/graphics/snap',
         'stache!apps/graphics/mask',
         'stache!apps/graphics/runners',
         'stache!apps/graphics/bitmap',
         'stache!apps/graphics/paper',
         'stache!apps/graphics/colorbox',
         'stache!apps/graphics/kinetic',
         'stache!apps/graphics/flexslider',
         'stache!apps/graphics/pie',
         'stache!apps/graphics/polar-clock',
         'stache!apps/graphics/helvetica',
         'stache!apps/graphics/swiper',
         'stache!apps/graphics/fancybox',
         'stache!apps/graphics/two',
         'stache!apps/graphics/three',
         'stache!apps/graphics/panorama',
         'stache!apps/graphics/bounce',
          'shine', 'snap.svg', 'paper', 'raphael', 
         'css!apps/graphics/style',
         'css!apps/graphics/swiper',
         'css!apps/graphics/colorbox',
         'three', 'jquery.magnific-popup', 'fabric', 'createjs', 'easeljs',  'movieclip',
         'jquery.colorbox', 'kinetic', 'jquery.flexslider', 'swiper', 'jquery.fancybox', 'two', 'three'], function(App, viewTpl, asciiTpl, buffergeometryTpl, magnificpopupTpl, shineTpl, fabricTpl,
        		 solarTpl, drawingTpl,particlesTpl, snapTpl, maskTpl, runnersTpl, bitmapTpl, paperTpl, colorboxTpl, kineticTpl, flexsliderTpl, pieTpl, clockTpl,
        		 helveticaTpl, swiperTpl, fancyboxTpl, twoTpl,threeTpl,panoramaTpl,bounceTpl,
        		 shinejs, Snap, paper, Raphael) {
	App.module('graphics', function(graphics, App, Backbone, Marionette, $, _) {
		Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
		    var paper = this,
		        rad = Math.PI / 180,
		        chart = this.set();
		    function sector(cx, cy, r, startAngle, endAngle, params) {
		        var x1 = cx + r * Math.cos(-startAngle * rad),
		            x2 = cx + r * Math.cos(-endAngle * rad),
		            y1 = cy + r * Math.sin(-startAngle * rad),
		            y2 = cy + r * Math.sin(-endAngle * rad);
		        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
		    }
		    var angle = 0,
		        total = 0,
		        start = 0,
		        process = function (j) {
		            var value = values[j],
		                angleplus = 360 * value / total,
		                popangle = angle + (angleplus / 2),
		                color = Raphael.hsb(start, .75, 1),
		                ms = 500,
		                delta = 30,
		                bcolor = Raphael.hsb(start, 1, 1),
		                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
		                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
		            p.mouseover(function () {
		                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
		                txt.stop().animate({opacity: 1}, ms, "elastic");
		            }).mouseout(function () {
		                p.stop().animate({transform: ""}, ms, "elastic");
		                txt.stop().animate({opacity: 0}, ms);
		            });
		            angle += angleplus;
		            chart.push(p);
		            chart.push(txt);
		            start += .1;
		        };
		    for (var i = 0, ii = values.length; i < ii; i++) {
		        total += values[i];
		    }
		    for (i = 0; i < ii; i++) {
		        process(i);
		    }
		    return chart;
		};
		graphics.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions:{
				content: '#graphics-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		graphics.bounceView = Marionette.Layout.extend({
			template : bounceTpl,
			onShow: function(){
				require(['apps/graphics/cannon.demo', 'vendor/utils/Detector', 'vendor/utils/Stats',
				         'vendor/utils/smoothie', 'vendor/utils/dat.gui'], function(){
					var demo = new CANNON.Demo({
						container: 'bounce'
					});
				})
			}
		});
		
		graphics.panoramaView = Marionette.Layout.extend({
			template : panoramaTpl,
			onShow: function(){
				var camera, scene, renderer;

				var texture_placeholder,
				isUserInteracting = false,
				onMouseDownMouseX = 0, onMouseDownMouseY = 0,
				lon = 90, onMouseDownLon = 0,
				lat = 0, onMouseDownLat = 0,
				phi = 0, theta = 0,
				target = new THREE.Vector3();

				init();
				animate();

				function init() {

					var container, mesh;

					container = document.getElementById( 'panorama' );

					camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

					scene = new THREE.Scene();

					texture_placeholder = document.createElement( 'canvas' );
					texture_placeholder.width = 128;
					texture_placeholder.height = 128;

					var context = texture_placeholder.getContext( '2d' );
					context.fillStyle = 'rgb( 200, 200, 200 )';
					context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );

					var materials = [

						loadTexture( 'assets/js/apps/graphics/textures/cube/skybox/px.jpg' ), // right
						loadTexture( 'assets/js/apps/graphics/textures/cube/skybox/nx.jpg' ), // left
						loadTexture( 'assets/js/apps/graphics/textures/cube/skybox/py.jpg' ), // top
						loadTexture( 'assets/js/apps/graphics/textures/cube/skybox/ny.jpg' ), // bottom
						loadTexture( 'assets/js/apps/graphics/textures/cube/skybox/pz.jpg' ), // back
						loadTexture( 'assets/js/apps/graphics/textures/cube/skybox/nz.jpg' )  // front

					];

					mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
					mesh.scale.x = - 1;
					scene.add( mesh );

					renderer = new THREE.CanvasRenderer();
					renderer.setSize( window.innerWidth, window.innerHeight );

					container.appendChild( renderer.domElement );

					document.addEventListener( 'mousedown', onDocumentMouseDown, false );
					document.addEventListener( 'mousemove', onDocumentMouseMove, false );
					document.addEventListener( 'mouseup', onDocumentMouseUp, false );
					document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

					document.addEventListener( 'touchstart', onDocumentTouchStart, false );
					document.addEventListener( 'touchmove', onDocumentTouchMove, false );

					//

					window.addEventListener( 'resize', onWindowResize, false );

				}

				function onWindowResize() {

					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();

					renderer.setSize( window.innerWidth, window.innerHeight );

				}

				function loadTexture( path ) {

					var texture = new THREE.Texture( texture_placeholder );
					var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

					var image = new Image();
					image.onload = function () {

						texture.image = this;
						texture.needsUpdate = true;

					};
					image.src = path;

					return material;

				}

				function onDocumentMouseDown( event ) {

					event.preventDefault();

					isUserInteracting = true;

					onPointerDownPointerX = event.clientX;
					onPointerDownPointerY = event.clientY;

					onPointerDownLon = lon;
					onPointerDownLat = lat;

				}

				function onDocumentMouseMove( event ) {

					if ( isUserInteracting === true ) {

						lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
						lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

					}

				}

				function onDocumentMouseUp( event ) {

					isUserInteracting = false;

				}

				function onDocumentMouseWheel( event ) {

					camera.fov -= event.wheelDeltaY * 0.05;
					camera.updateProjectionMatrix();

				}


				function onDocumentTouchStart( event ) {

					if ( event.touches.length == 1 ) {

						event.preventDefault();

						onPointerDownPointerX = event.touches[ 0 ].pageX;
						onPointerDownPointerY = event.touches[ 0 ].pageY;

						onPointerDownLon = lon;
						onPointerDownLat = lat;

					}

				}

				function onDocumentTouchMove( event ) {

					if ( event.touches.length == 1 ) {

						event.preventDefault();

						lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
						lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

					}

				}

				function animate() {

					requestAnimationFrame( animate );
					update();

				}

				function update() {

					if ( isUserInteracting === false ) {

						lon += 0.1;

					}

					lat = Math.max( - 85, Math.min( 85, lat ) );
					phi = THREE.Math.degToRad( 90 - lat );
					theta = THREE.Math.degToRad( lon );

					target.x = 500 * Math.sin( phi ) * Math.cos( theta );
					target.y = 500 * Math.cos( phi );
					target.z = 500 * Math.sin( phi ) * Math.sin( theta );

					camera.lookAt( target );

					renderer.render( scene, camera );

				}
			}
		});
		
		graphics.threeView = Marionette.Layout.extend({
			template : threeTpl,
			onShow: function(){
				var container = $('#cube').get(0);
				console.log(container);
				
				var camera, scene, renderer;
				var mesh;

				init();
				animate();

				function init() {

					renderer = new THREE.WebGLRenderer();
					renderer.setSize( window.innerWidth, window.innerHeight );
					container.appendChild( renderer.domElement );

					//

					camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
					camera.position.z = 400;

					scene = new THREE.Scene();

					var geometry = new THREE.BoxGeometry( 200, 200, 200 );

					var texture = THREE.ImageUtils.loadTexture( 'assets/js/apps/graphics/textures/crate.gif' );
					texture.anisotropy = renderer.getMaxAnisotropy();

					var material = new THREE.MeshBasicMaterial( { map: texture } );

					mesh = new THREE.Mesh( geometry, material );
					scene.add( mesh );

					//

					window.addEventListener( 'resize', onWindowResize, false );

				}

				function onWindowResize() {

					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();

					renderer.setSize( window.innerWidth, window.innerHeight );

				}

				function animate() {

					requestAnimationFrame( animate );

					mesh.rotation.x += 0.005;
					mesh.rotation.y += 0.01;

					renderer.render( scene, camera );

				}
			}
		});
		
		graphics.fancyboxView = Marionette.Layout.extend({
			template : fancyboxTpl,
			onShow: function(){
				$('.fancybox').fancybox();
			}
		});
		
		graphics.twoView = Marionette.Layout.extend({
			template : twoTpl,
			onShow: function(){
				var elem = document.getElementById('two-container');
				var two = new Two({ width: 285, height: 200 }).appendTo(elem);

				var circle = two.makeCircle(-70, 0, 50);
				var rect = two.makeRectangle(70, 0, 100, 100);
				circle.fill = '#FF8000';
				rect.fill = 'rgba(0, 200, 255, 0.75)';

				var group = two.makeGroup(circle, rect);
				group.translation.set(two.width / 2, two.height / 2);
				group.scale = 0;
				group.noStroke();

				// Bind a function to scale and rotate the group
				// to the animation loop.
				two.bind('update', function(frameCount) {
				  // This code is called everytime two.update() is called.
				  // Effectively 60 times per second.
				  if (group.scale > 0.9999) {
				    group.scale = group.rotation = 0;
				  }
				  var t = (1 - group.scale) * 0.125;
				  group.scale += t;
				  group.rotation += t * 4 * Math.PI;
				}).play();  // Finally, start the animation loop
			}
		});
		
		graphics.swiperView = Marionette.Layout.extend({
			template : swiperTpl,
			onShow: function(){
				 var mySwiper = new Swiper('.swiper-container',{
					    pagination: '.pagination',
					    loop:true,
					    grabCursor: true,
					    paginationClickable: true
					  })
					  $('.arrow-left').on('click', function(e){
					    e.preventDefault()
					    mySwiper.swipePrev()
					  })
					  $('.arrow-right').on('click', function(e){
					    e.preventDefault()
					    mySwiper.swipeNext()
					  })
			}
		});
		
		graphics.keycatcherView = Marionette.Layout.extend({
			template : helveticaTpl,
			onShow: function(){
				require(['apps/graphics/helvetica'], function(){
					 var r = Raphael("keycatcher-holder", 800, 600), pos = [0, 0];
		                var letter = r.path("M0,0L0,0z").attr({fill: "#fff", stroke: "#fff", "fill-opacity": .3, "stroke-width": 1, "stroke-linecap": "round", translation: "100 100"});
		                var kc = document.getElementById("keycatcher");
		                kc.onkeyup = function (e) {
		                    var key = this.value.substring(this.value.length - 1);
		                    this.value = "";
		                    if (key && key in helvetica) {
		                        letter.animate({path: helvetica[key]}, 200);
		                    }
		                    return false;
		                };
		                kc.onblur = function () {
		                    kc.focus();
		                };
		                kc.focus();
				})

			}
		});
		
		graphics.clockView = Marionette.Layout.extend({
			template : clockTpl,
			onShow: function(){
				 var r = Raphael("time-holder", 600, 600),
                 R = 200,
                 init = true,
                 param = {stroke: "#fff", "stroke-width": 30},
                 hash = document.location.hash,
                 marksAttr = {fill: hash || "#444", stroke: "none"},
                 html = [
                     document.getElementById("h"),
                     document.getElementById("m"),
                     document.getElementById("s"),
                     document.getElementById("d"),
                     document.getElementById("mnth"),
                     document.getElementById("ampm")
                 ];
             // Custom Attribute
             r.customAttributes.arc = function (value, total, R) {
                 var alpha = 360 / total * value,
                     a = (90 - alpha) * Math.PI / 180,
                     x = 300 + R * Math.cos(a),
                     y = 300 - R * Math.sin(a),
                     color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)"),
                     path;
                 if (total == value) {
                     path = [["M", 300, 300 - R], ["A", R, R, 0, 1, 1, 299.99, 300 - R]];
                 } else {
                     path = [["M", 300, 300 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
                 }
                 return {path: path, stroke: color};
             };

             drawMarks(R, 60);
             var sec = r.path().attr(param).attr({arc: [0, 60, R]});
             R -= 40;
             drawMarks(R, 60);
             var min = r.path().attr(param).attr({arc: [0, 60, R]});
             R -= 40;
             drawMarks(R, 12);
             var hor = r.path().attr(param).attr({arc: [0, 12, R]});
             R -= 40;
             drawMarks(R, 31);
             var day = r.path().attr(param).attr({arc: [0, 31, R]});
             R -= 40;
             drawMarks(R, 12);
             var mon = r.path().attr(param).attr({arc: [0, 12, R]});
             var pm = r.circle(300, 300, 16).attr({stroke: "none", fill: Raphael.hsb2rgb(15 / 200, 1, .75).hex});
             html[5].style.color = Raphael.hsb2rgb(15 / 200, 1, .75).hex;

             function updateVal(value, total, R, hand, id) {
                 if (total == 31) { // month
                     var d = new Date;
                     d.setDate(1);
                     d.setMonth(d.getMonth() + 1);
                     d.setDate(-1);
                     total = d.getDate();
                 }
                 var color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)");
                 if (init) {
                     hand.animate({arc: [value, total, R]}, 900, ">");
                 } else {
                     if (!value || value == total) {
                         value = total;
                         hand.animate({arc: [value, total, R]}, 750, "bounce", function () {
                             hand.attr({arc: [0, total, R]});
                         });
                     } else {
                         hand.animate({arc: [value, total, R]}, 750, "elastic");
                     }
                 }
                 html[id].innerHTML = (value < 10 ? "0" : "") + value;
                 html[id].style.color = Raphael.getRGB(color).hex;
             }

             function drawMarks(R, total) {
                 if (total == 31) { // month
                     var d = new Date;
                     d.setDate(1);
                     d.setMonth(d.getMonth() + 1);
                     d.setDate(-1);
                     total = d.getDate();
                 }
                 var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
                     out = r.set();
                 for (var value = 0; value < total; value++) {
                     var alpha = 360 / total * value,
                         a = (90 - alpha) * Math.PI / 180,
                         x = 300 + R * Math.cos(a),
                         y = 300 - R * Math.sin(a);
                     out.push(r.circle(x, y, 2).attr(marksAttr));
                 }
                 return out;
             }

             (function () {
                 var d = new Date,
                     am = (d.getHours() < 12),
                     h = d.getHours() % 12 || 12;
                 updateVal(d.getSeconds(), 60, 200, sec, 2);
                 updateVal(d.getMinutes(), 60, 160, min, 1);
                 updateVal(h, 12, 120, hor, 0);
                 updateVal(d.getDate(), 31, 80, day, 3);
                 updateVal(d.getMonth() + 1, 12, 40, mon, 4);
                 pm[(am ? "hide" : "show")]();
                 html[5].innerHTML = am ? "AM" : "PM";
                 setTimeout(arguments.callee, 1000);
                 init = false;
             })();
			}
		});
		
		graphics.pieView = Marionette.Layout.extend({
			template : pieTpl,
			onShow: function(){
				var that = this;
				 var values = [],
			        labels = [];
			    that.$("tr").each(function () {
			        values.push(parseInt($("td", this).text(), 10));
			        labels.push($("th", this).text());
			    });
			    that.$("table").hide();
			    Raphael("holder", 700, 700).pieChart(350, 350, 200, values, labels, "#fff");
			}
		});
		
		graphics.flexsliderView = Marionette.Layout.extend({
			template : flexsliderTpl,
			onShow: function(){
				 $('.flexslider').flexslider({
		                animation: "slide",
		                animationLoop: false,
		                itemWidth: 210,
		                itemMargin: 5,
		                minItems: 2,
		                maxItems: 4
		              });
			}
		});
		
		graphics.kineticView = Marionette.Layout.extend({
			template : kineticTpl,
			onShow: function(){
				var stage = new Kinetic.Stage({
			        container: 'kcontainer',
			        width: 578,
			        height: 200
			      });

			      var layer = new Kinetic.Layer();

			      var rect = new Kinetic.Rect({
			        x: 239,
			        y: 75,
			        width: 100,
			        height: 50,
			        fill: 'green',
			        stroke: 'black',
			        strokeWidth: 4
			      });
			      
			      var circle = new Kinetic.Circle({
			          x: stage.getWidth() / 2,
			          y: stage.getHeight() / 2,
			          radius: 70,
			          fill: 'red',
			          stroke: 'black',
			          strokeWidth: 4
			        });

			        // add the shape to the layer
			        layer.add(circle);

			      // add the shape to the layer
			      layer.add(rect);
			      
			      var wedge = new Kinetic.Wedge({
			          x: stage.width() / 3,
			          y: stage.height() / 3,
			          radius: 70,
			          angle: 60,
			          fill: 'red',
			          stroke: 'black',
			          strokeWidth: 4,
			          rotation: -120
			        });

			        // add the shape to the layer
			        layer.add(wedge);
			        
			        var redLine = new Kinetic.Line({
			            points: [73, 70, 340, 23, 450, 60, 500, 20],
			            stroke: 'red',
			            strokeWidth: 15,
			            lineCap: 'round',
			            lineJoin: 'round'
			          });

			          // dashed line
			          var greenLine = new Kinetic.Line({
			            points: [73, 70, 340, 23, 450, 60, 500, 20],
			            stroke: 'green',
			            strokeWidth: 2,
			            lineJoin: 'round',
			            /*
			             * line segments with a length of 33px
			             * with a gap of 10px
			             */
			            dash: [33, 10]
			          });

			          // complex dashed and dotted line
			          var blueLine = new Kinetic.Line({
			            points: [73, 70, 340, 23, 450, 60, 500, 20],
			            stroke: 'blue',
			            strokeWidth: 10,
			            lineCap: 'round',
			            lineJoin: 'round',
			            /*
			             * line segments with a length of 29px with a gap
			             * of 20px followed by a line segment of 0.001px (a dot)
			             * followed by a gap of 20px
			             */
			            dash: [29, 20, 0.001, 20]
			          });

			          /*
			           * since each line has the same point array, we can
			           * adjust the position of each one using the
			           * move() method
			           */
			          redLine.move({x:0,y:5});
			          greenLine.move({x:0,y:55});
			          blueLine.move({x:0,y:105});

			          layer.add(redLine);
			          layer.add(greenLine);
			          layer.add(blueLine);

			      // add the layer to the stage
			      stage.add(layer);
			}
		});
		
		graphics.colorboxView = Marionette.Layout.extend({
			template : colorboxTpl,
			onShow: function(){
				//Examples of how to assign the Colorbox event to elements
				$(".group1").colorbox({rel:'group1'});
				$(".group2").colorbox({rel:'group2', transition:"fade"});
				$(".group3").colorbox({rel:'group3', transition:"none", width:"75%", height:"75%"});
				$(".group4").colorbox({rel:'group4', slideshow:true});
				$(".ajax").colorbox();
				$(".youtube").colorbox({iframe:true, innerWidth:640, innerHeight:390});
				$(".vimeo").colorbox({iframe:true, innerWidth:500, innerHeight:409});
				$(".iframe").colorbox({iframe:true, width:"80%", height:"80%"});
				$(".inline").colorbox({inline:true, width:"50%"});
				$(".callbacks").colorbox({
					onOpen:function(){ alert('onOpen: colorbox is about to open'); },
					onLoad:function(){ alert('onLoad: colorbox has started to load the targeted content'); },
					onComplete:function(){ alert('onComplete: colorbox has displayed the loaded content'); },
					onCleanup:function(){ alert('onCleanup: colorbox has begun the close process'); },
					onClosed:function(){ alert('onClosed: colorbox has completely closed'); }
				});

				$('.non-retina').colorbox({rel:'group5', transition:'none'})
				$('.retina').colorbox({rel:'group5', transition:'none', retinaImage:true, retinaUrl:true});
				
				//Example of preserving a JavaScript event for inline calls.
				$("#click").click(function(){ 
					$('#click').css({"background-color":"#f00", "color":"#fff", "cursor":"inherit"}).text("Open this window again and this message will still be here.");
					return false;
				});
			}
		});
		
		graphics.paperView = Marionette.Layout.extend({
			template : paperTpl,
			onShow: function(){
				// Get a reference to the canvas object
				var canvas = document.getElementById('animated-star');
				// Create an empty project and a view for the canvas:
				paper.setup(canvas);
				// Create a Paper.js Path to draw a line into it:
				var path = new paper.Path();
				// Give the stroke a color
				path.strokeColor = 'black';
				var start = new paper.Point(100, 100);
				// Move to start and draw a line from there
				path.moveTo(start);
				// Note that the plus operator on Point objects does not work
				// in JavaScript. Instead, we need to call the add() function:
				path.lineTo(start.add([ 200, -50 ]));
				
				// Draw the view now:
				paper.view.draw();
				
				
			}
		});
		
		graphics.bitmapView = Marionette.Layout.extend({
			template : bitmapTpl,
			onShow: function(){
				   var canvas;
			        var stage;
			        var shape;
			        var circleRadius = 30;
			        var rings = 30;

			        function init() {

			            // create a new stage and point it at our canvas:
			            canvas = document.getElementById("testCanvas");
			            stage = new createjs.Stage(canvas);

			            // create a large number of slightly complex vector shapes, and give them random positions and velocities:

			            var colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

			            for(var i = 0; i < 200; i++) {
			                shape = new createjs.Shape();
			                for(var j = rings; j > 0; j--) {
			                    shape.graphics.beginFill(colors[Math.random() * colors.length | 0]).drawCircle(0, 0, circleRadius * j / rings);
			                }
			                shape.x = Math.random() * canvas.width;
			                shape.y = Math.random() * canvas.height;
			                shape.velX = Math.random() * 10 - 5;
			                shape.velY = Math.random() * 10 - 5;

			                // turn snapToPixel on for all shapes - it's set to false by default on Shape.
			                // it won't do anything until stage.snapToPixelEnabled is set to true.
			                shape.snapToPixel = true;

			                stage.addChild(shape);
			            }

			            // add a text object to output the current FPS:
			            fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#FFF");
			            stage.addChild(fpsLabel);
			            fpsLabel.x = 10;
			            fpsLabel.y = 20;

			            // start the tick and point it at the window so we can do some work before updating the stage:
			            createjs.Ticker.addEventListener("tick", tick);
			            createjs.Ticker.setFPS(50);
			            
			            
			        }

			        function tick(event) {
			            var w = canvas.width;
			            var h = canvas.height;
			            var l = stage.getNumChildren() - 1;

			            // iterate through all the children and move them according to their velocity:
			            for(var i = 1; i < l; i++) {
			                var shape = stage.getChildAt(i);
			                shape.x = (shape.x + shape.velX + w) % w;
			                shape.y = (shape.y + shape.velY + h) % h;
			            }

			            fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

			            // draw the updates to stage:
			            stage.update(event);
			        }

			        function toggleCache(value) {
			            // iterate all the children except the fpsLabel, and set up the cache:
			            var l = stage.getNumChildren() - 1;

			            for(var i = 0; i < l; i++) {
			                var shape = stage.getChildAt(i);
			                if (value) {
			                    shape.cache(-circleRadius, -circleRadius, circleRadius * 2, circleRadius * 2);
			                } else {
			                    shape.uncache();
			                }
			            }
			        }
			        
			        init();
			        $('#toggleCache').click(function(){
			        	toggleCache($(this).is(':checked') )
			        })
			}
		});
		
		graphics.runnersView = Marionette.Layout.extend({
			template : runnersTpl,
			onShow: function(){
				require(['vendor/easeljs/display/SpriteContainer', 'vendor/easeljs/display/SpriteStage', 
				         'vendor/easeljs/events/MouseEvent',
				         'vendor/easeljs/filters/Filter', 
				         'vendor/easeljs/ui/ButtonHelper',
				         'vendor/easeljs/ui/Touch', 
				         'vendor/easeljs/utils/SpriteSheetUtils',
				         'vendor/easeljs/utils/SpriteSheetBuilder',
				         'vendor/easeljs/display/BitmapText',
				         'vendor/createjs/events/EventDispatcher'
				         ], function(){
					var stage;
					var runnerSS, textSS, sparkleSS;
					var runnerContainer, sparkleContainer, hitArea;
					var sparklePool, maxRunners=300, maxSparkles = 1000;
					
					function init() {
						if (location.search.match(/c2d/i)) {
							// force it to use Context2D if c2d appears in the query string: ex. Runners.html?c2d
							stage = new createjs.Stage("testCanvas");
						} else {
							stage = new createjs.SpriteStage("testCanvas");
						}
						
						// reduce visual complexity if WebGL is not supported:
						if (!stage.isWebGL) {
							maxRunners = maxRunners/5|0;
							maxSparkles = maxSparkles/5|0;
						}
						sparklePool = []; // simple object pool
						
						var queue = new createjs.LoadQueue();
						queue.on("complete", handleLoad, this);
						queue.loadManifest([
							{id: "runner", src: "assets/js/apps/graphics/runningGrantSmall.png"},
							{id: "sparkle", src: "assets/js/apps/graphics/sparkle_21x23.png"},
							{id: "font", src: "assets/js/apps/graphics/BitmapFont.png"},
							{id: "hill", src: "assets/js/apps/graphics/parallaxHill1.png"}
							], true);
					}
					
					function handleLoad(evt) {
						setupSpriteSheets(evt.target);
						setupUI(evt.target);
						createjs.Ticker.timingMode = createjs.Ticker.RAF;
						createjs.Ticker.on("tick", tick, this);
					}
					
					function tick(evt) {
						// runners:
						var l = runnerContainer.getNumChildren();
						if (l < maxRunners && Math.random() < 0.3) { addRunner(); l++; }
						for (var i=0; i<l; i++) {
							var runner = runnerContainer.getChildAt(i);
							runner.x += runner.velX;
							if (runner.x > 1000) {
								resetRunner(runner);
							}
						}
						
						l = sparkleContainer.getNumChildren();
						for (var i=0; i<l; i++) {
							var sparkle = sparkleContainer.getChildAt(i);
							sparkle.x += sparkle.velX;
							sparkle.y += sparkle.velY;
							sparkle.velX *= 0.99;
							sparkle.velY = (sparkle.velY + 0.5)*0.99;
							if (sparkle.y > 400 || sparkle.x < 0 || sparkle.x > 960) {
								sparkleContainer.removeChildAt(i);
								sparklePool.push(sparkle);
								i--; l--;
							}
						}
						
						stage.update(evt);
					}
					
					function addRunner() {
						var runner = new createjs.Sprite(runnerSS, "run");
						runner.on("mousedown", explodeRunner, this);
						runner.hitArea = hitArea;
						resetRunner(runner);
					}
					
					function explodeRunner(evt) {
						var runner = evt.target;
						addSparkles(runner.x, runner.y-40*runner.scaleY, runner.velX, -8);
						resetRunner(runner);
					}
					
					function resetRunner(runner) {
						runner.x = -50;
						runner.y = Math.random()*100+300|0;
						
						runnerContainer.removeChild(runner);
						var l = runnerContainer.getNumChildren();
						
						// very simple depth sorting. Not exact, but good enough for this example.
						for (var i=0; i<l; i++) {
							if (runner.y <= runnerContainer.getChildAt(i).y) { runnerContainer.addChildAt(runner, i); break; }
						}
						if (i==l) { runnerContainer.addChild(runner); }
						
						var size = Math.random()*Math.random()*Math.random();
						runner.velX = 6-size*4;
						runner.framerate = runner.velX*8;
						runner.scaleX = runner.scaleY = size*2+1.5;
					}
					
					function addSparkles(x, y, velX, velY) {
						for (var i=0; i<maxSparkles; i++) {
							var sparkle = sparklePool.length ? sparklePool.pop() : new createjs.Sprite(sparkleSS);
							sparkle.gotoAndPlay(Math.random()*sparkleSS.getNumFrames());
							var sc = Math.random()+1;
							sparkle.setTransform(x, y, sc, sc, Math.random()*360);
							var r = Math.random()*Math.PI*2;
							var v = Math.random()*15;
							sparkle.velX = velX + Math.cos(r)*v;
							sparkle.velY = velY + Math.sin(r)*v;
							sparkleContainer.addChild(sparkle);
						}
					}
					
					
					function setupUI(queue) {
						// background hill - just to demonstrate that bitmaps can be added to a SpriteStage:
						var hill1 = new createjs.Bitmap(queue.getResult("hill"));
						hill1.setTransform(345,110, 3,3);
						var hill2 = hill1.clone();
						hill2.x -= 600;
						
						// SpriteContainers for runners and sparkles.
						// Each SpriteContainer specifies a SpriteSheet that all its descendants must share:
						runnerContainer = new createjs.SpriteContainer(runnerSS);
						sparkleContainer = new createjs.SpriteContainer(sparkleSS);
						
						// Bitmap Text header.
						// Again, the children must all share the SpriteSheet specified by the container.
						var textContainer = new createjs.SpriteContainer(textSS);
						var topText = new createjs.BitmapText("CLICK THE RUNNERS!", textSS);
						topText.setTransform(10,10);
						var bottomText = new createjs.BitmapText("THEY WILL EXPLODE!!", textSS);
						bottomText.setTransform(400, 350);
						
						textContainer.addChild(topText);
						stage.addChild(hill1, hill2, runnerContainer, bottomText, topText, sparkleContainer);
						
						// we can use Shape for hitArea, because mouse interaction doesn't use WebGL:
						hitArea = new createjs.Shape();
						hitArea.graphics.beginFill("#FFF").drawRect(-30,-70,60,80);
					}
					
					function setupSpriteSheets(queue) {
						runnerSS = 	new createjs.SpriteSheet({
							framerate: 30,
							images: [queue.getResult("runner")],
							frames: { width: 51, height: 70, regX: 25, regY: 70, numFrames: 15},
							animations: {"run": [0, 14]},
						});
						
						sparkleSS = new createjs.SpriteSheet({
							framerate: 60,
							images: [queue.getResult("sparkle")],
			                frames:{width:21, height:23, regX:10, regY:11}
			            });
			            
			            textSS = new createjs.SpriteSheet({
			            	images: [queue.getResult("font")],
							frames:[
								[155, 2, 25, 41, 0, -10, -3],
								[72, 2, 28, 43, 0, -8, -1],
								[599, 2, 28, 38, 0, -8, -4],
								[41, 2, 27, 44, 0, -8, -1],
								[728, 2, 32, 38, 0, -6, -4],
								[184, 2, 35, 41, 0, -4, -2],
								[409, 2, 30, 39, 0, -7, -3],
								[443, 2, 29, 39, 0, -7, -3],
								[901, 2, 13, 35, 0, -8, -5],
								[698, 2, 26, 38, 0, -9, -4],
								[666, 2, 28, 38, 0, -8, -4],
								[764, 2, 23, 38, 0, -10, -4],
								[828, 2, 37, 36, 0, -3, -5],
								[567, 2, 28, 38, 0, -8, -4],
								[519, 2, 44, 38, 0, 1, -4],
								[869, 2, 28, 36, 0, -8, -5],
								[476, 2, 39, 38, 0, -2, -4],
								[371, 2, 34, 39, 0, -5, -3],
								[631, 2, 31, 38, 0, -6, -4],
								[289, 2, 39, 40, 0, -2, -3],
								[918, 2, 31, 32, 0, -6, -7],
								[791, 2, 33, 37, 0, -5, -4],
								[2, 2, 35, 46, 0, -4, 1],
								[253, 2, 32, 40, 0, -6, -3],
								[104, 2, 32, 43, 0, -6, -1],
								[332, 2, 35, 39, 0, -5, -4],
								[953, 2, 9, 16, 0, -17, -29],
								[140, 2, 11, 41, 0, -16, -1],
								[223, 2, 26, 41, 0, -7, -1],
								[966, 2, 9, 10, 0, -17, -31]
							],
							animations:{
								"A":0, "B":1, "C":2, "D":3, "E":4, "F":5, "G":6, "H":7, "I":8, "J":9, "K":10, "L":11, "M":12, "N":13, "O":14, "P":15, "Q":16, "R":17, "S":18, "T":19, "U":20, "V":21, "W":22, "X":23, "Y":24, "Z":25, ",":26, "!":27, "?":28, ".":29
							}
						});
					}
					
					init();
				})

			}
		});
		
		graphics.maskView = Marionette.Layout.extend({
			template : maskTpl,
			onShow: function(){
				function handleImageLoad() {
			        document.getElementById("loader").className = "";

					//find canvas and load images, wait for last image to load
					var canvas = document.getElementById("testCanvas");

					// create a new stage and point it at our canvas:
					stage = new createjs.Stage(canvas);
					
					// masks can only be shapes.
					star = new createjs.Shape();
					// the mask's position will be relative to the parent of its target:
					star.x = img.width/2;
					star.y = img.height/2;
					// only the drawPolyStar call is needed for the mask to work:
					star.graphics.beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,img.height/2-15,5,0.6).closePath();

					var bg = new createjs.Bitmap(img);
					// blur and desaturate the background image:
					bg.filters = [new createjs.BlurFilter(2,2,2), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0,0,-100,0))];
					bg.cache(0,0,img.width,img.height);
					stage.addChild(bg);
					
					var bmp = new createjs.Bitmap(img);
					stage.addChild(bmp);
					bmp.mask = star;
					
					// note that the shape can be used in the display list as well if you'd like, or
					// we can reuse the Graphics instance in another shape if we'd like to transform it differently.
					stage.addChild(star);

					createjs.Ticker.addEventListener("tick", tick);
				}
				
				function tick(event) {
					star.rotation += 5; 
					star.scaleX = star.scaleY = 1.5+Math.sin(angle)*3;
					stage.update(event);
					angle+=0.025;
				}
				
				 if (window.top != window) {
			            document.getElementById("header").style.display = "none";
			        }
			        document.getElementById("loader").className = "loader";

					//wait for the image to load
					img = new Image();
					img.onload = handleImageLoad;
					img.src = "assets/js/apps/graphics/photo-hires.jpg";
					angle = 0;
			}
		});
		
		graphics.snapView = Marionette.Layout.extend({
			template : snapTpl,
			onShow: function(){
				   var g = Snap();
		            g.attr({
		                viewBox: [0, 0, 800, 600]
		            });
		            
		            Snap.load("assets/js/apps/graphics/map.svg", function (f) {
		                function getShift(dot) {
		                    return "t" + (400 - dot.x) + "," + (300 - dot.y);
		                }
		                var gr = f.select("g"),
		                    wrd = f.select("#world").attr({fill: "#fff"}),
		                    syd = f.select("#sydney").attr({fill: "red"}),
		                    msk = f.select("#san_francisco").attr({fill: "red"}),
		                    pth = f.select("#flight"),
		                    pln = f.select("#plane"),
		                    top = g.g();
		                top.attr({
		                    mask: g.rect(100, 0, 600, 600).attr({
		                        fill: "r(.5,.5,.25)#fff-#000"
		                    })
		                });
		                top.add(gr);
		                var click = top.text(410, 310, "click!").attr({
		                    font: "20px Source Sans Pro, sans-serif",
		                    fill: "#fff"
		                });
		                pth.attr({
		                    display: "none"
		                });
		                pln = gr.g(pln, pln.clone());
		                pln.attr({
		                    display: "none"
		                });
		                pln[0].attr({
		                    stroke: "#fff",
		                    strokeWidth: 2
		                });
		                gr.attr({
		                    transform: getShift({
		                        x: syd.attr("cx"),
		                        y: syd.attr("cy")
		                    })
		                });
		                var flight = gr.path().attr({
		                    fill: "none",
		                    stroke: "red",
		                    strokeWidth: 3,
		                    strokeDasharray: "5 3"
		                }).insertBefore(pln);
		                window.onclick = function () {
		                    pln.attr({
		                        display: ""
		                    });
		                    click.attr({
		                        display: "none"
		                    });
		                    var flag,
		                        len = pth.getTotalLength();
		                    Snap.animate(0, len, function (l) {
		                        // Safari bug workaround: forcing redraw
		                        g.attr({width: 100 + (flag = !flag ? 1e-5 : 0) + "%"});
		                        //
		                        var dot = pth.getPointAtLength(l);
		                        flight.attr({
		                            d: pth.getSubpath(0, l)
		                        });
		                        pln.attr({
		                            transform: "t" + [dot.x, dot.y] +
		                                       "r" + (dot.alpha - 90)
		                        });
		                        gr.attr({
		                            transform: getShift(dot)
		                        });
		                    }, 10000);
		                };
		            });
			}
		});
		
		graphics.particlesView = Marionette.Layout.extend({
			template : particlesTpl,
			onShow: function(){
				 var total = 1000,
				    blobs = new Array(total),
				    myfps = 60,
				    updateTime = 1000 / myfps,
				    mouse_pos = { x: 0, y: 0 },
				    canvas = this.__canvas = new fabric.Canvas('c', {
				      renderOnAddRemove: false,
				      selection: false
				    }),
				    maxx = canvas.width,
				    maxy = canvas.height,
				    msg, startTime, prevTime, ms, frames;

				  canvas.setBackgroundImage('assets/js/apps/graphics/bkg.jpg');
				  fabric.Image.fromURL('assets/js/apps/graphics/blob.png', blobLoaded);

				  canvas.on('mouse:move', function(options) {
				    mouse_pos = canvas.getPointer(options.e);
				  });

				  function blobLoaded(img) {
				    for (var i = 0; i < total; i++) {
				      var img = new fabric.Image(img.getElement(), {
				        left: Math.random() * maxx,
				        top: Math.random() * maxy,
				        selectable: false
				      });
				      img.vx = 0;
				      img.vy = 0;
				      canvas.add(img);
				      blobs[i] = img;
				    }

				    msg = new fabric.Text('FPS: 0/' + myfps, {
				      fontFamily: 'Arial',
				      fontSize: 12,
				      fill: 'white',
				      fontWeight: 'bold',
				      left: 50,
				      top: 35,
				      selectable: false
				    });
				    canvas.add(msg);

				    frames = 0;
				    startTime = Date.now(), prevTime = startTime;
				    animate();
				  }

				  function animate() {
				    for (var i = 0; i < total; i++) {
				      var blob = blobs[i];
				      var dx = blob.left - mouse_pos.x;
				      var dy = blob.top - mouse_pos.y;
				      var vx = blob.vx;
				      var vy = blob.vy;

				      if (dx * dx + dy * dy <= 10000) {
				        vx += dx * 0.01;
				        vy += dy * 0.01;
				      }
				      vx *= 0.95;
				      vy *= 0.95;

				      vx += Math.random() - 0.5;
				      vy += Math.random() - 0.5;

				      var x = blob.left += vx;
				      var y = blob.top += vy;

				      if (x < 0 || x > maxx || y < 0 || y > maxy) {
				        var r = Math.atan2(y - maxy / 2, x - maxx / 2);
				        vx = -Math.cos(r);
				        vy = -Math.sin(r);
				      }

				      blob.vx = vx;
				      blob.vy = vy;
				    }

				    var time = Date.now();
				    frames++;

				    if ( time > prevTime + 1000 ) {
				      fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				      prevTime = time;
				      frames = 0;

				      msg.setText("FPS: " + fps + "/" + myfps);
				    }

				    fabric.util.requestAnimFrame(animate, canvas.getElement());
				    canvas.renderAll();
				}
			}
		});
		
		graphics.drawingView = Marionette.Layout.extend({
			template : drawingTpl,
			onShow: function(){
				var $ = function(id){return document.getElementById(id)};
				 var canvas = this.__canvas = new fabric.Canvas('c', {
					    isDrawingMode: true
					  });

					  fabric.Object.prototype.transparentCorners = false;

					  var drawingModeEl = $('drawing-mode'),
					      drawingOptionsEl = $('drawing-mode-options'),
					      drawingColorEl = $('drawing-color'),
					      drawingShadowColorEl = $('drawing-shadow-color'),
					      drawingLineWidthEl = $('drawing-line-width'),
					      drawingShadowWidth = $('drawing-shadow-width'),
					      drawingShadowOffset = $('drawing-shadow-offset'),
					      clearEl = $('clear-canvas');

					  clearEl.onclick = function() { canvas.clear() };

					  drawingModeEl.onclick = function() {
					    canvas.isDrawingMode = !canvas.isDrawingMode;
					    if (canvas.isDrawingMode) {
					      drawingModeEl.innerHTML = 'Cancel drawing mode';
					      drawingOptionsEl.style.display = '';
					    }
					    else {
					      drawingModeEl.innerHTML = 'Enter drawing mode';
					      drawingOptionsEl.style.display = 'none';
					    }
					  };

					  if (fabric.PatternBrush) {
					    var vLinePatternBrush = new fabric.PatternBrush(canvas);
					    vLinePatternBrush.getPatternSrc = function() {

					      var patternCanvas = fabric.document.createElement('canvas');
					      patternCanvas.width = patternCanvas.height = 10;
					      var ctx = patternCanvas.getContext('2d');

					      ctx.strokeStyle = this.color;
					      ctx.lineWidth = 5;
					      ctx.beginPath();
					      ctx.moveTo(0, 5);
					      ctx.lineTo(10, 5);
					      ctx.closePath();
					      ctx.stroke();

					      return patternCanvas;
					    };

					    var hLinePatternBrush = new fabric.PatternBrush(canvas);
					    hLinePatternBrush.getPatternSrc = function() {

					      var patternCanvas = fabric.document.createElement('canvas');
					      patternCanvas.width = patternCanvas.height = 10;
					      var ctx = patternCanvas.getContext('2d');

					      ctx.strokeStyle = this.color;
					      ctx.lineWidth = 5;
					      ctx.beginPath();
					      ctx.moveTo(5, 0);
					      ctx.lineTo(5, 10);
					      ctx.closePath();
					      ctx.stroke();

					      return patternCanvas;
					    };

					    var squarePatternBrush = new fabric.PatternBrush(canvas);
					    squarePatternBrush.getPatternSrc = function() {

					      var squareWidth = 10, squareDistance = 2;

					      var patternCanvas = fabric.document.createElement('canvas');
					      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
					      var ctx = patternCanvas.getContext('2d');

					      ctx.fillStyle = this.color;
					      ctx.fillRect(0, 0, squareWidth, squareWidth);

					      return patternCanvas;
					    };

					    var diamondPatternBrush = new fabric.PatternBrush(canvas);
					    diamondPatternBrush.getPatternSrc = function() {

					      var squareWidth = 10, squareDistance = 5;
					      var patternCanvas = fabric.document.createElement('canvas');
					      var rect = new fabric.Rect({
					        width: squareWidth,
					        height: squareWidth,
					        angle: 45,
					        fill: this.color
					      });

					      var canvasWidth = rect.getBoundingRectWidth();

					      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
					      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

					      var ctx = patternCanvas.getContext('2d');
					      rect.render(ctx);

					      return patternCanvas;
					    };

					    var img = new Image();
					    img.src = 'assets/js/apps/graphics/honey_im_subtle.png';

					    var texturePatternBrush = new fabric.PatternBrush(canvas);
					    texturePatternBrush.source = img;
					  }

					  $('drawing-mode-selector').onchange = function() {

					    if (this.value === 'hline') {
					      canvas.freeDrawingBrush = vLinePatternBrush;
					    }
					    else if (this.value === 'vline') {
					      canvas.freeDrawingBrush = hLinePatternBrush;
					    }
					    else if (this.value === 'square') {
					      canvas.freeDrawingBrush = squarePatternBrush;
					    }
					    else if (this.value === 'diamond') {
					      canvas.freeDrawingBrush = diamondPatternBrush;
					    }
					    else if (this.value === 'texture') {
					      canvas.freeDrawingBrush = texturePatternBrush;
					    }
					    else {
					      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
					    }

					    if (canvas.freeDrawingBrush) {
					      canvas.freeDrawingBrush.color = drawingColorEl.value;
					      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
					      canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
					    }
					  };

					  drawingColorEl.onchange = function() {
					    canvas.freeDrawingBrush.color = this.value;
					  };
					  drawingShadowColorEl.onchange = function() {
					    canvas.freeDrawingBrush.shadowColor = this.value;
					  };
					  drawingLineWidthEl.onchange = function() {
					    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
					    this.previousSibling.innerHTML = this.value;
					  };
					  drawingShadowWidth.onchange = function() {
					    canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
					    this.previousSibling.innerHTML = this.value;
					  };
					  drawingShadowOffset.onchange = function() {
					    canvas.freeDrawingBrush.shadowOffsetX =
					    canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
					    this.previousSibling.innerHTML = this.value;
					  };

					  if (canvas.freeDrawingBrush) {
					    canvas.freeDrawingBrush.color = drawingColorEl.value;
					    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
					    canvas.freeDrawingBrush.shadowBlur = 0;
					  }
			}
		});
		
		graphics.solarView = Marionette.Layout.extend({
			template : solarTpl,
			onShow: function(){
				fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

				  var canvas = this.__canvas = new fabric.Canvas('c', {
				    hoverCursor: 'pointer',
				    selection: false,
				    perPixelTargetFind: true,
				    targetFindTolerance: 5
				  });

				  // load sun and center it
				  fabric.Image.fromURL('assets/js/apps/graphics/sun.png', function(sunImg) {
				    canvas.add(sunImg);
				    sunImg.center();
				  });

				  var planetSize = 26,
				      totalPlanets = 12,
				      rotationSpeed = 20000,
				      orbits = [ ],
				      planets = [ ],
				      planetNames = ['Selene', 'Mimas', 'Ares', 'Enceladus', 'Tethys', 'Dione',
				                     'Zeus', 'Rhea', 'Titan', 'Janus', 'Hyperion', 'Iapetus'];

				  var hoverCircle = new fabric.Circle({
				    radius: 13,
				    fill: '#000',
				    stroke: 'rgb(0,192,255)',
				    strokeWidth: 3,
				    left: -100,
				    top: -100
				  });

				  var planetLabel = new fabric.Text('', {
				    fill: '#fff',
				    fontSize: 16,
				    fontFamily: 'Open Sans',
				    textBackgroundColor: '#002244'
				  });

				  // load sprite with planets
				  fabric.Image.fromURL('assets/js/apps/graphics/planets.png', function(planetsImg) {

				    // temp canvas to generate planet images
				    var tempCanvas = new fabric.StaticCanvas();

				    // only to fit one planet onto temp canvas
				    tempCanvas.setDimensions({
				      width: planetSize,
				      height: planetSize
				    });

				    // make sure image is drawn from left/top corner
				    planetsImg.originX = 'left';
				    planetsImg.originY = 'top';

				    // add it onto temp canvas
				    tempCanvas.add(planetsImg);

				    for (var i = 0; i < totalPlanets; i++) {
				      createOrbit(i);
				    }
				    canvas.add(hoverCircle);

				    for (var i = 0; i < totalPlanets; i++) {
				      var planet = createPlanet(i, planetsImg, tempCanvas);
				      planets.push(planet);
				      animatePlanet(planet, i);
				    }

				    canvas.add(planetLabel);
				  });

				  function createOrbit(i) {
				    var orbit = new fabric.Circle({
				      radius: 26 * i + 90,
				      left: canvas.getWidth() / 2,
				      top: canvas.getHeight() / 2,
				      fill: '',
				      stroke: 'rgba(0,192,255,0.5)',
				      hasBorders: false,
				      hasControls: false,
				      lockMovementX: true,
				      lockMovementY: true,
				      index: i
				    });
				    canvas.add(orbit);
				    orbits.push(orbit);
				  }

				  function createPlanet(i, planetsImg, tempCanvas) {

				    // offset planets sprite to fit each of the planets onto it
				    planetsImg.left = -planetSize * i;
				    planetsImg.setCoords();
				    tempCanvas.renderAll();

				    // get data url for that planet
				    var img = new Image;
				    img.src = tempCanvas.toDataURL();

				    // create image of a planet from data url
				    var oImg = new fabric.Image(img, {

				      width: planetSize,
				      height: planetSize,

				      name: planetNames[i],
				      index: i,

				      // position planet 90px from canvas center and 26px from previous planet
				      left: (canvas.getWidth() / 2) - 90 - (planetSize * i),
				      top: canvas.getHeight() / 2,

				      // remove borders and corners but leaving object available for events
				      hasBorders: false,
				      hasControls: false
				    });

				    canvas.add(oImg);
				    return oImg;
				  }

				  function animatePlanet(oImg, planetIndex) {

				    var radius = planetIndex * 26 + 90,

				        // rotate around canvas center
				        cx = canvas.getWidth() / 2,
				        cy = canvas.getHeight() / 2,

				        // speed of rotation slows down for further planets
				        duration = (planetIndex + 1) * rotationSpeed,

				        // randomize starting angle to avoid planets starting on one line
				        startAngle = fabric.util.getRandomInt(-180, 0),
				        endAngle = startAngle + 359;

				    (function animate() {

				      fabric.util.animate({
				        startValue: startAngle,
				        endValue: endAngle,
				        duration: duration,

				        // linear movement
				        easing: function(t, b, c, d) { return c*t/d + b; },

				        onChange: function(angle) {
				          angle = fabric.util.degreesToRadians(angle);

				          var x = cx + radius * Math.cos(angle);
				          var y = cy + radius * Math.sin(angle);

				          oImg.set({ left: x, top: y }).setCoords();

				          // only render once
				          if (planetIndex === totalPlanets - 1) {
				            canvas.renderAll();
				          }
				        },
				        onComplete: animate
				      });
				    })();
				  }

				  // piggyback on `canvas.findTarget`, to fire "object:over" and "object:out" events
				  canvas.findTarget = (function(originalFn) {
				    return function() {
				      var target = originalFn.apply(this, arguments);
				      if (target) {
				        if (this._hoveredTarget !== target) {
				          canvas.fire('object:over', { target: target });
				          if (this._hoveredTarget) {
				            canvas.fire('object:out', { target: this._hoveredTarget });
				          }
				          this._hoveredTarget = target;
				        }
				      }
				      else if (this._hoveredTarget) {
				        canvas.fire('object:out', { target: this._hoveredTarget });
				        this._hoveredTarget = null;
				      }
				      return target;
				    };
				  })(canvas.findTarget);

				  var hoverTarget, prevHoverTarget;

				  canvas.on('object:over', function(options) {
				    hoverTarget = options.target;
				  });

				  canvas.on('object:out', function(options) {
				    hoverTarget = null;
				    prevHoverTarget = options.target;
				  });

				  canvas.on('after:render', function() {
				    if (hoverTarget) {

				      var hoveredPlanet = planets[hoverTarget.index];
				      var hoveredOrbit = orbits[hoveredPlanet.index];

				      hoveredOrbit.set({
				        strokeWidth: 3,
				        stroke: 'rgb(0,192,255)'
				      });

				      hoverCircle.set({
				        left: hoveredPlanet.left,
				        top: hoveredPlanet.top
				      });

				      planetLabel.set({
				        left: hoveredPlanet.left + 50,
				        top: hoveredPlanet.top + 20,
				        text: hoveredPlanet.name
				      });
				    }
				    else {
				      hoverCircle.set({ left: -100, top: -100 });
				      planetLabel.set({ left: -100, top: -100 });

				      prevHoverTarget &&
				      orbits[prevHoverTarget.index] &&
				      orbits[prevHoverTarget.index].set({
				        strokeWidth: 1,
				        stroke: 'rgba(0,192,255,0.5)'
				      });
				    }
				  });
			}
		});
		
		graphics.fabricView = Marionette.Layout.extend({
			template : fabricTpl,
			onShow: function(){
				 var canvas = this.__canvas = new fabric.Canvas('c');
				  fabric.Object.prototype.transparentCorners = false;

				  var minScale = 1, maxScale = 2;

				  fabric.loadSVGFromURL('assets/js/apps/graphics/112.svg', function(objects, options) {

				    var obj = fabric.util.groupSVGElements(objects, options);
				    canvas.add(obj);

				    obj.set({ left: 80, top: 90, angle: -30, direction: 1 });
				    obj.setShadow({ color: 'rgba(0,0,0,0.3)' });

				    // animate angle back and forth (every 2 second)
				    obj.animate({ angle: 30 }, {
				      duration: 2000,
				      easing: fabric.util.ease.easeOutCubic,
				      onChange: canvas.renderAll.bind(canvas),
				      onComplete: function onComplete() {
				        obj.animate({
				          angle: Math.round(obj.angle) === 30 ? -30 : 30
				        }, {
				          duration: 2000,
				          onComplete: onComplete
				        });
				      }
				    });

				    // animate scale and shadow (every second)
				    (function animate(dir) {

				      var options = {
				        easing: fabric.util.ease.easeOutCubic,
				        duration: 1000
				      };

				      obj.animate({
				        scaleX: dir ? maxScale : minScale,
				        scaleY: dir ? maxScale : minScale
				      }, options);

				      obj.animate({
				        'shadow.offsetX': dir ? 20 : 0.00001,
				        'shadow.offsetY': dir ? 20 : 0.00001
				      }, options);

				      obj.animate({ 'shadow.blur': dir ? 20 : 0 }, fabric.util.object.extend({
				        onChange: canvas.renderAll.bind(canvas),
				        onComplete: function() {
				          obj.direction = !obj.direction;
				          animate(obj.direction);
				        }
				      }, options));

				    })(1);
				  });
			}
		});
		
		graphics.shineView = Marionette.Layout.extend({
			template : shineTpl,
			onShow: function(){
				 // use new shinejs.Shine(...) if Shine is already defined somewhere else
			      // var shine = new shinejs.Shine(document.getElementById("headline"));
			      var shine = new shinejs.Shine(document.getElementById('headline'));

			      function update() {
			        window.requestAnimationFrame(update);
			        var time = new Date().getTime();
			        var speed = 0.00025;  // 1 = 1000 rotations/s
			        var phase = time * speed * 2.0 * Math.PI;
			        var radiusX = window.innerWidth * 0.5;
			        var radiusY = window.innerHeight * 0.5;
			        shine.light.position.x = radiusX + radiusX * Math.cos(phase);
			        shine.light.position.y = radiusY + radiusY * Math.sin(phase * 0.7);
			        shine.draw();
			      }

			      update();

			}
		});
		
		graphics.magnificpopupView = Marionette.Layout.extend({
			template : magnificpopupTpl,
			onShow: function(){
				$('.image-popup-vertical-fit').magnificPopup({
			          type: 'image',
			          closeOnContentClick: true,
			          mainClass: 'mfp-img-mobile',
			          image: {
			            verticalFit: true
			          }
			          
			        });

			        $('.image-popup-fit-width').magnificPopup({
			          type: 'image',
			          closeOnContentClick: true,
			          image: {
			            verticalFit: false
			          }
			        });

			        $('.image-popup-no-margins').magnificPopup({
			          type: 'image',
			          closeOnContentClick: true,
			          closeBtnInside: false,
			          fixedContentPos: true,
			          mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
			          image: {
			            verticalFit: true
			          },
			          zoom: {
			            enabled: true,
			            duration: 300 // don't foget to change the duration also in CSS
			          }
			        });
			        $('.popup-gallery').magnificPopup({
			            delegate: 'a',
			            type: 'image',
			            tLoading: 'Loading image #%curr%...',
			            mainClass: 'mfp-img-mobile',
			            gallery: {
			              enabled: true,
			              navigateByImgClick: true,
			              preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			            },
			            image: {
			              tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
			              titleSrc: function(item) {
			                return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
			              }
			            }
			          });
			        $('.zoom-gallery').magnificPopup({
			            delegate: 'a',
			            type: 'image',
			            closeOnContentClick: false,
			            closeBtnInside: false,
			            mainClass: 'mfp-with-zoom mfp-img-mobile',
			            image: {
			              verticalFit: true,
			              titleSrc: function(item) {
			                return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
			              }
			            },
			            gallery: {
			              enabled: true
			            },
			            zoom: {
			              enabled: true,
			              duration: 300, // don't foget to change the duration also in CSS
			              opener: function(element) {
			                return element.find('img');
			              }
			            }
			            
			          });
			}
		});
		
		
		graphics.buffergeometryView = Marionette.Layout.extend({
			template : buffergeometryTpl,
			onShow: function(){
				var that = this;
				require(['vendor/three/Detector', 'vendor/three/libs/stats.min'], function(){
					if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

					var container, stats;

					var camera, scene, renderer;

					var projector, raycaster, mouse, points = [];

					var mesh, line;

					init();
					animate();

					function init() {

						container = document.getElementById( 'buffergeometrycontainer' );

						//

						camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
						camera.position.z = 2750;

						scene = new THREE.Scene();
						scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

						//

						scene.add( new THREE.AmbientLight( 0x444444 ) );

						var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
						light1.position.set( 1, 1, 1 );
						scene.add( light1 );

						var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
						light2.position.set( 0, -1, 0 );
						scene.add( light2 );

						//

						var triangles = 5000;

						var geometry = new THREE.BufferGeometry();

						geometry.addAttribute( 'position', Float32Array, triangles * 3, 3 );
						geometry.addAttribute( 'normal', Float32Array, triangles * 3, 3 );
						geometry.addAttribute( 'color', Float32Array, triangles * 3, 3 );

						var positions = geometry.attributes.position.array;
						var normals = geometry.attributes.normal.array;
						var colors = geometry.attributes.color.array;

						var color = new THREE.Color();

						var n = 800, n2 = n/2;	// triangles spread in the cube
						var d = 120, d2 = d/2;	// individual triangle size

						var pA = new THREE.Vector3();
						var pB = new THREE.Vector3();
						var pC = new THREE.Vector3();

						var cb = new THREE.Vector3();
						var ab = new THREE.Vector3();

						for ( var i = 0; i < positions.length; i += 9 ) {

							// positions

							var x = Math.random() * n - n2;
							var y = Math.random() * n - n2;
							var z = Math.random() * n - n2;

							var ax = x + Math.random() * d - d2;
							var ay = y + Math.random() * d - d2;
							var az = z + Math.random() * d - d2;

							var bx = x + Math.random() * d - d2;
							var by = y + Math.random() * d - d2;
							var bz = z + Math.random() * d - d2;

							var cx = x + Math.random() * d - d2;
							var cy = y + Math.random() * d - d2;
							var cz = z + Math.random() * d - d2;

							positions[ i ]     = ax;
							positions[ i + 1 ] = ay;
							positions[ i + 2 ] = az;

							positions[ i + 3 ] = bx;
							positions[ i + 4 ] = by;
							positions[ i + 5 ] = bz;

							positions[ i + 6 ] = cx;
							positions[ i + 7 ] = cy;
							positions[ i + 8 ] = cz;

							// flat face normals

							pA.set( ax, ay, az );
							pB.set( bx, by, bz );
							pC.set( cx, cy, cz );

							cb.subVectors( pC, pB );
							ab.subVectors( pA, pB );
							cb.cross( ab );

							cb.normalize();

							var nx = cb.x;
							var ny = cb.y;
							var nz = cb.z;

							normals[ i ]     = nx;
							normals[ i + 1 ] = ny;
							normals[ i + 2 ] = nz;

							normals[ i + 3 ] = nx;
							normals[ i + 4 ] = ny;
							normals[ i + 5 ] = nz;

							normals[ i + 6 ] = nx;
							normals[ i + 7 ] = ny;
							normals[ i + 8 ] = nz;

							// colors

							var vx = ( x / n ) + 0.5;
							var vy = ( y / n ) + 0.5;
							var vz = ( z / n ) + 0.5;

							color.setRGB( vx, vy, vz );

							colors[ i ]     = color.r;
							colors[ i + 1 ] = color.g;
							colors[ i + 2 ] = color.b;

							colors[ i + 3 ] = color.r;
							colors[ i + 4 ] = color.g;
							colors[ i + 5 ] = color.b;

							colors[ i + 6 ] = color.r;
							colors[ i + 7 ] = color.g;
							colors[ i + 8 ] = color.b;

						}

						geometry.computeBoundingSphere();

						var material = new THREE.MeshPhongMaterial( {
								color: 0xaaaaaa, ambient: 0xaaaaaa, specular: 0xffffff, shininess: 250,
								side: THREE.DoubleSide, vertexColors: THREE.VertexColors
						} );

						mesh = new THREE.Mesh( geometry, material );
						scene.add( mesh );

						//

						projector = new THREE.Projector();
						raycaster = new THREE.Raycaster();

						mouse = new THREE.Vector2();

						var geometry = new THREE.BufferGeometry();
						geometry.addAttribute( 'position', Float32Array, 4, 3 );

						var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2, transparent: true } );

						line = new THREE.Line( geometry, material );
						scene.add( line );

						//

						renderer = new THREE.WebGLRenderer( { antialias: false } );
						renderer.setClearColor( scene.fog.color, 1 );
						renderer.setSize( window.innerWidth, window.innerHeight );

						container.appendChild( renderer.domElement );

						//

						stats = new Stats();
						stats.domElement.style.position = 'absolute';
						stats.domElement.style.top = '0px';
						container.appendChild( stats.domElement );

						//

						window.addEventListener( 'resize', onWindowResize, false );
						document.addEventListener( 'mousemove', onDocumentMouseMove, false );

					}

					function onWindowResize() {

						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();

						renderer.setSize( window.innerWidth, window.innerHeight );

					}

					function onDocumentMouseMove( event ) {

						event.preventDefault();

						mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
						mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

					}

					//

					function animate() {

						requestAnimationFrame( animate );

						render();
						stats.update();

					}

					function render() {

						var time = Date.now() * 0.001;

						mesh.rotation.x = time * 0.15;
						mesh.rotation.y = time * 0.25;

						var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
						projector.unprojectVector( vector, camera );

						raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

						var intersects = raycaster.intersectObject( mesh );

						if ( intersects.length > 0 ) {

							var intersect = intersects[ 0 ];

							var object = intersect.object;
							var positions = object.geometry.attributes.position.array;

							for ( var i = 0, j = 0; i < 4; i ++, j += 3 ) {

								var index = intersect.indices[ i % 3 ] * 3;

								line.geometry.attributes.position.array[ j     ] = positions[ index     ];
								line.geometry.attributes.position.array[ j + 1 ] = positions[ index + 1 ];
								line.geometry.attributes.position.array[ j + 2 ] = positions[ index + 2 ];

							}

							mesh.updateMatrix();
							
							line.geometry.applyMatrix( mesh.matrix );

							line.visible = true;

						} else {

							line.visible = false;

						}

						renderer.render( scene, camera );

					}
				})
			}
		});
		
		graphics.asciiView = Marionette.Layout.extend({
			template : asciiTpl,
			onShow: function(){
				
				var that = this;
				
				require(['vendor/three/controls/TrackballControls', 'vendor/three/effects/AsciiEffect', 'vendor/three/libs/stats.min'], function(){
					var container, stats;

					var camera, controls, scene, renderer;

					var sphere, plane;

					var start = Date.now();

					init();
					animate();

					function init() {

						var width = window.innerWidth || 2;
						var height = window.innerHeight || 2;

						container = document.createElement( 'div' );
						that.el.appendChild( container );

						var info = document.createElement( 'div' );
						info.style.position = 'absolute';
						info.style.top = '10px';
						info.style.width = '100%';
						info.style.textAlign = 'center';
						info.innerHTML = 'Drag to change the view';
						container.appendChild( info );

						camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
						camera.position.y = 150;
						camera.position.z = 500;

						controls = new THREE.TrackballControls( camera );

						scene = new THREE.Scene();

						var light = new THREE.PointLight( 0xffffff );
						light.position.set( 500, 500, 500 );
						scene.add( light );

						var light = new THREE.PointLight( 0xffffff, 0.25 );
						light.position.set( - 500, - 500, - 500 );
						scene.add( light );

						sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshLambertMaterial( { shading: THREE.FlatShading } ) );
						scene.add( sphere );

						// Plane

						plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
						plane.position.y = - 200;
						plane.rotation.x = - Math.PI / 2;
						scene.add( plane );

						renderer = new THREE.CanvasRenderer();
						renderer.setSize( width, height );
						// container.appendChild( renderer.domElement );

						effect = new THREE.AsciiEffect( renderer );
						effect.setSize( width, height );
						container.appendChild( effect.domElement );

						stats = new Stats();
						stats.domElement.style.position = 'absolute';
						stats.domElement.style.top = '0px';
						container.appendChild( stats.domElement );

						//

						window.addEventListener( 'resize', onWindowResize, false );

					}

					function onWindowResize() {

						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();

						renderer.setSize( window.innerWidth, window.innerHeight );
						effect.setSize( window.innerWidth, window.innerHeight );

					}

					//

					function animate() {

						requestAnimationFrame( animate );

						render();
						stats.update();

					}

					function render() {

						var timer = Date.now() - start;

						sphere.position.y = Math.abs( Math.sin( timer * 0.002 ) ) * 150;
						sphere.rotation.x = timer * 0.0003;
						sphere.rotation.z = timer * 0.0002;

						controls.update();

						effect.render( scene, camera );

					}
				})
				

			
			}
		});
		
		graphics.mainView = new graphics.MainView();

		graphics.controller = {
			show : function() {
				App.navigate("graphics");
				App.mainRegion.show(graphics.mainView);
			},
			showascii: function(){
				graphics.mainView.content.show(new graphics.asciiView);
			},
			showbuffergeometry: function(){
				graphics.mainView.content.show(new graphics.buffergeometryView);
			},
			showmagnificpopup: function(){
				graphics.mainView.content.show(new graphics.magnificpopupView);
			},
			showShine: function(){
				graphics.mainView.content.show(new graphics.shineView);
			},
			showfabric: function(){
				graphics.mainView.content.show(new graphics.fabricView);
			},
			showsolar: function(){
				graphics.mainView.content.show(new graphics.solarView);
			},
			showdrawing: function(){
				graphics.mainView.content.show(new graphics.drawingView);
			},
			showparticles: function(){
				graphics.mainView.content.show(new graphics.particlesView);
			},
			showSnap: function(){
				graphics.mainView.content.show(new graphics.snapView);
			},
			showMask: function(){
				graphics.mainView.content.show(new graphics.maskView);
			},
			showRunners: function(){
				graphics.mainView.content.show(new graphics.runnersView);
			},
			showbitmap: function(){
				graphics.mainView.content.show(new graphics.bitmapView);
			},
			showstar: function(){
				graphics.mainView.content.show(new graphics.paperView);
			},
			showColorbox: function(){
				graphics.mainView.content.show(new graphics.colorboxView);
			},
			showKinetic: function(){
				graphics.mainView.content.show(new graphics.kineticView);
			},
			showFlexslider: function(){
				graphics.mainView.content.show(new graphics.flexsliderView);
			},
			showPie: function(){
				graphics.mainView.content.show(new graphics.pieView);
			},
			showClock: function(){
				graphics.mainView.content.show(new graphics.clockView);
			},
			showKeycatcher: function(){
				graphics.mainView.content.show(new graphics.keycatcherView);
			},
			showSwiper: function(){
				graphics.mainView.content.show(new graphics.swiperView);
			},
			showFancybox: function(){
				graphics.mainView.content.show(new graphics.fancyboxView);
			},
			showTwo: function(){
				graphics.mainView.content.show(new graphics.twoView);
			},
			showThree: function(){
				graphics.mainView.content.show(new graphics.threeView);
			},
			showpanorama: function(){
				graphics.mainView.content.show(new graphics.panoramaView);
			},
			showBounce: function(){
				graphics.mainView.content.show(new graphics.bounceView);
			}
		}

		App.on("graphics:show", function() {
			graphics.controller.show();
		});

		graphics.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"graphics" : "show",
				'graphics/ascii_effect': 'showascii',
				'graphics/buffergeometry': 'showbuffergeometry',
				'graphics/magnific-popup': 'showmagnificpopup',
				'graphics/shine': 'showShine',
				'graphics/fabric': 'showfabric',
				'graphics/solar': 'showsolar',
				'graphics/drawing': 'showdrawing',
				'graphics/particles': 'showparticles',
				'graphics/snap': 'showSnap',
				'graphics/mask': 'showMask',
				'graphics/runners': 'showRunners',
				'graphics/bitmap': 'showbitmap',
				'graphics/star': 'showstar',
				'graphics/colorbox': 'showColorbox',
				'graphics/kinetic': 'showKinetic',
				'graphics/flexslider': 'showFlexslider',
				'graphics/pie': 'showPie',
				'graphics/clock': 'showClock',
				'graphics/keycatcher': 'showKeycatcher',
				'graphics/swiper': 'showSwiper',
				'graphics/fancybox': 'showFancybox',
				'graphics/two': 'showTwo',
				'graphics/three': 'showThree',
				'graphics/panorama': 'showpanorama',
				'graphics/bounce': 'showBounce'
			}
		});

		App.addInitializer(function() {
			new graphics.Router({
				controller : graphics.controller
			});
		});
	});
	return App.graphics.controller;
})