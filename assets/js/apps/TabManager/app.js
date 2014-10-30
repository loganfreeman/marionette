define([ 'app',
         'tpl!apps/TabManager/view.tpl',
         'apps/TabManager/tabs',
         'css!apps/TabManager/style'], function(App, viewTpl, _TabManager) {
	App.module('TabManager', function(TabManager, App, Backbone, Marionette, $, _) {
		
		
		TabModel = Backbone.Model.extend({
			defaults : {
				id : '_tab',
				order : 1,
				tagName : 'span',
				className : '_tab_manager tab-normal',
				selectedClassName : '_tab_manager tab-selected'
			},
			idAttribute : 'id'
		});

		TabManager.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			events: {
				'click #select-contact-tab': 'selectContact'
			},
			selectContact: function(){
				this._tabManager_.selectTab('contact');
			},
			onShow: function(){
				// instance of our tab manager
				var _tabManager = new _TabManager('#tabs-go-here');

				// define a function to be called when a tab is selected or un-selected
				function fnTabCallback() {
					var selector = '#' + this.model.id;
					selector = selector.toLowerCase();
					$(selector).toggleClass('hidden');
				}

				// Add some tabs
				_tabManager.addTab({
					id: 'about',
					selectCallback: fnTabCallback,
					unselectCallback: fnTabCallback,
					order: 1
				});
				_tabManager.addTab({
					id: 'news',
					selectCallback: fnTabCallback,
					unselectCallback: fnTabCallback,
					order: 2
				});
				_tabManager.addTab({
					id: 'contact',
					selectCallback: fnTabCallback,
					unselectCallback: fnTabCallback,
					order: 3
				});
				_tabManager.render();
				
				this._tabManager_ = _tabManager;
			}
		});

		TabManager.controller = {
			show : function() {
				App.navigate("TabManager");
				App.mainRegion.show(new TabManager.MainView());
			}
		}

		App.on("TabManager:show", function() {
			TabManager.controller.show();
		});

		TabManager.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"TabManager" : "show"
			}
		});

		App.addInitializer(function() {
			new TabManager.Router({
				controller : TabManager.controller
			});
		});
	});
	return App.TabManager.controller;
})