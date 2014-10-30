define([ "views/ApplicationView", "views/WindowContainerView", "views/TabIndexView", "views/SelectedTabView", "views/TabMenuView", "views/TabView", "controllers/ApplicationController", "controllers/tabListController", "app/router", "routes/IndexRoute", "routes/SelectedTabRoute", "scripts/fixtures/tabFixtures.js" ], function(ApplicationView, WindowContainerView, TabIndexView, SelectedTabView,
		TabMenuView, TabView, ApplicationController, tabListController, Router, IndexRoute, SelectedTabRoute, tabFixtures) {

	// setup
	tabListController.addTabs(tabFixtures.tabs);

	/* Module Pattern */
	var App = {
		ApplicationView : ApplicationView,
		WindowContainerView : WindowContainerView,
		TabIndexView : TabIndexView,
		SelectedTabView : SelectedTabView,
		TabMenuView : TabMenuView,
		TabView : TabView,
		ApplicationController : ApplicationController,
		tabListController : tabListController,
		Router : Router,
		IndexRoute : IndexRoute,
		SelectedTabRoute : SelectedTabRoute,
		LOG_TRANSITIONS : true,
		LOG_TRANSITIONS_INTERNAL : true
	};

	App.ClockController = Ember.Controller.extend({
		createdAt : new Date()
	});
	
	App.ClockRoute = Ember.Route.extend({		
		renderTemplate: function(){
			console.log('rendering clock');
			this.render('clock', {
				into: 'application'
			})
		}
	});
	
	App.ClockView = Ember.View.extend({
		template: Ember.Handlebars.compile('<p>Created {{fromNow valueBinding="createdAt"}}</p>')
	});

	App.FromNowView = Ember.View.extend({
		tagName : 'time',

		template : Ember.Handlebars.compile('{{view.output}}'),

		output : function() {
			console.log('output called')
			return moment(this.get('value')).fromNow();
		}.property('value'),

		didInsertElement : function() {
			this.tick();
		},

		tick : function() {
			var nextTick = Ember.run.later(this, function() {
				console.log('tick');
				this.notifyPropertyChange('output');
				this.tick();
			}, 1000);
			this.set('nextTick', nextTick);
		},

		willDestroyElement : function() {
			var nextTick = this.get('nextTick');
			Ember.run.cancel(nextTick);
		}
	});

	Ember.Handlebars.helper('fromNow', App.FromNowView);

	return App;
});