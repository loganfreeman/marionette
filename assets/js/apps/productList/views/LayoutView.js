define(['marionette', 'tpl!apps/productList/templates/container.tpl'], function(Marionette, tpl) {
  'use strict';
  var TotalsView;
  return TotalsView = Marionette.Layout.extend({
    template: tpl,
    regions: {
        form: '#form',
        list: '#list-table',
        totals: '#totals'
    },
  });
});
