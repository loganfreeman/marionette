define([ 'app',
         'stache!apps/paginator/main',
         'stache!apps/paginator/contextmenu',
         'tpl!apps/paginator/image.html',
         'tpl!apps/paginator/position.html',
         'tpl!apps/paginator/form.html',
         'tpl!apps/paginator/infinite.html',
         'tpl!apps/paginator/resultItemTemplate.html',
         'tpl!apps/paginator/tmpServerPagination.html',
         'tpl!apps/paginator/infinite-mode.html',
         'tpl!apps/paginator/client-mode.html',
         'tpl!apps/paginator/server-mode.html',
         'tpl!apps/paginator/relationModel.html',
         'tpl!apps/paginator/scrollable.html',
         'tpl!apps/paginator/jscrollpane.html',
         'tpl!apps/paginator/nested.html',
         'css!apps/paginator/relationModel', 
         'css!apps/paginator/style', 
         'css!apps/paginator/position', 
         'css!apps/paginator/image',
         'css!apps/paginator/contextmenu',
         'css!apps/paginator/jscrollpane',
         'css!apps/paginator/nested',
         'backbone.paginator','backbone-forms', 'bootstrap3-forms', 'jquery.tooltip', 'jquery.ui.position', 
          'backbone-pageable', 'backbone-relational', 'backgrid', 'backgrid-text-cell', 'backgrid-paginator', 'jquery-ui-scrollable',
          'jquery.jscrollpane',
          'jquery.nested'], function(App, viewTpl, 
        		 contextmenuTpl,
        		 imageTpl, positionTpl, formTpl, infiniteTpl, resultItemTemplate, tmpServerPagination,
        		 infiniteModeTpl, clientModeTpl, serverModeTpl,
        		 relationModelTPl, scrollableTPl,
        		 jscrollpaneTpl,
        		 nestedTpl) {
	App.module('paginator', function(paginator, App, Backbone, Marionette, $, _) {
		
		    
		    function left(el, using){
		    	el.position({
			        my: "right middle",
			        at: "left middle",
			        of: "#img-container",
			        collision: "none",
			        using: using
			      });
		    }
		    
		    function right(el, using){
		    	el.position({
			        my: "left middle",
			        at: "right middle",
			        of: "#img-container",
			        collision: "none",
			        using: using
			      });
		    }
		    
		    function center(el, using){
		    	el.position({
			        my: "center middle",
			        at: "center middle",
			        of: "#img-container",
			        using: using
			      });
		    }
		    
		    
		    function animate( to ) {
		        $( this ).stop( true, false ).animate( to );
		      }
		      function next( event ) {
		        event.preventDefault();
		        center($( "img:eq(2)" ), animate)
		        left($( "img:eq(1)" ) , animate)
		        right($( "img:eq(0)" ) , animate)
		        $( "img:eq(0)" ).appendTo( "#img-container" );
		      }
		      function previous( event ) {
		        event.preventDefault();
		        center($( "img:eq(0)" ), animate)
		        right($( "img:eq(1)" ) , animate)
		        left($( "img:eq(2)" ) , animate)
		        $( "img:eq(2)" ).prependTo( "#img-container" );
		      }
		    		    
		    
		    
		
		paginator.collections = {};
		paginator.models = {};
		paginator.views = {};
		paginator.mixins = {};
		
		paginator.models.Item = Backbone.Model.extend({});
		
		// collection model
		paginator.collections.PaginatedCollection = Backbone.Paginator.requestPager.extend({

			// As usual, let's specify the model to be used
			// with this collection
			model: paginator.models.Item,

			// Next, we're going to map the parameters supported by
			// your API or backend data service back to attributes
			// that are internally used by Backbone.Paginator. 

			// e.g the GitHub API refers to it's parameter for
			// stating how many results to skip ahead by as $skip
			// and it's number of items to return per page as $top

			// We simply map these to the relevant Paginator equivalents
			// shown on the left hand side to get everything working.

			paginator_core: {
				// the type of the request (GET by default)
				type: 'GET',
				
				// the type of reply (jsonp by default)
				dataType: 'jsonp',
			
				// the URL (or base URL) for the service
				url: 'https://api.github.com/repos/twbs/bootstrap/issues?'
			},
			
			paginator_ui: {
				// the lowest page index your API allows to be accessed
				firstPage: 1,
			
				// which page should the paginator start from 
				// (also, the actual page the paginator is on)
				currentPage: 1,
				
				// how many items per page should be shown
				perPage: 10,
				
				// a default number of total pages to query in case the API or 
				// service you are using does not support providing the total 
				// number of pages for us.
				// 10 as a default in case your service doesn't return the total
				totalPages: 10
			},
			
			server_api: {
				// number of items to return per request/page
				'per_page': function() { return this.perPage },
				
				// how many results the request should skip ahead to
				'page': function() { return this.currentPage },
				
				// field to sort by
				'sort': 'created',
				
				// custom parameters
				'callback': '?'
			},

			parse: function (response) {
				// Normally this would be parsed from the response,
				// but GitHub doesn't make this readily available
				this.totalRecords = this.totalPages * this.perPage;

				// Be sure to change this based on how your results
				// are structured (e.g response.data is GitHub specific)
				return response.data;
			}

		});
		
		paginator.views.ResultView = Marionette.ItemView.extend({
			tagName : 'li',
			template: resultItemTemplate,

			initialize: function() {
				this.model.bind('change', this.render, this);
				this.model.bind('destroy', this.remove, this);
			}
		});
		
		paginator.jscrollpaneView = Marionette.ItemView.extend({
			template: jscrollpaneTpl,
			onShow: function(){
				$('.scroll-pane').jScrollPane();				
			}
		});
		
		paginator.views.PaginatedView = Backbone.View.extend({

			events: {
				'click a.servernext': 'nextResultPage',
				'click a.serverprevious': 'previousResultPage',
				'click a.orderUpdate': 'updateSortBy',
				'click a.serverlast': 'gotoLast',
				'click a.page': 'gotoPage',
				'click a.serverfirst': 'gotoFirst',
				'click a.serverpage': 'gotoPage',
				'click .serverhowmany a': 'changeCount'

			},

			tagName: 'aside',

			template: tmpServerPagination,

			initialize: function () {
				this.collection.on('sync', this.render, this);
				this.$el.appendTo('#pagination');
			},

			render: function () {
				var html = this.template(this.collection.info());
				this.$el.html(html);
			},

			updateSortBy: function (e) {
				e.preventDefault();
				var currentSort = $('#sortByField').val();
				this.collection.updateOrder(currentSort);
			},

			nextResultPage: function (e) {
				e.preventDefault();
				this.collection.requestNextPage();
			},

			previousResultPage: function (e) {
				e.preventDefault();
				this.collection.requestPreviousPage();
			},

			gotoFirst: function (e) {
				e.preventDefault();
				this.collection.goTo(this.collection.information.firstPage);
			},

			gotoLast: function (e) {
				e.preventDefault();
				this.collection.goTo(this.collection.information.lastPage);
			},

			gotoPage: function (e) {
				e.preventDefault();
				var page = $(e.target).text();
				this.collection.goTo(page);
			},

			changeCount: function (e) {
				e.preventDefault();
				var per = $(e.target).text();
				this.collection.howManyPer(per);
			}

		});
		
		paginator.views.AppView = Backbone.View.extend({
			el : '#content',

			initialize : function () {

				var tags = this.collection;

				tags.on('add', this.addOne, this);
				tags.on('all', this.render, this);

				tags.pager();

			},

			addOne : function ( item ) {
				var view = new paginator.views.ResultView({model:item});
				$('#content').append(view.render().el);
			},

			render: function(){
			}
		});

		paginator.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions: {
				content : '#paginator-container'
			},
			onShow: function(){
				$('#header-region').hide();
			},
			onClose: function(){
				$('#header-region').show();
			}
		});
		
		paginator.infiniteView = Marionette.ItemView.extend({
			template : infiniteTpl,
			onShow: function(){
				paginator.collections.paginatedItems = new paginator.collections.PaginatedCollection();
				paginator.views.app = new paginator.views.AppView({collection: paginator.collections.paginatedItems});
				paginator.views.pagination = new paginator.views.PaginatedView({collection: paginator.collections.paginatedItems});
			}
		});
		

		var mainView = new paginator.MainView();
		
		var RegisterForm = Backbone.Form.extend({

			template : formTpl,
			
			schema : {
				title : {
					type : 'Select',
					options : [ 'Mr', 'Mrs', 'Ms' ]
				},
				name : {
					validators : [ 'required' ]
				},
				birthday : {
					type : 'Date'
				},
				email : {
					validators : [ 'required', 'email' ]
				},
				password : {
					type : 'Password',
					validators : [ 'required' ]
				},
				confirmPassword : {
					type : 'Password',
					validators : [ 'required', {
						type : 'match',
						field : 'password',
						message : 'Passwords must match!'
					} ]
				}
			}

		});
		
		var form = new RegisterForm();
		
		form.on('submit', function(){
			alert('form submitted');
		    var errs = form.validate();
		    console.log(errs);

		    if (errs) event.preventDefault();
		})
		

		function position() {
			$(".positionable").position({
				of : $("#parent"),
				my : $("#my_horizontal").val() + " " + $("#my_vertical").val(),
				at : $("#at_horizontal").val() + " " + $("#at_vertical").val(),
				collision : $("#collision_horizontal").val() + " " + $("#collision_vertical").val()
			});
		}

		paginator.positionView = Marionette.ItemView.extend({
			template : positionTpl,

			ui : {
				input : "select, input",
				positionable: ".positionable",
				parent: "#parent"
			},

			onShow : function() {

				this.ui.positionable.css("opacity", 0.5);

				this.ui.input.bind("click keyup change", position);

				this.ui.parent.draggable({
					drag : position
				});

				position();
				
				$( "#position1" ).position({
					  my: "center",
					  at: "center",
					  of: "#targetElement"
					});
					 
					$( "#position2" ).position({
					  my: "left top",
					  at: "left top",
					  of: "#targetElement"
					});
					 
					$( "#position3" ).position({
					  my: "right center",
					  at: "right bottom",
					  of: "#targetElement"
					});
					 
				
			}
		});
		
		paginator.imageView = Marionette.ItemView.extend({
			template : imageTpl,

			ui : {
				container : "#img-container",
			},
			onShow: function(){
				
				var that = this;
				left(this.$( "img:eq(0)" ));
				center(this.$( "img:eq(1)" ));
				right(this.$( "img:eq(2)" ));
				
				this.$( "#previous" ).click( previous );
			    this.$( "#next" ).click( next );
			 
			    this.$( "img" ).click(function( event ) {
			    	that.$( "img" ).index( this ) === 0 ? previous( event ) : next( event );
			    });
			 
			    $( window ).resize(function() {
			    	that.$( "img:eq(0)" ).left( animate );
			    	that.$( "img:eq(1)" ).center( animate );
			    	that.$( "img:eq(2)" ).right( animate );
			    });
			}

		});
		
		paginator.contextmenuView = Marionette.ItemView.extend({
			template : contextmenuTpl,

			onClose: function(){
				$.contextMenu( 'destroy' );
			},
			onShow: function(){
				 $.contextMenu({
				        selector: '.context-menu-one', 
				        callback: function(key, options) {
				            var m = "clicked: " + key;
				            window.console && console.log(m) || alert(m); 
				        },
				        items: {
				            "edit": {name: "Edit", icon: "edit"},
				            "cut": {name: "Cut", icon: "cut"},
				            "copy": {name: "Copy", icon: "copy"},
				            "paste": {name: "Paste", icon: "paste"},
				            "delete": {name: "Delete", icon: "delete"},
				            "sep1": "---------",
				            "quit": {name: "Quit", icon: "quit"}
				        }
				    });
				    
				    $('.context-menu-one').on('click', function(e){
				        console.log('clicked', this);
				    });
				    $('#the-node').contextMenu({
				        selector: 'li', 
				        callback: function(key, options) {
				            var m = "clicked: " + key + " on " + $(this).text();
				            window.console && console.log(m) || alert(m); 
				        },
				        items: {
				            "edit": {name: "Edit", icon: "edit"},
				            "cut": {name: "Cut", icon: "cut"},
				            "copy": {name: "Copy", icon: "copy"},
				            "paste": {name: "Paste", icon: "paste"},
				            "delete": {name: "Delete", icon: "delete"},
				            "sep1": "---------",
				            "quit": {name: "Quit", icon: "quit"}
				        }
				    });
				    $('#add-trigger').on('click', function(e) {
				        $('<div style="padding: 10px; margin: 10px;" class="inline-spaces context-menu-one box menu-injected">'
				            + 'right click me <em>(injected)</em>'
				            + '</div>').insertBefore(this);

				        // not need for re-initializing $.contextMenu here :)
				    });
				    
				    $.contextMenu({
				        selector: '.ondemand.context-menu-one', 
				        build: function($trigger, e) {
				            // this callback is executed every time the menu is to be shown
				            // its results are destroyed every time the menu is hidden
				            // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
				            return {
				                callback: function(key, options) {
				                    var m = "clicked: " + key;
				                    window.console && console.log(m) || alert(m); 
				                },
				                items: {
				                    "edit": {name: "Edit", icon: "edit"},
				                    "cut": {name: "Cut", icon: "cut"},
				                    "copy": {name: "Copy", icon: "copy"},
				                    "paste": {name: "Paste", icon: "paste"},
				                    "delete": {name: "Delete", icon: "delete"},
				                    "sep1": "---------",
				                    "quit": {name: "Quit", icon: "quit"}
				                }
				            };
				        }
				    });
				    
				    $.contextMenu({
				        selector: '.onhover.context-menu-one', 
				        trigger: 'hover',
				        delay: 500,
				        callback: function(key, options) {
				            var m = "clicked: " + key;
				            window.console && console.log(m) || alert(m); 
				        },
				        items: {
				            "edit": {name: "Edit", icon: "edit"},
				            "cut": {name: "Cut", icon: "cut"},
				            "copy": {name: "Copy", icon: "copy"},
				            "paste": {name: "Paste", icon: "paste"},
				            "delete": {name: "Delete", icon: "delete"},
				            "sep1": "---------",
				            "quit": {name: "Quit", icon: "quit"}
				        }
				    });
			}

		});
		
		var columns = [{
	        name: "number",
	        cell: Backgrid.IntegerCell.extend({ orderSeparator: '' }),
	        editable: false,
	        sortable: false
	      }, {
	        name: "title",
	        cell: "string",
	        sortable: false
	      }, {
	        name: "body",
	        cell: "text",
	        sortable: false
	      }, {
	        name: "updated_at",
	        cell: "datetime",
	        editable: false,
	        sortable: false
	      }, {
	        name: "closed_at",
	        cell: "datetime",
	        editable: false,
	        sortable: false
	      }];

	      var Issue = Backbone.Model.extend({});

	      // Works exactly like Backbone.Collection.
	      var Issues = Backbone.PageableCollection.extend({
	        model: Issue,

	        // Enable infinite paging
	        mode: "infinite",

	        url: "https://api.github.com/repos/jashkenas/backbone/issues?state=closed",

	        // Initial pagination states
	        state: {
	          pageSize: 15,
	          sortKey: "updated",
	          order: 1
	        },

	        // You can remap the query parameters from `state` keys from
	        // the default to those your server supports
	        queryParams: {
	          totalPages: null,
	          totalRecords: null,
	          sortKey: "sort"
	        }
	      });


		
		paginator.infiniteModeView = Marionette.ItemView.extend({
			template : infiniteModeTpl,		
			onShow: function(){
				
			      var issues = new Issues();

				
			      var grid = new Backgrid.Grid({
				        columns: columns,
				        collection: issues
				      });


			      // make a new for infinite paging
			      var paginator = new Backgrid.Extension.Paginator({
			        renderIndexedPageHandles: false,
			        collection: issues,
			        controls: {
			          rewind: null,
			          fastForward: null
			        }
			      });

			      $("#grid").append(grid.render().$el);
			      $("#paginator").append(paginator.render().$el);

			      issues.fetch();
			}
		});
		
		paginator.clientModeView = Marionette.ItemView.extend({
			template : clientModeTpl,	
			onShow: function(){
				 var columns = [{
				        name: "id",
				        editable: false,
				        cell: Backgrid.IntegerCell.extend({
				          orderSeparator: ''
				        })
				      }, {
				        name: "name",
				        cell: "string"
				      }, {
				        name: "pop",
				        cell: "integer"
				      }, {
				        name: "percentage",
				        cell: "number"
				      }, {
				        name: "date",
				        cell: "date"
				      }, {
				        name: "url",
				        cell: "uri"
				      }];

				      var Territories = Backbone.PageableCollection.extend({
				        url: "json/pageable-territories.json",
				        mode: "client"
				      });

				      var territories = new Territories();

				      var grid = new Backgrid.Grid({
				        columns: columns,
				        collection: territories
				      });

				      var paginator = new Backgrid.Extension.Paginator({
				        collection: territories
				      });

				      $("#grid").append(grid.render().$el);
				      $("#paginator").append(paginator.render().$el);
				      
				      territories.fetch();

			}
		});
		
		paginator.serverModeView = Marionette.ItemView.extend({
			template : serverModeTpl,	
			onShow: function(){
			      var Issues = Backbone.PageableCollection.extend({

			          url: "https://api.github.com/search/issues",

			          // Initial pagination states
			          state: {
			            pageSize: 30,
			            sortKey: "updated",
			            order: 1
			          },

			          // You can remap the query parameters from `state` keys from
			          // the default to those your server supports
			          queryParams: {
			            totalPages: null,
			            totalRecords: null,
			            sortKey: "sort",
			            q: "state:closed repo:jashkenas/backbone"
			          },

			          // get the state from Github's search API result
			          parseState: function (resp, queryParams, state, options) {
			            return {totalRecords: resp.total_count};
			          },

			          // get the actual records
			          parseRecords: function (resp, options) {
			            return resp.items;
			          }

			        });

			        var issues = new Issues();

			        var grid = new Backgrid.Grid({
			          columns: [{
			            name: "id",
			            cell: Backgrid.IntegerCell.extend({ orderSeparator: '' }),
			            sortable: false,
			            editable: false
			          }, {
			             name: "title",
			             cell: "string",
			             sortable: false,
			             editable: false
			           }, {
			             name: "body",
			             cell: "text", // See the TextCell extension
			             sortable: false
			           }, {
			             name: "comments",
			             cell: "integer"
			           }],

			          collection: issues
			        });

			        var paginator = new Backgrid.Extension.Paginator({
			          collection: issues
			        });

			        $("#grid").append(grid.render().$el);
			        $("#paginator").append(paginator.render().$el);

			        issues.fetch({reset: true});
			}
		});
		
		paginator.relationModelView = Marionette.ItemView.extend({
			template: relationModelTPl
		});
		
		paginator.nestedView = Marionette.ItemView.extend({
			

			template: nestedTpl,
			onShow: function(){
				function makeBoxes() {
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
					}
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
		
		paginator.scrollableView = Marionette.ItemView.extend({
			template: scrollableTPl,
			onShow: function(){
				var vpw = $(window).width(),
			       vph = $(window).height();

			   $('#offset')
			      .css({
			         borderWidth: '5px',
			         borderStyle: 'solid',
			         borderColor: 'silver',
			         left: vpw * 0.2,
			         top: vph * 0.2,
			         width: vpw * 0.8 - vpw * 0.2,
			         height: vph * 0.8 - vph * 0.2
			      });

			   $('div.scrolling')
			      .width(50).height(50)
			      .css({
			            left: $('#bounds').width() * 0.5,
			            top: $('#bounds').height() * 0.5
			         })
			      .scrollable({ offset: { x: '40%', y: '40%' } })
			      .on('scrollout', function ( e, ui) {

			            $.each( ['top', 'right', 'bottom', 'left'], function ( val, prop ) {

			                  if ( ui.position[this] )
			                     $('#offset').css('border-'+prop+'-color', 'red');
			               });

			            $(this).scrollable('goto', {
			               complete: function () {

			                  $('#offset').css('border-color', 'silver');
			               }
			            });

			         })
			      .scrollable('goto', { onlyOutside: true });
			}
		});
				
		paginator.controller = {
				show : function() {
					App.navigate("paginator");
					App.mainRegion.show(mainView);
				},
				infinite: function(){
					mainView.content.show(new paginator.infiniteView());
				},
				showForm : function() {
					mainView.content.show(form);
					$('.mytooltip').tooltipster();
				},
				showPosition: function(){
					mainView.content.show(new paginator.positionView());
				},
				showImage: function(){
					mainView.content.show(new paginator.imageView());
				},
				showContextMenu: function(){
					mainView.content.show(new paginator.contextmenuView());
				},
				showInfiniteMode: function(){
					mainView.content.show(new paginator.infiniteModeView());
				},
				showClientMode: function(){
					mainView.content.show(new paginator.clientModeView());
				},
				showServerMode: function(){
					mainView.content.show(new paginator.serverModeView());
				},
				showRelation: function(){
					mainView.content.show(new paginator.relationModelView());
				},
				showScrollable: function(){
					mainView.content.show(new paginator.scrollableView());
				},
				showJScroll: function(){
					mainView.content.show(new paginator.jscrollpaneView());
				},
				showNested: function(){
					mainView.content.show(new paginator.nestedView());
				}
			}

		App.on("paginator:show", function() {
			paginator.controller.show();
		});

		paginator.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"paginator" : "show",
				'paginator/infinite' : 'infinite',
				'paginator/form' : 'showForm',
				'paginator/position' : 'showPosition',
				'paginator/image' : 'showImage',
				'paginator/contextmenu' : 'showContextMenu',
				'paginator/infinitemode' : 'showInfiniteMode',
				'paginator/clientmode' : 'showClientMode',
				'paginator/servermode' : 'showServerMode',
				'paginator/relationmodel' : 'showRelation',
				'paginator/scrollable' : 'showScrollable',
				'paginator/jscrollpane' : 'showJScroll',
				'paginator/nested' : 'showNested'
			}
		});

		App.addInitializer(function() {
			new paginator.Router({
				controller : paginator.controller
			});
		});
	});
	return App.paginator.controller;
})