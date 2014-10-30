define(['backbone'], function(Backbone) {
  'use strict';
  var Totals;
  return Totals = Backbone.Model.extend({
    defaults: {
      average: 0,
      total: 0,
      count: 0
    },
    addValue: function(value) {
      this.set({
        'count': this.get('count') + 1,
        'total': this.get('total') + +value
      });
      return this.set({
        'average': this.get('total') / this.get('count')
      });
    },
    removeValue: function(value) {
      this.set({
        'count': this.get('count') - 1,
        'total': this.get('total') - value
      });
      return this.set({
        'average': this.get('count') > 0 ? this.get('total') / this.get('count') : 0
      });
    }
  });
});
