define(["app", "marionette", "apps/cardgame/view/view", "apps/cardgame/entities/model"], function(ContactManager, Marionette, GameView, GameModel){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "card" : "showCard"
    }
  });

  var API = {
	showCard: function(){
		var gameModel = ContactManager.request("card:gameModel");
		var view = new GameView({model: gameModel});
		ContactManager.mainRegion.show(view);
    }
  };

  ContactManager.on("card:show", function(){
    ContactManager.navigate("card");
    API.showCard();
  });

  ContactManager.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});
