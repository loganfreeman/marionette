define([ 'app', 'tpl!apps/astar/main.html', 'css!apps/astar/style', 'algorithm/pqueue', 'interface', 'apps/astar/model' ], function(App, viewTpl) {
	App.module('AStar', function(AStar, App, Backbone, Marionette, $, _) {

		AStar.MainView = Marionette.ItemView.extend({
			template : viewTpl,

			clearPathOnMap : function() {
				$("#astar-container > div").removeClass("pth");
				this.mapCtr.clear_all();
			},

			createMap : function(width, height, tileSize) {
				if (tileSize == null) {
					tileSize = 60;
				}
				this.mapCtr = new MapContainer(width, height, tileSize);
				this.mapCtr.set_element($("#astar-container")[0]);
				this.mapCtr.initMap();
			},

			onShow : function() {

				var that = this;
				$("#hiro").draggable({
					ghosting : false,
					zIndex : 1000
				});

				$("#enemy").draggable({
					ghosting : false,
					zIndex : 1000
				});

				$("#findBtn").click(function() {
					// clear old path
					that.clearPathOnMap();
					var result = that.mapCtr.findPath();
					if (!result) {
						alert("I can't find a path.");
						return;
					}
					$(that.mapCtr.get_pathElements()).addClass("pth");
				});
				$("#resetBtn").click(function() {
					that.clearPathOnMap();
				});

				this.createMap(20, 10, 40);

			}
		});

		AStar.controller = {
			show : function() {
				App.navigate("astar");
				App.mainRegion.show(new AStar.MainView());
			}
		}

		App.on("astar:show", function() {
			AStar.controller.show();
		});

		AStar.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"astar" : "show"
			}
		});

		AStar.addInitializer(function() {
			new AStar.Router({
				controller : AStar.controller
			});
		});
	});
	return App.AStar.controller;
})