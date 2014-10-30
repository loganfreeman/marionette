define([ 'app',
         'tpl!apps/jlayout/main.tpl',
         'tpl!apps/jlayout/listing.tpl',
         'tpl!apps/jlayout/details.tpl',
         'tpl!apps/jlayout/maincontent.tpl',
         'jquery.layout',
         'css!apps/jlayout/css/main'], function(App, mainTpl, listingTpl, detailsTpl, maincontentTpl) {
	App.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {
				
		Layout.vent = new Backbone.Wreqr.EventAggregator();
		
		Layout.Member = Backbone.Model.extend({

		});
		Layout.Members = Backbone.Collection.extend({
			model: Layout.Member,

		});
		Layout.Team = Backbone.Model.extend({
			initialize: function(){
				// Each team is initially containing an array, we need to convert that
				// into a Collection...
				var membersCollection = new Layout.Members(this.get('teamMembers'));
				this.set('teamMembers', membersCollection);
			},
		});
		Layout.Teams = Backbone.Collection.extend({
			model: Layout.Team,
		});
		
		Layout.Game = Backbone.Model.extend({

		});
		
		Layout.TourneyGame = Backbone.Model.extend({

			initialize: function(){
				var game = new Layout.Game(this.get('game'));
				var teams = new Layout.Teams(this.get('teams'));
				this.set('game', game);
				this.set('teams', teams);
			},
		});
		Layout.TourneyGames = Backbone.Collection.extend({
			model: Layout.TourneyGame,
		});
		
		Layout.Tourney = Backbone.Model.extend({

			initialize: function(){
				var tourneyGames = new Layout.TourneyGames(this.get('eventGames'));
				this.set('tourneyGames', tourneyGames);
			}
		});
		Layout.Tourneys = Backbone.Collection.extend({
			model: Layout.Tourney,
			url: 'assets/js/apps/jlayout/mock-darts-tourneys.json',
		});
		
		Layout.TourneyManagerLayout = Backbone.Marionette.Layout.extend({
	        template: mainTpl,
	        className: "outer-center",
	        
	        regions: {
	            tourneyListing: "#tourney-manager-listing",
	            tourneyDetails: "#tourney-manager-detail",
	            status: "#tourney-manager-status"
	        },
	    	
	        initialize: function(){
				var that = this;
	    		App.on("selectedTourney:changed", function(myTourney){	    			
					if(that.tourneyDetails) that.tourneyDetails.show(new Layout.TourneyDetails({model: myTourney}));
				});
			},
		
	    });
	     
		Layout.TourneyListing = Backbone.Marionette.ItemView.extend({
	        tagName: "li",
	        template: listingTpl, 
			
			events: {
				"click a": "showDetailedView"
			},
			
			showDetailedView: function(){
				App.trigger("selectedTourney:changed", this.model);
			}
			   });
	    
		Layout.TourneysListing = Backbone.Marionette.CollectionView.extend({
	        tagName: "ul",
	        itemView: Layout.TourneyListing,
	    });
	        
		Layout.TourneyDetails = Backbone.Marionette.ItemView.extend({
			template: detailsTpl
		});
		
		Layout.MainView = Backbone.Marionette.Layout.extend({
			template: maincontentTpl,
			regions: {
				'mainContent' : '#main-content'
			}
		});

		Layout.mainView = new Layout.MainView();

		Layout.controller = {
			show : function() {
				App.navigate("jquery-layout");
				Layout.tourneyCollection = new Layout.Tourneys();
				Layout.tourneyCollection.fetch();
				
				App.mainRegion.show(Layout.mainView);
				
                
                // Start the application's top-level regions
                var tourneyManager = new Layout.TourneyManagerLayout();
                
				Layout.mainView.mainContent.show(tourneyManager);


                
                // Within that top-level region, show the listing of the tourneys
				tourneyManager.tourneyListing.show(new Layout.TourneysListing({collection: Layout.tourneyCollection}));
				
				// lay out
				$("#main-content").layout({
					applyDefaultStyles:   true,
					center__paneSelector: ".outer-center",
					spacing__open:        8,
					spacing__closed:      12,
					center__childOptions: {
						center__paneSelector:  ".middle-center",
						east__paneSelector:    ".middle-east",
						west__paneSelector:    ".middle-west",
						north__paneSelector:    ".middle-north",
						south__paneSelector:    ".middle-south",
						west__size:    250,
						south__size:    25,
						spacing__open:        8,
						spacing__closed:        12,
					}
				});
				                

				
			}
		}

		App.on("jquery-layout:show", function() {
			Layout.controller.show();
		});

		Layout.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"jquery-layout" : "show"
			}
		});

		Layout.addInitializer(function() {
			new Layout.Router({
				controller : Layout.controller
			});
		});
	});
	return App.Layout.controller;
})