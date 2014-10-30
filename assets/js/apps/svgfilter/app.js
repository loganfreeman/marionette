define([ 'app', 'tpl!apps/svgfilter/view.tpl', 'svg', 'svg.easing', 'svg.filter', 'css!apps/svgfilter/filter' ], function(App, viewTpl, SVG) {
	App.module('SVGFilterDemo', function(SVGFilterDemo, App, Backbone, Marionette, $, _) {

		SVGFilterDemo.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 var draw, rect
			        , src = 'http://distilleryimage11.ak.instagram.com/89ac2e90d9b111e297bf22000a1f9263_7.jpg'

			      // canvas
			      draw = SVG('filter-canvas').size(990, 1650)

			      // nase elements../
			      rect  = draw.defs().rect(300,300)

			      // original
			      drawImage(15, 15, 'original')

			      // blur
			      drawImage(345, 15, 'gaussian blur').filter(function(add) {
			        add.gaussianBlur('30')
			      })

			      // horizontal blur
			      drawImage(675, 15, 'horizontal blur').filter(function(add) {
			        add.gaussianBlur('30 0')
			      })


			      // desaturate
			      drawImage(15, 345, 'desaturate').filter(function(add) {
			        add.colorMatrix('saturate', 0)
			      })

			      // contrast
			      drawImage(345, 345, 'contrast').filter(function(add) {
			        var amount = 1.5

			        add.componentTransfer({
			          rgb: { type: 'linear', slope: amount, intercept: -(0.3 * amount) + 0.3 }
			        })
			      })

			      // sepiatone
			      drawImage(675, 345, 'sepiatone').filter(function(add) {
			        add.colorMatrix('matrix', [ .343, .669, .119, 0, 0 
			                                  , .249, .626, .130, 0, 0
			                                  , .172, .334, .111, 0, 0
			                                  , .000, .000, .000, 1, 0 ])
			      })

			      // hue rotate
			      drawImage(15, 675, 'hue rotate 180').filter(function(add) {
			        add.colorMatrix('hueRotate', 180)
			      })

			      // alpha
			      drawImage(345, 675, 'luminance to alpha').filter(function(add) {
			        add.colorMatrix('luminanceToAlpha')
			      })

			      // colorize
			      drawImage(675, 675, 'colorize').filter(function(add) {
			        add.colorMatrix('matrix', [ 1.0, 0,   0,   0,   0
			                                  , 0,   0.2, 0,   0,   0 
			                                  , 0,   0,   0.2, 0,   0 
			                                  , 0,   0,   0,   1.0, 0 ])
			      })

			      // posterize
			      drawImage(15, 1005, 'posterize').filter(function(add) {
			        add.componentTransfer({
			          rgb: { type: 'discrete', tableValues: '0 0.2 0.4 0.6 0.8 1' }
			        })
			      })

			      // darken
			      drawImage(345, 1005, 'darken').filter(function(add) {
			        add.componentTransfer({
			          rgb: { type: 'linear', slope: 0.2 }
			        })
			      })

			      // lighten
			      drawImage(675, 1005, 'lighten').filter(function(add) {
			        add.componentTransfer({
			          rgb: { type: 'linear', slope: 1.5, intercept: 0.2 }
			        })
			      })


			      // invert
			      drawImage(15, 1335, 'invert').filter(function(add) {
			        add.componentTransfer({
			          rgb: { type: 'table', tableValues: '1 0' }
			        })
			      })

			      // gamma correct
			      drawImage(345, 1335, 'gamma correct 1').filter(function(add) {
			        add.componentTransfer({
			          g: { type: 'gamma', amplitude: 1, exponent: 0.5 }
			        })
			      })

			      // gamma correct
			      drawImage(675, 1335, 'gamma correct 2').filter(function(add) {
			        add.componentTransfer({
			          g: { type: 'gamma', amplitude: 1, exponent: 0.5, offset: -0.1 }
			        })
			      })


			      // helpers
			      function drawImage(x, y, effect) {
			        var text
			          , original = draw.image(src).size(300, 300).move(x, y)
			          , filtered = original.clone()

			        /* hide original */
			        original.opacity(0)

			        /* description */
			        text = draw.text(effect)
			          .move(x + 150, y + 250)
			          .font({ size: 24, anchor: 'middle', family: 'Helvetica Neue, Helvetica, sans-serif', weight: 100 })
			          .fill('#fff')

			        /* add drop shadow to description */
			        text.filter(function(add) {
			          var blur = add.offset(0,1).in(add.sourceAlpha).gaussianBlur('1')

			          add.blend(add.source, blur)
			        })

			        /* mouse events */
			        filtered.mouseover(function() {
			          filtered.animate(300).opacity(0)
			          original.animate(100).opacity(1)
			        })

			        filtered.mouseout(function() {
			          filtered.animate(100).opacity(1)
			          original.animate(300).opacity(0)
			        })

			        return filtered.clipWith(draw.use(rect).move(x, y))
			      }
			}
		});

		SVGFilterDemo.controller = {
			show : function() {
				App.navigate("svgfilter");
				App.mainRegion.show(new SVGFilterDemo.MainView());
			}
		}

		App.on("svgfilter:show", function() {
			SVGFilterDemo.controller.show();
		});

		SVGFilterDemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"svgfilter" : "show"
			}
		});

		SVGFilterDemo.addInitializer(function() {
			new SVGFilterDemo.Router({
				controller : SVGFilterDemo.controller
			});
		});
	});
	return App.SVGFilterDemo.controller;
})