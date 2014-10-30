define([ 'app',
         'stache!apps/conditionbuilder/main',
         'css!apps/conditionbuilder/style', 'json2', 'apps/conditionbuilder/condition-builder'], function(App, viewTpl) {
	App.module('conditionbuilder', function(conditionbuilder, App, Backbone, Marionette, $, _) {

		conditionbuilder.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 $('#btnCondition').click(function () {
		                var query = {};
		                query = getCondition('.query > table');
		                //var l = JSON.stringify(query,null,4);
		                var l = JSON.stringify(query);
		                alert(l);
		            });

		            $('#btnQuery').click(function () {
		                var con = getCondition('.query >table');
		                var k = getQuery(con);
		                alert(k);
		            });
		            addqueryroot('.query', true);
			}
		});

		conditionbuilder.controller = {
			show : function() {
				App.navigate("conditionbuilder");
				App.mainRegion.show(new conditionbuilder.MainView());
			}
		}

		App.on("conditionbuilder:show", function() {
			conditionbuilder.controller.show();
		});

		conditionbuilder.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"conditionbuilder" : "show"
			}
		});

		App.addInitializer(function() {
			new conditionbuilder.Router({
				controller : conditionbuilder.controller
			});
		});
	});
	return App.conditionbuilder.controller;
})