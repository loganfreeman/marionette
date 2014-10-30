define(['marionette', 'app', 'apps/productList/views/ProductView', 'apps/productList/views/NoProductView', 'tpl!apps/productList/templates/productsView.tpl'], function(Marionette, vent, ProductView, NoProductView, tpl) {
  'use strict';
  var ProductsView;
  return ProductsView = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-striped",
    template: tpl,
    itemView: ProductView,
    emptyView: NoProductView,
    appendHtml: function(collectionView, itemView) {
      return collectionView.$("tbody").append(itemView.el);
    },
    initialize: function() {
      return vent.trigger('Products.fetch');
    }
  });
});
