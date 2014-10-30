define(["app", "marionette"], function(ContactManager, Marionette){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "tetris" : "showTetris"
    }
  });

  var API = {
	showTetris: function(){
      require(["apps/tetris/show/tetris_controller"], function(ShowController){
        ContactManager.startSubApp("TetrisApp");
        ShowController.showTetris();
      });
    }
  };

  ContactManager.on("tetris:show", function(){
    ContactManager.navigate("tetris");
    API.showTetris();
  });

  ContactManager.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});
