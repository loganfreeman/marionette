define([ 'app', 'tpl!apps/game-of-life/templates/main.tpl', 'hbs!apps/game-of-life/templates/grid', 'hbs!apps/game-of-life/templates/control', 'css!apps/game-of-life/style' ], function(App, viewTpl, gridTpl, controlTpl) {
	App.module('gameoflife', function(gameoflife, App, Backbone, Marionette, $, _) {

		gameoflife.MainView = Marionette.Layout.extend({
			template : viewTpl,
			regions : {
				gameRegion : '#gameRegion',
				controlRegion : '#controlRegion'
			}
		});


		gameoflife.CellView = Marionette.ItemView.extend({
			template : function() {
				return "";
			},
			tagName : "td",
			className : function() {
				return this.model.get("state") === "ALIVE" ? "alive" : "dead";
			},
			events : {
				"click" : "onClick"
			},
			modelEvents : {
				"change" : "onModelChange"
			},
			onClick : function() {
				this.model.toggleState();
			},
			onModelChange : function() {
				if (this.model.get("state") === "ALIVE") {
					this.$el.removeClass("dead").addClass("alive");
				} else {
					this.$el.removeClass("alive").addClass("dead");
				}
			}
		});
		
		gameoflife.RowView = Marionette.CollectionView.extend({
			tagName : "tr",
			itemView : gameoflife.CellView,
			initialize : function() {
				this.collection = this.model.get("cellCollection");
			}
		});
		
		gameoflife.GridView = Marionette.CompositeView.extend({
			template : gridTpl,
			tagName : "table",
			className : "table-bordered",
			itemView : gameoflife.RowView,
			itemViewContainer : "tbody"
		});
		
		

		gameoflife.ControlView = Marionette.ItemView.extend({
			template : controlTpl,
			className : "btn-group",
			triggers : {
				"click .play" : "control:play",
				"click .step" : "control:step",
				"click .random" : "control:random",
				"click .reset" : "control:reset"
			},
			modelEvents : {
				"change" : "render"
			}
		});

		gameoflife.RowCollection = Backbone.Collection.extend({
			model : gameoflife.Row
		});

		gameoflife.CellCollection = Backbone.Collection.extend({
			model: gameoflife.Cell
		});

		gameoflife.Row = Backbone.Model.extend();

		gameoflife.Cell = Backbone.Model.extend({
			defaults : {
				state : "DEAD"
			},
			toggleState : function() {
				if (this.get("state") === "ALIVE") {
					this.set("state", "DEAD");
				} else {
					this.set("state", "ALIVE");
				}
				console.log("cell " + this.get("row") + "," + this.get("column") + " has the neighbors: " + _.map(this.get("neighbors"), function(cell) {
					return "(" + cell.get("row") + "," + cell.get("column") + ")";
				}).join(","));
			},
			stageState : function() {
				var neighborsState = _.countBy(this.get("neighbors"), function(cell) {
					return cell.get("state");
				});
				if (this.get("state") === "ALIVE") {
					if (neighborsState.ALIVE < 2) {
						this.set("stagedState", "DEAD");
					}
					if (neighborsState.ALIVE > 3) {
						this.set("stagedState", "DEAD");
					}
				} else {
					if (neighborsState.ALIVE === 3) {
						this.set("stagedState", "ALIVE");
					}
				}
			},
			updateState : function() {
				if (this.has("stagedState")) {
					this.set("state", this.get("stagedState"));
					this.unset("stagedState");
				}
			}
		});

		gameoflife.Controls = Backbone.Model.extend({
			defaults : {
				playing : false
			}
		});

		gameoflife.Controller = Marionette.Controller.extend({
			initialize : function(options) {
				this.rows = [];
				for ( var row = 0; row < options.rows; row++) {
					var cells = [];
					for ( var column = 0; column < options.columns; column++) {
						cells.push(new gameoflife.Cell({
							row : row,
							column : column
						}));
					}
					this.rows.push(new gameoflife.Row({
						cellCollection : new gameoflife.CellCollection(cells)
					}));
				}
				_.each(this.rows, function(row, rowIndex) {
					_.each(row.get("cellCollection").models, function(cell, cellIndex) {
						var neighbors = [];
						if (row.get("cellCollection").models[cellIndex - 1]) {
							neighbors.push(row.get("cellCollection").models[cellIndex - 1]);
						}
						if (row.get("cellCollection").models[cellIndex + 1]) {
							neighbors.push(row.get("cellCollection").models[cellIndex + 1]);
						}
						if (this.rows[rowIndex - 1]) {
							neighbors.push(this.rows[rowIndex - 1].get("cellCollection").models[cellIndex]);
							if (this.rows[rowIndex - 1].get("cellCollection").models[cellIndex - 1]) {
								neighbors.push(this.rows[rowIndex - 1].get("cellCollection").models[cellIndex - 1]);
							}
							if (this.rows[rowIndex - 1].get("cellCollection").models[cellIndex + 1]) {
								neighbors.push(this.rows[rowIndex - 1].get("cellCollection").models[cellIndex + 1]);
							}
						}
						if (this.rows[rowIndex + 1]) {
							neighbors.push(this.rows[rowIndex + 1].get("cellCollection").models[cellIndex]);
							if (this.rows[rowIndex + 1].get("cellCollection").models[cellIndex - 1]) {
								neighbors.push(this.rows[rowIndex + 1].get("cellCollection").models[cellIndex - 1]);
							}
							if (this.rows[rowIndex + 1].get("cellCollection").models[cellIndex + 1]) {
								neighbors.push(this.rows[rowIndex + 1].get("cellCollection").models[cellIndex + 1]);
							}
						}
						cell.set("neighbors", neighbors);
					}, this)
				}, this);
				App.reqres.setHandlers({
					"play" : {
						callback : this.play,
						context : this
					},
					"stop" : {
						callback : this.stop,
						context : this
					},
					"step" : {
						callback : this.step,
						context : this
					},
					"randomise" : {
						callback : this.randomise,
						context : this
					},
					"reset" : {
						callback : this.reset,
						context : this
					}
				});
				_.bindAll(this, "step");
			},
			play : function() {
				this.gameTicker = window.setInterval(this.step, 100);
			},
			stop : function() {
				window.clearInterval(this.gameTicker);
			},
			step : function() {
				_.each(this.rows, function(row) {
					_.each(row.get("cellCollection").models, function(cell) {
						cell.stageState();
					});
				});
				_.each(this.rows, function(row) {
					_.each(row.get("cellCollection").models, function(cell) {
						cell.updateState();
					});
				});
			},
			randomise : function() {
				_.each(this.rows, function(row) {
					_.each(row.get("cellCollection").models, function(cell) {
						if (Math.random() <= 0.2) {
							cell.set("state", "ALIVE");
						} else {
							cell.set("state", "DEAD");
						}
					});
				});
			},
			reset : function() {
				_.each(this.rows, function(row) {
					_.each(row.get("cellCollection").models, function(cell) {
						cell.set("state", "DEAD");
					});
				});
			},

			show : function() {
				App.navigate("game-of-life");
				this.mainView = new gameoflife.MainView();
				this.controlView = new gameoflife.ControlView({
					model : new gameoflife.Controls()
				});
				this.gameView = new gameoflife.GridView({
					collection : new gameoflife.RowCollection(this.rows)
				});
				App.mainRegion.show(this.mainView);
				this.mainView.gameRegion.show(this.gameView);
				this.mainView.controlRegion.show(this.controlView);
				this.listenTo(this.controlView, "control:play", this.controlPlay);
				this.listenTo(this.controlView, "control:step", this.controlStep);
				this.listenTo(this.controlView, "control:random", this.controlRandom);
				this.listenTo(this.controlView, "control:reset", this.controlReset);
			},
			controlPlay : function(eventData) {
				if (eventData.model.get("playing")) {
					App.request("stop");
					eventData.model.set("playing", false);
				} else {
					App.request("play");
					eventData.model.set("playing", true);
				}
			},
			controlStep : function() {
				App.request("step");
			},
			controlRandom : function() {
				App.request("randomise");
			},
			controlReset : function() {
				App.request("reset");
			}
		});

		gameoflife.controller = new gameoflife.Controller({
			rows: 50,
			columns: 50
		});

		App.on("game-of-life:show", function() {
			gameoflife.controller.show();
		});

		gameoflife.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"game-of-life" : "show"
			}
		});

		App.addInitializer(function() {
			new gameoflife.Router({
				controller : gameoflife.controller
			});
		});

	});
	return App.gameoflife.controller;
})