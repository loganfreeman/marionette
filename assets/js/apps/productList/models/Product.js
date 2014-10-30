define(['backbone'], function(Backbone) {
  'use strict';
  var LocalStorageEventsMap;
  LocalStorageEventsMap = {
    create: 'create',
    read: 'read',
    update: 'update',
    "delete": 'destroy'
  };
  return Backbone.Model.extend({
    defaults: {
      name: '',
      price: 0
    },
    sync: function(method, model, options) {
      return this.collection.localStorage[LocalStorageEventsMap[method]](this);
    }
  });
});
