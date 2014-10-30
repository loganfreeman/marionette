define([ 'app',
         'tpl!apps/progressview/view.tpl',
         'tpl!apps/progressview/progress.tpl',
         'tpl!apps/progressview/view1.tpl',
         'tpl!apps/progressview/view2.tpl',
         'tpl!apps/progressview/view3.tpl',
         'marionette.progressview',
         'css!apps/progressview/style'], function(App, viewTpl, progressTpl, view1Tpl, view2Tpl, view3Tpl, ProgressView) {
	App.module('progressviewdemo', function(progressviewdemo, App, Backbone, Marionette, $, _) {
		
		var View1 = Marionette.ItemView.extend({

			  template : view1Tpl,

			  triggers : {
			    "click .next" : "next:item"
			  }
			});
		
		var View2 = Marionette.ItemView.extend({

			  template : view2Tpl,

			  triggers : {
			    "click .next" : "next:item"
			  }

			});
		
		var View3 = Marionette.ItemView.extend({

			  template : view3Tpl,

			  triggers : {
			    "click .prev" : "prev:item",
			    "click .next" : "next:item"
			  }

			});
		
		var MyProgressView = Marionette.ProgressView.extend({

			  template : progressTpl,

			  ui : {
			    "content"  : ".content",
			    "progress" : ".progress .bar"
			  },

			  viewContainer : ".content",

			  views : [View1, View2, View3],

			  onProgress : function (completion) {
			    //bootstrap progress bar
			    this.$(this.ui.progress).width(completion + "%");
			  },

			  onComplete : function () {
			    this.$(this.ui.content).html("<h1>Completed View Series</h1>");
			  }
			});


		progressviewdemo.MainView = Marionette.ItemView.extend({
			template : viewTpl,
		});

		progressviewdemo.controller = {
			show : function() {
				App.navigate("progressviewdemo");
				App.mainRegion.show(new MyProgressView());
			}
		}

		App.on("progressviewdemo:show", function() {
			progressviewdemo.controller.show();
		});

		progressviewdemo.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"progressviewdemo" : "show"
			}
		});

		App.addInitializer(function() {
			new progressviewdemo.Router({
				controller : progressviewdemo.controller
			});
		});
	});
	return App.progressviewdemo.controller;
})