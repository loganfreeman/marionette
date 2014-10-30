define(["app", "marionette"], function(ContactManager, Marionette){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "widgets" : "showWidgets"
    }
  });

  var API = {
	showWidgets: function(){
      require(["apps/widgets/show/show_controller"], function(ShowController){
        ContactManager.startSubApp(null);
        ShowController.showWidgets();
        ContactManager.execute("set:active:header", "widgets");
      });
    }
  };

  ContactManager.on("widgets:show", function(){
    ContactManager.navigate("widgets");
    API.showWidgets();
  });

  ContactManager.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});
