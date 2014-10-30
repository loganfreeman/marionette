define(["app", "localstorage"], function(ContactManager){
  ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
    var findStorageKey = function(entity){
      // use a model's urlRoot value
      if(entity.urlRoot){
        return _.result(entity, "urlRoot");
      }
      // use a collection's url value
      if(entity.url){
        return _.result(entity, "url");
      }
      // fallback to obtaining a model's storage key from
      // the collection it belongs to
      if(entity.collection && entity.collection.url){
        return _.result(entity.collection, "url");
      }

      throw new Error("Unable to determine storage key");
    };

    var StorageMixin = function(entityPrototype){
      var storageKey = findStorageKey(entityPrototype);
      return { localStorage: new Backbone.LocalStorage(storageKey) };
    };

    Entities.configureStorage = function(entity){
      _.extend(entity.prototype, new StorageMixin(entity.prototype));
    };
  });

  return ContactManager.Entities.configureStorage;
});
