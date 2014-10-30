define(["app"], function(ContactManager){
  ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
    Entities.GameModel = Backbone.Model.extend({

        initialize: function(options) {
            this.set("cardsClicked", 0);
            this.set("cardSet", options.cardSet || new Entities.CardSetCollection);
            this.set("inprogress", false);
        },

    });


    Entities.CardModel = Backbone.Model.extend({

        initialize: function(options) {
            this.set("flipped", false);
            this.set("matched", false);
            this.set("imagePath", options.imagePath || '');
            this.set("value", options.value || undefined);
        },

        flip: function() {
            if(this.get("flipped")) {
                return;
            }
            else {
                this.set("flipped", true);
            }

        },

    });
    
    Entities.CardSetCollection = Backbone.Collection.extend({

        model: Entities.CardModel,

        initialize: function() {

        },

        shuffleCards: function() {
            this.reset(this.shuffle(), {silent: true});
        },

    });


    var initializeGameModel = function(){
        var cardSetCollection = new Entities.CardSetCollection([
	                              new Entities.CardModel({value: '1', matched: false, imagePath: 'images/bargs.jpeg'}),
	                              new Entities.CardModel({value: '1', matched: false, imagePath: 'images/bargs.jpeg'}),
	                              new Entities.CardModel({value: '2', matched: false, imagePath: 'images/coorslight.jpeg'}),
	                              new Entities.CardModel({value: '2', matched: false, imagePath: 'images/coorslight.jpeg'}),
	                              new Entities.CardModel({value: '3', matched: false, imagePath: 'images/duff.jpeg'}),
	                              new Entities.CardModel({value: '3', matched: false, imagePath: 'images/duff.jpeg'}),
	                              new Entities.CardModel({value: '4', matched: false, imagePath: 'images/fattire.jpeg'}),
	                              new Entities.CardModel({value: '4', matched: false, imagePath: 'images/fattire.jpeg'}),
	                              new Entities.CardModel({value: '5', matched: false, imagePath: 'images/guinness.jpeg'}),
	                              new Entities.CardModel({value: '5', matched: false, imagePath: 'images/guinness.jpeg'}),
	                              new Entities.CardModel({value: '6', matched: false, imagePath: 'images/miller.jpeg'}),
	                              new Entities.CardModel({value: '6', matched: false, imagePath: 'images/miller.jpeg'}),
	                              new Entities.CardModel({value: '7', matched: false, imagePath: 'images/oldmilwaukee.jpeg'}),
	                              new Entities.CardModel({value: '7', matched: false, imagePath: 'images/oldmilwaukee.jpeg'}),
	                              new Entities.CardModel({value: '8', matched: false, imagePath: 'images/8-bit.jpeg'}),
	                              new Entities.CardModel({value: '8', matched: false, imagePath: 'images/8-bit.jpeg'})
                          ]);

       Entities.gameModel = new Entities.GameModel({cardSet: cardSetCollection});

    };

    var API = {
      getGameModel: function(){
    	  initializeGameModel();
        return Entities.gameModel;
      }
    };

    ContactManager.reqres.setHandler("card:gameModel", function(){
      return API.getGameModel();
    });
  });

  return ContactManager.Entities.GameModel;
});
