define([
       "jquery" , "underscore" , "backbone"
       , "apps/formbuilder/models/snippet"
       , "apps/formbuilder/views/tab-snippet"
], function(
  $, _, Backbone
  , SnippetModel
  , TabSnippetView
){
  return Backbone.Collection.extend({
    model: SnippetModel
    , renderAll: function(){
      return this.map(function(snippet){
        return new TabSnippetView({model: snippet}).render();
      });
    }
  });
});
