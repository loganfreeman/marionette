App.BookmarksRoute = Ember.Route.extend({
  model: function() {
    // return App.Bookmark.find();
	  return this.store.find('bookmark');
  }
});
