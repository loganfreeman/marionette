define([ 'app', 'tpl!apps/multimodelview/view.tpl', 
         'tpl!apps/multimodelview/pilot.tpl',
         'tpl!apps/multimodelview/pilotList.tpl',
         'tpl!apps/multimodelview/kirk.tpl',
         'css!apps/multimodelview/style', 'marionette.mmv'], function(App, viewTpl, pilotTpl, pilotListTpl, kirkTpl) {
	App.module('multimodelview', function(multimodelview, App, Backbone, Marionette, $, _) {

		var PilotModel = Backbone.Model.extend({
			defaults : {
				name : 'Unassigned',
				rank : '--',
				level : 0,
				team : '--',
				shipId : 0
			}
		});

		var ShipModel = Backbone.Model.extend({
			defaults : {
				name : 'Unassigned',
				health : 0,
				speed : 0,
				storage : 0
			}
		});

		var ScoreModel = Backbone.Model.extend({
			defaults : {
				currentScore : 1000,
				highScore : 2000
			}
		});
		
		
		var raw = {};
		raw.Pilots = [
			{id: 1, name: 'James T Kirk', rank: 'Captan', team: 'Federation', shipId: 1},
			{id: 2, name: 'Gene Starwind', rank: 'Capitan', team: 'Space Pirates', shipId: 2},
			{id: 3, name: 'Luke Skywalker', rank: 'Jedi Knight', team: 'Rebellion', shipId: 3},
			{id: 4, name: 'Jack Sparrow', rank: 'Admiral', team: 'Pirates', shipId: 0}
		];
		raw.Ships = [
			{id: 1, name: 'USS Enterprise', health: 100, speed: 5, storage: 19},
			{id: 2, name: 'Outlaw Star', health: 75, speed: 6, storage: 11},
			{id: 3, name: 'X-Wing Fighter', health: 100, speed: 5, storage: 2}
		];

		multimodelview.data = {};
		multimodelview.data.Pilots = new Backbone.Collection( raw.Pilots );
		multimodelview.data.Ships  = new Backbone.Collection( raw.Ships );
		
		multimodelview.PilotItemView = Backbone.Marionette.MultiModelView.extend({
			template: pilotTpl,
			tagName: 'tr',
			tagClass: 'pilot-row',

			models: {
				ship: function(baseModel) {
					var ship = multimodelview.data.Ships.get( baseModel.get('shipId'));
					if( typeof ship === 'undefined' ) {
						return new ShipModel();
					}
					return ship;
				}
			}
		});

		// collection view to show a list of Pilots
		multimodelview.PilotListView = Backbone.Marionette.CompositeView.extend({
			itemView: multimodelview.PilotItemView,
			itemViewContainer: 'tbody',
			template: pilotListTpl
		});

		multimodelview.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				mainRegion : '#content',
				kirkRegion : '#kirk'
			}
		});
		
		multimodelview.layout = new multimodelview.MainView();

		multimodelview.controller = {
			show : function() {
				App.navigate("multimodelview");
				App.mainRegion.show(multimodelview.layout);
				
				var listView = new multimodelview.PilotListView({
					collection: multimodelview.data.Pilots
				});
				multimodelview.layout.mainRegion.show( listView );
				
				var kirk = multimodelview.data.Pilots.get(1);
				var myScore = new ScoreModel();
				var oneView = new Backbone.Marionette.MultiModelView({
					template: kirkTpl,
					models: {
						pilot: kirk,
						score: myScore
					}
				});
				multimodelview.layout.kirkRegion.show( oneView );
			}
		}

		App.on("multimodelview:show", function() {
			multimodelview.controller.show();
		});

		multimodelview.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"multimodelview" : "show"
			}
		});

		App.addInitializer(function() {
			new multimodelview.Router({
				controller : multimodelview.controller
			});
		});
	});
	return App.multimodelview.controller;
})