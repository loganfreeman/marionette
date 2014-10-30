App.FlashView = Ember.CollectionView.extend({
  itemViewClass: "App.FlashItemView",
  contentBinding: "App.flashController"
});

App.FlashItemView = Ember.View.extend({
  classNameBindings: [ "baseClass", "kind" ],
  baseClass: "alert-box",
  kindBinding: "content.kind",
  template: Ember.Handlebars.compile("{{view.content.message}}"),
  timeout: 2,

  didInsertElement: function() {
    var view = this;

    setTimeout(function() {
      view.$().fadeOut(200,function() {
        view.removeFromParent();
      })
    } , this.get("timeout") * 1000)
  }
});

App.flash = App.FlashView.extend();
