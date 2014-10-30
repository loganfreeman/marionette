define(['marionette', 'tpl!apps/productList/templates/noProductsView.tpl'], function(Marionette, tpl) {
  'use strict';
  var NoProductView;
  return NoProductView = Marionette.ItemView.extend({
    template: tpl,
    tagName: 'tr'
  });
});
