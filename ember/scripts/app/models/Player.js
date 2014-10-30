define([ 'ember' ], function(Ember) {
	var player = Ember.Object.extend({

		// Players start with a score of 0.
		score : 0,

		// During a turn, all scores are automatically updated to show
		// how they will be affected should the player finished their
		// turn. We consider this the `possibleScore`. After their turn
		// is made, it will be saved in `score`.
		possibleScore : function() {

			// If it's a player's turn, their `possibleScore` is their
			// previous score plus the sum of the letters they've chosen.
			// If it's not a player's turn, their `possibleScore` is their
			// previous score minus the letters the current player has
			// stolen from them.
			var result = this.get('score');
			if (this.get('isTurn')) {
				result += this.get('board.score');
			} else {
				result -= this.get('board.stolenScore');
			}
			return result;
		}.property('board.score', 'board.stolenScore', 'isTurn'),

		// Is it this player's turn?
		isTurn : function() {
			return this.get('board.currentPlayer') === this;
		}.property('board.currentPlayer'),

		// When a turn finishes, `updateScore()` is called to make
		// the `possibleScore` permanent.
		updateScore : function() {
			this.set('score', this.get('possibleScore'));
		}

	});
	return player;
})