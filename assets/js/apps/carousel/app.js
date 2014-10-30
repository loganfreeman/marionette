define([ 'app','tether',
         'stache!apps/carousel/main',
         'stache!apps/carousel/basic',
         'stache!apps/carousel/ajax',
         'stache!apps/carousel/bubble',
         'stache!apps/carousel/colortip',
         'stache!apps/carousel/countdown',
         'stache!apps/carousel/facebookwall',
         'stache!apps/carousel/shutter',
         'stache!apps/carousel/typeahead',
         'stache!apps/carousel/stellar',
         'stache!apps/carousel/tether',
         'stache!apps/carousel/facebook',
         'stache!apps/carousel/peity',
         'stache!apps/carousel/mobile',
         'stache!apps/carousel/mobile-page1',
         'stache!apps/carousel/mobile-page2',
         'stache!apps/carousel/sidebar',
         'stache!apps/carousel/chart',
         'stache!apps/carousel/d3chart',
         'stache!apps/carousel/vein',
         'stache!apps/carousel/skrollr',
         'stache!apps/carousel/transit',
         'stache!apps/carousel/parallax',
         'stache!apps/carousel/superscrollorama',
         'stache!apps/carousel/move',
         'vein', 'skrollr',
         'css!apps/carousel/move',
         'css!apps/carousel/superscrollorama',
         'css!apps/carousel/transit',
         'css!apps/carousel/style', 
         'css!apps/carousel/typeahead',
         'css!apps/carousel/stellar',
         'css!apps/carousel/tether',
         'css!apps/carousel/color',
         'css!apps/carousel/facebook',
         'css!vendor/jcarousel/jcarousel.basic',
         'css!apps/carousel/vein',
         'css!apps/carousel/skrollr',
         'css!apps/carousel/parallax',
         'jquery.jcarousel',
         'jquery.bubbleSlideshow',
         'colortip',
          'countdown', 'jquery.facebookwall', 'jquery.shutter', 'typeahead', 'stellar',
          'datetimepicker_css',
          'drop','jquery.peity', 'leaflet-sidebar', 'chart',
          'd3.chart',
          'apps/carousel/d3chart/datasrc',  
          'chain','jquery.transit',
          'jquery.parallax',
          'jquery.superscrollorama',
          'TweenMax',
          'move'
          ], function(App, Tether,
        		 viewTpl, basicTpl, ajaxTpl, bubbleTpl,
        		 colortipTpl,
        		 countdownTpl,
        		 facebookwallTpl,
        		 shutterTpl, typeaheadTpl, stellarTpl, tetherTpl, facebookTpl, peityTpl, mobileTpl, page1Tpl, page2Tpl,
        		 sidebarTpl,
        		 chartTpl,
        		 d3chartTpl,
        		 veinTpl,
        		 skrollrTpl,
        		 transitTpl,
        		 parallaxTpl,
        		 superscrolloramaTpl,
        		 moveTpl,
        		 vein,  
        		 skrollr) {
	App.module('carousel', function(carousel, App, Backbone, Marionette, $, _) {
		console.log(skrollr);
		//console.log(Tether);
	      // Random colors bit, don't mind this
	      var colors = ['navy', 'blue', 'aqua', 'teal', 'olive', 'green', 'lime',
	        'yellow', 'orange', 'red', 'fuchsia', 'purple', 'maroon'];

		carousel.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions: {
				content : '#jcarousel-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		carousel.basicView = Marionette.ItemView.extend({
			template : basicTpl,
		});
		
		carousel.moveView = Marionette.ItemView.extend({
			template : moveTpl,
			events: {
				'click a.moveme': 'move'
			},
			move: function(){
				move('#square')
		        .to(500, 200)
		        .rotate(180)
		        .scale(.5)
		        .set('background-color', '#888')
		        .set('border-color', 'black')
		        .duration('2s')
		        .skew(50, -10)
		        .then()
		          .set('opacity', 0)
		          .duration('0.3s')
		          .scale(.1)
		          .pop()
		        .end(function(){
		          var el = document.getElementById('square');
		          el.style.webkitTransform = 'scale(.5)';
		        });
			},
		});
				
		carousel.superscrolloramaView = Marionette.ItemView.extend({
			template : superscrolloramaTpl,
			events: {
				'click a.moveme': 'doScroll'
			},
			doScroll: function(){
				var controller = $.superscrollorama();
				// individual element tween examples
				controller.addTween('#fade-it', 
						TweenMax.from( $('#fade-it'), .5, {css:{opacity: 0}}));
				controller.addTween('#fly-it', 
						TweenMax.from( $('#fly-it'), .25, {css:{right:'1000px'}, ease:Quad.easeInOut}));
				controller.addTween('#spin-it', 
						TweenMax.from( $('#spin-it'), .25, {css:{opacity:0, rotation: 720}, ease:Quad.easeOut}));
				controller.addTween('#scale-it', 
						TweenMax.fromTo( $('#scale-it'), .25, {css:{opacity:0, fontSize:'20px'}, immediateRender:true, ease:Quad.easeInOut}, {css:{opacity:1, fontSize:'240px'}, ease:Quad.easeInOut}));
				controller.addTween('#smush-it', 
						TweenMax.fromTo( $('#smush-it'), .25, {css:{opacity:0, 'letter-spacing':'30px'}, 
					immediateRender:true, 
					ease:Quad.easeInOut}, {css:{opacity:1, 'letter-spacing':'-10px'}, ease:Quad.easeInOut}), 0, 100);
			}
			
		});
		
		carousel.parallxView = Marionette.ItemView.extend({
			template : parallaxTpl,
			onShow: function(){
				$('#scene').parallax();
			}
		});
		
		carousel.transitView = Marionette.ItemView.extend({
			template : transitTpl,
			events: {
				'click a.moveme': 'doTransit'
			},
			doTransit: function(){
				$("#box").css({ x: '30px' });               // Move right
				$("#box").css({ y: '60px' });               // Move down
				$("#box").css({ translate: [60,30] });      // Move right and down
				$("#box").css({ rotate: '30deg' });         // Rotate clockwise
				$("#box").css({ scale: 2 });                // Scale up 2x (200%)
				$("#box").css({ scale: [2, 1.5] });         // Scale horiz and vertical
				$("#box").transition({ opacity: 0.1, scale: 0.3 });
				$("#box").transition({ opacity: 0.1, scale: 0.3 }, 500);                         // duration
				$("#box").transition({ opacity: 0.1, scale: 0.3 }, 'fast');                      // easing
				$("#box").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');                   // duration+easing
			}
		});
		
		carousel.skrollrView = Marionette.ItemView.extend({
			template : skrollrTpl,
			onShow: function(){
				var s = skrollr.init({
					edgeStrategy: 'set',
					easing: {
						WTF: Math.random,
						inverted: function(p) {
							return 1-p;
						}
					}
				});
			}
		});
		
		carousel.veinView = Marionette.ItemView.extend({
			template : veinTpl,
			onShow: function(){
				$('#media-example-trigger').click(function(e){
					e.preventDefault();

					$('#friendly-cube').append('<br><br>Thanks for injecting me with CSS awesomeness! I will be red in small screens now.')
					vein.inject([{'@media (max-width: 768px)': ['#friendly-cube']}], {'background-color': '#F00'});
				});

				$('.run-example-button').click(function(){
					run(
						function(){
							var self = this;

							$('.jquery-inline .loaded-item').css({'background-color': '#eeaaaa'});
							vein.inject('.vein-awesomeness .loaded-item', {'background-color': '#eeaaaa'});

							vein.inject('.run-example-button', {'display': 'none'});
							vein.inject('.next-button', {'display': 'block'});

							$('.example-canvas').append(
								"<div class='row'>" +
									"<div class='run-example col-sm-12'>" +
										"<p class='text-center annotations'>" +
											"We just ran the following code: " +
											"<br />" +
											"<code>$('.jquery-inline .loaded-item').css({'background-color': '#eeaaaa'});</code> (Applied only on the jQuery row)" +
											"<br />" +
											"<code>vein.inject('.vein-awesomeness .loaded-item', {'background-color': '#eeaaaa'});</code> (for the veinjs row)" +
											"<br />" +
											"<br />" +
											"Click next to now dynamically insert more items into both rows. " +
										"</p>" +
									"</div>" +
								"</div>"
							);

							$('.example-canvas').append( $("<div class='col-sm-6 jquery-inline jquery-inline-more'>") );
							$('.example-canvas').append( $("<div class='col-sm-6 vein-awesomeness vein-awesomeness-more'>") );

							$('.next-button').click(function(){
								self.next(true);
							});
						}
					)
					.then(
						function(){
							var anotherItem = $(
								"<div class='loaded-item'>" +
									"<h4>Title</h4>" +
									"<p>Lorem ipsum dolor sit amet</p>" +
								"</div>"
							);

							$('.jquery-inline-more').append(anotherItem.clone());
							$('.jquery-inline-more').append(anotherItem.clone());

							$('.vein-awesomeness-more').append(anotherItem.clone());
							$('.vein-awesomeness-more').append(anotherItem.clone());

							$('.example-canvas').append(
								"<div class='row'>" +
									"<div class='run-example col-sm-12'>" +
										"<p class='text-center annotations'>" +
											"As you can see, because jQuery operates on inline CSS styles, our newly added items don't have any style applied to them. Our veinjs applied CSS, on the other hand, is injected into a dynamically generated SYTLE tag and therefore remains." +
										"</p>" +
									"</div>" +
								"</div>"
							);

							vein.inject('.next-button', {'display': 'none'});
							vein.inject('.github-button', {'display': 'block'});
						}
					);
				});
			}
		});
		
		carousel.d3chartView = Marionette.ItemView.extend({
			template : d3chartTpl,
			onShow: function(){
				require(['apps/carousel/d3chart/app'], function(){
					
				});
			}
		});
		
		carousel.chartView = Marionette.ItemView.extend({
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

				var myLine = new Chart(document.getElementById("bar").getContext("2d")).Bar(barChartData);
				// doughnut
				var doughnutData = [
				    				{
				    					value: 30,
				    					color:"#F7464A"
				    				},
				    				{
				    					value : 50,
				    					color : "#46BFBD"
				    				},
				    				{
				    					value : 100,
				    					color : "#FDB45C"
				    				},
				    				{
				    					value : 40,
				    					color : "#949FB1"
				    				},
				    				{
				    					value : 120,
				    					color : "#4D5360"
				    				}
				    			
				    			];

				    	var myDoughnut = new Chart(document.getElementById("doughnut").getContext("2d")).Doughnut(doughnutData);
				    	// line
						var lineChartData = {
								labels : ["January","February","March","April","May","June","July"],
								datasets : [
									{
										fillColor : "rgba(220,220,220,0.5)",
										strokeColor : "rgba(220,220,220,1)",
										pointColor : "rgba(220,220,220,1)",
										pointStrokeColor : "#fff",
										data : [65,59,90,81,56,55,40]
									},
									{
										fillColor : "rgba(151,187,205,0.5)",
										strokeColor : "rgba(151,187,205,1)",
										pointColor : "rgba(151,187,205,1)",
										pointStrokeColor : "#fff",
										data : [28,48,40,19,96,27,100]
									}
								]
								
							}

						var myLine = new Chart(document.getElementById("line").getContext("2d")).Line(lineChartData);
						// pie
						var pieData = [
										{
											value: 30,
											color:"#F38630"
										},
										{
											value : 50,
											color : "#E0E4CC"
										},
										{
											value : 100,
											color : "#69D2E7"
										}
									
									];

							var myPie = new Chart(document.getElementById("pie").getContext("2d")).Pie(pieData);
							// polar area
							var chartData = [
							     			{
							     				value : Math.random(),
							     				color: "#D97041"
							     			},
							     			{
							     				value : Math.random(),
							     				color: "#C7604C"
							     			},
							     			{
							     				value : Math.random(),
							     				color: "#21323D"
							     			},
							     			{
							     				value : Math.random(),
							     				color: "#9D9B7F"
							     			},
							     			{
							     				value : Math.random(),
							     				color: "#7D4F6D"
							     			},
							     			{
							     				value : Math.random(),
							     				color: "#584A5E"
							     			}
							     		];
							     	var myPolarArea = new Chart(document.getElementById("polarArea").getContext("2d")).PolarArea(chartData);
							     	// radar
									var radarChartData = {
											labels : ["Eating","Drinking","Sleeping","Designing","Coding","Partying","Running"],
											datasets : [
												{
													fillColor : "rgba(220,220,220,0.5)",
													strokeColor : "rgba(220,220,220,1)",
													pointColor : "rgba(220,220,220,1)",
													pointStrokeColor : "#fff",
													data : [65,59,90,81,56,55,40]
												},
												{
													fillColor : "rgba(151,187,205,0.5)",
													strokeColor : "rgba(151,187,205,1)",
													pointColor : "rgba(151,187,205,1)",
													pointStrokeColor : "#fff",
													data : [28,48,40,19,96,27,100]
												}
											]
											
										}

									var myRadar = new Chart(document.getElementById("radar").getContext("2d")).Radar(radarChartData,{scaleShowLabels : false, pointLabelFontSize : 10});
									// sixup
									
			}
		});
		
		carousel.peityView = Marionette.ItemView.extend({
			template : peityTpl,
			onClose: function(){
				if(this.updatingChartInterval) {clearInterval(this.updatingChartInterval); console.log('updatingChartInterval stopped');}
			},
			/*
			onRender: function(){
				$.fn.peity.defaults.pie = {
						  delimiter: null,
						  diameter: 16,
						  fill: ['<span style="background:#ff9900">#ff9900</span>', '<span style="background:#fff4dd">#fff4dd</span>', '<span style="background:#ffd592">#ffd592</span>'],
						  height: null,
						  width: null
						}

						$.fn.peity.defaults.line = {
						  delimiter: ",",
						  fill: '<span style="background:#c6d9fd">#c6d9fd</span>',
						  height: 16,
						  max: null,
						  min: 0,
						  stroke: '<span style="background:#4d89f9">#4d89f9</span>',
						  strokeWidth: 1,
						  width: 32
						}

						$.fn.peity.defaults.bar = {
						  delimiter: ",",
						  fill: ['<span style="background:#4d89f9">#4d89f9</span>'],
						  gap: 1,
						  height: 16,
						  max: null,
						  min: 0,
						  width: 32
						};
			},
			*/
			onShow: function(){
				$("span.pie").peity("pie");
				$(".line").peity("line");
				$(".bar").peity("bar");
				$(".bar-colours-1").peity("bar", {
					  fill: ["red", "green", "blue"]
					})

					$(".bar-colours-2").peity("bar", {
					  fill: function(value) {
					    return value > 0 ? "green" : "red"
					  }
					})

					$(".bar-colours-3").peity("bar", {
					  fill: function(_, i, all) {
					    var g = parseInt((i / all.length) * 255)
					    return "rgb(255, " + g + ", 0)"
					  }
					})

					$(".pie-colours-1").peity("pie", {
					  fill: ["cyan", "magenta", "yellow", "black"]
					})

					$(".pie-colours-2").peity("pie", {
					  fill: function(_, i, all) {
					    var g = parseInt((i / all.length) * 255)
					    return "rgb(255, " + g + ", 0)"
					  }
					});
				var updatingChart = $(".updating-chart").peity("line", { width: 64 })

				this.updatingChartInterval = setInterval(function() {
					var random = Math.round(Math.random() * 10)
					var values = updatingChart.text().split(",")
					values.shift()
					values.push(random)

					updatingChart.text(values.join(",")).change()
				}, 1000);
				

				$("#graphSelect select").change(function() {
					$(this).siblings("span.graph").text($(this).val() + "/" + 5).change()
				}).change()

				var chartUpdate = function(event, value, max) {
					$("#notice").text("Chart updated: " + value + "/" + max)
				}

				$("span.graph").peity("pie").bind("change.peity", chartUpdate);
					
				
			}
		});
		
		carousel.facebookView = Marionette.ItemView.extend({
			template : facebookTpl,
			className : 'body',
		});
		
		carousel.tetherView = Marionette.ItemView.extend({
			template : tetherTpl,
			
			onShow: function(){
				new Tether({
			        element: '.element',
			        target: document.body,
			        attachment: 'middle center',
			        targetAttachment: 'middle center',
			        targetModifier: 'visible'
			      });
			},
			onClose: function(){
				$('#tethered').remove();
			},
			onRender: function(){
				 var curColors = null;
				for (var i = 300; i--;) {
					if (!curColors || !curColors.length)
						curColors = colors.slice(0);

					var bit = document.createElement('div')
					var index = (Math.random() * curColors.length) | 0;
					bit.className = 'bit bg-' + curColors[index]
					curColors.splice(index, 1);
					this.el.appendChild(bit);
				}
			}
		});
		
		carousel.typeaheadView = Marionette.ItemView.extend({
			template : typeaheadTpl,
			onShow: function(){
				var substringMatcher = function(strs) {
					  return function findMatches(q, cb) {
					    var matches, substringRegex;
					 
					    // an array that will be populated with substring matches
					    matches = [];
					 
					    // regex used to determine if a string contains the substring `q`
					    substrRegex = new RegExp(q, 'i');
					 
					    // iterate through the pool of strings and for any string that
					    // contains the substring `q`, add it to the `matches` array
					    $.each(strs, function(i, str) {
					      if (substrRegex.test(str)) {
					        // the typeahead jQuery plugin expects suggestions to a
					        // JavaScript object, refer to typeahead docs for more info
					        matches.push({ value: str });
					      }
					    });
					 
					    cb(matches);
					  };
					};
					 
					var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
					  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
					  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
					  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
					  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
					  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
					  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
					  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
					  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
					];
					 
					$('#the-basics .typeahead').typeahead({
					  hint: true,
					  highlight: true,
					  minLength: 1
					},
					{
					  name: 'states',
					  displayKey: 'value',
					  source: substringMatcher(states)
					});
					
					// constructs the suggestion engine
					var states = new Bloodhound({
					  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
					  queryTokenizer: Bloodhound.tokenizers.whitespace,
					  // `states` is an array of state names defined in "The Basics"
					  local: $.map(states, function(state) { return { value: state }; })
					});
					 
					// kicks off the loading/processing of `local` and `prefetch`
					states.initialize();
					 
					$('#bloodhound .typeahead').typeahead({
					  hint: true,
					  highlight: true,
					  minLength: 1
					},
					{
					  name: 'states',
					  displayKey: 'value',
					  // `ttAdapter` wraps the suggestion engine in an adapter that
					  // is compatible with the typeahead jQuery plugin
					  source: states.ttAdapter()
					});
			}
		});
		
		carousel.shutterView = Marionette.ItemView.extend({
			template : shutterTpl,
			onShow: function(){
				var container = $('#shutter'),
				li = container.find('li');

			// Using the tzShutter plugin. We are giving the path
			// to he shutter.png image in the plugin folder and two
			// callback functions.

			container.tzShutter({
				imgSrc: 'assets/js/vendor/jquery.shutter/shutter.png',
				closeCallback: function(){

					// Cycling the visibility of the li items to
					// create a simple slideshow.

					li.filter(':visible:first').hide();
					
					if(li.filter(':visible').length == 0){
						li.show();
					}
					
					// Scheduling a shutter open in 0.1 seconds:
					setTimeout(function(){container.trigger('shutterOpen')},100);
				},
				loadCompleteCallback:function(){
					setInterval(function(){
						container.trigger('shutterClose');
					},4000);
					
					container.trigger('shutterClose');
				}
			});
			}
		});
		
		carousel.facebookwallView = Marionette.ItemView.extend({
			template : facebookwallTpl,
			onShow: function(){
				$('#wall').facebookWall({
					id:'smashmag',
					access_token:'191042970944652|NGJyz1d0Kclt2XO3AyrjHmrKOHo'
				});
			}
		});
		
		carousel.countdownView = Marionette.ItemView.extend({
			template : countdownTpl,
			onShow: function(){
				var note = $('#note'),
				ts = new Date(2012, 0, 1),
				newYear = true;
			
			if((new Date()) > ts){
				// The new year is here! Count towards something else.
				// Notice the *1000 at the end - time must be in milliseconds
				ts = (new Date()).getTime() + 10*24*60*60*1000;
				newYear = false;
			}
				
			$('#countdown').countdown({
				timestamp	: ts,
				callback	: function(days, hours, minutes, seconds){
					
					var message = "";
					
					message += days + " day" + ( days==1 ? '':'s' ) + ", ";
					message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
					message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
					message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br />";
					
					if(newYear){
						message += "left until the new year!";
					}
					else {
						message += "left to 10 days from now!";
					}
					
					note.html(message);
				}
			});
			}
		});
		
		carousel.colortipView = Marionette.ItemView.extend({
			template : colortipTpl,
			onShow: function(){
				$('[title]').colorTip({color:'yellow'});
			}
		});
		
		carousel.bubbleView = Marionette.ItemView.extend({
			template : bubbleTpl,
			onShow: function(){
				var photos = [
				      		'http://farm6.static.flickr.com/5230/5822520546_dd2b6d7e24_z.jpg',
				      		'http://farm5.static.flickr.com/4014/4341260799_b466a1dfe4_z.jpg',
				      		'http://farm6.static.flickr.com/5138/5542165153_86e782382e_z.jpg',
				      		'http://farm5.static.flickr.com/4040/4305139726_829be74e29_z.jpg',
				      		'http://farm4.static.flickr.com/3071/5713923079_60f53b383f_z.jpg',
				      		'http://farm5.static.flickr.com/4108/5047301420_621d8a7912_z.jpg'
				      	];
				      	
				      	var slideshow = $('#slideShow').bubbleSlideshow(photos);

			      		slideshow.autoAdvance(5000);

			}
		});
		
		
	    function changePage(page) {
	        $(page.el).attr('data-role', 'page');
	        page.render();
	        $('body').append($(page.el));
	        var transition = $.mobile.defaultPageTransition;
	        // We don't want to slide the first page
	        if (this.firstPage) {
	            transition = 'none';
	            this.firstPage = false;
	        }
	        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
	    }

		Page1View = Backbone.View.extend({

		    template:page1Tpl

		});

		Page2View = Backbone.View.extend({

		    template: page2Tpl

		});
		carousel.MobileView = Marionette.ItemView.extend({
			template: mobileTpl,
			events: {
				'click #page1': 'showPage1',
				'click #page2': 'showPage2'
			
			},
			showPage1: function(){
				console.log('#page1');
		        //changePage(new Page1View());
			},
			showPage2: function(){
				console.log('#page2');
		        //changePage(new Page2View());
			}
		});
		
		carousel.ajaxView = Marionette.ItemView.extend({
			template : ajaxTpl,
			onShow: function(){
				var jcarousel = $('.jcarousel').jcarousel();

		        $('.jcarousel-control-prev')
		            .on('jcarouselcontrol:active', function() {
		                $(this).removeClass('inactive');
		            })
		            .on('jcarouselcontrol:inactive', function() {
		                $(this).addClass('inactive');
		            })
		            .jcarouselControl({
		                target: '-=1'
		            });

		        $('.jcarousel-control-next')
		            .on('jcarouselcontrol:active', function() {
		                $(this).removeClass('inactive');
		            })
		            .on('jcarouselcontrol:inactive', function() {
		                $(this).addClass('inactive');
		            })
		            .jcarouselControl({
		                target: '+=1'
		            });

		        var setup = function(data) {
		            var html = '<ul>';

		            $.each(data.items, function() {
		                html += '<li><img src="' + this.src + '" alt="' + this.title + '"></li>';
		            });

		            html += '</ul>';

		            // Append items
		            jcarousel
		                .html(html);

		            // Reload carousel
		            jcarousel
		                .jcarousel('reload');
		        };

		        $.getJSON('assets/data/carousel-data.json', setup);
			}
		});
		
		carousel.sidebarView = Marionette.ItemView.extend({
			template: sidebarTpl,
			onShow: function(){
				  var map = L.map('map');
			        map.setView([51.2, 7], 9);

			        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			            maxZoom: 18,
			            attribution: 'Map data &copy; OpenStreetMap contributors'
			        }).addTo(map);

			        var sidebar = L.control.sidebar('sidebar', {
			            closeButton: true,
			            position: 'left'
			        });
			        map.addControl(sidebar);

			        setTimeout(function () {
			            sidebar.show();
			        }, 500);

			        var marker = L.marker([51.2, 7]).addTo(map).on('click', function () {
			            sidebar.toggle();
			        });

			        map.on('click', function () {
			            sidebar.hide();
			        })

			        sidebar.on('show', function () {
			            console.log('Sidebar visible.');
			        });

			        sidebar.on('hide', function () {
			            console.log('Sidebar hidden.');
			        });

			        L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
			            console.log('Close button clicked.');
			        });
			}
		})
		
		var mainView = new carousel.MainView();
		carousel.controller = {
			show : function() {
				App.navigate("carousel");
				App.mainRegion.show(mainView);
			},
			ajax: function(){
				mainView.content.show(new carousel.ajaxView());
			},
			basic: function(){
				mainView.content.show(new carousel.basicView());
				$('.jcarousel').jcarousel();

		        $('.jcarousel-control-prev')
		            .on('jcarouselcontrol:active', function() {
		                $(this).removeClass('inactive');
		            })
		            .on('jcarouselcontrol:inactive', function() {
		                $(this).addClass('inactive');
		            })
		            .jcarouselControl({
		                target: '-=1'
		            });

		        $('.jcarousel-control-next')
		            .on('jcarouselcontrol:active', function() {
		                $(this).removeClass('inactive');
		            })
		            .on('jcarouselcontrol:inactive', function() {
		                $(this).addClass('inactive');
		            })
		            .jcarouselControl({
		                target: '+=1'
		            });

		        $('.jcarousel-pagination')
		            .on('jcarouselpagination:active', 'a', function() {
		                $(this).addClass('active');
		            })
		            .on('jcarouselpagination:inactive', 'a', function() {
		                $(this).removeClass('active');
		            })
		            .jcarouselPagination();
			},
			showCountdown: function(){
				mainView.content.show(new carousel.countdownView());
			},
			showFacebookwall: function(){
				mainView.content.show(new carousel.facebookwallView());
			},
			showShutter: function(){
				mainView.content.show(new carousel.shutterView());
			},
			showBubble: function(){
				mainView.content.show(new carousel.bubbleView());
			},
			showColortip: function(){
				mainView.content.show(new carousel.colortipView());
			},
			showTypeahead: function(){
				mainView.content.show(new carousel.typeaheadView());
			},
			showTether: function(){
				mainView.content.show(new carousel.tetherView());
			},
			showFacebook: function(){
				mainView.content.show(new carousel.facebookView());
			},
			showPeity: function(){
				mainView.content.show(new carousel.peityView());
			},
			showMobile: function(){
				mainView.content.show(new carousel.MobileView());
			},
			showLeafletSidebar: function(){
				mainView.content.show(new carousel.sidebarView());
			},
			showChart: function(){
				mainView.content.show(new carousel.chartView());
			},
			showD3Chart: function(){
				mainView.content.show(new carousel.d3chartView());
			},
			showVein: function(){
				mainView.content.show(new carousel.veinView());
			},
			showSkrollr: function(){
				mainView.content.show(new carousel.skrollrView());
			},
			showTransit: function(){
				mainView.content.show(new carousel.transitView());
			},
			showParallax: function(){
				mainView.content.show(new carousel.parallxView());
			},
			showSuperscrollorama: function(){
				mainView.content.show(new carousel.superscrolloramaView());
			},
			showMove: function(){
				mainView.content.show(new carousel.moveView());
			}
				
		}

		App.on("carousel:show", function() {
			carousel.controller.show();
		});

		carousel.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"carousel" : "show",
				'jcarousel/ajax': 'ajax',
				'jcarousel/basic': 'basic',
				'jcarousel/countdown': 'showCountdown',
				'jcarousel/facebookwall': 'showFacebookwall',
				'jcarousel/shutter': 'showShutter',
				'jcarousel/bubble': 'showBubble',
				'jcarousel/colortip': 'showColortip',
				'jcarousel/typeahead': 'showTypeahead',
				'jcarousel/tether': 'showTether',
				'jcarousel/facebook': 'showFacebook',
				'jcarousel/peity': 'showPeity',
				'jcarousel/jquerymobile': 'showMobile',
				'jcarousel/sidebar': 'showLeafletSidebar',
				'jcarousel/chart': 'showChart',
				'jcarousel/d3chart': 'showD3Chart',
				'jcarousel/vein': 'showVein',
				'jcarousel/skrollr': 'showSkrollr',
				'jcarousel/transit': 'showTransit',
				'jcarousel/parallax': 'showParallax',
				'jcarousel/superscrollorama': 'showSuperscrollorama',
				'jcarousel/move': 'showMove'
				
			}
		});

		App.addInitializer(function() {
			new carousel.Router({
				controller : carousel.controller
			});
		});
	});
	return App.carousel.controller;
})