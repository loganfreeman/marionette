App.BookmarkController = Ember.ObjectController.extend({
  description: function() {
    return this.get("content.name") + " - " + this.get("content.url");
  }.property("content.name", "content.url")
});
