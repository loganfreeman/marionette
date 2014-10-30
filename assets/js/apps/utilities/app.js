define([ 'app',
         'stache!apps/utilities/main',
         'stache!apps/utilities/isotope',
         'stache!apps/utilities/waypoints', 'stache!apps/utilities/enquire',
         'stache!apps/utilities/nested', 'stache!apps/utilities/fullpage',
         'stache!apps/utilities/fuelex', 'stache!apps/utilities/fittext',
         'stache!apps/utilities/viewsource', 'stache!apps/utilities/progressbar',
         'isotope.pkgd', 'cellsbyrow', 'masonry', 'spin',
         'css!apps/utilities/style', 'css!apps/utilities/waypoints','css!apps/utilities/progressbar',
         'vendor/wow', 'css!vendor/css/animate', 'waypoints', 'vendor/waypoints-infinite', 'vendor/enquire', 
         'jquery.nested', 'jquery.fullPage', 'moment', 'fuelux/all', 'jquery.gridster', 'vendor/jquery.fittext', 
         'vendor/jquery.lettering', 'vendor/authormarks', 'vendor/jquery.webfonts', 
         'vendor/jquery.typer', 'vendor/bigtext', 'vendor/jquery.balancetext', 'vendor/cufon'], function(App, viewTpl, 
        		 isotopeTpl, waypointsTpl, enquireTpl, nestedTpl, fullpageTpl, fuelexTpl, fittextTpl, viewsourceTpl,progressbarTpl,
        		 Isotope, CellsByRow, Masonry, Spinner) {
	App.module('utilities', function(utilities, App, Backbone, Marionette, $, _) {
		
		function getText( elem ) {
			  return elem.textContent || elem.innerText;
			}

		utilities.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions: {
				content: '#utilities-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		utilities.progressbarView = Marionette.ItemView.extend({
			template : progressbarTpl,
			onShow: function(){
				
			}
		});
		
		utilities.viewsourceView = Marionette.ItemView.extend({
			template : viewsourceTpl,
			onShow: function(){
				$("<pre />", {
					"html":   '&lt;!DOCTYPE html>\n&lt;html>\n' + 
							$("html")
								.html()
								.replace(/[<>]/g, function(m) { return {'<':'&lt;','>':'&gt;'}[m]})
								.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>') + 
							'\n&lt;/html>',
					"class": "prettyprint"
				}).appendTo("#source-code");
				
				prettyPrint();
			}
		});
		
		utilities.fittextView = Marionette.Layout.extend({
			template : fittextTpl,
			onShow: function(){
				$("#fittext1").fitText();
				$("#fittext2").fitText(1.2);
				$("#fittext3").fitText(1.1, { minFontSize: '50px', maxFontSize: '75px' });
				
				$("#demo1 h1").lettering();
				$("#demo2 h1").lettering('words');
				$("#demo3 p").lettering('lines');
				$("#demo4 h1").lettering('words').children("span").lettering();
				$("#demo5 h1").lettering().children("span").css({'display':'inline-block', '-webkit-transform':'rotate(-25deg)'});
				
				$( 'div#webfonts-container' ).webfonts( {
					repository: {
						base: 'assets/fonts/',
						fonts: {
							"Rufscript": {
								eot: "Rufscript.eot",
								ttf: "Rufscript.ttf",
								woff: "Rufscript.woff",
								version: "0.1"
							},
							"UnifrakturMaguntia": {
								eot: "UnifrakturMaguntia.eot",
								ttf: "UnifrakturMaguntia.ttf",
								woff: "UnifrakturMaguntia.woff",
								version: "2012-02-11"
							}
						},
						languages: {
							en: [ 'Sans', 'Rufscript', 'UnifrakturMaguntia' ]
						}
					},
					exclude: '.webfonts-exclude'
				} );

				// get an instance of WebFonts
				var $webfonts = $( 'div#webfonts-container' ).data( 'webfonts' );
				// Get a list of all fonts provided by WebFonts
				var fonts = $webfonts.list();
				// Also test system fonts.
				$.merge( fonts, [ 'Courier', 'Sans', 'Serif', 'Monospace' ] );
				var $fontSelector = $( 'select#fontselector' );
				$.each( fonts, function( key, font ) {
					$fontSelector.append( $( "<option></option>" ).attr( "value", font ).text( font ) );
				} );
				$fontSelector.append( $( "<option></option>" ).text( 'Reset' ) );
				$fontSelector.on( 'change', function() {
					var font = $fontSelector.find( 'option:selected' ).val();
					if ( font === 'Reset' ) {
						$webfonts.reset();
					} else {
						$webfonts.apply( font );
					}
				} );
				$webfonts.apply( 'Rufscript' );
				$('#bigtext').bigtext();
				
				$(".balance-text").balanceText();
				
				require(['vendor/Vegur.font'], function(){
					Cufon.replace('.cufon h1', {
						textShadow: '#fff -1px -1px, #333 1px 1px'
					});

					Cufon.replace('.cufon h2', {
						textShadow: '#fff 1px 1px, #333 -1px -1px'
					});
	
					Cufon.replace('.cufon h3', {
						textShadow: '#333 1px 1px'
					});
	
					Cufon.replace('.cufon h4', {
						textShadow: '-1px -1px rgba(51, 51, 51, 0.6)'
					});
				})
			}
		});
		
		utilities.timelineView = Marionette.ItemView.extend({
			template: _.template('<div id="my-timeline"></div>'),
			onShow: function(){
				require(['apps/utilities/timeline'], function(run){
					run();
				})
			}
		});
		
		utilities.fuelexView = Marionette.ItemView.extend({
			template : fuelexTpl,
			onShow: function(){
				require(['apps/utilities/fuelux'], function(run){
					run();
				})
			}
		});
		
		utilities.fullpageView = Marionette.ItemView.extend({
			template : fullpageTpl,
			onClose: function(){
				$('#fullPage-nav').remove()
			},
			onShow: function(){
				$('#fullpage').fullpage({
					'verticalCentered': false,
					'css3': true,
					'slidesColor': ['#F0F2F4', '#fff', '#fff', '#fff'],
					'navigation': true,
					'navigationPosition': 'right',
					'navigationTooltips': ['fullPage.js', 'Powerful', 'Amazing', 'Simple'],
									
					'afterLoad': function(anchorLink, index){
						if(index == 2){
							$('#iphone3, #iphone2, #iphone4').addClass('active');
						}					
					},
					
					'onLeave': function(index, newIndex, direction){
						if (index == 3 && direction == 'down'){
							$('.section').eq(index -1).removeClass('moveDown').addClass('moveUp');
						}
						else if(index == 3 && direction == 'up'){
							$('.section').eq(index -1).removeClass('moveUp').addClass('moveDown');
						}
						
						$('#staticImg').toggleClass('active', (index == 2 && direction == 'down' ) || (index == 4 && direction == 'up'));
						$('#staticImg').toggleClass('moveDown', index == 3 && direction == 'down');	
					}
				});
			}
		});
		
		utilities.nestedView = Marionette.ItemView.extend({
			template : nestedTpl,
			onShow: function(){

			    $(".gridster ul").gridster({
			        widget_margins: [10, 10],
			        widget_base_dimensions: [140, 140]
			    });
			    
				makeBoxes = function() {
					  var boxes = [],
					      count = Math.random()*15;
					      if (count < 5) count = 5;

					  for (var i=0; i < count; i++ ) {
					    var box = document.createElement('div');
					    box.className = 'box size' +  Math.ceil( Math.random()*3 ) +  Math.ceil( Math.random()*3 );
					    // add box DOM node to array of new elements
					    boxes.push( box );
					  }

					  return boxes;
					};

				 $('#container').nested(); 
				    
				    $('#prepend').click(function(){
				      var boxes = makeBoxes();
				      $('#container').prepend(boxes).nested('prepend',boxes);
				    })
				    $('#append').click(function(){
				      var boxes = makeBoxes();
				      $('#container').append(boxes).nested('append',boxes);     
				    })
			}
		});
		
		utilities.enquireView = Marionette.ItemView.extend({
			template : enquireTpl,
			onShow: function(){
				var opts = {
						  lines: 13, // The number of lines to draw
						  length: 20, // The length of each line
						  width: 10, // The line thickness
						  radius: 30, // The radius of the inner circle
						  corners: 1, // Corner roundness (0..1)
						  rotate: 0, // The rotation offset
						  direction: 1, // 1: clockwise, -1: counterclockwise
						  color: '#000', // #rgb or #rrggbb or array of colors
						  speed: 1, // Rounds per second
						  trail: 60, // Afterglow percentage
						  shadow: false, // Whether to render a shadow
						  hwaccel: false, // Whether to use hardware acceleration
						  className: 'spinner', // The CSS class to assign to the spinner
						  zIndex: 2e9, // The z-index (defaults to 2000000000)
						  top: '50%', // Top position relative to parent
						  left: '50%' // Left position relative to parent
						};
						var target = document.getElementById('foo');
						var spinner = new Spinner(opts).spin(target);
						
				 function queueResizes(target, sizes, step) {
		                var i = 0;
		                
		                step = step || 600;
		                attr = "width";

		                function factory(size) {
		                    return function() {
		                        target.width = size;
		                    }
		                }

		                for(i = 0; i < sizes.length; i++) {
		                    setTimeout(factory(sizes[i]), (i + 1) * step);
		                }
		            }

		            queueResizes(document.querySelector("#suite"), [400, 650, 550]);
			}
		});
		
		utilities.waypointsView = Marionette.ItemView.extend({
			template : waypointsTpl,
			onClose: function(){
				$('.popup').remove()
			},
			
			onShow: function(){
				$('.dial li').waypoint(function(direction) {
					var $active = $(this);
					var property, value;

					/* The waypoint is triggered at the top of each list item representing
					   a dial section. When triggering in the down direction we want to use
					   the dial section the waypoint is attached to. But in the up direction
					   we want to use the previous dial section. */
					if (direction === "up") {
						$active = $active.prev();
					}

					/* If we triggered in the up direction and the result from 'prev' came
					   back with an empty set of elements, it means we were on the first
					   element in the list, and we should just use the original element. */
					if (!$active.length) {
						$active = $(this);
					}

					/* The property the dial controls is a data attribute on the ul. */
					property = $active.closest('.dial').data('property');

					/* The value for that property is a data attribute on each li. */
					value = $active.data('value');
					
					$('#example-target').css(property, value);
				}, {
					context: 'ul' // Make the scroll context the nearest ul.
				});

				$('.dial ul').animate({ scrollTop: 145}, 750, 'swing');
				
				$('body').append($("<div class='popup hiding' id='article-finished'>You have finished reading the article.  Instead of this popup we could track a custom analytics event or show links to related articles the user may be interested in reading. (<a href='http://www.nytimes.com/2011/02/16/technology/16dell.html?ref=technology' target='_blank'>New York Times Online articles</a> do this.)</div>"));
				
				function recordAdEvent(trackid) {
					var el = ($("div[data-analyticsid='"+trackid+"']")),
					popup = $("<div class='popup'>This ad came into your viewport.  Instead of a popup we would track a custom analytics event with this ad&rsquo;s ID: "+trackid+".  Beats using pageviews to track ad views.</div>"),
					close = $("<a href='#' class='close'>X</a>");
					
					el.addClass('active');
					popup.append(close);
					$('body').append(popup);
					popup.css('width', el.outerWidth() - 10);
					popup.css({
						'top': el.offset().top - popup.outerHeight(),
						'left': el.offset().left
					});
					close.click(function(event) {
						$(this).parent().remove();
						el.removeClass('active');
						event.preventDefault();
					});
				}
				
				$('.ad-unit').waypoint(function() {
					//recordAdEvent($(this).data('analyticsid'));
				}, {
					triggerOnce: true,
					offset: 'bottom-in-view'
				});
				
				$('#lcol').waypoint(function(direction) {
					$('#article-finished').toggleClass('hiding', direction === "up");
				}, {
					offset: function() {
						return $.waypoints('viewportHeight') - $(this).height() + 100;
					}
				});
				
				$('.infinite-container').waypoint('infinite');
			}
		});
		
		utilities.isotopeView = Marionette.Layout.extend({
			template : isotopeTpl,		
			onShow: function(){
				wow = new WOW(
					      {
					        animateClass: 'animated',
					        offset:       100
					      }
					    );
					    wow.init();
					    
				  var container = document.querySelector('#container');
				  var iso = window.iso = new Isotope( container, {
				    // sortBy: 'symbol',
				    // filter: '.metal',
				    layoutMode: 'cellsByRow',
				    // isOriginLeft: false,
				    // isOriginTop: false,
				    cellsByRow: {
				      columnWidth: 200,
				      rowHeight: 150
				    },
				    vertical: {
				      horizontalAlignment: 0.5
				    },
				    getSortData: {

				      number: '.number parseInt',
				      symbol: '.symbol',
				      name: '.name',
				      category: '[data-category]',

				      weight: function( itemElem ) {
				        // remove parenthesis
				        return parseFloat( getText( itemElem.querySelector('.weight') ).replace( /[\(\)]/g, '') );
				      }

				    }
				  });

				 $('#options').on('click', function(event){
					 if($(event.target).is('a')){
						  // use link's href, remove leading hash
						    var sortBy = event.target.getAttribute('href').slice( 1 );
						    sortBy.slice( 0, 1 );
						    iso.arrange({ sortBy: sortBy });
						    event.preventDefault();
					 }
				 });
				 
				  ( function() {
					    var container = document.querySelector('#basic');
					    var msnry = new Masonry( container, {
					      isOriginTop: false,
					      columnWidth: 60
					    });
					  })();

					  ( function() {
					    var container = document.querySelector('#stamped');
					    var msnry = new Masonry( container, {
					      itemSelector: '.item',
					      isOriginTop: false,
					      columnWidth: 60,
					      gutter: 10,
					      stamp: '.stamp'
					    });
					  })();
			}
		});
		
		var mainView = new utilities.MainView;

		utilities.controller = {
			show : function() {
				App.navigate("utilities");
				App.mainRegion.show(mainView);
			},
			showisotope: function(){
				mainView.content.show(new utilities.isotopeView)
			},
			showwaypoints: function(){
				mainView.content.show(new utilities.waypointsView)
			},
			showenquire: function(){
				mainView.content.show(new utilities.enquireView)
			},
			shownested: function(){
				mainView.content.show(new utilities.nestedView)
			},
			showfullpage: function(){
				mainView.content.show(new utilities.fullpageView)
			},
			showfuelex: function(){
				mainView.content.show(new utilities.fuelexView)
			},
			showtimeline: function(){
				mainView.content.show(new utilities.timelineView)
			},
			showfittext: function(){
				mainView.content.show(new utilities.fittextView)
			},
			showviewsource: function(){
				mainView.content.show(new utilities.viewsourceView)
			},
			showprogressbar: function(){
				mainView.content.show(new utilities.progressbarView)
			}
		}

		App.on("utilities:show", function() {
			utilities.controller.show();
		});

		utilities.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"utilities" : "show",
				"utilities/isotope" : "showisotope",
				"utilities/waypoints" : "showwaypoints",
				"utilities/enquire" : "showenquire",
				"utilities/nested" : "shownested",
				"utilities/fullpage" : "showfullpage",
				"utilities/fuelex" : "showfuelex",
				"utilities/timeline" : "showtimeline",
				"utilities/fittext" : "showfittext",
				"utilities/viewsource" : "showviewsource",
				"utilities/progressbar" : "showprogressbar",
			}
		});

		App.addInitializer(function() {
			new utilities.Router({
				controller : utilities.controller
			});
		});
	});
	return App.utilities.controller;
})