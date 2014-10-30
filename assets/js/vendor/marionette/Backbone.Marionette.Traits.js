(function (root, factory) {
  if (typeof exports === 'object') {

    var underscore = require('underscore');
    var backbone = require('backbone');
    var marionette = require('marionette');

    module.exports = factory(underscore, backbone, marionette);

  } else if (typeof define === 'function' && define.amd) {

    define(['underscore', 'backbone', 'marionette'], factory);

  }
}(this, function (_, Backbone, Marionette) {

  var extract = function (prop, manyMeth) {
    return function (traits) {
      var items = _.compact(_.unshift(this[prop], _.pluck(traits, prop)));
      var len = items.length;
      var retVal = {};

      if (len) {
        retVal[prop] = len == 1 ? _.first(items) : manyMeth.apply(this, items);
      }
      return retVal;
    };
  };

  var stackFns = function (items) {
    return function () {
      var args = Array.prototype.slice.apply(arguments);
      return _.map(items, function (fn) {
        return fn.apply(this, args);
      }, this);
    };
  };

  Backbone.Marionette.View.prototype.withTraits = (function () {
    var extractors = [extract('ui', _.extend),
                      extract('triggers', _.extend),
                      extract('onBeforeRender', stackFns)
                      extract('onRender', stackFns)
                      extract('onDomRefresh', stackFns)
                      extract('onShow', stackFns)
                      extract('onBeforeClose', stackFns)
                      extract('onClose', stackFns)

                      //CollectionView Only
                      extract('onBeforeItemAdded', stackFns)
                      extract('onAfterItemAdded', stackFns)
                      extract('onItemRemoved', stackFns)];
    return function () {
      var traits = Array.prototype.slice.apply(arguments);

      _.extend.apply(this, traits.concat(_.map(extractors, function (extractor) {
        return extractor.call(this, traits);
      }, this)));
    };
  }());
}));