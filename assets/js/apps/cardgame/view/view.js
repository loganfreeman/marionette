define(["app"], function(ContactManager){
  ContactManager.module("CardGame", function(CardGame, ContactManager, Backbone, Marionette, $, _){
	  CardGame.CardView = Backbone.View.extend({

		    className: 'card',

		    events: {
		        "click": "cardFlipped"
		    },

		    initialize: function(options) {
		        this.model.on("change:flipped", this.flipCard, this);
		        this.model.on("change:matched", this.removeMatchedCards, this);
		        this.render();
		    },
		    
		    cardFlipped: function(e) {
		        e.preventDefault();
		        if(this.model.get("flipped")) {
		            return;
		        }
		        CardGame.trigger("cardFlippedEvent", this);
		    },

		    render: function() {
		        var html = '<div class="front"></div><div class="back"></div>';
		        $(this.el).append(html);
		        $(this.el).find("div.back").css({"background-image": "url(" + this.model.get("imagePath") + ")", "background-size": "contain", "background-repeat": "no-repeat"});
		    },

		    flipCard: function() {
		        if(this.model.get("flipped")) {
		            $(this.el).addClass('flip');
		        } else {
		            $(this.el).removeClass('flip');
		        }
		    },

		    removeMatchedCards: function() {
		        var that = this;
		        setTimeout(function() {
		            $(that.el).find("div.front").addClass("matched");
		            $(that.el).find("div.back").addClass("matched");
		            $(that.el).animate({opacity: 0});
		            $(that.el).unbind("click");
		        }, 300);
		    },

		    destroy: function() {
		        this.remove();
		        this.unbind();
		    }

		});


	  CardGame.GameBoardView = Backbone.View.extend({

		    className: 'board',

		    initialize: function(options) {
		        // shuffle card set
		        this.model.get("cardSet").shuffleCards();

		        // Listen for card flip event
		        CardGame.on("cardFlippedEvent", this.checkMatch, this);

		        this.render();
		    },

		    checkMatch: function(card) {
		        var that = this;

		        if(that.model.get("cardsClicked") < 2) {
		            that.model.set("cardsClicked", that.model.get("cardsClicked") + 1);
		            card.model.flip();
		        }
		        if(that.model.get("cardsClicked") == 2 && that.model.get("inprogress") == false) {
		            that.model.set("inprogress", true);
		            setTimeout(function() {
		                var flippedCards = that.model.get("cardSet").where({flipped: true, matched: false});
		                if(flippedCards[0].get("value")  == flippedCards[1].get("value")) {
		                    setTimeout(function() {
		                        flippedCards[0].set("matched", true);
		                        flippedCards[1].set("matched", true);
		                        that.model.set("cardsClicked", 0);
		                        that.model.set("inprogress", false);
		                    }, 400);
		                } else {
		                    setTimeout(function() {
		                        flippedCards[0].set("flipped", false);
		                        flippedCards[1].set("flipped", false);
		                        that.model.set("cardsClicked", 0);
		                        that.model.set("inprogress", false);
		                    }, 400);
		                }
		            }, 700);
		        }


		    },

		    render: function() {
		    	if(this.rendered) return;
		        // Iterate through our card models and build card views on our gameboard view
		        var el = $(this.el);
		        var cardModels = this.model.get("cardSet");
		        console.log("rendered");
		        cardModels.each(function(cardModel) {
		            var cardView = new CardGame.CardView({model: cardModel});
		            // Add a card to the gameboard
		            el.append(cardView.el);
		        });
		        this.rendered = true;

		    },

		    destroy: function() {
		        // Stop listening for event on view
		    	CardGame.off("cardFlippedEvent");
		        
		        this.remove();
		        this.unbind();
		    }

		});
    }) 
    return ContactManager.CardGame.GameBoardView;


});
