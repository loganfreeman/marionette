define([ "marionette", "apps/config/marionette/regions/dialog", 'bootstrap/bootstrap' ], function(Marionette) {
	var ContactManager = new Marionette.Application();

	ContactManager.addRegions({
		headerRegion : "#header-region",
		mainRegion : "#main-region",
		dialogRegion : Marionette.Region.Dialog.extend({
			el : "#dialog-region"
		})
	});

	ContactManager.navigate = function(route, options) {
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	ContactManager.getCurrentRoute = function() {
		return Backbone.history.fragment
	};

	ContactManager.startSubApp = function(appName, args) {
		var currentApp = appName ? ContactManager.module(appName) : null;
		if (ContactManager.currentApp === currentApp) {
			return;
		}

		if (ContactManager.currentApp) {
			ContactManager.currentApp.stop();
		}

		ContactManager.currentApp = currentApp;
		if (currentApp) {
			currentApp.start(args);
		}
	};

	ContactManager.on("initialize:after", function() {
		if (Backbone.history) {
			require([ "apps/contacts/contacts_app", "apps/about/about_app", "apps/widgets/widget_app", "apps/backgrid/backgrid_app", "apps/tetris/tetris_app", "apps/cardgame/card_app", "apps/transitionregion/app", "apps/require/app", "apps/sudoku/Sudoku", 'apps/gogame/gogame_app', 'apps/regexp/app', 'apps/gallery/app', 'apps/waterfall/app', 'jquery.contextmenu' ], function() {
				Backbone.history.start();

				if (ContactManager.getCurrentRoute() === "") {
					ContactManager.trigger("widgets:show");
				}

				ContactManager.on('css:show', function() {
					ContactManager.navigate('ember');
					window.location.href = 'ember/index.html';
				})

				ContactManager.on('ember:show', function() {
					ContactManager.navigate('ember');
					window.location.href = 'ember-bootstrap/index.html';
				})

				ContactManager.on("angular:show", function() {
					ContactManager.navigate("angular");
					window.location.href = 'angular/index.html';
				});
				ContactManager.on("emberrequire:show", function() {
					ContactManager.navigate("emberrequire");
					window.location.href = 'emberjs_require/index.html';
				});
			});
		}
	});

	return ContactManager;
});
