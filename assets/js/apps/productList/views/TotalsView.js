define(['marionette', 'tpl!apps/productList/templates/totalsView.tpl'], function(Marionette, tpl) {
  'use strict';
  var TotalsView;
  return TotalsView = Marionette.ItemView.extend({
    template: tpl,
    modelEvents: {
      "change": "modelChanged"
    },
    modelChanged: function() {
      return this.render();
    }
  });
});
