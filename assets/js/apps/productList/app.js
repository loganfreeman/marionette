define([ 'app', 'apps/productList/collections/Products', 'apps/productList/models/Totals', 'apps/productList/views/FormView',
		'apps/productList/views/ProductsView', 'apps/productList/views/TotalsView', 'apps/productList/views/LayoutView' ],
		function(App, Products, Totals, FormView, ProductsView, TotalsView,
				LayoutView) {
			App.module('ProductTracker', function(ProductTracker, App,
					Backbone, Marionette, $, _) {

				ProductTracker.Products = new Products();
				ProductTracker.Totals = new Totals();
				ProductTracker.Form = new FormView({
					collection : ProductTracker.Products
				});
				ProductTracker.mainView = new LayoutView();

				ProductTracker.controller = {
					show : function() {
						App.navigate("ProductTracker");
						App.mainRegion.show(ProductTracker.mainView);

						ProductTracker.mainView.form.show(ProductTracker.Form);
						ProductTracker.mainView.list.show(new ProductsView({
							collection : ProductTracker.Products
						}));
						ProductTracker.mainView.totals.show(new TotalsView({
							model : ProductTracker.Totals
						}));
					}
				}

				App.on("ProductTracker:show", function() {
					ProductTracker.controller.show();
				});

				ProductTracker.Router = Marionette.AppRouter.extend({
					appRoutes : {
						"ProductTracker" : "show"
					}
				});

				ProductTracker.addInitializer(function() {
					new ProductTracker.Router({
						controller : ProductTracker.controller
					});
				});
				
				App.on('Totals:updateFetchedValues', function() {
					    var price, _i, _len, _ref, _results;
					    _ref = ProductTracker.Products.pluck('price');
					    _results = [];
					    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					      price = _ref[_i];
					      _results.push(ProductTracker.Totals.addValue(price));
					    }
					    return _results;
					  });
				App.on('Totals.addValue', function(value) {
					    return ProductTracker.Totals.addValue(value);
					  });
				App.on('Totals.removeValue', function(value) {
					    return ProductTracker.Totals.removeValue(value);
					  });
				App.on('Products.fetch', function() {
					    ProductTracker.Products.fetch();
					    return App.trigger('Totals:updateFetchedValues');
					  });
				App.on('Form.setState', function(state) {
					    return ProductTracker.Form.setState(state);
					  });
				App.on('Form.set_ui_val', function(element, value) {
					    return ProductTracker.Form.ui[element].val(value);
					  });
			});
			return App.ProductTracker.controller;
		})