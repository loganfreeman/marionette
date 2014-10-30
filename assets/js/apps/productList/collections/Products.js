define(['backbone', 'apps/productList/models/Product', 'localstorage'], function(Backbone, Product) {
  'use strict';
  var Products;
  return Products = Backbone.Collection.extend({
    model: Product,
    localStorage: new Backbone.LocalStorage("ProductsStorage")
  });
});
