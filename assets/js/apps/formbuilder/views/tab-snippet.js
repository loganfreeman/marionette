define([
       "jquery", "underscore", "backbone"
       , "apps/formbuilder/models/snippet"
       , "apps/formbuilder/views/snippet", "apps/formbuilder/views/temp-snippet"
       , "apps/formbuilder/helper/pubsub"
], function(
  $, _, Backbone
  , SnippetModel
  , SnippetView, TempSnippetView
  , PubSub
){
  return SnippetView.extend({
    events:{
      "mousedown" : "mouseDownHandler"
    }
    , mouseDownHandler: function(mouseDownEvent){
      mouseDownEvent.preventDefault();
      mouseDownEvent.stopPropagation();
      //hide all popovers
      $(".popover").hide();
      $("body").append(new TempSnippetView({model: new SnippetModel($.extend(true,{},this.model.attributes))}).render());
      PubSub.trigger("newTempPostRender", mouseDownEvent);
    }
  });
});
