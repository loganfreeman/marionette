App.Router.map(function() {
  this.resource("about", function () {
    this.route("team");
  });
  this.route("contact");
  this.resource("bookmarks");
  this.resource("bookmark", { path: "/bookmarks/:bookmark_id" });

  this.route("demotemplate");
  this.route('autosuggest');
});
