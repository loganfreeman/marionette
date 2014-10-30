define([ 'ember', 'jquery' ], function(Ember, $) {
	var boardController = Ember.ObjectController.extend({

		// By default, there is no game in progress.
		inProgress : true,

		// Do we want to show 'CLEAR' button?
		showClearWord : function() {
			// The word needs to have at least one letter to be cleared.
			return this.get('content.word').length > 0;
		}.property('content.word.@each'),

		// Do we want to show the 'SUBMIT' button?
		showSubmitWord : function() {
			// Word needs to be at least 2 letters long
			return (this.get('content.word').length > 1);
		}.property('content.word.@each'),

		// `resign` is called when a player clicks the resign button.
		resign : function() {
			this.get('content').finishGame(true);
		},

		// If we have a winner, the game is over
		winnerChanged : function() {
			if (this.get('content.winner')) {
				this.set('inProgress', false);
			}
		}.observes('content.winner'),

		// `submitWord` is called when the player clicks submit.
		submitWord : function() {

			var w = this.get('content.wordAsString').toLowerCase();

			// First, we need to see if the word is in our game's dictionary.
			// We use jQuery's handy $.inArray for this.
			if ($.inArray(w, EmberPressDictionary) == -1) {
				alert("Sorry, that word isn't in the dictionary");
				return;
			}

			// Secondly, we need to consider whether that word has already
			// been played. We unfortunately have to use a `forEach` for this,
			// as we do not allow roots of existing words either.
			var unplayedWord = true;
			this.get('content.played').forEach(function(word) {
				if (word.get('value').toLowerCase().indexOf(w) === 0) {
					alert("That word can't be played.");
					unplayedWord = false;
					return false;
				}
			});
			if (!unplayedWord)
				return;

			// Note that this turn wasn't skipped.
			this.set('skipped', false);

			// Finally, submit the word to the `Board` model.
			this.get('content').submitWord();
		},

		// When a user chooses to skip their turn.
		skipTurn : function() {
			if (this.get('skipped')) {
				// If the previous player also skipped their turn, the game
				// is now over.
				this.get('content').finishGame();
			} else {
				// Otherwise, skip to the next turn.
				this.set('skipped', true);
				this.get('content').nextTurn();
			}
		},

		// When we want to start a new game on this board.
		reset : function() {
			this.set('skipped', false);
			this.get('content').restart();
			this.set('inProgress', true);
		}

	});
	return boardController;
})