define([ 'ember' ], function(Ember, tabListController, Board) {
	"use strict";

	var IndexRoute = Ember.Route.extend({
		// renderTemplate: function() {
		// this.render('selectedTab', {
		// into: "application",
		// controller: tabListController
		// });
		// }
		redirect : function() {
			this.transitionTo('selectedTab');
		}
	// renderTemplate : function() {
	// this.render('board');
	// }
	});

	return IndexRoute;
});