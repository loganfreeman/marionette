define(["app", "backbone.picky"], function(ContactManager){
  ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
    Entities.Header = Backbone.Model.extend({
      initialize: function(){
        var selectable = new Backbone.Picky.Selectable(this);
        _.extend(this, selectable);
      }
    });

    Entities.HeaderCollection = Backbone.Collection.extend({
      model: Entities.Header,

      initialize: function(){
        var singleSelect = new Backbone.Picky.SingleSelect(this);
        _.extend(this, singleSelect);
      }
    });

    var initializeHeaders = function(){
      Entities.headers = new Entities.HeaderCollection([
        {name: "Backbone.Marionette", url: "widgets", navigationTrigger: "widgets:show"},
        {name: "Angular", url: "angular", navigationTrigger: "angular:show"},
        {name: "CSS", url: "css", navigationTrigger: "css:show"},
        {name: "Ember", url: "ember", navigationTrigger: "ember:show"},
        {name: "Ember&Require", url: "emberrequire", navigationTrigger: "emberrequire:show"},
        { name: "About", url: "about", navigationTrigger: "about:show" },
        {name: "Demos", url: "demos", navigationTrigger: "demos:show"},
      ]);
    };

    var API = {
      getHeaders: function(){
        if(Entities.headers === undefined){
          initializeHeaders();
        }
        return Entities.headers;
      }
    };

    ContactManager.reqres.setHandler("header:entities", function(){
      return API.getHeaders();
    });
  });

  return ;
});
